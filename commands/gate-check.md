---
description: Check whether a feature can move to the next delivery gate
argument-hint: "<gate-number> <path-to-master-record-or-feature-folder>"
---

# /gate-check

Use the `ai-feature-delivery` skill to run a lifecycle gate check.

**Arguments:** `$ARGUMENTS`

Steps:
1. Identify the requested gate and read the feature artifacts.
2. Compare evidence against `workflows/ai-feature-delivery-lifecycle.md`.
3. Use `templates/gate-check-template.md` for the result.
4. Return verdict `READY`, `READY_WITH_RISKS`, or `BLOCKED`.
5. List required evidence found, missing evidence, blockers, non-blocking risks,
   and next actions.
