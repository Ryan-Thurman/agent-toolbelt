# DESC: compare an ask with current behavior or shape an approved brief (+ optional tickets)
# DEPENDS: simple-english
pack_shape_up() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd shape-up
  cmd to-issues

  skill shape-up SKILL.md
  skill shape-up references/interrogation.md
  skill shape-up references/current-state-gap.md
  skill shape-up references/rct-acceleration.md
  skill shape-up references/slicing.md

  template shape-up-brief.md
  template shape-up-issues.md
}
