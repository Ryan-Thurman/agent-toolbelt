---
description: Bridge command for checking doc deltas during dev or before PR
argument-hint: "<ticket-or-pr-or-feature-folder>"
---

# /dev-doc-delta-check

Use this bridge command while coding or before PR to keep implementation aligned
with controlled docs.

**Arguments:** `$ARGUMENTS`

Steps:
1. Check whether the change affects behavior, APIs, data model, UX, security,
   observability, QA expectations, or release scope.
2. Decide whether SDD, SRS, SAD, CDP, or QA handoff updates are required.
3. If the ticket says `Doc Delta Required: Yes`, block readiness until the doc
   update exists or an explicit owner-approved waiver is recorded.
4. If doc impact is unknown, mark the work not ready for PR until clarified.
