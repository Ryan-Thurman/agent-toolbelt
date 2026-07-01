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
- For each behavior-changing task, include `Files` and `Interfaces` fields.
  `Files` names created/modified/test files from the map. `Interfaces` names
  what the task consumes, produces, exports, calls, or changes for neighboring
  tasks.
- Identify dependencies and risks.
- Avoid over-engineering.
- Prefer the smallest useful implementation that satisfies the acceptance criteria.
- Replace template placeholders before presenting the plan. A generated plan
  should not contain `TBD`, vague "add tests", "handle edge cases", or undefined
  file/interface references.
- Require exact test names, check commands, or manual verification steps for
  each task. Do not use generic test instructions when the repo has a known
  command or file-level check.
- Include full code snippets only when they materially reduce ambiguity: an
  algorithmically specific task, a tricky data shape, or work that will be
  dispatched to a fresh-context subagent. Otherwise, name files, interfaces,
  commands, and acceptance criteria instead of embedding code.
- Run the assumption-delta check when the plan introduces another
  platform/provider/auth method/source of truth, makes a required field
  optional, or turns a derived constant into user choice. Record the accepted
  assumption change, promoted primary noun, or explicit debt in the plan.
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
include `Files`, `Interfaces`, and matching test work, and either use files from
the map or explain why the map changed. Keep `Current State`, `Activity Log`,
and `Resume Instructions` updated throughout the workflow.

## Code and Command Specificity

Plans are execution prompts, but they should stay lightweight:

- Required: exact files, interfaces, test names, commands, expected check
  results, and manual verification steps where automation is not practical.
- Required: full code snippets only for algorithmically specific changes,
  fragile data transformations, complex schemas/contracts, or tasks intended
  for fresh-context subagent dispatch.
- Avoid: broad implementation prose that restates the goal without naming
  files, commands, interfaces, or acceptance criteria.
- Avoid: embedding routine code when the file/interface/test contract is enough
  for a local implementer to proceed.

## Assumption Delta Check

Most plans should not need extra ceremony. Use this checkpoint only when the
feature changes a core planning assumption:

- Adds a second platform, provider, auth method, storage layer, runtime, or
  source of truth.
- Makes a required field optional, or makes an optional field required.
- Turns a derived constant, convention, or environment assumption into user
  choice.
- Changes which noun is primary in the domain model, such as repository vs
  workspace, user vs organization, or local vs remote config.

When triggered, add a short note in the plan that states:

- Previous assumption.
- New assumption.
- Primary noun or source of truth after the change.
- Accepted debt, compatibility cost, or migration risk.

## Plan Review Gate

Before presenting the plan, perform this self-review and fix any failures:

- Search the generated plan for `TBD`, placeholder text, or empty task fields.
- Confirm each task is concrete enough for one focused commit.
- Confirm each behavior-changing task names specific test work, not vague
  "add tests" language.
- Confirm file references in tasks exist in the `File / Responsibility Map` or
  the task explains why the map changed.
- Confirm `Interfaces` entries name concrete inputs, outputs, exports,
  consumers, commands, templates, or contracts.
- Confirm risks and acceptance criteria are represented in phases or explicitly
  deferred.
- If the assumption-delta triggers appear, confirm the plan records the previous
  assumption, new assumption, primary noun/source of truth, and accepted debt.

End the response by asking the user to review the plan and confirm whether to
proceed, revise it, or choose the first task. Do not begin implementation in the
same turn unless the user already explicitly asked for implementation after the
plan.

When creating a persistent plan file, include `Current State`, `Activity Log`,
and `Resume Instructions`. These fields must be updated throughout the workflow.
