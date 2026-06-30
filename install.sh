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
SWEEP=0
HARNESS_SPEC=""      # raw accumulated --harness text
HARNESS_GIVEN=0
HARNESS_ENABLED=""   # normalized, space-wrapped: " cursor claude "
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

# Dedup-on-add into the space-wrapped HARNESS_ENABLED list.
_h_add() {
  case " $HARNESS_ENABLED " in *" $1 "*) ;; *) HARNESS_ENABLED="$HARNESS_ENABLED $1" ;; esac
}

# Parse HARNESS_SPEC ("cursor,claude" / "all") into HARNESS_ENABLED, validating tokens.
normalize_harness() {
  local tok oldifs="$IFS"
  IFS=','
  for tok in $HARNESS_SPEC; do
    IFS="$oldifs"
    tok="${tok#"${tok%%[![:space:]]*}"}"; tok="${tok%"${tok##*[![:space:]]}"}"  # trim
    if [ -n "$tok" ]; then
      case "$tok" in
        all)                 _h_add cursor; _h_add claude; _h_add codex ;;
        cursor|claude|codex) _h_add "$tok" ;;
        *) echo "install: unknown harness: '$tok' (valid: cursor, claude, codex, all)" >&2; exit 2 ;;
      esac
    fi
    IFS=','
  done
  IFS="$oldifs"
}

usage() {
  cat <<EOF
Usage:
  ./install.sh [options] <pack> [<pack> ...] <target-folder>
  ./install.sh [options] all <target-folder>

Options:
  --harness <list>  REQUIRED. Comma list of harnesses to install for:
                    cursor, claude, codex, or all (repeatable).
  --sweep           target is a parent dir: install into it AND each child git
                    repo (Cursor rules land at the parent only).
  --list            list the available packs and exit
  --force           overwrite existing installed files
  --dry-run         print what would be installed without writing files
  --help            show this help

Examples:
  ./install.sh --harness cursor pr-review ~/work/my-project
  ./install.sh --harness cursor,claude bug-to-fix simplify ~/work/my-project
  ./install.sh --harness all all ~/work/my-project
  ./install.sh --sweep --harness cursor all ~/work/my-monorepo-parent
  ./install.sh --dry-run --harness cursor all ~/work/my-project

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
    --sweep)   SWEEP=1 ;;
    --list)    DO_LIST=1 ;;
    --harness)
      if [ "$#" -lt 2 ]; then echo "install: --harness needs a value" >&2; exit 2; fi
      HARNESS_SPEC="${HARNESS_SPEC:+$HARNESS_SPEC,}$2"; HARNESS_GIVEN=1; shift ;;
    --harness=*)
      HARNESS_SPEC="${HARNESS_SPEC:+$HARNESS_SPEC,}${1#--harness=}"; HARNESS_GIVEN=1 ;;
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

# --harness is required — no implicit default.
if [ "$HARNESS_GIVEN" = "0" ]; then
  echo "install: --harness is required (no implicit default)." >&2
  echo "  choose one or more of: cursor, claude, codex, all" >&2
  echo "  e.g. ./install.sh --harness cursor ${selected[*]:-<pack>} $TARGET" >&2
  exit 2
fi
normalize_harness

# shellcheck source=install/lib.sh
. "$INSTALL_DIR/lib.sh"

# Define every selected pack's pack_<name> function once (idempotent across targets).
for p in "${selected[@]}"; do
  # shellcheck disable=SC1090
  . "$INSTALL_DIR/$p.sh"
done

# install_into_target <dir> — install all selected packs into <dir>.
# Resets the per-target counters/records so each target's summary + AGENTS.md block
# reflect only its own install.
install_into_target() {
  TARGET="$1"
  created=0; updated=0; skipped=0; gated=0
  INSTALLED_COMMANDS=(); INSTALLED_SKILLS=()

  if [ ! -d "$TARGET" ]; then
    if [ "$DRY_RUN" = "1" ]; then
      echo "+ would create target folder: $TARGET"
    else
      mkdir -p "$TARGET" || exit 1
    fi
  fi

  echo "=== Installing into: $TARGET ==="
  local p pre pre_g touched
  for p in "${selected[@]}"; do
    CURRENT_PACK="$p"
    pre=$((created + updated + skipped)); pre_g=$gated
    echo "--- $p ---"
    "pack_${p//-/_}"
    touched=$(( (created + updated + skipped) - pre ))
    if [ "$touched" = 0 ]; then
      echo "  ! $p installed nothing for harness '${HARNESS_ENABLED# }'" >&2
    elif [ "$gated" -gt "$pre_g" ]; then
      echo "  note: $p skipped $((gated - pre_g)) file(s) not owned by the selected harness/scope"
    fi
  done
  write_agents_md "${selected[@]}"

  if [ "$DRY_RUN" = "1" ]; then
    echo "  (dry run) $TARGET"
  else
    echo "  $TARGET: $created created, $updated updated, $skipped skipped."
  fi
}

PARENT="$TARGET"   # install_into_target overwrites TARGET, so remember the original

echo "Packs: ${selected[*]}"
echo "Harness:${HARNESS_ENABLED}"
[ "$DRY_RUN" = "1" ] && echo "Mode: dry run"
[ "$FORCE" = "1" ] && echo "Mode: overwrite existing files"
echo

if [ "$SWEEP" = "1" ]; then
  # Parent (workspace root) + each immediate child git repo. Every target is a full,
  # self-contained install (including .cursor/rules) so a repo opened on its own has
  # its guardrails. See README for promoting always-on rules to Cursor User Rules for
  # whole-app / multi-root sessions.
  children=()
  for child in "$PARENT"/*/; do
    child="${child%/}"
    [ -e "$child/.git" ] || continue
    [ "$(cd "$child" 2>/dev/null && pwd)" = "$ROOT" ] && continue  # skip our own checkout
    children+=("$child")
  done
  echo "Sweep targets:"
  echo "  $PARENT  (parent / workspace root)"
  for child in "${children[@]:-}"; do [ -n "$child" ] && echo "  $child  (child repo)"; done
  echo
  install_into_target "$PARENT"
  for child in "${children[@]:-}"; do
    [ -n "$child" ] || continue
    install_into_target "$child"
  done
else
  install_into_target "$PARENT"
fi

if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete."
else
  echo "Install complete."
fi
