#!/usr/bin/env bash
# Verify that duplicated skill files stay byte-identical to their canonical copy.
#
# The phased-delivery skill ships in two places so it can be both a shared
# skill and a repo-scoped Codex skill. The whole skill tree (SKILL.md plus its
# references/) must not drift. Run this locally or in CI; exits non-zero if any
# pair differs.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0

# canonical dir : copy dir (compared recursively)
pairs="
skills/phased-delivery:.agents/skills/phased-delivery
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

# The repository's Cursor commands must use the same delivery entry points.
for copy in "$ROOT"/.cursor/commands/dev-*.md; do
  canonical="$ROOT/commands/$(basename "$copy")"
  if [ ! -f "$canonical" ] || ! cmp -s "$canonical" "$copy"; then
    echo "DRIFT: ${copy#"$ROOT/"} differs from ${canonical#"$ROOT/"}" >&2
    status=1
  fi
done

exit "$status"
