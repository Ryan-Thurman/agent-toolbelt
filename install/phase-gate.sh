# DESC: in-loop phase-boundary PR-review gate: a subagent reviews each phase PR, then posts to host (team) or feeds back + merges (solo)
# DEPENDS: pr-review pr-improve simple-english
pack_phase_gate() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd phase-gate

  skill phase-gate SKILL.md
  skill phase-gate references/modes.md
  skill phase-gate references/merge.md
  shared_contract references/providers.md

  workflow phase-gate-solo-workflow.md
  workflow phase-gate-team-workflow.md
}
