# DESC: narrow ticket discovery workflow: find precedent, compare target, gap analysis, test plan, handoff
# DEPENDS: simple-english
pack_ticket_discovery() {
  cmd ticket-discover

  skill ticket-discovery SKILL.md
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/execution.md

  template ticket-discovery-brief.md

  workflow ticket-discovery-workflow.md
}
