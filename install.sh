#!/usr/bin/env bash
# Unified installer for the agent-toolbelt packs.
#
#   ./install.sh [options] <pack> [<pack> ...] <target-folder>
#   ./install.sh [options] all <target-folder>
#
# Each pack's file list lives in install/<pack>.sh; shared logic in install/lib.sh.
# Existing files are skipped unless --force is passed.

set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="$ROOT/install"

FORCE=0
DRY_RUN=0
DO_LIST=0
positionals=()

available_packs() {
  local f
  for f in "$INSTALL_DIR"/*.sh; do
    [ "$(basename "$f")" = "lib.sh" ] && continue
    basename "$f" .sh
  done | sort
}

pack_desc() {
  sed -n 's/^# DESC: //p' "$INSTALL_DIR/$1.sh" | head -1
}

usage() {
  cat <<EOF
Usage:
  ./install.sh [options] <pack> [<pack> ...] <target-folder>
  ./install.sh [options] all <target-folder>

Options:
  --list      list the available packs and exit
  --force     overwrite existing installed files
  --dry-run   print what would be installed without writing files
  --help      show this help

Examples:
  ./install.sh pr-review ~/work/my-project
  ./install.sh bug-to-fix simplify shape-up ~/work/my-project
  ./install.sh all ~/work/my-project
  ./install.sh --dry-run all ~/work/my-project

Packs:
EOF
  local p
  for p in $(available_packs); do
    printf "  %-22s %s\n" "$p" "$(pack_desc "$p")"
  done
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --force)   FORCE=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --list)    DO_LIST=1 ;;
    --help|-h) usage; exit 0 ;;
    -*)
      echo "install: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *) positionals+=("$1") ;;
  esac
  shift
done

if [ "$DO_LIST" = "1" ]; then
  echo "Available packs:"
  for p in $(available_packs); do
    printf "  %-22s %s\n" "$p" "$(pack_desc "$p")"
  done
  exit 0
fi

if [ "${#positionals[@]}" -lt 2 ]; then
  echo "install: need at least one pack and a target folder" >&2
  usage >&2
  exit 2
fi

# Last positional is the target; the rest are pack names.
TARGET="${positionals[${#positionals[@]}-1]}"
packs=("${positionals[@]:0:${#positionals[@]}-1}")

# Expand 'all'.
all_packs=$(available_packs)
expanded=()
for p in "${packs[@]}"; do
  if [ "$p" = "all" ]; then
    for q in $all_packs; do expanded+=("$q"); done
  else
    expanded+=("$p")
  fi
done

# Validate + de-duplicate (preserve order).
selected=()
for p in "${expanded[@]}"; do
  if [ ! -f "$INSTALL_DIR/$p.sh" ]; then
    echo "install: unknown pack: $p" >&2
    echo "Run './install.sh --list' to see available packs." >&2
    exit 2
  fi
  case " ${selected[*]:-} " in
    *" $p "*) ;;
    *) selected+=("$p") ;;
  esac
done

# shellcheck source=install/lib.sh
. "$INSTALL_DIR/lib.sh"

if [ ! -d "$TARGET" ]; then
  if [ "$DRY_RUN" = "1" ]; then
    echo "+ would create target folder: $TARGET"
  else
    mkdir -p "$TARGET" || exit 1
  fi
fi

echo "Installing into: $TARGET"
echo "Packs: ${selected[*]}"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"

for p in "${selected[@]}"; do
  echo "--- $p ---"
  # shellcheck disable=SC1090
  . "$INSTALL_DIR/$p.sh"
  "pack_${p//-/_}"
done

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete: $created created, $updated updated, $skipped skipped."
fi
