#!/usr/bin/env bash
# Build a private Cursor plugin from the agent-toolbelt content.
#
#   ./build-cursor-plugin.sh [--with-rules] [output-dir]
#
# Assembles a Cursor skills plugin (skills/ [+ rules/] + .cursor-plugin/plugin.json)
# from this repo. The repository itself is also a native Cursor, Claude Code, and
# Codex plugin; this build is the optional frozen/user-scoped Cursor package.
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
mkdir -p "$OUT/.cursor-plugin" "$OUT/skills" "$OUT/shared"
[ "$WITH_RULES" = "1" ] && mkdir -p "$OUT/rules"

# --- Manifest -----------------------------------------------------------------
# Keep the assembled package on the same metadata contract as the tracked root
# plugin. The manifest intentionally declares skills only: commands, hooks, and
# always-on rules are opt-in project-install features, not global plugin defaults.
if [ ! -f "$ROOT/.cursor-plugin/plugin.json" ]; then
  echo "build-cursor-plugin: missing tracked Cursor manifest" >&2
  exit 1
fi
cp "$ROOT/.cursor-plugin/plugin.json" "$OUT/.cursor-plugin/plugin.json"

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

# Skills refer to these support documents by their repository-root paths. Include
# them in the frozen package so those references work from the plugin cache.
for support_dir in templates workflows examples docs; do
  if [ -d "$ROOT/$support_dir" ]; then
    cp -R "$ROOT/$support_dir" "$OUT/"
  fi
done

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

echo "Done: $skill_count skills, 0 commands, $rule_count rules$([ "$WITH_RULES" = 1 ] || echo ' (rules omitted; pass --with-rules to include always-on rules globally)')."
echo
echo "Install privately (user-scoped, all projects):"
echo "  ln -s \"$OUT\" ~/.cursor/plugins/local/$NAME"
echo "  # then enable \"$NAME\" in Cursor → Settings → Plugins, and run Developer: Reload Window"
