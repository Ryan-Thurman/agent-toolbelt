# Failure recovery

Use this contract when implementation or verification repeats without useful progress.
Keep the record in the workflow's existing investigation, ledger, or execution file.

## Establish the comparison

Record the relevant baseline checks and any pre-existing failures before the first risky change.
State the hypothesis, predicted observation, and bounded probe before each repair attempt.
After each attempt, record the changed scope, command, failure identity, evidence path, and result.
Persist attempt counts before another attempt can start, including across session resets.
Use the caller's attempt limit when supplied; otherwise use the owning workflow's existing limit.
For a general implementation repair, default to three attempts at the same hypothesis before reassessment.

Compare behavior and failure causes, rather than error counts alone.
A new failing acceptance test can expose required work without indicating a regression.
A passing suite cannot establish progress when assertions were weakened or required checks were skipped.
Separate product defects from unavailable dependencies, permissions, flaky checks, and environment failures.

## Stop the failed approach

When the same failure repeats, findings oscillate, or changes spread without evidence, pause edits and reassess.
Compare the attempts and explain what each one disproved.
Choose a different hypothesis only when new evidence supports it.
If progress needs a scope, architecture, or authority change, record the decision needed and its owner.
Keep `capped`, `blocked`, and `completed` distinct; exhausting a limit cannot establish completion.
Preserve existing workflow status names when they differ.

Recover by inspecting the current diff and identifying changes owned by this attempt.
Preserve the failure evidence before removing experimental changes.
Reverse only those changes, or restart in an isolated worktree with the recorded input.
Preserve user changes, concurrent work, and useful tests that expose the problem.
Bulk resets and deletion of untracked files are not a default recovery action.

## Bound observations

Keep complete command output in a local evidence file when its size exceeds the useful context budget.
Mark shortened output and retain its location, exit status, and relevant failure details.
A truncated read cannot establish that no additional failures or callers exist.
When a timeout interrupts a command, record the interruption and check whether its process or external operation continues.
Manage only processes created by the current task.

## Resume

Reconcile branch, worktree, source revisions, diff, and attempt history before another edit.
Resume from the recorded next action; a reset does not renew an exhausted attempt limit.
After a consequential failure, use [execution-lessons.md](execution-lessons.md) when a reusable lesson has evidence.
