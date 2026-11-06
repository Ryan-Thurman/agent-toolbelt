# DESC: cross-cutting resumable handoff so a fresh agent/person can continue without context loss
pack_handoff() {
  shared_contract references/human-readable-output.md
  cmd handoff
  skill handoff SKILL.md
}
