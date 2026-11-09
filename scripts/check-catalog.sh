#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

node "$SCRIPT_DIR/validate-catalog.js"
node "$SCRIPT_DIR/test-validate-catalog.js"
REPORT_DIR=$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-catalog-report.XXXXXX")
trap 'rm -rf "$REPORT_DIR"' EXIT
node "$SCRIPT_DIR/generate-skill-taxonomy-audit.js" --output "$REPORT_DIR/skill-taxonomy-audit.md"
node "$SCRIPT_DIR/generate-skill-taxonomy-audit.js" --check --output "$REPORT_DIR/skill-taxonomy-audit.md"
echo "Catalog and generated audit checks passed."
