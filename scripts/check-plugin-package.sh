#!/usr/bin/env bash
# Validate the tracked Cursor, Claude Code, and Codex plugin package.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v node >/dev/null 2>&1 || {
  echo "node is required for cross-host plugin checks" >&2
  exit 1
}
node "$ROOT/scripts/test-release-version.js"
node "$ROOT/scripts/check-public-content.js" "$ROOT"
node "$ROOT/scripts/test-public-content.js"
node "$ROOT/scripts/check-plugin-package.js" "$ROOT"

echo "Running execution contract and selected-install checks..."
python3 "$ROOT/scripts/test-execution-contract.py"
"$ROOT/scripts/check-skill-shape.sh"
"$ROOT/scripts/check-skill-sync.sh"
"$ROOT/scripts/test-crap-analysis.sh"
python3 "$ROOT/scripts/test-react-rule-scan.py"
python3 "$ROOT/scripts/build-react-rule-routing.py" --check

echo "Running catalog and generated-audit checks..."
"$ROOT/scripts/check-catalog.sh"

echo "Running generated portal checks..."
"$ROOT/scripts/check-portal.sh"

# Claude's installed validator checks plugin and marketplace schemas. Keep this
# separate from the JSON/path checks above so its diagnostics remain visible.
if command -v claude >/dev/null 2>&1; then
  claude plugin validate "$ROOT/.claude-plugin/plugin.json" --strict >/dev/null
  claude plugin validate "$ROOT/.claude-plugin/marketplace.json" --strict >/dev/null
  echo "ok: Claude Code validator passed"
else
  echo "warning: claude CLI not found; skipped Claude validator" >&2
fi
