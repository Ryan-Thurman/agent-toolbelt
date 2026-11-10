#!/usr/bin/env bash
# DESC: report-only QA test-case design from requirements and risks
pack_test_case_design() {
  shared_contract references/human-readable-output.md
  cmd test-case-design
  skill test-case-design SKILL.md
  template test-case-design.md
}
