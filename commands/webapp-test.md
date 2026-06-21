---
description: Plan or run browser/webapp verification for a user-facing change
argument-hint: "<url-or-feature-context>"
---

# /webapp-test

Use the `webapp-testing` skill to verify a browser flow or user-facing change.

**Arguments:** `$ARGUMENTS`

Steps:
1. Identify the target URL, app startup command, user flow, changed behavior,
   and acceptance criteria.
2. Prefer an existing project test command or Playwright setup when available.
3. If no browser test exists, perform a black-box smoke pass of the critical
   flow before adding deeper automation.
4. Capture failures with URL, viewport, steps, observed result, expected result,
   console/network clues, and screenshots or traces when available.
5. If feature metadata exists, map browser evidence back to feature ID, ticket,
   acceptance criterion, QA handoff, and release risk.
6. End with `Pass`, `Needs Work`, or `Blocked`, plus the exact checks run and
   any unverified gaps.
