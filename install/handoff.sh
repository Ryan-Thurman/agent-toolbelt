# DESC: cross-cutting resumable handoff so a fresh agent/person can continue without context loss
pack_handoff() {
  shared_contract references/human-readable-output.md
  shared_contract references/execution.md
  shared_contract references/failure-recovery.md
  shared_contract references/execution-lessons.md
  shared_contract references/operation-retries.md
  shared_contract references/posting.md
  shared_contract references/providers.md
  shared_contract scripts/validate-execution.py
  cmd handoff
  skill handoff SKILL.md
}
