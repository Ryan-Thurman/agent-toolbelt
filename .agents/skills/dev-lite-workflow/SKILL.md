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

These command files install as real slash commands in Cursor
(`.cursor/commands/`) and Claude Code (`.claude/commands/`). In Codex they are
reusable prompt references rather than registered slash commands, so invoke this
skill directly instead:

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

## Detailed rules (load when you reach that step)

- `references/implementation-rules.md` — before / during / after implementing a
  task, plus the test-suite rule.
- `references/review-rules.md` — phase review evaluation and finding
  classification (also used for the final PR readiness review).
- `references/commit-rules.md` — commit cadence and message conventions.
- `references/standalone-use.md` — running the review steps by themselves for a
  bug fix or small change.
