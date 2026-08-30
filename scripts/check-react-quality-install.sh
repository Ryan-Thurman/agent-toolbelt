#!/usr/bin/env bash
# Exercise the Vercel specialist packs through real all-harness installs.
# This checks runtime package shape, dependency composition, path rewriting,
# attribution, and the expected upstream rule inventory.

set -e
set -u
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/agent-toolbelt-react-quality.XXXXXX")"
trap 'rm -rf "$TMP_ROOT"' EXIT

require_file() {
  [ -f "$1" ] || { echo "missing installed file: $1" >&2; exit 1; }
}

require_rule_count() {
  local dir="$1" expected="$2" actual
  actual="$(find "$dir/references/rules" -type f -name '*.md' | wc -l | tr -d ' ')"
  [ "$actual" = "$expected" ] || {
    echo "unexpected rule inventory in $dir: expected $expected, got $actual" >&2
    exit 1
  }
}

require_prefix_counts() {
  local dir="$1" prefix count
  while IFS=: read -r prefix count; do
    actual="$(find "$dir/references/rules" -type f -name "$prefix-*.md" | wc -l | tr -d ' ')"
    [ "$actual" = "$count" ] || {
      echo "unexpected $prefix rule count in $dir: expected $count, got $actual" >&2
      exit 1
    }
  done <<'EOF'
advanced:4
async:6
bundle:6
client:4
js:14
rendering:11
rerender:15
server:10
EOF
}

check_common_skill_copy() {
  local target="$1" name="$2"
  require_file "$target/.atb/skills/$name/SKILL.md"
  require_file "$target/.atb/skills/$name/agents/openai.yaml"
  require_file "$target/.agents/skills/$name/SKILL.md"
  require_file "$target/.agents/skills/$name/agents/openai.yaml"
  [ "$(find "$target/.atb/skills/$name/agents" -type f -name openai.yaml | wc -l | tr -d ' ')" = 1 ]
  [ "$(find "$target/.agents/skills/$name/agents" -type f -name openai.yaml | wc -l | tr -d ' ')" = 1 ]
  grep -q '063bee94c3f4df8453406c830b0a7df0f2860278' "$target/.atb/skills/$name/references/upstream-attribution.md"
  grep -q 'MIT' "$target/.atb/skills/$name/references/upstream-attribution.md"
  grep -q '.atb/shared/contracts/references/typescript-react-baseline.md' "$target/.atb/skills/$name/SKILL.md"
}

composition_target="$TMP_ROOT/composition"
"$ROOT/install.sh" --harness all vercel-composition-patterns "$composition_target" >/dev/null
check_common_skill_copy "$composition_target" vercel-composition-patterns
require_rule_count "$composition_target/.atb/skills/vercel-composition-patterns" 8
require_rule_count "$composition_target/.agents/skills/vercel-composition-patterns" 8
for rule in \
  architecture-avoid-boolean-props architecture-compound-components \
  patterns-children-over-render-props patterns-explicit-variants \
  react19-no-forwardref state-context-interface state-decouple-implementation \
  state-lift-state
do
  require_file "$composition_target/.atb/skills/vercel-composition-patterns/references/rules/$rule.md"
done
require_file "$composition_target/.atb/shared/contracts/references/typescript-react-baseline.md"
grep -q 'references/rule-routing.md' "$composition_target/.atb/skills/vercel-composition-patterns/SKILL.md"
grep -q '### vercel-composition-patterns' "$composition_target/AGENTS.md"

performance_target="$TMP_ROOT/performance"
"$ROOT/install.sh" --harness all vercel-react-best-practices "$performance_target" >/dev/null
check_common_skill_copy "$performance_target" vercel-react-best-practices
require_rule_count "$performance_target/.atb/skills/vercel-react-best-practices" 70
require_rule_count "$performance_target/.agents/skills/vercel-react-best-practices" 70
require_prefix_counts "$performance_target/.atb/skills/vercel-react-best-practices"
require_prefix_counts "$performance_target/.agents/skills/vercel-react-best-practices"
require_file "$performance_target/.atb/shared/contracts/references/typescript-react-baseline.md"
grep -q 'references/rule-routing.md' "$performance_target/.atb/skills/vercel-react-best-practices/SKILL.md"
grep -q '### vercel-react-best-practices' "$performance_target/AGENTS.md"

bundle_target="$TMP_ROOT/bundle"
"$ROOT/install.sh" --harness all react-quality "$bundle_target" >/dev/null
for name in vercel-composition-patterns vercel-react-best-practices; do
  require_file "$bundle_target/.atb/skills/$name/SKILL.md"
  require_file "$bundle_target/.agents/skills/$name/SKILL.md"
  [ "$(grep -c "^### $name$" "$bundle_target/AGENTS.md")" = 1 ]
done
[ "$(grep -c '^### react-quality$' "$bundle_target/AGENTS.md")" = 1 ]
grep -q '.atb/skills/vercel-react-best-practices' "$bundle_target/.atb/shared/contracts/references/typescript-react-baseline.md"

composed_target="$TMP_ROOT/composed"
"$ROOT/install.sh" --harness all pr-review simplify dev-lite-workflow code-quality-gate "$composed_target" >/dev/null
for path in \
  .atb/shared/contracts/references/typescript-react-baseline.md \
  .atb/skills/pr-review/facets/performance.md \
  .atb/skills/pr-review/facets/maintainability.md \
  .atb/skills/pr-review/facets/standards.md \
  .atb/skills/simplify/SKILL.md \
  .atb/skills/dev-lite-workflow/SKILL.md \
  .atb/skills/code-quality-gate/SKILL.md
do
  require_file "$composed_target/$path"
done
grep -q 'vercel-react-best-practices' "$composed_target/.atb/skills/pr-review/facets/performance.md"
grep -q 'vercel-composition-patterns' "$composed_target/.atb/skills/pr-review/facets/maintainability.md"
grep -q 'typescript-react-baseline' "$composed_target/.atb/skills/simplify/SKILL.md"
grep -q '.atb/skills/code-quality-gate/SKILL.md' "$composed_target/.cursor/commands/code-quality-gate.md"

echo "ok: Vercel specialist standalone, meta-pack, path rewriting, attribution, inventory, and composed-pack installs"
