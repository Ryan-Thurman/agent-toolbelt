---
description: Slice a Feature Master Record into implementation-ready tickets
argument-hint: "<path-to-master-record>"
---

# /refine-to-tickets

Use the `ai-feature-delivery` skill to convert a feature package into tickets.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the Feature Master Record, SDD if present, and doc impact map if present.
2. Use `templates/refinement-ticket-template.md` for each ticket.
3. Ensure every ticket includes feature ID, release ID, source section,
   requirement, acceptance criteria, impacted repos/services, test expectation,
   doc delta status, dependencies, and open questions.
4. Group tickets by dependency order where possible.
5. End with Gate 2 readiness: `READY`, `READY_WITH_RISKS`, or `BLOCKED`.
