---
description: Implement a bounded step within the current phased-delivery PR
argument-hint: "<phase-or-ticket-step>"
---

# /dev-implement-task

Use `$phased-delivery` and its `references/implementation-rules.md` for
`$ARGUMENTS`. Implement only the selected phase or ticket's work, discover the
needed technical context, add relevant tests, and run focused checks. Verify
external preconditions read-only before mutation. Update the existing plan or
execution record with changed files, evidence, risks, and next action. A step
does not require its own commit; keep commits coherent and the PR reviewable.
