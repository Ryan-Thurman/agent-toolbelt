---
description: Plan or write tests for a behavior change, preserving feature traceability when present
argument-hint: "<task-or-diff-context>"
---

# /write-tests

Plan or write tests for the selected task, implementation, or diff.

**Arguments:** `$ARGUMENTS`

Steps:
1. Identify behavior changes and acceptance criteria.
2. Discover this repository's test stack before choosing commands: inspect its
   manifests, checked-in wrappers, test configuration, neighboring tests,
   contributor docs, and CI. Use the repository's focused command during the
   edit loop and its full-suite command before completion.
3. Before writing or changing a test, name the production behavior or mutation
   that should make it fail. If no plausible production change would break the
   assertion, redesign the test so it proves behavior rather than implementation
   details.
4. Prefer writing or updating a failing test before implementation when the
   behavior is testable.
5. Observe the expected failure when practical; a test that starts green is not
   evidence for new behavior until its sensitivity is otherwise demonstrated.
6. Propose or implement unit, integration, regression, and manual/QA tests as
   appropriate.
7. For user-facing behavior, consider `/webapp-test` for browser evidence.
8. Call out untestable areas, required fixtures/data, and risk-based test gaps.
9. If feature metadata exists, map tests back to feature ID, requirement,
   ticket, QA evidence, and doc sections.
10. Do not mark test evidence complete if tests were only proposed and not run.
