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
  require_file "$target/.agents/skills/$name/SKILL.md"
  require_file "$target/.agents/skills/$name/agents/openai.yaml"
  [ "$(find "$target/.agents/skills/$name/agents" -type f -name openai.yaml | wc -l | tr -d ' ')" = 1 ]
  grep -q '063bee94c3f4df8453406c830b0a7df0f2860278' "$target/.agents/skills/$name/references/upstream-attribution.md"
  grep -q 'MIT' "$target/.agents/skills/$name/references/upstream-attribution.md"
  grep -q '.agents/shared/contracts/references/typescript-react-baseline.md' "$target/.agents/skills/$name/SKILL.md"
}

composition_target="$TMP_ROOT/composition"
"$ROOT/install.sh" --harness all vercel-composition-patterns "$composition_target" >/dev/null
check_common_skill_copy "$composition_target" vercel-composition-patterns
require_rule_count "$composition_target/.agents/skills/vercel-composition-patterns" 8
for rule in \
  architecture-avoid-boolean-props architecture-compound-components \
  patterns-children-over-render-props patterns-explicit-variants \
  react19-no-forwardref state-context-interface state-decouple-implementation \
  state-lift-state
do
  require_file "$composition_target/.agents/skills/vercel-composition-patterns/references/rules/$rule.md"
done
require_file "$composition_target/.agents/shared/contracts/references/typescript-react-baseline.md"
grep -q 'references/rule-routing.md' "$composition_target/.agents/skills/vercel-composition-patterns/SKILL.md"

performance_target="$TMP_ROOT/performance"
"$ROOT/install.sh" --harness all vercel-react-best-practices "$performance_target" >/dev/null
check_common_skill_copy "$performance_target" vercel-react-best-practices
require_rule_count "$performance_target/.agents/skills/vercel-react-best-practices" 70
require_prefix_counts "$performance_target/.agents/skills/vercel-react-best-practices"
require_file "$performance_target/.agents/shared/contracts/references/typescript-react-baseline.md"
grep -q 'references/rule-routing.md' "$performance_target/.agents/skills/vercel-react-best-practices/SKILL.md"

effects_target="$TMP_ROOT/effects"
"$ROOT/install.sh" --harness all use-effect-killer "$effects_target" >/dev/null
for rel in SKILL.md agents/openai.yaml references/anti-patterns.md references/rule-index.json references/upstream-attribution.md; do
  require_file "$effects_target/.agents/skills/use-effect-killer/$rel"
done
grep -q '1c2f53aea6bfcfffe00729884454e3550a27364e' "$effects_target/.agents/skills/use-effect-killer/references/upstream-attribution.md"
grep -q 'MIT License' "$effects_target/.agents/skills/use-effect-killer/references/upstream-attribution.md"
[ "$(grep -c '^### [0-9]*\. ' "$effects_target/.agents/skills/use-effect-killer/references/anti-patterns.md")" = 13 ]
require_file "$effects_target/.agents/shared/contracts/scripts/react-rule-scan.py"
grep -q '.agents/shared/contracts/scripts/react-rule-scan.py' "$effects_target/.agents/skills/use-effect-killer/SKILL.md"

native_target="$TMP_ROOT/native"
"$ROOT/install.sh" --harness all vercel-react-native-skills "$native_target" >/dev/null
require_rule_count "$native_target/.agents/skills/vercel-react-native-skills" 36
for rel in SKILL.md agents/openai.yaml references/rule-index.json references/rule-routing.md references/upstream-attribution.md; do
  require_file "$native_target/.agents/skills/vercel-react-native-skills/$rel"
done
grep -q '1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62' "$native_target/.agents/skills/vercel-react-native-skills/references/upstream-attribution.md"
require_file "$native_target/.agents/shared/contracts/scripts/react-rule-scan.py"
require_file "$native_target/.agents/shared/contracts/references/react-acceptance.md"

transitions_target="$TMP_ROOT/transitions"
"$ROOT/install.sh" --harness all vercel-react-view-transitions "$transitions_target" >/dev/null
for rel in SKILL.md agents/openai.yaml references/rule-index.json references/upstream-attribution.md \
  references/css-recipes.md references/implementation.md references/nextjs.md references/patterns.md references/troubleshooting.md; do
  require_file "$transitions_target/.agents/skills/vercel-react-view-transitions/$rel"
done
grep -q '1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62' "$transitions_target/.agents/skills/vercel-react-view-transitions/references/upstream-attribution.md"

grep -q '434b7f91364665f2f733b310ec54809bf8f37937' "$ROOT/skills/vercel-web-interface-guidelines/references/upstream-attribution.md"

bundle_target="$TMP_ROOT/bundle"
"$ROOT/install.sh" --harness all react-quality "$bundle_target" >/dev/null
for name in vercel-composition-patterns vercel-react-best-practices use-effect-killer vercel-react-view-transitions vercel-web-interface-guidelines; do
  require_file "$bundle_target/.agents/skills/$name/SKILL.md"
done
grep -q '.agents/shared/contracts/scripts/react-rule-scan.py' "$bundle_target/.agents/shared/contracts/references/typescript-react-baseline.md"
require_file "$bundle_target/.agents/shared/contracts/scripts/react-rule-scan.py"
require_file "$bundle_target/.agents/shared/contracts/references/react-acceptance.md"
grep -q '.agents/shared/contracts/references/react-acceptance.md' "$bundle_target/.agents/shared/contracts/references/typescript-react-baseline.md"

composed_target="$TMP_ROOT/composed"
"$ROOT/install.sh" --harness all pr-review simplify phased-delivery code-quality-gate "$composed_target" >/dev/null
for path in \
  .agents/shared/contracts/references/typescript-react-baseline.md \
  .agents/skills/pr-review/facets/performance.md \
  .agents/skills/pr-review/facets/maintainability.md \
  .agents/skills/pr-review/facets/standards.md \
  .agents/skills/simplify/SKILL.md \
  .agents/skills/phased-delivery/SKILL.md \
  .agents/skills/code-quality-gate/SKILL.md
do
  require_file "$composed_target/$path"
done
grep -q 'vercel-react-best-practices' "$composed_target/.agents/skills/pr-review/facets/performance.md"
grep -q 'vercel-composition-patterns' "$composed_target/.agents/skills/pr-review/facets/maintainability.md"
grep -q 'typescript-react-baseline' "$composed_target/.agents/skills/simplify/SKILL.md"
require_file "$composed_target/.agents/shared/contracts/scripts/react-rule-scan.py"
require_file "$composed_target/.agents/shared/contracts/references/react-acceptance.md"
grep -q 'React rule scan' "$composed_target/.agents/skills/pr-review/SKILL.md"
grep -q 'React rules check' "$composed_target/.agents/skills/code-quality-gate/references/gate-contract.md"
grep -q '.agents/shared/contracts/references/typescript-react-baseline.md' "$composed_target/.agents/skills/phased-delivery/references/implementation-rules.md"
grep -q '.agents/skills/code-quality-gate/SKILL.md' "$composed_target/.cursor/commands/code-quality-gate.md"
if grep -rq '^Toolbelt paths: ' "$composed_target"; then
  echo "installed files must not keep the plugin-only \"Toolbelt paths:\" line" >&2
  exit 1
fi

echo "ok: React specialist and useEffect standalone, meta-pack, path rewriting, attribution, inventory, and composed-pack installs"
