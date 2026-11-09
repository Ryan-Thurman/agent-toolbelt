---
name: pr-improve
description: Iteratively fix an agreed PR review ledger within a frozen scope and verify each round. Use to improve a PR after findings exist; not for one-time review or broad cleanup.
---

# pr-improve

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Improve a change through a bounded, evidence-preserving review loop. This is
distinct from `pr-review` (findings only) and `simplify` (small cleanup).

## Steps

When failures repeat or progress stops, read `shared/contracts/references/failure-recovery.md`.
Keep this skill's frozen ledger and existing round limit as the recovery record.

1. Read `references/loop-contract.md`, establish its durable scratch workspace,
   and create the frozen baseline, initial diff, scope/untracked guard, and ledger.
   Do not edit outside scope.
2. Assign stable IDs to findings. Record accepted, rejected, deferred, fixed, and
   evidence changes; do not relitigate a decision unless new evidence changes it.
3. Select a bounded round of agreed findings. For a behavior correction, first add
   or identify a failing test using `shared/contracts/references/test-driven-development.md`.
   Keep red/green evidence and coverage gaps in the existing ledger.
4. Apply only in-scope fixes, run relevant checks, guard against untracked or
   out-of-scope changes, then re-run `pr-review` on the current delta.
5. Reconcile the ledger after every round. Stop at the configured bound, clean
   convergence, or structural escalation for repeated/oscillating findings.

## Completion

Report the baseline, scope, ledger status, changes, checks, remaining findings,
and one of: converged, capped-not-converged, or escalated. Never commit or push
automatically.
