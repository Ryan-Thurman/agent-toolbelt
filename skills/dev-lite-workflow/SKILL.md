---
name: dev-lite-workflow
description: Run a lightweight AI-assisted dev workflow from feature or app idea through brief, flows, acceptance criteria, phased implementation, per-task commits, phase reviews, review fixes, and final PR readiness review. Use for practical dev work that should stay lighter than the regulated AI Feature Delivery process.
---

# dev-lite-workflow

Use this skill when the user wants a lightweight development loop for a feature,
app idea, ticket, or product request.

This skill is intentionally dev-specific. Do not add corporate release,
compliance, QA handoff, or controlled-document gates unless the user explicitly
asks for the heavier feature-delivery workflow.

## Core Loop

```text
Idea / Feature Request
↓
Feature Brief
↓
Implementation Plan
↓
Plan Review / User Approval
↓
Phase Tasks
↓
Task -> Implement -> Test -> Commit
↓
Phase Review
↓
Fix Issues -> Commit
↓
Next Phase
↓
Final PR Review
↓
Open PR
```

## Always Preserve

- Feature or app goal
- Target user
- App or feature flows
- Acceptance criteria
- Implementation plan
- Current phase
- Current task
- Test expectations
- Known risks
- Open questions

## Branch and PR Safety

Do not push directly to `main`, `master`, or the repository default branch
during this workflow unless the user explicitly asks for that exact behavior.

Before implementation, check the current branch. If work is on the default
branch, create or ask to create a focused feature/fix branch such as:

```text
dev/<short-feature-name>
fix/<short-bug-name>
```

Keep commits on that branch. After all phases are complete and blocking review
issues are fixed:

1. Run the final PR readiness review against the branch diff.
2. Fix any Blocking findings and rerun the review.
3. When the result is `Ready for PR`, push the branch if needed.
4. Open a PR or provide the exact PR command and description for the user to run.

Do not merge the PR, squash, rebase public history, or push to the default
branch unless the user explicitly asks.

## Commands

The portable command prompts live in `../../commands/`:

- `/dev-intake` creates or updates a Feature Brief.
- `/dev-plan` creates a phased Implementation Plan.
- `/dev-start-phase` prepares the next phase before coding.
- `/dev-implement-task` implements exactly one task.
- `/dev-phase-review` reviews the completed phase.
- `/dev-fix-review-issues` fixes only phase review findings.
- `/dev-pr-review` performs final PR readiness review.

In Codex, these command files are reusable prompt references, not automatically
registered slash commands. Use this skill directly instead:

```text
$dev-lite-workflow
Run a dev-lite PR readiness review for the current diff. Context: [bug or feature summary].
```

You can also invoke the skill through `/skills` and then ask for the specific
action by name, such as "run the PR readiness review" or "run a phase review."

Use the matching templates in `../../templates/` for persistent artifacts:

- `dev-feature-brief.md`
- `dev-implementation-plan.md`
- `dev-phase-review.md`
- `dev-pr-review.md`

## Standalone Use

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

## Planning Approval Gate

After creating or updating the Implementation Plan, stop and ask the user to
review it before making code changes.

Do not begin `/dev-start-phase`, `/dev-implement-task`, or any file edits after
planning unless the user explicitly approves the plan, asks to continue, or
names the first task to implement.

Valid approval signals include:

- "Looks good, continue."
- "Start phase 1."
- "Implement task 1."
- "Proceed with the plan."

If the user asks for plan changes, revise the plan and stop again for review.

## Living Plan Rule

Treat the Implementation Plan as the durable handoff state for the workflow.
Keep it accurate enough that a new agent can resume after a crash, context
reset, or handoff.

Update the plan document whenever any of these change:

- Plan approval status
- Current phase
- Current task
- Task checkbox/status
- Tests/checks run
- Files changed
- Commit hash or suggested commit state
- Phase review result
- Review fixes
- Branch name
- PR URL or PR readiness result
- Blockers, risks, assumptions, or next step

Before ending a turn after implementation work, update `Current State`,
`Activity Log`, task evidence/status, and `Resume Instructions`. If no plan file
exists yet, create one from `dev-implementation-plan.md` or clearly ask where to
store it before continuing substantial work.

## Before Implementation

Before changing code:

1. Confirm the intended behavior.
2. Identify impacted files or modules.
3. Tie the work to the current task.
4. Call out assumptions.
5. Identify the automated tests that should prove the behavior.
6. If automated tests are not practical, explain why and identify the manual or
   integration check that will cover the risk.

Do not implement future-phase work while completing the current task.

## Test Suite Rule

Build out the test suite as implementation progresses.

For every task that changes behavior, include the matching test work in the same
task unless there is a clear, stated reason it cannot be automated yet. Prefer
small tests near the changed code: unit tests for logic, component or integration
tests for interactions, and browser/user-flow checks for critical UI behavior.

Do not defer all test coverage to a final hardening phase. A final test phase
may fill gaps, add regression coverage, and clean up brittle tests, but each
feature task should leave the relevant test suite better than it started.

## During Implementation

- Work on one task at a time.
- Keep changes small and reviewable.
- Follow existing project conventions.
- Avoid unrelated formatting and broad refactors.
- Add or update tests in the same task when behavior changes.
- Prefer simple, maintainable solutions over clever abstractions.

## After Implementation

Return:

- Task completed
- Intended behavior
- Files changed
- Tests added or updated
- Checks run or still needed
- Acceptance criteria impact
- Risks or notes
- Suggested commit message

Also update the Implementation Plan document with the completed task status,
test/check evidence, changed files, next task, and resume instructions before
claiming the task is ready for commit.

Do not mark the task complete unless the intended behavior is implemented,
relevant tests/checks have run or are clearly listed, missing tests are called
out with a reason, and the task is ready for a small commit.

## Phase Review Rules

At the end of each phase, review against the Feature Brief, app/feature flows,
acceptance criteria, Implementation Plan, completed tasks, tests/checks, and
current diff if available.

Evaluate:

- Correctness
- Acceptance criteria coverage
- Tests
- Performance
- Security
- Code quality
- Maintainability
- UX/product quality
- Future-phase leakage

Classify findings as:

- Blocking: must fix before moving on.
- Should Fix: important, but may not block if explicitly accepted.
- Nice to Have: improvement, polish, or future cleanup.

Do not approve a phase or PR if blocking issues remain.

Treat missing feasible tests for behavior changes as a Should Fix issue by
default, or Blocking when the missing coverage leaves core behavior,
permissions, data safety, or high-risk edge cases unverified.

## Commit Rules

Recommend one small commit after each completed task and another after phase
review fixes, if any.

Use concise conventional-style messages when possible:

```text
feat: add [task summary]
fix: address [issue summary]
test: add coverage for [behavior]
refactor: simplify [area]
docs: update [doc or README area]
chore: update [tooling/config]
```
