# DESC: traceable feature-delivery workflow (Cursor-first): commands, rules, skills, templates, workflows
pack_ai_feature_delivery() {
  local c
  for c in \
    workflow-router feature-start feature-fleshout steward-review draft-pings \
    sdd-draft doc-impact doc-delta refine-to-tickets start-dev-from-feature \
    implementation-plan write-tests webapp-test role-review dev-doc-delta-check \
    review-diff pr-ready-check pr-traceability-review gate-check qa-handoff \
    release-manifest release-doc-check
  do
    cmd_cursor "$c"
  done

  skill_shared ai-feature-delivery SKILL.md
  skill_shared ai-feature-delivery references/define-and-steward.md
  skill_shared ai-feature-delivery references/design-refine-dev.md
  skill_shared ai-feature-delivery references/gates-qa-release.md
  skill_shared webapp-testing SKILL.md

  local t
  for t in \
    feature-master-record.md sdd-template.md doc-impact-template.md \
    clarification-queue-template.md steward-review-template.md \
    refinement-ticket-template.md implementation-plan-template.md \
    pr-traceability-review-template.md gate-check-template.md \
    qa-handoff-template.md release-manifest-template.md
  do
    template "$t"
  done

  workflow ai-feature-delivery-lifecycle.md
  workflow cursor-first-ai-feature-delivery.md
  workflow dev-ticket-to-pr.md

  rule_tmpl cursor-rules-000-core-process.mdc 000-core-process.mdc
  rule_tmpl cursor-rules-010-doc-control.mdc 010-doc-control.mdc
  rule_tmpl cursor-rules-020-gates.mdc 020-gates.mdc
  rule_tmpl cursor-rules-030-traceability.mdc 030-traceability.mdc
  rule_tmpl cursor-rules-040-stakeholder-pings.mdc 040-stakeholder-pings.mdc
  rule_tmpl cursor-rules-050-pr-review.mdc 050-pr-review.mdc
  rule_tmpl cursor-rules-100-dev-core.mdc 100-dev-core.mdc
  rule_tmpl cursor-rules-130-testing.mdc 130-testing.mdc
  rule_tmpl cursor-rules-150-pr-hygiene.mdc 150-pr-hygiene.mdc
  rule_tmpl cursor-rules-200-dev-feature-traceability.mdc 200-dev-feature-traceability.mdc
}
