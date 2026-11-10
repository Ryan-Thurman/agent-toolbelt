<!--
  Copy this to the ROOT of a repo as `.tickets.md` (or `.claude/tickets.md`).
  It tells /ticket-sync WHERE ticket files get published and HOW their fields map. Every section is
  optional; delete what you do not need. Where a base branch is meaningful, ticket-sync loads this
  file from the BASE branch. Full contract: agent-toolbelt/skills/ticket-sync/references/config.md
-->

## Provider
<!-- One of: github | jira | azure. The tracker every other section targets.
     If omitted, inferred from the origin remote (github.com → github, dev.azure.com → azure). -->
- jira

## Project
<!-- The project/board key issues are created under.
     Jira: project key (e.g. ABC). GitHub: owner/repo (defaults to origin). Azure: org / project [/ team]. -->
- ABC

## Defaults
<!-- Applied to every issue. Issue type is Jira issue type / Azure work-item type; GitHub has none. -->
- Issue type: Story
- Labels: backend, q3-roadmap
- Components: payments
- Parent / Epic: REL-2026.06

## Field mapping
<!-- How `Key: value` fields in the ticket files land in the tracker. Left = the ticket field name,
     right = the destination. A field without a line here goes into the issue body, so no field is lost.
     Acceptance criteria go into the body as a checklist unless mapped. -->
- Feature             -> label `feat:{value}`        (or a custom field, e.g. Jira customfield_10010)
- Release             -> label `rel:{value}`         (or Jira fixVersion / Azure Iteration Path)
