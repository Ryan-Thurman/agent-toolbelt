#!/usr/bin/env bash
# Install the shape-up pack into another repo or working folder.
#
# Installs:
#   - .cursor/commands/*.md and .claude/commands/*.md   /shape-up and /to-issues
#   - skills/shape-up/**                                 shared skill (SKILL.md + references)
#   - .agents/skills/shape-up/**                         repo-scoped Codex copy of the skill tree
#   - templates/*.md                                     brief and vertical-slice issue templates
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
  ./install-shape-up.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-shape-up.sh ~/work/my-project
  ./install-shape-up.sh --dry-run ~/work/my-project
  ./install-shape-up.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       /shape-up and /to-issues for Cursor
  .claude/commands/       the same commands for Claude Code
  skills/shape-up/        Shared skill (SKILL.md + references/)
  .agents/skills/         Repo-scoped Codex copy of the skill tree
  templates/              shape-up-brief and shape-up-issues

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
      echo "install-shape-up: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-shape-up: only one target folder is allowed" >&2
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

echo "Installing shape-up pack into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

# Commands: install for both Cursor and Claude Code.
for command in \
  shape-up \
  to-issues
do
  install_file "$ROOT/commands/$command.md" "$TARGET/.cursor/commands/$command.md"
  install_file "$ROOT/commands/$command.md" "$TARGET/.claude/commands/$command.md"
done

# Skill tree: install to both the shared skills/ path and the Codex .agents path.
skill_files="
SKILL.md
references/interrogation.md
"

for rel in $skill_files; do
  install_tree_file "$rel" "$ROOT/skills/shape-up" "$TARGET/skills/shape-up"
  install_tree_file "$rel" "$ROOT/skills/shape-up" "$TARGET/.agents/skills/shape-up"
done

# Templates.
for template in \
  shape-up-brief.md \
  shape-up-issues.md
do
  install_file "$ROOT/templates/$template" "$TARGET/templates/$template"
done

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: open the target folder in Cursor or Claude Code and run /shape-up."
echo "In Codex, invoke the skill with /skills or by mentioning \$shape-up."
