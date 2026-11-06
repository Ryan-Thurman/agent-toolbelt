---
description: Fix scoped findings on the current phase or ticket PR
argument-hint: "<review-findings>"
---

# /dev-fix-review-issues

Use `$phased-delivery` to address `$ARGUMENTS` on the current phase branch.
Stay inside the ticket or phase boundary, update tests when needed, rerun
affected checks, and review the changed diff. Record fixed and unresolved
findings, checks, and next action in the existing plan. Do not begin the next
phase as part of the fix.
