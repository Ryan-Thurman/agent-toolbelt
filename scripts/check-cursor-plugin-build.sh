#!/usr/bin/env bash
# Smoke-check the private Cursor plugin package without publishing or linking it.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cleanup_out=0

if [ $# -gt 1 ]; then
  echo "usage: check-cursor-plugin-build.sh [output-dir]" >&2
  exit 2
fi

if [ $# -eq 1 ]; then
  OUT="$1"
else
  OUT="$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-cursor-plugin-check.XXXXXX")"
  cleanup_out=1
fi

cleanup() {
  if [ "$cleanup_out" = "1" ]; then
    rm -rf "$OUT"
  fi
}
trap cleanup EXIT

"$ROOT/build-cursor-plugin.sh" "$OUT" >/dev/null

manifest="$OUT/.cursor-plugin/plugin.json"
if [ ! -f "$manifest" ]; then
  echo "missing plugin manifest: $manifest" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is required to validate plugin manifest JSON" >&2
  exit 1
fi

node -e '
const fs = require("fs");
const manifest = process.argv[1];
const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
for (const key of ["name", "description", "version", "author"]) {
  if (!Object.prototype.hasOwnProperty.call(data, key)) {
    console.error(`missing manifest key: ${key}`);
    process.exit(1);
  }
}
' "$manifest"

cmd_count="$(find "$OUT/commands" -maxdepth 1 -type f -name '*.md' | wc -l | tr -d ' ')"
skill_count="$(find "$OUT/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')"
source_cmd_count="$(find "$ROOT/commands" -maxdepth 1 -type f -name '*.md' | wc -l | tr -d ' ')"
source_skill_count="$(find "$ROOT/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')"

if [ "$cmd_count" -eq 0 ]; then
  echo "plugin build contains no commands" >&2
  exit 1
fi
if [ "$skill_count" -eq 0 ]; then
  echo "plugin build contains no skills" >&2
  exit 1
fi
if [ "$cmd_count" -ne "$source_cmd_count" ]; then
  echo "plugin command count mismatch: source=$source_cmd_count build=$cmd_count" >&2
  exit 1
fi
if [ "$skill_count" -ne "$source_skill_count" ]; then
  echo "plugin skill count mismatch: source=$source_skill_count build=$skill_count" >&2
  exit 1
fi

while IFS= read -r src; do
  rel="${src#"$ROOT/commands/"}"
  if [ ! -f "$OUT/commands/$rel" ]; then
    echo "plugin build missing command: commands/$rel" >&2
    exit 1
  fi
done < <(find "$ROOT/commands" -maxdepth 1 -type f -name '*.md' | sort)

while IFS= read -r src; do
  skill_name="$(basename "$(dirname "$src")")"
  if [ ! -f "$OUT/skills/$skill_name/SKILL.md" ]; then
    echo "plugin build missing skill: skills/$skill_name/SKILL.md" >&2
    exit 1
  fi
  if [ ! -f "$OUT/skills/$skill_name/agents/openai.yaml" ]; then
    echo "plugin build missing skill metadata: skills/$skill_name/agents/openai.yaml" >&2
    exit 1
  fi
done < <(find "$ROOT/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | sort)

if [ ! -f "$OUT/shared/contracts/manifest.json" ]; then
  echo "plugin build is missing shared contracts manifest" >&2
  exit 1
fi

for path in "$OUT/hooks" "$OUT/rules" "$OUT/.cursor" "$OUT/.claude" "$OUT/.agents"; do
  if [ -e "$path" ]; then
    echo "default plugin build must not include harness-local payload: $path" >&2
    exit 1
  fi
done

echo "ok: Cursor plugin build has $cmd_count commands, $skill_count skills, valid manifest, and no default hooks/rules"
