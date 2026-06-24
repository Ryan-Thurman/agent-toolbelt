# Standalone use

The full workflow is optional. For bug fixes or small changes, use the review
steps by themselves when enough context is available.

For a QA-style change review:

```text
$dev-lite-workflow
Run a phase review for this bug fix. Check expected behavior, tests, edge cases,
security, performance, code quality, UX, and whether review issues remain.
```

For final PR readiness:

```text
$dev-lite-workflow
Run a PR readiness review for the current diff. Compare against this bug:
[describe bug and expected behavior].
```

When running standalone reviews, infer the feature brief from the bug or change
summary. If acceptance criteria are missing, turn the expected behavior into a
small checklist before reviewing.
