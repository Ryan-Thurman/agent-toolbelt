---
description: Plan or write tests for a behavior change, preserving feature traceability when present
argument-hint: "<task-or-diff-context>"
---

# /write-tests

Plan or write tests for the selected task, implementation, or diff.

**Arguments:** `$ARGUMENTS`

Steps:
1. Identify behavior changes and acceptance criteria.
2. Prefer writing or updating a failing test before implementation when the
   behavior is testable.
3. Propose or implement unit, integration, regression, and manual/QA tests as
   appropriate.
4. For user-facing behavior, consider `/webapp-test` for browser evidence.
5. Call out untestable areas, required fixtures/data, and risk-based test gaps.
6. If feature metadata exists, map tests back to feature ID, requirement,
   ticket, QA evidence, and doc sections.
7. Do not mark test evidence complete if tests were only proposed and not run.
