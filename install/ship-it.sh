# DESC: lightweight pipeline-aware release readiness: checklist, rollback, notes, rollout
pack_ship_it() {
  cmd ship-it

  skill ship-it SKILL.md
  skill ship-it references/readiness-checklist.md
  skill ship-it references/rollout-and-rollback.md

  template release-notes.md
}
