#!/usr/bin/env bash
# Install the ship-it pack into another repo or working folder.
#
# Installs:
#   - .cursor/commands/*.md and .claude/commands/*.md   /ship-it
#   - skills/ship-it/**                                  shared skill (SKILL.md + references)
#   - .agents/skills/ship-it/**                          repo-scoped Codex copy of the skill tree
#   - templates/release-notes.md                         release-notes draft template
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
  ./install-ship-it.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-ship-it.sh ~/work/my-project
  ./install-ship-it.sh --dry-run ~/work/my-project
  ./install-ship-it.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       /ship-it for Cursor
  .claude/commands/       /ship-it for Claude Code
  skills/ship-it/         Shared skill (SKILL.md + references/)
  .agents/skills/         Repo-scoped Codex copy of the skill tree
  templates/              release-notes draft

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
      echo "install-ship-it: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-ship-it: only one target folder is allowed" >&2
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

install_tree_file() {
  local rel="$1" src_root="$2" dest_root="$3"
  install_file "$src_root/$rel" "$dest_root/$rel"
}

echo "Installing ship-it pack into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

# Command: install for both Cursor and Claude Code.
install_file "$ROOT/commands/ship-it.md" "$TARGET/.cursor/commands/ship-it.md"
install_file "$ROOT/commands/ship-it.md" "$TARGET/.claude/commands/ship-it.md"

# Skill tree: install to both the shared skills/ path and the Codex .agents path.
skill_files="
SKILL.md
references/readiness-checklist.md
references/rollout-and-rollback.md
"

for rel in $skill_files; do
  install_tree_file "$rel" "$ROOT/skills/ship-it" "$TARGET/skills/ship-it"
  install_tree_file "$rel" "$ROOT/skills/ship-it" "$TARGET/.agents/skills/ship-it"
done

# Template.
install_file "$ROOT/templates/release-notes.md" "$TARGET/templates/release-notes.md"

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: open the target folder in Cursor or Claude Code and run /ship-it after a merge."
echo "In Codex, invoke the skill with /skills or by mentioning \$ship-it."
