#!/usr/bin/env bash
# Verify that duplicated skill files stay byte-identical to their canonical copy.
#
# The dev-lite-workflow skill ships in two places so it can be both a shared
# skill and a repo-scoped Codex skill. The whole skill tree (SKILL.md plus its
# references/) must not drift. Run this locally or in CI; exits non-zero if any
# pair differs.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0

# canonical dir : copy dir (compared recursively)
pairs="
skills/dev-lite-workflow:.agents/skills/dev-lite-workflow
"

for pair in $pairs; do
  canonical="${pair%%:*}"
  copy="${pair#*:}"

  if [ ! -d "$ROOT/$canonical" ]; then
    echo "! missing canonical: $canonical" >&2
    status=1
    continue
  fi
  if [ ! -d "$ROOT/$copy" ]; then
    echo "! missing copy: $copy" >&2
    status=1
    continue
  fi

  if diff -rq "$ROOT/$canonical" "$ROOT/$copy" >/dev/null; then
    echo "ok: $copy matches $canonical"
  else
    echo "DRIFT: $copy differs from canonical $canonical" >&2
    diff -rq "$ROOT/$canonical" "$ROOT/$copy" >&2
    echo "  fix with: rm -rf \"$copy\" && cp -R \"$canonical\" \"$copy\"" >&2
    status=1
  fi
done

exit "$status"
