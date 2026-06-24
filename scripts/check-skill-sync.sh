#!/usr/bin/env bash
# Verify that duplicated skill files stay byte-identical to their canonical copy.
#
# The dev-lite-workflow skill ships in two places so it can be both a shared
# skill and a repo-scoped Codex skill. They must not drift. Run this locally or
# in CI; exits non-zero if any pair differs.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0

# canonical : copy
pairs="
skills/dev-lite-workflow/SKILL.md:.agents/skills/dev-lite-workflow/SKILL.md
"

for pair in $pairs; do
  canonical="${pair%%:*}"
  copy="${pair#*:}"

  if [ ! -f "$ROOT/$canonical" ]; then
    echo "! missing canonical: $canonical" >&2
    status=1
    continue
  fi
  if [ ! -f "$ROOT/$copy" ]; then
    echo "! missing copy: $copy" >&2
    status=1
    continue
  fi

  if diff -q "$ROOT/$canonical" "$ROOT/$copy" >/dev/null; then
    echo "ok: $copy matches $canonical"
  else
    echo "DRIFT: $copy differs from canonical $canonical" >&2
    echo "  fix with: cp \"$canonical\" \"$copy\"" >&2
    status=1
  fi
done

exit "$status"
