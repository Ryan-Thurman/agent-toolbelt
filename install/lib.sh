#!/usr/bin/env bash
# Shared installer library. Sourced by ../install.sh; each install/<pack>.sh uses
# the helpers below to declare what a pack installs. Not meant to run directly.
#
# Expects these globals to be set by install.sh before a pack function runs:
#   REPO_ROOT  TARGET  FORCE  DRY_RUN  HARNESS_ENABLED  CURRENT_PACK
# and maintains the counters: created updated skipped gated.
#
# HARNESS_ENABLED is a space-wrapped list of enabled harnesses (e.g. " cursor claude ");
# helpers below gate each write on it so only the selected harness' files are installed.

# Resolve the repo root from this file's location (install/lib.sh -> repo root).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

created=0
updated=0
skipped=0
gated=0          # files skipped because their harness was not selected

# Per-target record of what was actually installed, for the AGENTS.md pointer.
# Entries are "pack<TAB>name". Reset per target by install.sh.
INSTALLED_COMMANDS=()
INSTALLED_SKILLS=()
INSTALLED_SHARED_CONTRACTS=()

# ---- Harness gating -----------------------------------------------------------

# harness_enabled <name> — true if <name> is in the selected harness set.
harness_enabled() {
  case " ${HARNESS_ENABLED:-} " in
    *" $1 "*) return 0 ;;
    *) return 1 ;;
  esac
}

# _record_command <name> / _record_skill <dir> — note an installed artifact under
# the current pack so write_agents_md can group by pack. Skills dedup on pack+dir.
_record_command() {
  INSTALLED_COMMANDS+=("${CURRENT_PACK:-}"$'\t'"$1")
}
_record_skill() {
  local key="${CURRENT_PACK:-}"$'\t'"$1" e
  for e in "${INSTALLED_SKILLS[@]:-}"; do
    [ "$e" = "$key" ] && return 0
  done
  INSTALLED_SKILLS+=("$key")
}

ensure_dir() {
  local dir="$1"
  if [ "$DRY_RUN" = "1" ]; then
    [ -d "$dir" ] || echo "+ would create directory: $dir"
  else
    mkdir -p "$dir" || exit 1
  fi
}

# The shared, harness-agnostic folders (skills/ templates/ workflows/ examples/ shared/)
# are installed under .atb/ in the target so they don't collide with a brownfield
# project's own top-level dirs. Content shipped by the packs still refers to them by
# their *source* path (e.g. `skills/pr-review/references/foo.md`), so we rewrite those
# absolute-from-root refs to `.atb/…` as each file is copied. Relative refs
# (`../../examples/…`) are left alone: since all four dirs move together, their
# relative distance is unchanged and they still resolve. Matching only at a path
# boundary ([start | space | ` | ( | =]) skips relative refs (preceded by `/`) and
# makes the rewrite idempotent (an existing `.atb/` prefix is preceded by `/`).
ATB_REWRITE='s#(^|[[:space:](=`])(skills|templates|workflows|examples|shared)/#\1.atb/\2/#g'

# install_copy <src> <dest> — copy while rewriting shared-folder refs to .atb/.
install_copy() {
  sed -E "$ATB_REWRITE" "$1" > "$2"
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
      updated=$((updated + 1))
    else
      echo "+ would install: $dest"
      created=$((created + 1))
    fi
    return 0
  fi

  if [ -e "$dest" ]; then
    install_copy "$src" "$dest" || exit 1
    echo "~ updated: $dest"
    updated=$((updated + 1))
  else
    install_copy "$src" "$dest" || exit 1
    echo "+ installed: $dest"
    created=$((created + 1))
  fi
}

# _install <rel-src> <rel-dest> — src relative to REPO_ROOT, dest relative to TARGET.
_install() {
  install_file "$REPO_ROOT/$1" "$TARGET/$2"
}

# ---- Semantic helpers used by install/<pack>.sh -------------------------------

# cmd <name> — a slash command for Cursor and/or Claude Code (per selected harness).
cmd() {
  local did=0
  if harness_enabled cursor; then _install "commands/$1.md" ".cursor/commands/$1.md"; did=1; else gated=$((gated + 1)); fi
  if harness_enabled claude; then _install "commands/$1.md" ".claude/commands/$1.md"; did=1; else gated=$((gated + 1)); fi
  [ "$did" = 1 ] && _record_command "$1"
  return 0
}

# cmd_cursor <name> — a slash command for Cursor only (AI Feature Delivery pack).
cmd_cursor() {
  if harness_enabled cursor; then _install "commands/$1.md" ".cursor/commands/$1.md"; _record_command "$1"; else gated=$((gated + 1)); fi
  return 0
}

# rule_local <name.mdc> — a Cursor rule shipped from .cursor/rules/ (Dev Lite pack).
# Installed only in --rules full mode; minimal mode relies on the generated router rule.
rule_local() {
  if harness_enabled cursor && [ "${RULE_MODE:-minimal}" = "full" ]; then
    _install ".cursor/rules/$1" ".cursor/rules/$1"
  else
    gated=$((gated + 1))
  fi
  return 0
}

# rule_tmpl <src.mdc> <dest.mdc> — a Cursor rule shipped from templates/ (AI Feature Delivery).
# Installed only in --rules full mode; minimal mode relies on the generated router rule.
rule_tmpl() {
  if harness_enabled cursor && [ "${RULE_MODE:-minimal}" = "full" ]; then
    _install "templates/$1" ".cursor/rules/$2"
  else
    gated=$((gated + 1))
  fi
  return 0
}

# _skill_metadata <pack> <dest-root> — install host metadata next to a skill copy.
_skill_metadata() {
  _install "skills/$1/agents/openai.yaml" "$2/agents/openai.yaml"
}

# skill <pack> <rel> — canonical skills/ copy (always; commands reference it by path),
# plus the agent-native .agents/skills/ copy when cursor or codex is selected. Cursor AND
# Codex both auto-discover skills under .agents/skills/, so one copy serves both — writing a
# separate .cursor/skills/ too would make Cursor list every skill twice. (Bare skills/ is NOT
# an auto-discovery root, so it never double-registers.) SKILL.md is a cross-agent standard.
skill() {
  _install "skills/$1/$2" ".atb/skills/$1/$2"
  if [ "$2" = "SKILL.md" ]; then
    _skill_metadata "$1" ".atb/skills/$1"
  fi
  if harness_enabled cursor || harness_enabled codex; then
    _install "skills/$1/$2" ".agents/skills/$1/$2"
    if [ "$2" = "SKILL.md" ]; then
      _skill_metadata "$1" ".agents/skills/$1"
    fi
  else
    gated=$((gated + 1))
  fi
  _record_skill "$1"
  return 0
}

# skill_shared <pack> <rel> — canonical skills/ copy plus the native .agents/skills/ copy when
# cursor is selected (AI Feature Delivery is Cursor-first; no Codex-only case to cover).
skill_shared() {
  _install "skills/$1/$2" ".atb/skills/$1/$2"
  if [ "$2" = "SKILL.md" ]; then
    _skill_metadata "$1" ".atb/skills/$1"
  fi
  if harness_enabled cursor; then
    _install "skills/$1/$2" ".agents/skills/$1/$2"
    if [ "$2" = "SKILL.md" ]; then
      _skill_metadata "$1" ".agents/skills/$1"
    fi
  else
    gated=$((gated + 1))
  fi
  _record_skill "$1"
  return 0
}

# template <name>, workflow <name>, example <name> — shared artifacts (harness-agnostic).
# Installed under .atb/ so they don't collide with the target project's own top-level dirs.
template() { _install "templates/$1" ".atb/templates/$1"; }
workflow() { _install "workflows/$1" ".atb/workflows/$1"; }
example()  { _install "examples/$1"  ".atb/examples/$1"; }

# shared_contract <rel> — support-only contracts consumed by multiple packs.
# These are not skills and are not installed under .agents/.
shared_contract() {
  local rel="$1" e
  for e in "${INSTALLED_SHARED_CONTRACTS[@]:-}"; do
    [ "$e" = "manifest.json" ] && break
  done
  if [ "${e:-}" != "manifest.json" ]; then
    _install "shared/contracts/manifest.json" ".atb/shared/contracts/manifest.json"
    INSTALLED_SHARED_CONTRACTS+=("manifest.json")
  fi
  for e in "${INSTALLED_SHARED_CONTRACTS[@]:-}"; do
    [ "$e" = "$rel" ] && return 0
  done
  _install "shared/contracts/$rel" ".atb/shared/contracts/$rel"
  INSTALLED_SHARED_CONTRACTS+=("$rel")
}

# hook_json <src> — the Cursor hooks manifest (cursor only). install_file skips an existing
# .cursor/hooks.json (no --force), so we never clobber hooks you already have — merge manually.
hook_json() {
  if harness_enabled cursor; then _install "hooks/$1" ".cursor/hooks.json"; else gated=$((gated + 1)); fi
  return 0
}

# hook_script <name> — a Cursor hook script under .cursor/hooks/ (cursor only). hooks.json
# invokes these via `bash .cursor/hooks/<name>`, so no executable bit is required.
hook_script() {
  if harness_enabled cursor; then _install "hooks/$1" ".cursor/hooks/$1"; else gated=$((gated + 1)); fi
  return 0
}

# write_cursor_router_rule — in minimal Cursor rule mode, install one small always-on
# router/guardrail rule instead of every workflow's detailed project rules.
write_cursor_router_rule() {
  harness_enabled cursor || return 0
  [ "${RULE_MODE:-minimal}" = "minimal" ] || return 0
  _install "templates/cursor-rules-agent-toolbelt-router.mdc" ".cursor/rules/agent-toolbelt-router.mdc"
}

# ---- Root instruction pointers ------------------------------------------------

AGENTS_BEGIN="<!-- BEGIN agent-toolbelt -->"
AGENTS_END="<!-- END agent-toolbelt -->"

# pack_section <pack> — the "### <pack>" entry for a pack installed this run,
# built from the INSTALLED_* records. No leading or trailing blank line.
pack_section() {
  local p="$1" e out cmds sk
  out="### $p"$'\n'"$(pack_desc "$p")"$'\n'
  cmds=""
  for e in "${INSTALLED_COMMANDS[@]:-}"; do
    case "$e" in "$p"$'\t'*) cmds="$cmds- \`/${e#*$'\t'}\`"$'\n' ;; esac
  done
  sk=""
  for e in "${INSTALLED_SKILLS[@]:-}"; do
    case "$e" in "$p"$'\t'*) sk="$sk- \`.atb/skills/${e#*$'\t'}/\`"$'\n' ;; esac
  done
  [ -n "$cmds" ] && out="${out}"$'\n'"Commands:"$'\n'"$cmds"
  [ -n "$sk" ]   && out="${out}"$'\n'"Skills:"$'\n'"$sk"
  printf '%s' "$out"
}

# existing_pack_section <file> <pack> — that pack's "### <pack>" section, verbatim,
# from the file's existing marker block. Empty if absent.
existing_pack_section() {
  awk -v b="$AGENTS_BEGIN" -v e="$AGENTS_END" -v h="### $2" '
    $0==b {inb=1; next}
    inb && $0==e {exit}
    inb && /^### / { if ($0==h) sec=1; else if (sec) exit }
    sec {print}
  ' "$1"
}

# toolbelt_workflows_block <file> <packs...> — the full marker block, MERGED with
# the block already in <file>: packs advertised there keep their position (and
# their section text, unless reinstalled this run); packs new to this run are
# appended. Installing one pack must not un-advertise the others.
toolbelt_workflows_block() {
  local f="$1"; shift
  local p q sec seen block
  block="$AGENTS_BEGIN"$'\n'"## Available workflows"$'\n'
  block="$block"$'\n'"Installed by agent-toolbelt. Reach for these when the task matches the description."$'\n'
  local all=()
  if [ -f "$f" ] && grep -q "^$AGENTS_BEGIN\$" "$f"; then
    while IFS= read -r p; do
      [ -n "$p" ] && all+=("$p")
    done < <(awk -v b="$AGENTS_BEGIN" -v e="$AGENTS_END" '
      $0==b {inb=1; next} $0==e {inb=0} inb && /^### / {print substr($0,5)}' "$f")
  fi
  for p in "$@"; do
    seen=0
    for q in "${all[@]:-}"; do [ "$q" = "$p" ] && seen=1; done
    [ "$seen" = "1" ] || all+=("$p")
  done
  for p in "${all[@]:-}"; do
    [ -n "$p" ] || continue
    seen=0
    for q in "$@"; do [ "$q" = "$p" ] && seen=1; done
    if [ "$seen" = "1" ]; then
      sec="$(pack_section "$p")"
    else
      sec="$(existing_pack_section "$f" "$p")"
    fi
    [ -n "$sec" ] && block="$block"$'\n'"$sec"$'\n'
  done
  block="$block$AGENTS_END"$'\n'
  printf '%s' "$block"
}

# write_marked_pointer_file <file> <display-name> <packs...> — write/update the
# generated "Available workflows" block without disturbing user-authored content.
write_marked_pointer_file() {
  local f="$1" display="$2" block tmp blkfile
  shift 2
  block="$(toolbelt_workflows_block "$f" "$@"; printf x)"
  block="${block%x}"

  if [ "$DRY_RUN" = "1" ]; then
    if [ -f "$f" ]; then echo "~ would update $display block: $f"; else echo "+ would create $display: $f"; fi
    return 0
  fi

  ensure_dir "$(dirname "$f")"
  if [ ! -f "$f" ]; then
    printf '%s' "$block" > "$f" || exit 1
    echo "+ installed: $f"; created=$((created + 1)); return 0
  fi
  if ! grep -q "^$AGENTS_BEGIN\$" "$f"; then
    { printf '\n'; printf '%s' "$block"; } >> "$f" || exit 1
    echo "~ updated: $f"; updated=$((updated + 1)); return 0
  fi
  # Splice the block in place. The block is read from a temp file rather than an
  # awk -v var: BSD/macOS awk rejects a literal newline in a -v value ("newline in
  # string"), which would break every re-install over an existing AGENTS.md.
  blkfile="$(mktemp "$(dirname "$f")/.atb-block.XXXXXX")" || exit 1
  printf '%s' "$block" > "$blkfile" || { rm -f "$blkfile"; exit 1; }
  tmp="$(mktemp "$(dirname "$f")/.AGENTS.md.XXXXXX")" || { rm -f "$blkfile"; exit 1; }
  awk -v b="$AGENTS_BEGIN" -v e="$AGENTS_END" -v bf="$blkfile" '
    $0==b { while ((getline line < bf) > 0) print line; close(bf); skip=1; next }
    skip && $0==e { skip=0; next }
    skip { next }
    { print }
  ' "$f" > "$tmp" && mv "$tmp" "$f" || { rm -f "$tmp" "$blkfile"; exit 1; }
  rm -f "$blkfile"
  echo "~ updated: $f"; updated=$((updated + 1)); return 0
}

# write_agents_md <packs...> — write/update an "Available workflows" block in
# $TARGET/AGENTS.md listing the commands and skills installed for the given packs.
# Only runs when cursor or codex is selected (the AGENTS.md-consuming harnesses).
write_agents_md() {
  harness_enabled cursor || harness_enabled codex || return 0
  write_marked_pointer_file "$TARGET/AGENTS.md" "AGENTS.md" "$@"
}

# write_claude_md <packs...> — same pointer block for Claude Code, which reads
# CLAUDE.md rather than AGENTS.md.
write_claude_md() {
  harness_enabled claude || return 0
  write_marked_pointer_file "$TARGET/CLAUDE.md" "CLAUDE.md" "$@"
}
