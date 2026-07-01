#!/usr/bin/env bash
# Build a private Cursor plugin from the agent-toolbelt content.
#
#   ./build-cursor-plugin.sh [--with-rules] [output-dir]
#
# Assembles a Cursor plugin (skills/ + commands/ [+ rules/] + .cursor-plugin/plugin.json)
# from this repo. The plugin is user-scoped once linked into ~/.cursor/plugins/local/,
# so its skills are available in every project — no per-repo install.
#
# By DEFAULT rules are NOT bundled: most of this repo's rules are `alwaysApply: true`,
# and a user-scoped plugin would fire them in EVERY project. Skills are on-demand and
# safe to globalize; pass --with-rules only if you really want always-on rules everywhere.
#
# This does NOT publish anything. To use it privately:
#   ./build-cursor-plugin.sh
#   ln -s "$(pwd)/build/cursor-plugin/agent-toolbelt" ~/.cursor/plugins/local/agent-toolbelt
#   # then enable "agent-toolbelt" in Cursor → Settings → Plugins, and Reload Window
#
# The symlink means rebuilds are picked up live (Reload Window). Prefer `cp -R` of the
# build output instead of a symlink if you want a frozen copy.

set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAME="agent-toolbelt"
WITH_RULES=0
OUT="$ROOT/build/cursor-plugin/agent-toolbelt"
for arg in "$@"; do
  case "$arg" in
    --with-rules) WITH_RULES=1 ;;
    -*) echo "build-cursor-plugin: unknown option: $arg" >&2; exit 2 ;;
    *) OUT="$arg" ;;
  esac
done

echo "Building Cursor plugin into: $OUT"
rm -rf "$OUT"
mkdir -p "$OUT/.cursor-plugin" "$OUT/skills" "$OUT/commands" "$OUT/shared"
[ "$WITH_RULES" = "1" ] && mkdir -p "$OUT/rules"

# --- Manifest -----------------------------------------------------------------
cat > "$OUT/.cursor-plugin/plugin.json" <<JSON
{
  "name": "$NAME",
  "description": "Reusable AI-agent commands, skills, and rules for software delivery (private build).",
  "version": "0.1.0",
  "author": { "name": "$(git -C "$ROOT" config user.name 2>/dev/null || echo "local")" }
}
JSON

# --- Commands (*.md) ----------------------------------------------------------
cmd_count=0
for f in "$ROOT"/commands/*.md; do
  [ -f "$f" ] || continue
  cp "$f" "$OUT/commands/" && cmd_count=$((cmd_count + 1))
done

# --- Skills (each pack dir with a SKILL.md) -----------------------------------
skill_count=0
for d in "$ROOT"/skills/*/; do
  d="${d%/}"
  [ -f "$d/SKILL.md" ] || continue          # only real skill folders, skip README etc.
  cp -R "$d" "$OUT/skills/" && skill_count=$((skill_count + 1))
done

# --- Shared support contracts -------------------------------------------------
if [ -d "$ROOT/shared/contracts" ]; then
  cp -R "$ROOT/shared/contracts" "$OUT/shared/"
fi

# --- Rules (*.mdc) — opt-in only ----------------------------------------------
# From templates/cursor-rules-*.mdc (strip the cursor-rules- prefix) and .cursor/rules/.
rule_count=0
if [ "$WITH_RULES" = "1" ]; then
  for f in "$ROOT"/templates/cursor-rules-*.mdc; do
    [ -f "$f" ] || continue
    base="$(basename "$f")"; base="${base#cursor-rules-}"
    cp "$f" "$OUT/rules/$base" && rule_count=$((rule_count + 1))
  done
  for f in "$ROOT"/.cursor/rules/*.mdc; do
    [ -f "$f" ] || continue
    cp "$f" "$OUT/rules/$(basename "$f")" && rule_count=$((rule_count + 1))
  done
fi

echo "Done: $cmd_count commands, $skill_count skills, $rule_count rules$([ "$WITH_RULES" = 1 ] || echo ' (rules omitted; pass --with-rules to include always-on rules globally)')."
echo
echo "Install privately (user-scoped, all projects):"
echo "  ln -s \"$OUT\" ~/.cursor/plugins/local/$NAME"
echo "  # then enable \"$NAME\" in Cursor → Settings → Plugins, and run Developer: Reload Window"
