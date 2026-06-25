<!--
  Copy this to the ROOT of a repo as `.tickets.md` (or `.claude/tickets.md`).
  It tells /ticket-sync WHERE the slicers' tickets get published and HOW their fields map — the
  tracker-adapter config, separate from the tickets themselves. Every section is optional; delete
  what you don't need. Where a base branch is meaningful it's loaded from the BASE (a working branch
  can't silently retarget publishing). Full contract:
  agent-toolbelt/skills/ticket-sync/references/config.md
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
<!-- How the slicer ticket-template fields land in the tracker. Left = ticket field, right = destination.
     Defaults (when a line is omitted): IDs → labels, acceptance criteria/test expectation → description. -->
- Feature ID          -> label `feat:{value}`        (or a custom field, e.g. Jira customfield_10010)
- Release ID          -> label `rel:{value}`         (or Jira fixVersion / Azure Iteration Path)
- Acceptance criteria -> appended into the description as a checklist
- Dependencies        -> issue links ("Blocked by") between the created issues
- Test expectation    -> appended into the description under a "Testing" heading
- Doc-delta status    -> label `doc-delta:{value}`   (or a custom field)
