#!/usr/bin/env bash
# Check that the hand-review fixture inventory retains its cases and controls.
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cases="$ROOT/skills/pr-review/benchmarks/style-contract/cases.md"
status=0

for name in misleading synonym units boolean ID/object tiny established narration speculative clean; do
  if ! grep -q "$name" "$cases"; then
    echo "! missing style fixture coverage: $name" >&2
    status=1
  fi
done
if ! grep -q 'never call code AI-generated' "$cases"; then
  echo "! style fixtures must prohibit AI-generated accusations" >&2
  status=1
fi
[ "$status" -eq 0 ] && echo "ok: PR-review style fixture inventory is present"
exit "$status"
