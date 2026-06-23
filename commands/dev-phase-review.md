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

# Phase Review

## Phase

## Result

Use one:

- Pass
- Pass with Notes
- Needs Fixes
- Blocked

## Completed Tasks

## Acceptance Criteria Covered

## Findings

### Blocking

### Should Fix

### Nice to Have

## Required Fixes Before Next Phase

## Tests / Checks Reviewed

## Remaining Risks

## Plan Document Updates

Summarize phase status, review result, required fixes, next step, and resume
instructions recorded in the Implementation Plan.

## Suggested Fix Commit Message

Use this when fixes are needed:

```text
fix: address phase review issues for [phase name]
```
