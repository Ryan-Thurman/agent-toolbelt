#!/usr/bin/env bash
# macOS double-click wrapper for non-dev pilots.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "AI Feature Delivery Installer"
echo
echo "Drag the project or pilot folder into this Terminal window, then press Enter."
echo "The installer will add Cursor commands/rules plus templates and workflows."
echo "Existing files are skipped."
echo

printf "Target folder: "
IFS= read -r TARGET

# Finder drag-and-drop may add escaping or surrounding spaces.
TARGET="${TARGET# }"
TARGET="${TARGET% }"
TARGET="${TARGET//\\ / }"

if [ -z "$TARGET" ]; then
  echo "No target folder provided. Nothing installed."
  echo
  read -r -p "Press Enter to close."
  exit 1
fi

"$ROOT/install-ai-feature-delivery.sh" "$TARGET"

echo
read -r -p "Press Enter to close."
