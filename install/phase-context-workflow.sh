# DESC: durable phase context files, handoffs, and context packets; includes handoff for safe /clear or /compact boundaries
pack_phase_context_workflow() {
  cmd handoff
  cmd phase-create
  cmd phase-start
  cmd phase-close
  cmd phase-status

  skill handoff SKILL.md
  skill phase-context-workflow SKILL.md
  skill phase-context-workflow references/lifecycle.md

  template phase-file.md
  template phase-handoff.md
  template context-packet.md

  workflow phase-context-workflow.md
}
