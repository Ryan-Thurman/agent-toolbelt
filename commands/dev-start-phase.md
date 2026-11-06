---
description: Prepare the next phase or ticket PR for implementation
argument-hint: "<phase-or-ticket>"
---

# /dev-start-phase

Use `$phased-delivery` to reconcile `$ARGUMENTS` with its source requirement,
current repository state, dependencies, and plan. Confirm the ticket/phase
boundary, branch, PR target, parent PR if stacked, acceptance criteria, checks,
and material blockers. Create or switch to a focused phase branch before coding
if currently on the default branch; stop if that cannot be done safely. Add
needed file/interface/test context to the execution
record without expanding the source scope. Do not code unless implementation was
also requested or already approved.
