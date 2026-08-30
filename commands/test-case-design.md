---
description: Design prioritized, traceable QA test cases from requirements and risks without writing tests.
argument-hint: "<requirement-or-risk>"
---

# /test-case-design

Use the `test-case-design` skill to create a report-only QA case set.

**Arguments:** `$ARGUMENTS`

Produce cases using `templates/test-case-design.md`, including relevant behavioral,
boundary, state, failure, access, and UI states. Each case needs an ID, risk,
preconditions/data, steps, expected result, level, automation candidate, and priority.
Hand selected cases to `/cover` or `/webapp-test`; do not write tests here.
