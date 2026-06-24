---
description: Review a local diff for correctness, tests, maintainability, and feature-delivery gaps
argument-hint: "[target]"
---

# /review-diff

Review the selected diff before PR.

> **When to use vs related:** `/review-diff` is a quick local-diff review before a
> PR. Use `/pr-review` for the deeper tiered, multi-agent review, and
> `/pr-ready-check` for the open-the-PR readiness checklist.

**Arguments:** `$ARGUMENTS`

Steps:
1. Inspect changed files and surrounding context.
2. Check correctness, edge cases, error handling, maintainability, tests, and
   project conventions.
3. If feature metadata exists, also check feature ID, target release,
   acceptance criteria, doc-delta expectation, QA evidence, and release mismatch.
4. For browser-facing changes, check whether `/webapp-test` evidence or an
   equivalent project test exists.
5. Check whether the diff is on a feature/fix branch rather than `main`,
   `master`, or the repository default branch unless direct default-branch work
   was explicitly approved.
6. Check whether the implementation plan reflects the current diff, completed
   tasks, tests/checks, blockers, next step, and resume instructions.
7. Return findings with file/line references where possible and a verdict:
   `Ready`, `Needs Work`, or `Block`.
