#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TEMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-portal-check.XXXXXX")
trap 'rm -rf "$TEMP_DIR"' EXIT

node "$ROOT_DIR/scripts/build-portal.js" "$TEMP_DIR/generated"
node "$ROOT_DIR/scripts/check-portal.js" "$TEMP_DIR/generated"
node --check "$ROOT_DIR/scripts/build-portal.js"
node --check "$ROOT_DIR/scripts/check-portal.js"
node --check "$ROOT_DIR/scripts/test-portal-app.js"
node --check "$ROOT_DIR/scripts/test-portal-browser.js"
node --check "$ROOT_DIR/portal/src/app.js"
node "$ROOT_DIR/scripts/test-portal-app.js"
node "$ROOT_DIR/scripts/test-portal-browser.js"

for file in index.html styles.css app.js data.js brand-icon.svg favicon.svg favicon-16.png favicon-32.png favicon-48.png; do
  if ! cmp -s "$TEMP_DIR/generated/$file" "$ROOT_DIR/portal/generated/$file"; then
    echo "generated portal is stale: $file" >&2
    exit 1
  fi
done

echo "Portal checks passed: deterministic build, generated freshness, offline references, app helpers, Playwright flows, accessibility scans, and screenshots."
