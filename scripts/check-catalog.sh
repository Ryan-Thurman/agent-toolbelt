#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

node "$SCRIPT_DIR/validate-catalog.js"
node "$SCRIPT_DIR/test-validate-catalog.js"
node "$SCRIPT_DIR/generate-skill-taxonomy-audit.js" --check
echo "Catalog and generated audit checks passed."
