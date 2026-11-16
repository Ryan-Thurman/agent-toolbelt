#!/usr/bin/env bash
# DESC: report-only QA test-case design from requirements, risks, or a pull request diff
# DEPENDS: simple-english
pack_test_case_design() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/negative-testing.md
  shared_contract references/test-levels.md
  shared_contract references/reliability-checklist.md
  shared_contract references/risk-areas.md
  shared_contract references/test-driven-development.md
  cmd test-case-design
  skill test-case-design SKILL.md
  skill test-case-design references/system-failure-cases.md
  skill test-case-design references/change-risk-planning.md
  template test-case-design.md
}
