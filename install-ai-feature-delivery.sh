#!/usr/bin/env bash
# Install the AI Feature Delivery pack into another repo or working folder.
#
# Default install is Cursor-first:
#   - .cursor/commands/*.md
#   - .cursor/rules/*.mdc
#   - skills/*/SKILL.md
#   - templates/*.md
#   - workflows/*.md
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
  ./install-ai-feature-delivery.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-ai-feature-delivery.sh ~/work/my-project
  ./install-ai-feature-delivery.sh --dry-run ~/work/my-project
  ./install-ai-feature-delivery.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       Cursor slash commands for the workflow
  .cursor/rules/          Cursor rule files
  skills/                 Local skill instructions used by the commands
  templates/              Feature delivery templates
  workflows/              Workflow recipes

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
      echo "install-ai-feature-delivery: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-ai-feature-delivery: only one target folder is allowed" >&2
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
}

install_template() {
  local name="$1"
  install_file "$ROOT/templates/$name" "$TARGET/templates/$name"
}

install_workflow() {
  local name="$1"
  install_file "$ROOT/workflows/$name" "$TARGET/workflows/$name"
}

install_skill() {
  local name="$1"
  install_file "$ROOT/skills/$name/SKILL.md" "$TARGET/skills/$name/SKILL.md"
}

install_rule() {
  local src_name="$1"
  local dest_name="$2"
  install_file "$ROOT/templates/$src_name" "$TARGET/.cursor/rules/$dest_name"
}

echo "Installing AI Feature Delivery pack into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

for command in \
  workflow-router \
  feature-start \
  feature-fleshout \
  steward-review \
  draft-pings \
  sdd-draft \
  doc-impact \
  doc-delta \
  refine-to-tickets \
  start-dev-from-feature \
  implementation-plan \
  write-tests \
  webapp-test \
  role-review \
  dev-doc-delta-check \
  review-diff \
  pr-ready-check \
  pr-traceability-review \
  gate-check \
  qa-handoff \
  release-manifest \
  release-doc-check
do
  install_command "$command"
done

for skill in \
  ai-feature-delivery \
  webapp-testing
do
  install_skill "$skill"
done

for template in \
  feature-master-record.md \
  sdd-template.md \
  doc-impact-template.md \
  clarification-queue-template.md \
  steward-review-template.md \
  refinement-ticket-template.md \
  implementation-plan-template.md \
  pr-traceability-review-template.md \
  gate-check-template.md \
  qa-handoff-template.md \
  release-manifest-template.md
do
  install_template "$template"
done

for workflow in \
  ai-feature-delivery-lifecycle.md \
  cursor-first-ai-feature-delivery.md \
  dev-ticket-to-pr.md
do
  install_workflow "$workflow"
done

install_rule cursor-rules-000-core-process.mdc 000-core-process.mdc
install_rule cursor-rules-010-doc-control.mdc 010-doc-control.mdc
install_rule cursor-rules-020-gates.mdc 020-gates.mdc
install_rule cursor-rules-030-traceability.mdc 030-traceability.mdc
install_rule cursor-rules-040-stakeholder-pings.mdc 040-stakeholder-pings.mdc
install_rule cursor-rules-050-pr-review.mdc 050-pr-review.mdc
install_rule cursor-rules-100-dev-core.mdc 100-dev-core.mdc
install_rule cursor-rules-130-testing.mdc 130-testing.mdc
install_rule cursor-rules-150-pr-hygiene.mdc 150-pr-hygiene.mdc
install_rule cursor-rules-200-dev-feature-traceability.mdc 200-dev-feature-traceability.mdc

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: open the target folder in Cursor and type /feature-start in chat."
