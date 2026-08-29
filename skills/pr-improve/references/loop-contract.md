# PR Improvement Loop Contract

## Durable workspace

Keep each loop in `.atb-work/pr-improve/<target-slug>/`, outside tracked source.
Before writing, ensure `.atb-work/pr-improve/.gitignore` contains `*`. Derive a
stable target slug from the PR, branch, or reviewed path. If that directory already
has a baseline for another target, append a short stable suffix; never overwrite
unrelated scratch state. Reuse the matching target workspace only after checking
its baseline.

Create `baseline.md`, `initial.diff`, and `ledger.md`; start `ledger.md` from
`templates/pr-improve-ledger.md`. These artifacts are the durable source for the
loop, not chat history.

## Ledger and convergence

Freeze the start before editing: `baseline.md` records the base or merge-base SHA,
changed paths, untracked files, explicit allowed directories, initial review source,
and round bound. The allowed directories may widen only with an explicit recorded
reason. `initial.diff` is the immutable review snapshot.

Each ledger row contains `ID`, source/location, decision, evidence, owner, round,
status, verification, and notes. Decisions are `accepted`, `rejected`, or `deferred`;
statuses are `open`, `fixed`, `verified`, `superseded`, or `escalated`.

Before and after each round, compare changed and untracked paths against scope and
append the result to the round log. Stop if edits escape scope. For behavior fixes,
use a test or other decisive behavior pin; do not substitute a superficial
implementation assertion. Re-review after every round. If the same issue recurs,
severity oscillates, or fixing it shifts the defect without progress, stop editing
and escalate the structural choice. Default to three rounds unless the user sets
another bound. A cap is not convergence.
