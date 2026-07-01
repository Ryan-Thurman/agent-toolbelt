---
description: Implement exactly one task from the current lightweight dev phase
argument-hint: "<task-name-or-task-context>"
---

# /dev-implement-task

Implement exactly one task from the current phase.

Use this command for the core implementation loop.

**Arguments:** `$ARGUMENTS`

## Rules

- Implement one task only.
- Keep the change scoped to the selected task.
- Do not jump ahead to future phase work.
- Do not refactor unrelated code.
- Follow existing project conventions.
- Add or update tests in the same task if behavior changes.
- If automated tests are not practical, state why and list the manual or
  integration check that covers the risk.
- Update the Implementation Plan document before and after the task so the
  current task, status, evidence, checks, next step, and resume instructions are
  durable.
- When another agent will implement the task, or when context may be cleared,
  create a short task brief and report file outside tracked source. Put exact
  requirements and checks in the brief; ask the implementer to write the full
  report to the report file and return only a short status summary.
- After implementation, summarize changes and recommend a commit message.

## Required Steps

1. Identify the selected task.
2. Restate the intended behavior.
3. Identify files likely to change.
4. Identify tests to add or update.
5. If delegating or preserving context across a reset, create the task brief and
   report file outside tracked source.
6. Update the plan document to mark the task `In Progress`.
7. Implement the task.
8. Add/update tests for behavior changes.
9. Run or list the relevant checks/tests.
10. Update the plan document with task status, evidence, checks, next step, and
   resume instructions.
11. Summarize what changed.
12. Recommend a commit message.

## Output

# Task Completion Summary

## Task

## Intended Behavior

## What Changed

## Files Changed

## Tests Added / Updated

If none, explain why automated coverage was not practical for this task.

## Checks to Run

## Acceptance Criteria Impact

## Risks / Notes

## Plan Document Updates

Summarize the Implementation Plan updates made for current state, task status,
evidence, checks, and resume instructions.

## Suggested Commit Message

Use this format:

```text
feat: add [task summary]
```

or another appropriate conventional commit prefix.
