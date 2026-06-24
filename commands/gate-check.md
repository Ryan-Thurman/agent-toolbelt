---
description: Check whether a feature can move to the next delivery gate
argument-hint: "<gate-number> <path-to-master-record-or-feature-folder>"
---

# /gate-check

Use the `ai-feature-delivery` skill to run a lifecycle gate check.

**Arguments:** `$ARGUMENTS`

Preconditions:
- If the gate number is missing or is not one of the gates defined in
  `workflows/ai-feature-delivery-lifecycle.md`, list the valid gates and ask
  which one to check.
- If the master record / feature folder is missing, malformed, or its path does
  not resolve, stop and ask for it (or recommend `/feature-start`). Do not
  fabricate feature content.

Steps:
1. Identify the requested gate and read the feature artifacts.
2. Compare evidence against `workflows/ai-feature-delivery-lifecycle.md`.
3. Use `templates/gate-check-template.md` for the result.
4. Return verdict `READY`, `READY_WITH_RISKS`, or `BLOCKED`.
5. List required evidence found, missing evidence, blockers, non-blocking risks,
   and next actions.
