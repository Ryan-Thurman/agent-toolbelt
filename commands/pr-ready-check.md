---
description: Check whether implementation is ready to open or complete a PR
argument-hint: "<ticket-or-diff-context>"
---

# /pr-ready-check

Check whether a change is ready for PR.

**Arguments:** `$ARGUMENTS`

Steps:
1. Verify implementation summary, changed files, tests added/updated, test
   results, known risks, and reviewer notes.
2. Confirm required docs are updated or explicitly not impacted.
3. If feature metadata exists, verify feature ID, release ID, ticket scope,
   acceptance criteria, SDD/doc impact map, doc delta, QA notes, and release
   metadata.
4. For user-facing changes, verify browser evidence exists or explain why it is
   not required.
5. Return `Ready`, `Needs Work`, or `Block` with required fixes.
