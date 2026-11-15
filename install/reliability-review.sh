#!/usr/bin/env bash
# DESC: design-time reliability review and production readiness review with testable requirements
# DEPENDS: simple-english
pack_reliability_review() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/evidence-quality.md
  shared_contract references/reliability-checklist.md
  shared_contract references/depth-levels.md
  cmd reliability-review
  skill reliability-review SKILL.md
  skill reliability-review references/question-bank.md
  skill reliability-review references/failure-modes.md
  skill reliability-review references/slos-and-budgets.md
  skill reliability-review references/resilience-patterns.md
  skill reliability-review references/capacity-and-data.md
  skill reliability-review references/platform-notes.md
  template reliability-review.md
}
