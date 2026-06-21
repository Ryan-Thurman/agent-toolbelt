---
description: Review feature health, blockers, stale actions, doc gaps, and next best actions
argument-hint: "<path-to-master-record-or-feature-folder>"
---

# /steward-review

Use the `ai-feature-delivery` skill to run a feature stewardship review.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the Feature Master Record, related docs, tickets, clarification queue,
   pending actions, gate history, and release manifest if present.
2. Use `templates/steward-review-template.md` for persistent output when
   creating a report.
3. Identify current phase, gate status, release eligibility, release risk,
   blockers, stale actions, missing owners, unresolved assumptions, document
   gaps, and ticket traceability gaps.
4. Recommend the next best actions in priority order.
5. Draft stakeholder pings for blocking or stale owner actions.
