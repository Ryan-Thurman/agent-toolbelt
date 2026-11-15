#!/usr/bin/env bash
# DESC: refine a ticket or story into a ready-to-build spec with criteria, questions, and a readiness verdict
# DEPENDS: simple-english
pack_story_refinement() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/negative-testing.md
  shared_contract references/test-levels.md
  shared_contract references/reliability-checklist.md
  cmd story-refinement
  skill story-refinement SKILL.md
  skill story-refinement references/ambiguity-scan.md
  skill story-refinement references/question-strategy.md
  skill story-refinement references/acceptance-criteria.md
  skill story-refinement references/readiness-review.md
  template refined-story.md
  template refinement-questions.md
  workflow feature-refinement-workflow.md
}
