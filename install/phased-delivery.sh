# DESC: human-guided requirement or ticket delivery, one reviewable PR per phase
# DEPENDS: simple-english
pack_phased_delivery() {
  local c
  for c in \
    dev-intake dev-plan dev-start-phase dev-implement-task dev-phase-review \
    dev-fix-review-issues dev-pr-review implementation-plan plan-review workflow-router
  do
    cmd "$c"
  done

  skill phased-delivery SKILL.md
  skill phased-delivery references/implementation-rules.md
  skill phased-delivery references/review-rules.md
  skill phased-delivery references/execution-support.md
  skill phased-delivery references/standalone-use.md
  skill phased-delivery references/plan-readiness.md
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
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md

  template dev-feature-brief.md
  template phased-delivery-plan.md
  template dev-phase-review.md
  template dev-pr-review.md

  workflow phased-delivery-workflow.md
  workflow dev-ticket-to-pr.md
}
