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

. "$REPO_ROOT/install/migrate-layout.bash"

created=0
updated=0
skipped=0
gated=0          # files skipped because their harness was not selected

# Support files already installed for this target. Reset by install.sh.
INSTALLED_SHARED_CONTRACTS=()

# ---- Harness gating -----------------------------------------------------------

# harness_enabled <name> — true if <name> is in the selected harness set.
harness_enabled() {
  case " ${HARNESS_ENABLED:-} " in
    *" $1 "*) return 0 ;;
    *) return 1 ;;
  esac
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
# are installed under .agents/ in the target so they don't collide with a brownfield
# project's own top-level dirs. Content shipped by the packs still refers to them by
# their *source* path (e.g. `skills/pr-review/references/foo.md`), so we rewrite those
# absolute-from-root refs to `.agents/…` as each file is copied. Relative refs
# (`../../examples/…`) are left alone: since these dirs move together, their
# relative distance is unchanged and they still resolve. Matching only at a path
# boundary ([start | space | ` | ( | =]) skips relative refs (preceded by `/`) and
# makes the rewrite idempotent (an existing `.agents/` prefix is preceded by `/`).
AGENTS_REWRITE='s#(^|[[:space:](=`])(skills|templates|workflows|examples|shared)/#\1.agents/\2/#g'

# install_copy <src> <dest> — copy while rewriting shared-folder refs to .agents/.
# The "Toolbelt paths:" line in each SKILL.md resolves root-relative refs for plugin
# installs. The rewrite above makes those refs project-relative, so drop that line.
install_copy() {
  sed -E -e '/^Toolbelt paths: /d' -e "$AGENTS_REWRITE" "$1" > "$2"
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
  if harness_enabled cursor; then _install "commands/$1.md" ".cursor/commands/$1.md"; else gated=$((gated + 1)); fi
  if harness_enabled claude; then _install "commands/$1.md" ".claude/commands/$1.md"; else gated=$((gated + 1)); fi
  return 0
}

# cmd_cursor <name> — a slash command for Cursor only.
cmd_cursor() {
  if harness_enabled cursor; then _install "commands/$1.md" ".cursor/commands/$1.md"; else gated=$((gated + 1)); fi
  return 0
}

# _skill_metadata <pack> <dest-root> — install host metadata next to a skill copy.
_skill_metadata() {
  _install "skills/$1/agents/openai.yaml" "$2/agents/openai.yaml"
}

# skill <pack> <rel> — one shared copy for commands and skill discovery.
# Claude commands also read this tree by path.
skill() {
  _install "skills/$1/$2" ".agents/skills/$1/$2"
  if [ "$2" = "SKILL.md" ]; then
    _skill_metadata "$1" ".agents/skills/$1"
  fi
  return 0
}

# skill_shared <pack> <rel> — shared payload for a Cursor-only pack.
skill_shared() {
  skill "$@"
}

# skill_tree <pack> — install a complete skill reference tree without hand-listing
# every file. The skill entrypoint installs its host metadata; agents/openai.yaml
# is therefore skipped when walking the remaining source files.
skill_tree() {
  local pack="$1" root rel
  root="$REPO_ROOT/skills/$pack"
  if [ ! -d "$root" ]; then
    echo "! missing skill tree: $root" >&2
    exit 1
  fi
  skill "$pack" SKILL.md
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    case "$rel" in
      SKILL.md|agents/openai.yaml) continue ;;
    esac
    skill "$pack" "$rel"
  done < <(find "$root" -type f -print | sed "s#^$root/##" | sort)
}

# template <name>, workflow <name>, example <name> — shared artifacts (harness-agnostic).
# Installed under .agents/ so they don't collide with the target project's own top-level dirs.
template() { _install "templates/$1" ".agents/templates/$1"; }
workflow() { _install "workflows/$1" ".agents/workflows/$1"; }
example()  { _install "examples/$1"  ".agents/examples/$1"; }

# shared_contract <rel> — support-only contracts consumed by multiple packs.
# These support files live under .agents/shared/, outside skill discovery.
shared_contract() {
  local rel="$1" e
  for e in "${INSTALLED_SHARED_CONTRACTS[@]:-}"; do
    [ "$e" = "manifest.json" ] && break
  done
  if [ "${e:-}" != "manifest.json" ]; then
    _install "shared/contracts/manifest.json" ".agents/shared/contracts/manifest.json"
    INSTALLED_SHARED_CONTRACTS+=("manifest.json")
  fi
  for e in "${INSTALLED_SHARED_CONTRACTS[@]:-}"; do
    [ "$e" = "$rel" ] && return 0
  done
  _install "shared/contracts/$rel" ".agents/shared/contracts/$rel"
  INSTALLED_SHARED_CONTRACTS+=("$rel")
}

# hook_json <src> — the Cursor hooks manifest (cursor only). install_file skips an existing
# .cursor/hooks.json (no --force), so we never clobber hooks you already have — merge manually.
hook_json() {
  if harness_enabled cursor; then _install "optional/cursor-hooks/$1" ".cursor/hooks.json"; else gated=$((gated + 1)); fi
  return 0
}

# hook_script <name> — a Cursor hook script under .cursor/hooks/ (cursor only). hooks.json
# invokes these via `bash .cursor/hooks/<name>`, so no executable bit is required.
hook_script() {
  if harness_enabled cursor; then _install "optional/cursor-hooks/$1" ".cursor/hooks/$1"; else gated=$((gated + 1)); fi
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

# The same compact entry instructions serve every host. Skills own their task
# procedures and references, so the root block does not list installed packs.
toolbelt_instructions_block() {
  printf '%s\n' "$AGENTS_BEGIN"
  install_copy "$REPO_ROOT/templates/agent-toolbelt-instructions.md" /dev/stdout
  printf '%s\n' "$AGENTS_END"
}

# write_marked_pointer_file <file> <display-name> — replace only the managed block.
write_marked_pointer_file() {
  local f="$1" display="$2" block tmp blkfile
  block="$(toolbelt_instructions_block; printf x)"
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
  blkfile="$(mktemp "$(dirname "$f")/.agents-block.XXXXXX")" || exit 1
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

# write_agents_md — write compact entry instructions in $TARGET/AGENTS.md.
# Only runs when cursor or codex is selected (the AGENTS.md-consuming harnesses).
write_agents_md() {
  harness_enabled cursor || harness_enabled codex || return 0
  write_marked_pointer_file "$TARGET/AGENTS.md" "AGENTS.md"
}

# write_claude_md — same pointer block for Claude Code, which reads
# CLAUDE.md rather than AGENTS.md.
write_claude_md() {
  harness_enabled claude || return 0
  write_marked_pointer_file "$TARGET/CLAUDE.md" "CLAUDE.md"
}
