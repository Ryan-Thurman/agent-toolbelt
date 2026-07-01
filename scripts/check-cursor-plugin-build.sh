#!/usr/bin/env bash
# Smoke-check the private Cursor plugin package without publishing or linking it.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-${TMPDIR:-/tmp}/agent-toolbelt-cursor-plugin-check}"

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

if [ "$cmd_count" -eq 0 ]; then
  echo "plugin build contains no commands" >&2
  exit 1
fi
if [ "$skill_count" -eq 0 ]; then
  echo "plugin build contains no skills" >&2
  exit 1
fi

for path in "$OUT/hooks" "$OUT/rules" "$OUT/.cursor" "$OUT/.claude" "$OUT/.agents"; do
  if [ -e "$path" ]; then
    echo "default plugin build must not include harness-local payload: $path" >&2
    exit 1
  fi
done

echo "ok: Cursor plugin build has $cmd_count commands, $skill_count skills, valid manifest, and no default hooks/rules"
