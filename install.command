#!/usr/bin/env bash
# macOS double-click wrapper for the unified agent-toolbelt installer.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "agent-toolbelt Installer"
echo
echo "Available packs:"
"$ROOT/install.sh" --list | sed -n '2,$p'
echo

printf "Packs to install (space-separated, or 'all'): "
IFS= read -r PACKS
[ -z "$PACKS" ] && PACKS="all"

echo
echo "Drag the target project folder into this Terminal window, then press Enter."
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

# shellcheck disable=SC2086
"$ROOT/install.sh" $PACKS "$TARGET"

echo
read -r -p "Press Enter to close. "
