# DESC: lightweight dev loop (Cursor + Claude + Codex): intake, plan, phases, reviews, PR readiness
pack_dev_lite_workflow() {
  local c
  for c in \
    dev-intake dev-plan dev-start-phase dev-implement-task dev-phase-review \
    dev-fix-review-issues dev-pr-review
  do
    cmd "$c"
  done

  rule_local dev-lite-core.mdc
  rule_local dev-lite-commits.mdc
  rule_local dev-lite-review.mdc

  skill dev-lite-workflow SKILL.md
  skill dev-lite-workflow references/implementation-rules.md
  skill dev-lite-workflow references/review-rules.md
  skill dev-lite-workflow references/commit-rules.md
  skill dev-lite-workflow references/standalone-use.md

  template dev-feature-brief.md
  template dev-implementation-plan.md
  template dev-phase-review.md
  template dev-pr-review.md

  workflow dev-lite-feature-workflow.md
}
