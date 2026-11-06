# DESC: compare an ask with current behavior or shape an approved brief (+ optional tickets)
pack_shape_up() {
  shared_contract references/human-readable-output.md
  cmd shape-up
  cmd to-issues

  skill shape-up SKILL.md
  skill shape-up references/interrogation.md
  skill shape-up references/current-state-gap.md
  skill shape-up references/rct-acceleration.md

  template shape-up-brief.md
  template shape-up-issues.md
}
