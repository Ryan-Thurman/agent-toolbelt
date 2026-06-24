#!/usr/bin/env bash
# Install the PR Review tool into another repo or working folder.
#
# Installs:
#   - .cursor/commands/pr-review.md and .claude/commands/pr-review.md
#   - skills/pr-review/**            shared skill-aware agent instructions + tree
#   - .agents/skills/pr-review/**    repo-scoped Codex skill instructions + tree
#   - templates/pr-review.md         local review-config sample (copy to .pr-review.md)
#   - examples/**                    reference material the review facets cite
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
  ./install-pr-review.sh [options] <target-folder>

Options:
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install-pr-review.sh ~/work/my-project
  ./install-pr-review.sh --dry-run ~/work/my-project
  ./install-pr-review.sh --force ~/work/my-project

What gets installed:
  .cursor/commands/       /pr-review command for Cursor
  .claude/commands/       /pr-review command for Claude Code
  skills/pr-review/       Shared skill (SKILL.md + facets/references/checklists/benchmarks)
  .agents/skills/         Repo-scoped Codex copy of the skill tree
  templates/pr-review.md  Sample local review config (copy to .pr-review.md to use)
  examples/               Reference material cited by the review facets

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
      echo "install-pr-review: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [ -n "$TARGET" ]; then
        echo "install-pr-review: only one target folder is allowed" >&2
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

echo "Installing PR Review tool into: $TARGET"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

# Command: install for both Cursor and Claude Code.
install_file "$ROOT/commands/pr-review.md" "$TARGET/.cursor/commands/pr-review.md"
install_file "$ROOT/commands/pr-review.md" "$TARGET/.claude/commands/pr-review.md"

# Skill tree: install to both the shared skills/ path and the Codex .agents path.
skill_files="
SKILL.md
benchmarks/results.md
checklists/README.md
checklists/python.md
checklists/sql.md
checklists/typescript.md
facets/_shared.md
facets/correctness.md
facets/maintainability-deep.md
facets/maintainability.md
facets/performance.md
facets/security.md
facets/spec-alignment.md
facets/standards.md
facets/tests.md
references/auto-tier.md
references/benchmarking.md
references/deep-tier.md
references/dual-judge.md
references/fan-out.md
references/finding-schema.md
references/lang-checklists.md
references/output-format.md
references/posting.md
references/providers.md
references/rejection-memory.md
references/repo-config.md
references/review-rubric.md
references/targets-and-diff.md
references/rct-acceleration.md
"

for rel in $skill_files; do
  install_tree_file "$rel" "$ROOT/skills/pr-review" "$TARGET/skills/pr-review"
  install_tree_file "$rel" "$ROOT/skills/pr-review" "$TARGET/.agents/skills/pr-review"
done

# Template: sample local review config.
install_file "$ROOT/templates/pr-review.md" "$TARGET/templates/pr-review.md"

# Examples: reference material the review facets cite.
example_files="
README.md
ai-code-security.md
code-review-best-practices.md
code-review-comments-and-tone.md
code-review-principles-and-standards.md
defect-density.md
pr-review-reference.md
secure-code-review.md
thermo-nuclear-review.md
"

for rel in $example_files; do
  install_tree_file "$rel" "$ROOT/examples" "$TARGET/examples"
done

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi

echo "Next step: open the target folder in Cursor or Claude Code and run /pr-review."
echo "To declare local review priorities, copy templates/pr-review.md to .pr-review.md."
