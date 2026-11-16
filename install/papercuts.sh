# DESC: report-only friction retrospective for a session or a feature, postable to a shared team log
# DEPENDS: simple-english
pack_papercuts() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/operation-retries.md
  shared_contract references/posting.md
  shared_contract references/providers.md
  shared_contract references/execution-lessons.md
  shared_contract references/execution.md
  cmd papercuts
  workflow delivery-retrospective-workflow.md

  skill papercuts SKILL.md
  skill papercuts references/report-format.md
  skill papercuts references/feature-scope.md
  skill papercuts references/upstream-attribution.md
}
