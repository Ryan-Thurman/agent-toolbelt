#!/usr/bin/env bash
# Install the Bug-to-Fix pack into another repo or working folder.
#
# Installs:
#   - .cursor/commands/*.md and .claude/commands/*.md   the /bug-* commands
#   - skills/bug-to-fix/**                               shared skill (SKILL.md + references)
#   - .agents/skills/bug-to-fix/**                       repo-scoped Codex copy of the skill tree
#   - templates/*.md                                     investigation, RCA report, fix brief
#   - workflows/bug-to-fix-workflow.md                   the ordered playbook
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
  ./install-bug-to-fix.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-bug-to-fix.sh ~/work/my-project
  ./install-bug-to-fix.sh --dry-run ~/work/my-project
  ./install-bug-to-fix.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       /bug-intake /reproduce /rca /fix-plan /handoff for Cursor
  .claude/commands/       the same commands for Claude Code
  skills/bug-to-fix/      Shared skill (SKILL.md + references/)
  .agents/skills/         Repo-scoped Codex copy of the skill tree
  templates/              bug-investigation, rca-report, bug-agent-brief
  workflows/              bug-to-fix-workflow.md

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
      echo "install-bug-to-fix: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-bug-to-fix: only one target folder is allowed" >&2
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

# Install one path that lives under a repo subtree into the same relative path
# below a destination root, preserving directory structure.
install_tree_file() {
  local rel="$1" src_root="$2" dest_root="$3"
  install_file "$src_root/$rel" "$dest_root/$rel"
}

echo "Installing Bug-to-Fix pack into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

# Commands: install for both Cursor and Claude Code.
for command in \
  bug-intake \
  reproduce \
  rca \
  fix-plan \
  handoff
do
  install_file "$ROOT/commands/$command.md" "$TARGET/.cursor/commands/$command.md"
  install_file "$ROOT/commands/$command.md" "$TARGET/.claude/commands/$command.md"
done

# Skill tree: install to both the shared skills/ path and the Codex .agents path.
skill_files="
SKILL.md
references/durable-state.md
references/rca-strategies.md
references/adversarial-confirmation.md
references/severity.md
references/rct-acceleration.md
"

for rel in $skill_files; do
  install_tree_file "$rel" "$ROOT/skills/bug-to-fix" "$TARGET/skills/bug-to-fix"
  install_tree_file "$rel" "$ROOT/skills/bug-to-fix" "$TARGET/.agents/skills/bug-to-fix"
done

# Templates.
for template in \
  bug-investigation.md \
  rca-report.md \
  bug-agent-brief.md
do
  install_file "$ROOT/templates/$template" "$TARGET/templates/$template"
done

# Workflow playbook.
install_file "$ROOT/workflows/bug-to-fix-workflow.md" "$TARGET/workflows/bug-to-fix-workflow.md"

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: open the target folder in Cursor or Claude Code and start with /bug-intake."
echo "In Codex, invoke the skill with /skills or by mentioning \$bug-to-fix."
