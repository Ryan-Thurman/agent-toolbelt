#!/usr/bin/env bash
# Install the handoff pack into another repo or working folder.
#
# A small, cross-cutting capability: write a resumable handoff so a fresh agent
# or person can continue work without context loss. Useful in any lane.
#
# Installs:
#   - .cursor/commands/handoff.md and .claude/commands/handoff.md   /handoff
#   - skills/handoff/SKILL.md                                        shared skill
#   - .agents/skills/handoff/SKILL.md                               repo-scoped Codex copy
#
# Existing files are skipped unless --force is passed.

set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FORCE=0
DRY_RUN=0
TARGET=""

usage() {
  cat <<'EOF'
Usage:
  ./install-handoff.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-handoff.sh ~/work/my-project
  ./install-handoff.sh --dry-run ~/work/my-project
  ./install-handoff.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       /handoff for Cursor
  .claude/commands/       /handoff for Claude Code
  skills/handoff/         Shared skill (SKILL.md)
  .agents/skills/         Repo-scoped Codex copy of the skill

Safety:
  Existing files are skipped by default. Use --force only when you want this
  installer to replace files from a previous install.
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --force)
      FORCE=1
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    -*)
      echo "install-handoff: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-handoff: only one target folder is allowed" >&2
        exit 2
      fi
      TARGET="$1"
      ;;
  esac
  shift
done

if [ -z "$TARGET" ]; then
  usage >&2
  exit 2
fi

if [ ! -d "$TARGET" ]; then
  if [ "$DRY_RUN" = "1" ]; then
    echo "+ would create target folder: $TARGET"
  else
    mkdir -p "$TARGET" || exit 1
  fi
fi

created=0
updated=0
skipped=0

ensure_dir() {
  local dir="$1"
  if [ "$DRY_RUN" = "1" ]; then
    [ -d "$dir" ] || echo "+ would create directory: $dir"
  else
    mkdir -p "$dir" || exit 1
  fi
}

install_file() {
  local src="$1" dest="$2"

  if [ ! -f "$src" ]; then
    echo "! missing source: $src" >&2
    exit 1
  fi

  if [ -d "$dest" ]; then
    echo "! destination is a directory, refusing to overwrite: $dest" >&2
    exit 1
  fi

  ensure_dir "$(dirname "$dest")"

  if [ -e "$dest" ] && [ "$FORCE" != "1" ]; then
    echo "skip existing: $dest"
    skipped=$((skipped + 1))
    return 0
  fi

  if [ "$DRY_RUN" = "1" ]; then
    if [ -e "$dest" ]; then
      echo "~ would overwrite: $dest"
    else
      echo "+ would install: $dest"
    fi
    return 0
  fi

  if [ -e "$dest" ]; then
    cp "$src" "$dest" || exit 1
    echo "~ updated: $dest"
    updated=$((updated + 1))
  else
    cp "$src" "$dest" || exit 1
    echo "+ installed: $dest"
    created=$((created + 1))
  fi
}

echo "Installing handoff pack into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

# Command: install for both Cursor and Claude Code.
install_file "$ROOT/commands/handoff.md" "$TARGET/.cursor/commands/handoff.md"
install_file "$ROOT/commands/handoff.md" "$TARGET/.claude/commands/handoff.md"

# Skill: install to both the shared skills/ path and the Codex .agents path.
install_file "$ROOT/skills/handoff/SKILL.md" "$TARGET/skills/handoff/SKILL.md"
install_file "$ROOT/skills/handoff/SKILL.md" "$TARGET/.agents/skills/handoff/SKILL.md"

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: run /handoff before a context reset, when pausing, or when transferring work."
echo "In Codex, invoke the skill with /skills or by mentioning \$handoff."
