---
description: Start implementation from a feature record and ticket with traceability intact
argument-hint: "<path-to-master-record> <ticket-or-task>"
---

# /start-dev-from-feature

Use the `ai-feature-delivery` skill to bridge refinement into dev execution.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the Feature Master Record, ticket/task, SDD, doc impact map,
   clarification queue, and target release when available.
2. Identify scope, acceptance criteria, impacted repos/files, dependencies,
   open questions, test expectations, and doc-delta expectations.
3. Produce an implementation handoff with risks, assumptions, blockers, QA
   evidence needed, and PR checklist.
4. If doc delta or test evidence is unknown, flag it before implementation.
