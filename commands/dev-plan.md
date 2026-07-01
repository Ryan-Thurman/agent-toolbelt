---
description: Create a lightweight phased implementation plan from a feature brief
argument-hint: "<feature-brief-or-context>"
---

# /dev-plan

Create a phased implementation plan from the Feature Brief.

Use this after `/dev-intake`.

> **When to use vs related:** `/dev-plan` builds a *phased* Dev Lite plan from a
> Feature Brief. Use `/implementation-plan` for a concise single-ticket plan in
> the feature-delivery track.

**Arguments:** `$ARGUMENTS`

## Rules

- Organize work into clear phases.
- Each phase should produce working, reviewable progress.
- Each task should be small enough for one focused commit.
- Include test work inside each behavior-changing task, not only in a final
  hardening phase.
- Add a `Global Constraints` section for rules that apply across tasks, such as
  compatibility, security boundaries, migration limits, design-system
  constraints, performance budgets, dependency restrictions, or licensing
  rules.
- Put cross-task rules in `Global Constraints` once, then reference them from
  tasks only when a task needs a narrower or exceptional constraint.
- Add a `File / Responsibility Map` before phase tasks. Name the files/modules
  expected to be created, modified, or tested, and state each one's
  responsibility.
- Make task file choices trace back to the map. If a task needs a file not in
  the map, update the map or explain the deviation in the task.
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

Create or update an Implementation Plan following the structure in
`templates/dev-implementation-plan.md`. Replace the template's default phase
blocks with the phases from the model you chose above (duplicate the phase block
per phase). For a freshly created plan, set Current State to `Status: Planning`,
`Current Phase: Not Started`, `Next Step: Await user plan review`, and seed the
Activity Log with a "Plan created" row. Fill `Global Constraints` with any
cross-task rules from the brief or write `None beyond existing repo standards`
when no special constraints apply. Fill `File / Responsibility Map` before
writing phase tasks; include implementation, test, template, command, and
documentation files when they are relevant. Each behavior-changing task must
name its matching test work and either use files from the map or explain why the
map changed. Keep `Current State`, `Activity Log`, and `Resume
Instructions` updated throughout the workflow.

## Plan Review Gate

End the response by asking the user to review the plan and confirm whether to
proceed, revise it, or choose the first task. Do not begin implementation in the
same turn unless the user already explicitly asked for implementation after the
plan.

When creating a persistent plan file, include `Current State`, `Activity Log`,
and `Resume Instructions`. These fields must be updated throughout the workflow.
