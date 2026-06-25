# DESC: author/strengthen tests (apply on opt-in) + detect-only coverage-gap scan
pack_cover() {
  cmd cover
  cmd cover-gaps

  skill cover SKILL.md
  skill cover references/authoring.md
  skill cover references/gap-scan.md

  template regression-test-brief.md
}
