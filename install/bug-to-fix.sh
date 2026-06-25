# DESC: diagnostic lane: triage, reproduce, root-cause analysis, minimal fix, verification
pack_bug_to_fix() {
  local c
  for c in bug-intake reproduce rca fix-plan handoff; do
    cmd "$c"
  done

  local f
  for f in \
    SKILL.md \
    references/durable-state.md references/rca-strategies.md \
    references/adversarial-confirmation.md references/severity.md \
    references/rct-acceleration.md
  do
    skill bug-to-fix "$f"
  done

  template bug-investigation.md
  template rca-report.md
  template bug-agent-brief.md

  workflow bug-to-fix-workflow.md
}
