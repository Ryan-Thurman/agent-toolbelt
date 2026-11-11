# DESC: provider-agnostic issue-tracker adapter: publish slicer tickets to GitHub Issues / Jira / Azure Boards
# DEPENDS: simple-english
pack_ticket_sync() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  shared_contract references/operation-retries.md
  shared_contract references/posting.md
  shared_contract references/providers.md
  cmd ticket-sync

  skill ticket-sync SKILL.md
  skill ticket-sync references/config.md
  skill ticket-sync references/providers.md

  template tickets-config.md
}
