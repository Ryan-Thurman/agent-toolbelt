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
context, scoped Feature Brief / plan sections, these review rules, and
tests/check evidence. Do not include the coding agent's transcript,
self-summary, implementation report, or claims about how the work was done. Do
not paste a large diff into the review prompt when a file handoff will do.

## Check

- Check in order: done-when / acceptance evidence, scope completeness, contract
  drift, track boundaries, then ordinary code review.
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
Nice to Have, and include both required verdicts: Acceptance / Spec and Code
Quality. Include Verification Reach entries that distinguish Verified, Failed,
and Not Inferable items; do not count Not Inferable as a pass when it affects a
phase decision. Cite the done-when or acceptance clauses verified, and make each
request-changes finding name the specific plan, acceptance, contract, or
boundary clause violated. List missing feasible tests under Test Gaps with the
same classification. In Plan Document Updates, summarize the phase status,
result, required fixes, next step, and resume instructions you recorded in the
Implementation Plan. When fixes are needed, suggest a commit message like `fix:
address phase review issues for [phase name]`.
