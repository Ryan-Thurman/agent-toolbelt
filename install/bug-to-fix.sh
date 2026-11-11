# DESC: diagnostic lane: triage, reproduce, root-cause analysis, minimal fix, verification
# DEPENDS: simple-english
pack_bug_to_fix() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/test-driven-development.md
  shared_contract references/execution.md
  shared_contract references/execution-schema.md
  shared_contract references/failure-recovery.md
  shared_contract references/execution-lessons.md
  shared_contract references/operation-retries.md
  shared_contract references/posting.md
  shared_contract references/providers.md
  shared_contract scripts/validate-execution.py
  local c
  for c in bug-intake reproduce rca fix-plan handoff; do
    cmd "$c"
  done

  local f
  for f in \
    SKILL.md \
    references/durable-state.md references/rca-strategies.md \
    references/adversarial-confirmation.md references/severity.md \
    references/reproduction.md references/fix-contract.md \
    references/rct-acceleration.md
  do
    skill bug-to-fix "$f"
  done

  template bug-investigation.md
  template rca-report.md
  template bug-agent-brief.md

  workflow bug-to-fix-workflow.md
}
