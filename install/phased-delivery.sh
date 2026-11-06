# DESC: human-guided requirement or ticket delivery, one reviewable PR per phase
pack_phased_delivery() {
  local c
  for c in \
    dev-intake dev-plan dev-start-phase dev-implement-task dev-phase-review \
    dev-fix-review-issues dev-pr-review implementation-plan workflow-router
  do
    cmd "$c"
  done

  skill phased-delivery SKILL.md
  skill phased-delivery references/implementation-rules.md
  skill phased-delivery references/review-rules.md
  skill phased-delivery references/commit-rules.md
  skill phased-delivery references/command-surfaces.md
  skill phased-delivery references/execution-support.md
  skill phased-delivery references/standalone-use.md
  shared_contract references/human-readable-output.md

  template dev-feature-brief.md
  template phased-delivery-plan.md
  template dev-phase-review.md
  template dev-pr-review.md

  workflow phased-delivery-workflow.md
  workflow dev-ticket-to-pr.md
}
