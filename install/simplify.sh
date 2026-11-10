# DESC: active code cleanup (apply on opt-in) + detect-only smell scan
pack_simplify() {
  shared_contract references/human-readable-output.md
  cmd simplify
  cmd code-smell

  skill simplify SKILL.md
  skill simplify references/apply-discipline.md
  skill simplify references/rct-acceleration.md
  shared_contract references/maintainability-taxonomy.md
  shared_contract references/anti-slop-naming.md
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
