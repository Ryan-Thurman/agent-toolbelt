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
- After implementation, summarize changes and recommend a commit message.

## Required Steps

1. Identify the selected task.
2. Restate the intended behavior.
3. Identify files likely to change.
4. Identify tests to add or update.
5. Update the plan document to mark the task `In Progress`.
6. Implement the task.
7. Add/update tests for behavior changes.
8. Run or list the relevant checks/tests.
9. Update the plan document with task status, evidence, checks, next step, and
   resume instructions.
10. Summarize what changed.
11. Recommend a commit message.

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
