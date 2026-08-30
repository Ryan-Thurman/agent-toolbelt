---
name: code-quality-gate
description: Run the pre-PR quality gate that verifies repository checks and changed-code maintainability, naming, and simplification evidence. Use before PR readiness or when Dev Lite requires a quality verdict; not for broad cleanup or a standalone review.
---

# code-quality-gate

Orchestrate the existing quality owners into one current, durable verdict. This
is not another simplifier or taxonomy: `/simplify` owns behavior-preserving
cleanup, `/pr-review` owns findings, and `/pr-improve` owns the frozen-scope
fix/rereview ledger.

## Mutation policy

Default to report mode. It may write generated evidence under
`.atb-work/code-quality-gate/`, but must not change repository source, tests,
configuration, or documentation. Edit only when the surrounding implementation
request already authorizes edits or the user explicitly selects apply mode.
Never commit or push.

## Run

1. Read `references/gate-contract.md`. Gate only the current checked-out branch
   and local working tree: committed-since-merge-base, staged, unstaged, and
   untracked changes. Freeze its merge base, exact changed/untracked path set,
   allowed scope, round bound, and the
   deterministic fingerprints from `scripts/fingerprint.sh`. A prior PASS is
   current only when a consumer recomputes matching fingerprints and confirms
   final coverage.
2. Build the style evidence packet using
   `shared/contracts/references/style-precedence.md`; load
   `shared/contracts/references/anti-slop-naming.md`,
   `shared/contracts/references/maintainability-taxonomy.md`, and
   `shared/contracts/references/typescript-react-baseline.md` when their
   language/scope applies. Record uncertainty rather than inventing policy.
3. Discover and run the repository checks required for the changed work. Then
   assess every changed hunk through `/simplify` in report mode and `/pr-review`
   with `standards,maintainability` forced into focus. Preserve simplify's
   Chesterton's Fence and test-safety rules.
4. Capture the pre-threshold standards and maintainability facet findings before
   normal PR rendering can suppress nits. Record every finding in the durable
   evidence with the decision/status semantics in the contract. In report mode,
   stop with FAIL when a blocker, should-fix, unresolved evidence-backed issue,
   or undispositioned nit remains.
5. In apply mode, reuse `/pr-improve`'s frozen-scope ledger and convergence
   behavior. Apply only unambiguous, evidence-backed, behavior-preserving,
   in-scope fixes; a structural tradeoff or behavior change needs a recorded
   human choice. Rerun required checks and the changed-code assessment after
   each round. Stop on convergence, a blocker, scope escape, structural
   escalation, or the round cap.

## Completion

Write the status record defined in `references/gate-contract.md` and report one
of `PASS`, `FAIL`, `CAPPED`, or `BLOCKED`. PASS requires green required checks,
an unchanged frozen scope, no unresolved blocker/should-fix/evidence-backed
quality issue, an explicit disposition for every nit, and a verified fix for
every accepted finding. Partial-scope PASS evidence never satisfies Dev Lite
readiness. Do not infer or label AI authorship; judge only observable consequences.
