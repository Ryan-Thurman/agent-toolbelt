---
description: Review a local diff for correctness, tests, maintainability, and feature-delivery gaps
argument-hint: "[target]"
---

# /review-diff

Review the selected diff before PR.

**Arguments:** `$ARGUMENTS`

Steps:
1. Inspect changed files and surrounding context.
2. Check correctness, edge cases, error handling, maintainability, tests, and
   project conventions.
3. If feature metadata exists, also check feature ID, target release,
   acceptance criteria, doc-delta expectation, QA evidence, and release mismatch.
4. For browser-facing changes, check whether `/webapp-test` evidence or an
   equivalent project test exists.
5. Return findings with file/line references where possible and a verdict:
   `Ready`, `Needs Work`, or `Block`.
