#!/usr/bin/env bash
# Shared installer library. Sourced by ../install.sh; each install/<pack>.sh uses
# the helpers below to declare what a pack installs. Not meant to run directly.
#
# Expects these globals to be set by install.sh before a pack function runs:
#   REPO_ROOT  TARGET  FORCE  DRY_RUN
# and maintains the counters: created updated skipped.

# Resolve the repo root from this file's location (install/lib.sh -> repo root).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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

# install_file <abs-src> <abs-dest>
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

# _install <rel-src> <rel-dest> — src relative to REPO_ROOT, dest relative to TARGET.
_install() {
  install_file "$REPO_ROOT/$1" "$TARGET/$2"
}

# ---- Semantic helpers used by install/<pack>.sh -------------------------------

# cmd <name> — a slash command for both Cursor and Claude Code.
cmd() {
  _install "commands/$1.md" ".cursor/commands/$1.md"
  _install "commands/$1.md" ".claude/commands/$1.md"
}

# cmd_cursor <name> — a slash command for Cursor only (AI Feature Delivery pack).
cmd_cursor() {
  _install "commands/$1.md" ".cursor/commands/$1.md"
}

# rule_local <name.mdc> — a Cursor rule shipped from .cursor/rules/ (Dev Lite pack).
rule_local() {
  _install ".cursor/rules/$1" ".cursor/rules/$1"
}

# rule_tmpl <src.mdc> <dest.mdc> — a Cursor rule shipped from templates/ (AI Feature Delivery).
rule_tmpl() {
  _install "templates/$1" ".cursor/rules/$2"
}

# skill <pack> <rel> — a skill-tree file to both skills/ and the Codex .agents/skills/.
skill() {
  _install "skills/$1/$2" "skills/$1/$2"
  _install "skills/$1/$2" ".agents/skills/$1/$2"
}

# skill_shared <pack> <rel> — a skill-tree file to skills/ only (AI Feature Delivery).
skill_shared() {
  _install "skills/$1/$2" "skills/$1/$2"
}

# template <name>, workflow <name>, example <name> — shared artifacts.
template() { _install "templates/$1" "templates/$1"; }
workflow() { _install "workflows/$1" "workflows/$1"; }
example()  { _install "examples/$1"  "examples/$1"; }
