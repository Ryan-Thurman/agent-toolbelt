# DESC: active code cleanup (apply on opt-in) + detect-only smell scan
pack_simplify() {
  cmd simplify
  cmd code-smell

  skill simplify SKILL.md
  skill simplify references/apply-discipline.md
  skill simplify references/rct-acceleration.md
  shared_contract references/maintainability-taxonomy.md
}
