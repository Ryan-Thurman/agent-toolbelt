---
description: Fix accepted PR findings in bounded rounds with a frozen baseline, ledger, and rereview.
argument-hint: "<pr-or-diff> [--scope path[,path]] [--rounds N]"
---

# /pr-improve

Use the `pr-improve` skill to improve a PR after review findings exist.

**Arguments:** `$ARGUMENTS`

Freeze the start baseline and explicit scope before editing. Keep baseline, diff, and
ledger artifacts in the guarded `.atb-work/pr-improve/<target-slug>/` workspace;
do not overwrite unrelated scratch state. Maintain stable finding IDs and decisions,
re-review after each round, stop on scope escape or structural oscillation, and report
convergence honestly. Never commit or push automatically.
