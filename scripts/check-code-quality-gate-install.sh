#!/usr/bin/env bash
# Exercise dependency expansion with real all-harness installs. This checks the
# installed runtime surface rather than wording in source prompts.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-code-quality-gate.XXXXXX")"

cleanup() {
  rm -rf "$TMP_ROOT"
}
trap cleanup EXIT

require_file() {
  if [ ! -f "$1" ]; then
    echo "missing installed file: $1" >&2
    exit 1
  fi
}

gate_target="$TMP_ROOT/gate"
"$ROOT/install.sh" --harness all code-quality-gate "$gate_target" >/dev/null

for path in \
  .cursor/commands/code-quality-gate.md \
  .claude/commands/code-quality-gate.md \
  .atb/skills/code-quality-gate/SKILL.md \
  .atb/skills/code-quality-gate/references/gate-contract.md \
  .atb/skills/code-quality-gate/scripts/fingerprint.sh \
  .atb/skills/code-quality-gate/agents/openai.yaml \
  .agents/skills/code-quality-gate/SKILL.md \
  .agents/skills/code-quality-gate/references/gate-contract.md \
  .agents/skills/code-quality-gate/scripts/fingerprint.sh \
  .cursor/commands/simplify.md \
  .cursor/commands/pr-review.md \
  .cursor/commands/pr-improve.md \
  .atb/skills/simplify/SKILL.md \
  .atb/skills/pr-review/SKILL.md \
  .atb/skills/pr-improve/SKILL.md \
  .atb/shared/contracts/references/style-precedence.md \
  .atb/shared/contracts/references/anti-slop-naming.md \
  .atb/shared/contracts/references/typescript-react-baseline.md \
  .atb/shared/contracts/references/maintainability-taxonomy.md \
  .atb/templates/code-quality-gate-report.md
do
  require_file "$gate_target/$path"
done

if ! grep -q '.atb/shared/contracts/references/style-precedence.md' "$gate_target/.atb/skills/code-quality-gate/SKILL.md"; then
  echo "installed gate skill did not rewrite shared-contract path" >&2
  exit 1
fi
if ! grep -q '.atb/skills/code-quality-gate/SKILL.md' "$gate_target/.cursor/commands/code-quality-gate.md"; then
  echo "installed gate command did not rewrite skill path" >&2
  exit 1
fi
if ! grep -q '.atb/skills/code-quality-gate/scripts/fingerprint.sh' "$gate_target/.cursor/commands/code-quality-gate.md"; then
  echo "installed gate command did not rewrite fingerprint-script path" >&2
  exit 1
fi
for field in head_fingerprint scope_fingerprint coverage allowed_paths_file; do
  if ! grep -q "^$field:" "$gate_target/.atb/templates/code-quality-gate-report.md"; then
    echo "installed gate report template is missing $field" >&2
    exit 1
  fi
done
for pack in simplify pr-review pr-improve code-quality-gate; do
  count="$(grep -c "^### $pack$" "$gate_target/AGENTS.md")"
  if [ "$count" -ne 1 ]; then
    echo "dependency pack was not recorded exactly once: $pack" >&2
    exit 1
  fi
done

dev_lite_target="$TMP_ROOT/dev-lite"
"$ROOT/install.sh" --harness all dev-lite-workflow "$dev_lite_target" >/dev/null

for path in \
  .cursor/commands/dev-pr-review.md \
  .cursor/commands/code-quality-gate.md \
  .atb/skills/dev-lite-workflow/SKILL.md \
  .atb/skills/code-quality-gate/SKILL.md \
  .atb/skills/simplify/SKILL.md \
  .atb/skills/pr-review/SKILL.md \
  .atb/skills/pr-improve/SKILL.md \
  .atb/templates/dev-pr-review.md \
  .atb/templates/code-quality-gate-report.md
do
  require_file "$dev_lite_target/$path"
done

fingerprint_repo="$TMP_ROOT/fingerprint-repo"
mkdir -p "$fingerprint_repo"
git -C "$fingerprint_repo" init -q
printf 'base\n' > "$fingerprint_repo/tracked.txt"
git -C "$fingerprint_repo" add tracked.txt
git -C "$fingerprint_repo" -c user.name=Test -c user.email=test@example.invalid commit -qm base
printf 'changed\n' > "$fingerprint_repo/tracked.txt"
printf 'untracked\n' > "$fingerprint_repo/untracked.txt"
allowed_paths="$TMP_ROOT/allowed-paths.nul"
printf 'tracked.txt\0untracked.txt\0' > "$allowed_paths"
fingerprint_script="$gate_target/.atb/skills/code-quality-gate/scripts/fingerprint.sh"
first="$(cd "$fingerprint_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$allowed_paths")"
second="$(cd "$fingerprint_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$allowed_paths")"
if [ "$first" != "$second" ] || ! printf '%s\n' "$first" | grep -q '^coverage=final$'; then
  echo "fingerprint script did not produce stable final-coverage evidence" >&2
  exit 1
fi
printf 'changed again\n' > "$fingerprint_repo/untracked.txt"
third="$(cd "$fingerprint_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$allowed_paths")"
if [ "$first" = "$third" ]; then
  echo "fingerprint script did not detect untracked-content change" >&2
  exit 1
fi
partial_paths="$TMP_ROOT/partial-paths.nul"
printf 'tracked.txt\0' > "$partial_paths"
partial="$(cd "$fingerprint_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$partial_paths")"
if ! printf '%s\n' "$partial" | grep -q '^coverage=partial$'; then
  echo "fingerprint script did not identify partial coverage" >&2
  exit 1
fi
invalid_paths="$TMP_ROOT/invalid-paths.nul"
printf '../outside.txt\0' > "$invalid_paths"
if (cd "$fingerprint_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$invalid_paths" >/dev/null 2>&1); then
  echo "fingerprint script accepted an escaping scope path" >&2
  exit 1
fi
printf '/outside.txt\0' > "$invalid_paths"
if (cd "$fingerprint_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$invalid_paths" >/dev/null 2>&1); then
  echo "fingerprint script accepted an absolute scope path" >&2
  exit 1
fi

clean_repo="$TMP_ROOT/clean-head-repo"
mkdir -p "$clean_repo"
git -C "$clean_repo" init -q
printf 'first\n' > "$clean_repo/clean.txt"
git -C "$clean_repo" add clean.txt
git -C "$clean_repo" -c user.name=Test -c user.email=test@example.invalid commit -qm first
empty_paths="$TMP_ROOT/empty-paths.nul"
: > "$empty_paths"
clean_first="$(cd "$clean_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$empty_paths")"
printf 'second\n' > "$clean_repo/clean.txt"
git -C "$clean_repo" add clean.txt
git -C "$clean_repo" -c user.name=Test -c user.email=test@example.invalid commit -qm second
clean_second="$(cd "$clean_repo" && bash "$fingerprint_script" --base HEAD --allowed-paths-file "$empty_paths")"
if [ "$clean_first" = "$clean_second" ]; then
  echo "fingerprint script did not distinguish clean commits when --base HEAD moved" >&2
  exit 1
fi

echo "ok: code-quality-gate and dev-lite-workflow installs include dependency runtime surfaces"
