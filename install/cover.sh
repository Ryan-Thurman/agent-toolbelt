# DESC: author/strengthen tests (apply on opt-in) + detect-only coverage-gap scan
pack_cover() {
  cmd write-tests
  shared_contract references/human-readable-output.md
  shared_contract references/test-driven-development.md
  cmd cover
  cmd cover-gaps

  skill cover SKILL.md
  skill cover references/authoring.md
  skill cover references/gap-scan.md

  template regression-test-brief.md
}
