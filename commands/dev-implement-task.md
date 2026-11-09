---
description: Implement a bounded step within the current phased-delivery PR
argument-hint: "<phase-or-ticket-step>"
---

# /dev-implement-task

Use `$phased-delivery` and its `references/implementation-rules.md` for `$ARGUMENTS`.
Implement only the selected phase or ticket's work.
Discover the needed technical context and verify external preconditions read-only before mutation.
For behavior changes, use `shared/contracts/references/test-driven-development.md`.
Add a failing test before implementing each selected behavior, confirm green, and inspect important uncovered branches.
Run focused checks. Update the existing plan or
execution record with changed files, evidence, risks, and next action. A step
does not require its own commit; keep commits coherent and the PR reviewable.
