# DESC: provider-agnostic issue-tracker adapter: publish slicer tickets to GitHub Issues / Jira / Azure Boards
pack_ticket_sync() {
  shared_contract references/human-readable-output.md
  cmd ticket-sync

  skill ticket-sync SKILL.md
  skill ticket-sync references/config.md
  skill ticket-sync references/providers.md

  template tickets-config.md
}
