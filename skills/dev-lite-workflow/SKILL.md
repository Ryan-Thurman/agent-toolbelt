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

When resuming, handing off, or preparing a phase/PR review, reconcile derived
state before proceeding:

- `Current Phase` and `Current Task` should match the next incomplete task, or
  explain why the next action is review/fix/blocked work instead.
- `Last Completed Step` should match the latest completed Activity Log entry.
- `Next Step` and `Resume Instructions` should point to the same action.
- Task checkboxes, task `Status`, and task `Evidence` should agree.

Do not overwrite human-authored notes just to make the plan mechanically tidy.
If the task list and Activity Log conflict, record the mismatch and proceed from
the most reliable evidence.

## Scratch and Ledger Convention

For temporary task briefs, implementer reports, review packages, and progress
ledgers, use a repo-local scratch workspace instead of `.git/`:

```sh
mkdir -p .atb-work/dev-lite
printf '*\n' > .atb-work/dev-lite/.gitignore
```

Use `.atb-work/dev-lite/progress.md` as an optional recovery ledger for
subagent-style execution. Record one compact line per completed task with the
task name, commit range or changed files, checks run, and review result. The
Implementation Plan remains the durable tracked source of truth; the ledger is
only a local recovery aid after context loss.

Before committing, run `git status --short`. If `.atb-work/` appears, stop and
fix the scratch location or ignore before continuing.

## Optional Subagent Dispatch

Dev Lite must work without multi-agent tooling. Run tasks sequentially in the
current session by default.

When the current environment supports subagents and the user has explicitly
asked for delegation, parallel agents, or a subagent-driven run, delegate only
bounded work with clear ownership:

- Use one task brief per delegated task.
- Name the files or module boundaries the subagent owns.
- Tell the subagent it is not alone in the codebase and must preserve unrelated
  edits.
- Ask for a short return message: status, changed files or commits, checks run,
  and blockers or concerns. Longer evidence belongs in the report file.
- Do not delegate the immediate critical-path task if the next local step is
  blocked on its result; do that work locally.

Model selection should be explicit only when the tool supports it and there is
a task-specific reason:

- Mechanical single-file or copy-editing tasks: fastest/cheapest capable model.
- Normal implementation or integration tasks: default/current coding model.
- Architecture, security, cross-cutting correctness, or final review: strongest
  appropriate available model.

If no subagent tool or model override is available, record the intended split
only as guidance and continue sequentially.

## Detailed rules (load when you reach that step)

- `references/implementation-rules.md` — before / during / after implementing a
  task, plus the test-suite rule.
- `references/review-rules.md` — phase review evaluation and finding
  classification (also used for the final PR readiness review).
- `references/commit-rules.md` — commit cadence and message conventions.
- `references/standalone-use.md` — running the review steps by themselves for a
  bug fix or small change.
