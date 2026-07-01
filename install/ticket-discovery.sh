# DESC: narrow ticket discovery workflow: find precedent, compare target, gap analysis, test plan, handoff
pack_ticket_discovery() {
  cmd ticket-discover

  skill ticket-discovery SKILL.md

  template ticket-discovery-brief.md

  workflow ticket-discovery-workflow.md
}
