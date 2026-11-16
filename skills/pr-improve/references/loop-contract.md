# PR improvement loop contract

## Durable workspace

Keep each loop in `.atb-work/pr-improve/<target-slug>/`, outside tracked source.
Before writing, ensure `.atb-work/pr-improve/.gitignore` contains `*`. Derive a
stable target slug from the PR, branch, or reviewed path. If that directory already
has a baseline for another target, append a short stable suffix. Never overwrite
unrelated scratch state. Reuse the matching target workspace only after checking
its baseline.

Create `baseline.md`, `initial.diff`, and `ledger.md`. Start `ledger.md` from
`templates/pr-improve-ledger.md`. These artifacts are the durable source for the
loop, not chat history.

## Ledger and convergence

Freeze the start before editing: `baseline.md` records the base or merge-base SHA,
changed paths, untracked files, explicit allowed directories, initial review source,
and round bound. The allowed directories can widen only with an explicit recorded
reason. A behavior fix that needs a failing test adds that test file to the allowed paths, with the
reason `test for accepted finding <ID>`, even when the change did not touch it.
`initial.diff` is the immutable review snapshot.

Each ledger row contains `ID`, source/location, decision, evidence, owner, round,
status, verification, and notes. Decisions are `accepted`, `rejected`, or `deferred`.
Statuses are `open`, `fixed`, `verified`, `superseded`, `escalated`, or `closed`.
A row with decision `rejected` or `deferred` ends at status `closed`, with the reason in notes.
A `closed` row stays in the ledger. The loop reopens it only when new evidence changes the decision.

Before and after each round, compare changed and untracked paths against scope and
append the result to the round log. Stop if edits escape scope. For behavior fixes,
write a failing test first. Use another decisive behavior pin only when a test is not feasible.
Record why in the ledger. Do not substitute a superficial implementation assertion. Re-review after every round. If the same issue recurs,
severity oscillates, or fixing it shifts the defect without progress, stop editing
and escalate the structural choice. Default to three rounds unless the user sets
another bound. A cap is not convergence.
