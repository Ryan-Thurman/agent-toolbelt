#!/usr/bin/env bash
# Validate the lightweight shape constraints for runtime skills.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0
description_limit=45

for skill_md in "$ROOT"/skills/*/SKILL.md; do
  skill_rel="${skill_md#"$ROOT"/}"
  skill_dir="$(dirname "$skill_md")"
  skill_name="$(basename "$skill_dir")"
  install_file="$ROOT/install/$skill_name.sh"

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

  invocation_terms="$(grep -En 'user-invoked|model-invoked|disable-model-invocation' "$skill_md" || true)"
  if [ -n "$invocation_terms" ]; then
    echo "! $skill_rel: misleading invocation-model wording:" >&2
    printf '%s\n' "$invocation_terms" >&2
    status=1
  fi

  sediment_terms="$(grep -En 'Credits|Lifts concepts|future .*CLI|optional.*rct' "$skill_md" || true)"
  if [ -n "$sediment_terms" ]; then
    echo "! $skill_rel: top-level sediment should move to references or docs:" >&2
    printf '%s\n' "$sediment_terms" >&2
    status=1
  fi

  shared_refs="$(grep -RhoE 'shared/contracts/references/[-A-Za-z0-9_./]+\.md' "$skill_dir" | sort -u || true)"
  for shared_ref in $shared_refs; do
    shared_rel="${shared_ref#shared/contracts/}"
    if [ ! -f "$install_file" ]; then
      echo "! $skill_rel: references $shared_ref but install/$skill_name.sh is missing" >&2
      status=1
    elif ! grep -q "shared_contract $shared_rel" "$install_file"; then
      echo "! $skill_rel: references $shared_ref but install/$skill_name.sh does not install it" >&2
      status=1
    fi
  done

  metadata_file="$skill_dir/agents/openai.yaml"
  if [ ! -f "$metadata_file" ]; then
    echo "! $skill_rel: missing agents/openai.yaml metadata" >&2
    status=1
  fi

  if [ -f "$metadata_file" ]; then
    for key in display_name short_description default_prompt; do
      key_count="$(grep -c "^$key:" "$metadata_file")"
      if [ "$key_count" -ne 1 ]; then
        echo "! ${metadata_file#"$ROOT"/}: expected exactly one $key field" >&2
        status=1
      fi
    done

    extra_keys="$(grep -E '^[A-Za-z0-9_-]+:' "$metadata_file" | grep -Ev '^(display_name|short_description|default_prompt):' || true)"
    if [ -n "$extra_keys" ]; then
      echo "! ${metadata_file#"$ROOT"/}: unexpected metadata keys:" >&2
      printf '%s\n' "$extra_keys" >&2
      status=1
    fi
  fi
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
  echo "ok: skill frontmatter, descriptions, metadata, references, shared contracts, and top-level wording are valid"
fi

exit "$status"
