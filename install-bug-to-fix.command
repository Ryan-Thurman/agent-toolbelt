#!/usr/bin/env bash
# macOS double-click wrapper for the Bug-to-Fix installer.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Bug-to-Fix Installer"
echo
echo "Drag the project folder into this Terminal window, then press Enter."
echo "The installer will add the /bug-* commands, the bug-to-fix skill tree, templates, and the workflow playbook."
echo "Existing files are skipped."
echo

printf "Target folder: "
IFS= read -r TARGET

# Finder drag-and-drop may add escaping or surrounding whitespace.
TARGET="${TARGET#"${TARGET%%[![:space:]]*}"}"  # trim all leading whitespace
TARGET="${TARGET%"${TARGET##*[![:space:]]}"}"  # trim all trailing whitespace
TARGET="${TARGET//\\ / }"

if [ -z "$TARGET" ]; then
  echo "No target folder provided. Nothing installed."
  echo
  read -r -p "Press Enter to close. "
  exit 1
fi

"$ROOT/install-bug-to-fix.sh" "$TARGET"

echo
read -r -p "Press Enter to close. "
