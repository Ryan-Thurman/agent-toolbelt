#!/usr/bin/env bash
# Install the Dev Lite workflow into another repo or working folder.
#
# Installs:
#   - .cursor/commands/*.md and .cursor/rules/*.mdc for Cursor
#   - .claude/commands/*.md for Claude Code
#   - .agents/skills/dev-lite-workflow/SKILL.md for repo-scoped Codex skill use
#   - skills/dev-lite-workflow/SKILL.md for shared skill-aware agent use
#   - templates/*.md and workflows/*.md for shared artifacts
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
  ./install-dev-lite-workflow.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-dev-lite-workflow.sh ~/work/my-project
  ./install-dev-lite-workflow.sh --dry-run ~/work/my-project
  ./install-dev-lite-workflow.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       Cursor slash commands for dev-lite
  .cursor/rules/          Cursor project rules for dev-lite
  .claude/commands/       Claude Code slash commands for dev-lite
  .agents/skills/         Repo-scoped Codex skill instructions
  skills/dev-lite-workflow Shared skill-aware agent operating instructions
  templates/              Feature brief, plan, phase review, and PR review templates
  workflows/              Dev Lite workflow recipe

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
      echo "install-dev-lite-workflow: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-dev-lite-workflow: only one target folder is allowed" >&2
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

install_command() {
  local name="$1"
  install_file "$ROOT/commands/$name.md" "$TARGET/.cursor/commands/$name.md"
  install_file "$ROOT/commands/$name.md" "$TARGET/.claude/commands/$name.md"
}

install_template() {
  local name="$1"
  install_file "$ROOT/templates/$name" "$TARGET/templates/$name"
}

install_workflow() {
  local name="$1"
  install_file "$ROOT/workflows/$name" "$TARGET/workflows/$name"
}

install_rule() {
  local name="$1"
  install_file "$ROOT/.cursor/rules/$name" "$TARGET/.cursor/rules/$name"
}

install_skill() {
  local name="$1"
  install_file "$ROOT/skills/$name/SKILL.md" "$TARGET/.agents/skills/$name/SKILL.md"
  install_file "$ROOT/skills/$name/SKILL.md" "$TARGET/skills/$name/SKILL.md"
}

echo "Installing Dev Lite workflow into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

for command in \
  dev-intake \
  dev-plan \
  dev-start-phase \
  dev-implement-task \
  dev-phase-review \
  dev-fix-review-issues \
  dev-pr-review
do
  install_command "$command"
done

for rule in \
  dev-lite-core.mdc \
  dev-lite-commits.mdc \
  dev-lite-review.mdc
do
  install_rule "$rule"
done

install_skill dev-lite-workflow

for template in \
  dev-feature-brief.md \
  dev-implementation-plan.md \
  dev-phase-review.md \
  dev-pr-review.md
do
  install_template "$template"
done

install_workflow dev-lite-feature-workflow.md

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: open the target folder in Cursor or Claude Code and start with /dev-intake."
echo "In Codex, invoke the skill with /skills or by mentioning \$dev-lite-workflow."
