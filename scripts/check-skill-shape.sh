#!/usr/bin/env bash
# Validate the lightweight shape constraints for runtime skills.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0
description_limit=45

for skill_md in "$ROOT"/skills/*/SKILL.md; do
  skill_rel="${skill_md#"$ROOT"/}"
  skill_dir="$(dirname "$skill_md")"

  if [ "$(sed -n '1p' "$skill_md")" != "---" ]; then
    echo "! $skill_rel: frontmatter must start on line 1" >&2
    status=1
    continue
  fi

  frontmatter="$(sed -n '2,/^---$/p' "$skill_md" | sed '$d')"
  name_count="$(printf '%s\n' "$frontmatter" | grep -c '^name:')"
  description_count="$(printf '%s\n' "$frontmatter" | grep -c '^description:')"

  if [ "$name_count" -ne 1 ]; then
    echo "! $skill_rel: expected exactly one name field" >&2
    status=1
  fi
  if [ "$description_count" -ne 1 ]; then
    echo "! $skill_rel: expected exactly one description field" >&2
    status=1
  fi

  unexpected_keys="$(printf '%s\n' "$frontmatter" | grep -E '^[A-Za-z0-9_-]+:' | grep -Ev '^(name|description):' || true)"
  if [ -n "$unexpected_keys" ]; then
    echo "! $skill_rel: unexpected frontmatter keys:" >&2
    printf '%s\n' "$unexpected_keys" >&2
    status=1
  fi

  description="$(printf '%s\n' "$frontmatter" | sed -n 's/^description:[[:space:]]*//p')"
  if [ -n "$description" ]; then
    word_count="$(printf '%s\n' "$description" | wc -w | tr -d ' ')"
    if [ "$word_count" -gt "$description_limit" ]; then
      echo "! $skill_rel: description has $word_count words, limit is $description_limit" >&2
      status=1
    fi
  fi

  refs="$(grep -Eo 'shared/contracts/references/[-A-Za-z0-9_./]+\.md|skills/[-A-Za-z0-9_./]+/references/[-A-Za-z0-9_./]+\.md|references/[-A-Za-z0-9_./]+\.md' "$skill_md" | sort -u || true)"
  for ref in $refs; do
    case "$ref" in
      shared/*)
        target="$ROOT/$ref"
        ;;
      skills/*)
        target="$ROOT/$ref"
        ;;
      *)
        target="$skill_dir/$ref"
        ;;
    esac
    if [ ! -f "$target" ]; then
      echo "! $skill_rel: missing referenced file $ref" >&2
      status=1
    fi
  done
done

for ref in "$ROOT"/shared/contracts/references/*.md; do
  [ -f "$ref" ] || continue
  rel="${ref#"$ROOT"/shared/contracts/}"
  if ! grep -q "\"path\": \"$rel\"" "$ROOT/shared/contracts/manifest.json"; then
    echo "! shared/contracts/manifest.json: missing $rel" >&2
    status=1
  fi
done

if [ "$status" -eq 0 ]; then
  echo "ok: skill frontmatter, description budgets, and SKILL.md reference links are valid"
fi

exit "$status"
