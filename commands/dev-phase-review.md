---
description: Review a completed lightweight dev phase before moving to the next phase
argument-hint: "<phase-name-or-review-context>"
---

# /dev-phase-review

Review the completed phase against the Feature Brief and Implementation Plan.

Run this after all tasks in a phase are implemented and committed.

**Arguments:** `$ARGUMENTS`

## Review Scope

Compare the completed phase against:

- Feature Brief
- App or feature flows
- Acceptance criteria
- Implementation Plan
- Completed tasks
- Tests/checks
- Current diff if available

If the review is delegated, the diff is large, or context is near a reset,
create a review package outside tracked source and give the reviewer the file
path. Include the base/head identifiers, commit list, diff stat, full diff with
context, and paths to any task brief or implementer report files. Do not paste a
large diff into the review prompt when a file handoff will do.

## Check

- Were all phase tasks completed?
- Does the implemented behavior match the phase goal?
- Does the implementation support the relevant acceptance criteria?
- Are important tests missing?
- Did each behavior-changing task add or update appropriate tests?
- Are any missing feasible tests serious enough to block the next phase?
- Are there performance concerns?
- Are there security concerns?
- Are there code quality concerns?
- Are there UX edge cases?
- Did the phase accidentally include future-phase work?
- Was the Implementation Plan updated with completed task status, evidence,
  review findings, next step, and resume instructions?

## Output

Produce a Phase Review following the structure in
`templates/dev-phase-review.md`. Classify findings as Blocking, Should Fix, or
Nice to Have, and list missing feasible tests under Test Gaps with the same
classification. In Plan Document Updates, summarize the phase status, result,
required fixes, next step, and resume instructions you recorded in the
Implementation Plan. When fixes are needed, suggest a commit message like
`fix: address phase review issues for [phase name]`.
