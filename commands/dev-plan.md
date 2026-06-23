---
description: Create a lightweight phased implementation plan from a feature brief
argument-hint: "<feature-brief-or-context>"
---

# /dev-plan

Create a phased implementation plan from the Feature Brief.

Use this after `/dev-intake`.

**Arguments:** `$ARGUMENTS`

## Rules

- Organize work into clear phases.
- Each phase should produce working, reviewable progress.
- Each task should be small enough for one focused commit.
- Include test work inside each behavior-changing task, not only in a final
  hardening phase.
- Identify dependencies and risks.
- Avoid over-engineering.
- Prefer the smallest useful implementation that satisfies the acceptance criteria.
- Stop after producing the plan. Do not start implementation, file edits, or
  `/dev-start-phase` until the user approves the plan or explicitly asks to
  continue.

## Default Phase Model

For most features, use:

1. Foundation
2. Core Behavior
3. Edge Cases and UX Polish
4. Tests, Hardening, and Cleanup

For larger app ideas, use:

1. App Skeleton
2. Core Data Model / State
3. Primary User Flow
4. Secondary Flows
5. Error, Empty, and Loading States
6. Tests and Hardening
7. Final PR Review

Choose the model that fits the scope.

## Output

Create or update an Implementation Plan using this structure:

# Implementation Plan

## Overview

Briefly summarize the plan.

## Acceptance Criteria Coverage Strategy

Explain how the plan will satisfy the acceptance criteria.

## Current State

Status: Planning

Current Phase: Not Started

Current Task: Not Started

Current Branch: TBD

Last Updated: YYYY-MM-DD

Last Completed Step: Plan created

Next Step: Await user plan review

Resume Instructions: Review this plan and either approve it, request changes,
or choose the first task.

## Activity Log

| Date | Agent/Owner | Action | Evidence / Links | Next Step |
|---|---|---|---|---|
| YYYY-MM-DD | TBD | Plan created | TBD | Await user plan review |

## Phase 1: [Name]

### Goal

### Tasks

- [ ] Task 1
- [ ] Task 2

Each behavior-changing task should mention the matching test work.

### Expected Commits

- `feat: ...`
- `test: ...`

### Tests / Checks

List the automated tests to add or update during this phase and any manual
checks needed when automation is not practical.

### Risks

### Phase Review Checklist

- [ ] Phase goal met
- [ ] Acceptance criteria covered or still tracked
- [ ] Tests/checks completed or gaps listed
- [ ] No blocking performance/security/code quality issues

## Phase 2: [Name]

Repeat the same structure.

## Phase 3: [Name]

Repeat the same structure.

## Phase 4: [Name]

Repeat the same structure.

## Final PR Review Plan

Before PR is marked ready, review:

- Correctness
- Acceptance criteria
- App/feature flows
- Tests
- Performance
- Security
- Code quality
- Maintainability
- UX/product quality
- Documentation or README updates if needed

## Plan Review Gate

End the response by asking the user to review the plan and confirm whether to
proceed, revise it, or choose the first task. Do not begin implementation in the
same turn unless the user already explicitly asked for implementation after the
plan.

When creating a persistent plan file, include `Current State`, `Activity Log`,
and `Resume Instructions`. These fields must be updated throughout the workflow.
