---
description: Fix issues found in the latest lightweight phase review
argument-hint: "<phase-review-findings>"
---

# /dev-fix-review-issues

Fix the issues found in the latest phase review.

Use this after `/dev-phase-review` returns Blocking or Should Fix items that
need to be addressed before moving on.

**Arguments:** `$ARGUMENTS`

## Rules

- Fix only issues listed in the latest review.
- Do not add unrelated features.
- Do not start the next phase.
- Do not do broad refactors unless the review specifically called for it.
- Add or update tests if needed.
- Update the Implementation Plan with fix status, evidence, checks, remaining
  issues, next step, and resume instructions.
- Summarize fixes and recommend a commit message.

## Output

# Review Fix Summary

## Issues Fixed

## Files Changed

## Tests Added / Updated

## Checks to Run

## Remaining Risks

## Plan Document Updates

Summarize the Implementation Plan updates made for fixed issues, checks,
remaining risks, next step, and resume instructions.

## Suggested Commit Message

Use this format:

```text
fix: address phase review issues for [phase name]
```
