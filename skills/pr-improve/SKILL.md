---
name: pr-improve
description: Iteratively fix an agreed PR review ledger within a frozen scope and verify each round. Use to improve a PR after findings exist; not for one-time review or broad cleanup.
---

# pr-improve

Improve a change through a bounded, evidence-preserving review loop. This is
distinct from `pr-review` (findings only) and `simplify` (small cleanup).

## Steps

1. Read `references/loop-contract.md`, establish its durable scratch workspace,
   and create the frozen baseline, initial diff, scope/untracked guard, and ledger.
   Do not edit outside scope.
2. Assign stable IDs to findings. Record accepted, rejected, deferred, fixed, and
   evidence changes; do not relitigate a decision unless new evidence changes it.
3. Select a bounded round of agreed findings. For a behavior correction, first add
   or identify a behavior pin that would fail without the correction.
4. Apply only in-scope fixes, run relevant checks, guard against untracked or
   out-of-scope changes, then re-run `pr-review` on the current delta.
5. Reconcile the ledger after every round. Stop at the configured bound, clean
   convergence, or structural escalation for repeated/oscillating findings.

## Completion

Report the baseline, scope, ledger status, changes, checks, remaining findings,
and one of: converged, capped-not-converged, or escalated. Never commit or push
automatically.
