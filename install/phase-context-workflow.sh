# DESC: durable phase context files, handoffs, and context packets for safe /clear or /compact boundaries
pack_phase_context_workflow() {
  cmd phase-create
  cmd phase-start
  cmd phase-close
  cmd phase-status

  skill phase-context-workflow SKILL.md

  template phase-file.md
  template phase-handoff.md
  template context-packet.md

  workflow phase-context-workflow.md
}

