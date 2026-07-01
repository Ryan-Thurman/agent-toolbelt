# Implementation rules

How to carry out a single task within a phase. Load this when implementing.

## Before implementation

Before changing code:

1. Confirm the intended behavior.
2. Identify impacted files or modules.
3. Tie the work to the current task.
4. Call out assumptions.
5. Identify the automated tests that should prove the behavior.
6. If automated tests are not practical, explain why and identify the manual or
   integration check that will cover the risk.

Do not implement future-phase work while completing the current task.

## Test suite rule

Build out the test suite as implementation progresses.

For every task that changes behavior, include the matching test work in the same
task unless there is a clear, stated reason it cannot be automated yet. Prefer
small tests near the changed code: unit tests for logic, component or integration
tests for interactions, and browser/user-flow checks for critical UI behavior.

Do not defer all test coverage to a final hardening phase. A final test phase
may fill gaps, add regression coverage, and clean up brittle tests, but each
feature task should leave the relevant test suite better than it started.

## During implementation

- Work on one task at a time.
- Keep changes small and reviewable.
- Follow existing project conventions.
- Avoid unrelated formatting and broad refactors.
- Add or update tests in the same task when behavior changes.
- Prefer simple, maintainable solutions over clever abstractions.

## File handoffs for delegated or fresh-context work

Use normal prose when one agent is implementing directly in the current
session. When a task is delegated to another agent or likely to cross a
`/clear` or `/compact` boundary, hand off files instead of pasting the whole
plan or long prior-task history into the prompt.

Create a short task brief outside tracked source and make it the implementer's
requirements source. The brief should include only:

- The selected task text from the Implementation Plan.
- Applicable global constraints.
- Files and interfaces the task owns or touches.
- Decisions from earlier tasks that the selected task cannot infer.
- Exact checks/tests expected for this task.

Ask the implementer to write its detailed report to a sibling report file and
return only status, commits or changed files, a one-line test summary, and
blockers or concerns. Exact values, command output, and longer reasoning belong
in the file, not in the chat transcript.

Prefer `.atb-work/dev-lite/` for these handoff files. Ensure the directory has
a `.gitignore` containing `*` before writing scratch artifacts there. If a
delegated task completes cleanly, append one compact line to
`.atb-work/dev-lite/progress.md` with the task name, commit range or changed
files, checks run, and review result.

## After implementation

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
