#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
OUTPUT_DIR="${1:-$ROOT_DIR/portal/generated}"

node "$ROOT_DIR/scripts/build-portal.js" "$OUTPUT_DIR"
