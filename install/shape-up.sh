# DESC: interrogate a vague request into an agreed brief before building (+ vertical-slice tickets)
pack_shape_up() {
  cmd shape-up
  cmd to-issues

  skill shape-up SKILL.md
  skill shape-up references/interrogation.md
  skill shape-up references/rct-acceleration.md

  template shape-up-brief.md
  template shape-up-issues.md
}
