# DESC: browser/webapp verification: /webapp-test smoke checks, Playwright runs, QA evidence for user-facing changes
pack_webapp_testing() {
  cmd webapp-test

  skill webapp-testing SKILL.md
}
