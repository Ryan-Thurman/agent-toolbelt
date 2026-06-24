#!/usr/bin/env bash
# macOS double-click wrapper for the ship-it installer.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "ship-it Installer"
echo
echo "Drag the project folder into this Terminal window, then press Enter."
echo "The installer will add the /ship-it command, the ship-it skill tree, and the release-notes template."
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

"$ROOT/install-ship-it.sh" "$TARGET"

echo
read -r -p "Press Enter to close. "
