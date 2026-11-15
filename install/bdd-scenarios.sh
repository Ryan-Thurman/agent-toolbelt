#!/usr/bin/env bash
# DESC: write or review Gherkin feature files from acceptance criteria and plan a BDD runner
# DEPENDS: simple-english
pack_bdd_scenarios() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/negative-testing.md
  shared_contract references/test-levels.md
  shared_contract references/test-driven-development.md
  cmd bdd-scenarios
  skill bdd-scenarios SKILL.md
  skill bdd-scenarios references/writing-features.md
  skill bdd-scenarios references/runners.md
  skill bdd-scenarios references/review-checklist.md
  template bdd-scenarios.md
}
