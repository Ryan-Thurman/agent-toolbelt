# DESC: lightweight pipeline-aware release readiness: checklist, rollback, notes, rollout
# DEPENDS: simple-english
pack_ship_it() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/operation-retries.md
  shared_contract references/execution-lessons.md
  shared_contract references/posting.md
  shared_contract references/providers.md
  cmd ship-it

  skill ship-it SKILL.md
  skill ship-it references/readiness-checklist.md
  skill ship-it references/rollout-and-rollback.md

  template release-notes.md
  workflow delivery-retrospective-workflow.md
}
