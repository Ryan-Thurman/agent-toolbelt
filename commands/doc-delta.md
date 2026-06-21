---
description: Check whether code or ticket changes require SDD/SRS/SAD/CDP updates
argument-hint: "<ticket-or-pr-or-feature-folder>"
---

# /doc-delta

Use the `ai-feature-delivery` skill to verify documentation deltas.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the ticket/PR/feature artifacts and the doc impact map if present.
2. Determine whether behavior, APIs, data contracts, architecture, QA scope,
   release scope, security posture, or observability changed.
3. For each impacted artifact, list required section updates, owner, current
   status, release eligibility, and blocking risk.
4. If a ticket says `Doc Delta Required: Yes` and no doc update exists, mark the
   result `BLOCKED` or `NEEDS_WORK`.
5. If doc impact is unknown, mark the item not ready for dev/PR until clarified.
