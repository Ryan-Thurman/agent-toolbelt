---
description: Check whether implementation is ready to open or complete a PR
argument-hint: "<ticket-or-diff-context>"
---

# /pr-ready-check

Check whether a change is ready for PR.

> **When to use vs related:** `/pr-ready-check` confirms a change is *ready to
> open or complete* a PR (summary, tests, risks). Use `/review-diff` or
> `/pr-review` for actual code review, and `/pr-traceability-review` for
> feature/doc traceability.

**Arguments:** `$ARGUMENTS`

Steps:
1. Verify implementation summary, changed files, tests added/updated, test
   results, known risks, and reviewer notes.
2. **Documentation gate (blocking).** If the change altered behavior, an
   API/endpoint, a flag/config, the data model, or notable performance, the docs
   that describe it (README / setup / module header / architecture notes / API
   docs) must be updated **and committed to the same branch** so they get pushed
   and reviewed alongside the code. Updated-but-uncommitted, "I'll do it after
   merge," or a bare "flagged" is a `Block`, not a pass. The only pass without a
   doc edit is an explicit, recorded "not doc-impacting" judgment with a reason.
3. If feature metadata exists, verify feature ID, release ID, ticket scope,
   acceptance criteria, SDD/doc impact map, doc delta, QA notes, and release
   metadata.
4. For user-facing changes, verify browser evidence exists or explain why it is
   not required.
5. Verify the work is on a feature/fix branch, not `main`, `master`, or the
   repository default branch, unless direct default-branch work was explicitly
   approved.
6. Verify the implementation plan is up to date with current state, completed
   tasks, test/check evidence, doc delta state, branch/PR state, blockers, next
   step, and resume instructions.
7. Return `Ready`, `Needs Work`, or `Block` with required fixes. Default-branch
   work without explicit approval is `Block`; a doc-impacting change whose docs
   are not committed to the branch (step 2) is a `Block`.
