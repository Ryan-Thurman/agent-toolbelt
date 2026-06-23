# Dev Lite Feature Workflow

Use this workflow when starting from a feature idea, app idea, ticket, or
product request.

This workflow is intentionally lightweight and dev-specific. It does not replace
larger corporate release, compliance, QA, or documentation gates. It focuses on
building the feature correctly and keeping the work reviewable.

In Cursor and Claude Code, use the `/dev-*` command files directly when they are
installed as commands. In Codex, invoke `$dev-lite-workflow` or select the skill
with `/skills`, then ask for the specific action such as "run a PR readiness
review" or "run a phase review."

Do not push directly to `main`, `master`, or the repository default branch
during this workflow unless the user explicitly asks for that exact behavior.
Use a focused feature/fix branch and open a PR after final PR readiness review
passes.

## Workflow Summary

```text
Feature/App Idea
↓
/dev-intake
↓
/dev-plan
↓
Review plan and approve next step
↓
/dev-start-phase
↓
/dev-implement-task
↓
Commit
↓
Repeat tasks until phase complete
↓
/dev-phase-review
↓
/dev-fix-review-issues if needed
↓
Commit fixes
↓
Next phase
↓
Repeat
↓
/dev-pr-review
↓
Open PR from feature/fix branch
```

## Step 1: Intake

Run:

```text
/dev-intake
```

Create a Feature Brief with:

- Summary
- Target user
- Problem/goal
- App or feature flows
- Acceptance criteria
- Constraints
- Non-goals
- Open questions
- Suggested assumptions
- Risks

## Step 2: Plan

Run:

```text
/dev-plan
```

Create an Implementation Plan with:

- Phases
- Tasks per phase
- Expected commits
- Tests/checks tied to each behavior-changing task
- Risks
- Phase review checklist
- Final PR review plan

Stop here for plan review. Do not begin implementation until the user approves
the plan, asks to continue, or names the first task.

## Step 3: Start Phase

For each phase, run:

```text
/dev-start-phase
```

Before coding, confirm:

- Current branch and whether a feature/fix branch is needed
- Phase goal
- Tasks
- Files/modules likely impacted
- Dependencies
- Risks
- Test plan
- Recommended first task

## Step 4: Implement One Task

Run:

```text
/dev-implement-task
```

Rules:

- Implement one task only.
- Keep the change small.
- Add/update matching tests in the same task when behavior changes.
- If automated tests are not practical, explain why and list the manual or
  integration check that covers the risk.
- Summarize changes.
- Recommend a commit message.

## Step 5: Commit After Each Task

After each task is complete and checked, commit it.

Preferred commit examples:

```text
feat: add saved filter model
feat: add saved filter creation flow
test: add saved filter validation coverage
fix: handle duplicate saved filter names
```

## Step 6: Repeat Until Phase Is Complete

Repeat:

```text
/dev-implement-task
```

Then commit after each completed task.

## Step 7: Phase Review

When all tasks in a phase are complete, run:

```text
/dev-phase-review
```

The phase review must check:

- Completed tasks
- Acceptance criteria coverage
- Tests
- Whether each behavior-changing task built out the test suite
- Performance
- Security
- Code quality
- UX/product quality
- Future-phase leakage

## Step 8: Fix Review Issues

If review issues exist, run:

```text
/dev-fix-review-issues
```

Then commit the fixes.

Do not move to the next phase while blocking issues remain.

## Step 9: Move to Next Phase

Repeat the phase loop:

```text
/dev-start-phase
/dev-implement-task
commit
/dev-phase-review
/dev-fix-review-issues if needed
commit fixes
```

## Step 10: Final PR Review

After all phases are complete and review issues are fixed, run:

```text
/dev-pr-review
```

The final PR review must check:

- Correctness
- Acceptance criteria
- Flow coverage
- Tests
- Performance
- Security
- Code quality
- Maintainability
- UX/product quality
- Documentation updates

Do not mark the PR ready if blocking issues remain.

## Step 11: Open PR

When the final PR review result is `Ready for PR`:

1. Confirm the work is on a feature/fix branch, not `main`, `master`, or the
   repository default branch.
2. Push the branch if needed.
3. Open a PR using the suggested PR description, or provide the exact command
   and PR body for the user to run.

Do not merge the PR or push to the default branch unless the user explicitly
asks.
