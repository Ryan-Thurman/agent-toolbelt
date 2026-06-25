---
description: Slice a Feature Master Record into implementation-ready tickets
argument-hint: "<path-to-master-record>"
---

# /refine-to-tickets

Use the `ai-feature-delivery` skill to convert a feature package into tickets.

**Arguments:** `$ARGUMENTS`

Preconditions:
- If the Feature Master Record is missing, malformed, or its path does not
  resolve, stop and ask for it (or recommend `/feature-start`). Do not fabricate
  feature content.

Steps:
1. Read the Feature Master Record, SDD if present, and doc impact map if present.
2. Use `templates/refinement-ticket-template.md` for each ticket.
3. Ensure every ticket includes feature ID, release ID, source section,
   requirement, acceptance criteria, impacted repos/services, test expectation,
   doc delta status, dependencies, open questions, and a `Tracker` field (the
   tracker key once published, blank until then).
4. Group tickets by dependency order where possible.
5. End with Gate 2 readiness: `READY`, `READY_WITH_RISKS`, or `BLOCKED`.
6. Publish (optional): hand off to `/ticket-sync` to create/update these in the
   configured tracker (GitHub Issues / Jira / Azure Boards). When the repo's
   `.tickets.md` sets `provider: jira`, map feature ID, release ID, acceptance
   criteria, and dependencies to the Jira fields per the ticket-sync config.
