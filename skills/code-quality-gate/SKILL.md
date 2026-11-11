---
name: code-quality-gate
description: Run a focused pre-PR quality gate when repository policy, user request, or change risk calls for repository checks and changed-code maintainability evidence; not for broad cleanup.
---

# code-quality-gate

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Orchestrate the existing quality owners into one current, durable verdict. This
is not another simplifier or taxonomy: `/simplify` owns behavior-preserving
cleanup, `/pr-review` owns findings, and `/pr-improve` owns the frozen-scope
fix/rereview ledger.

Read `references/gate-contract.md` before step 1.
It owns the target, modes, scope rules, dispositions, evidence files, and status decisions.

## Run

1. Freeze the target, scope, round bound, and fingerprints as the contract defines.
   Use `scripts/fingerprint.sh` for the fingerprints.
2. Build the style evidence packet using
   `shared/contracts/references/style-precedence.md`; load
   `shared/contracts/references/anti-slop-naming.md`,
   `shared/contracts/references/maintainability-taxonomy.md`, and
   `shared/contracts/references/typescript-react-baseline.md` when their
   language/scope applies. Record uncertainty rather than inventing policy.
3. Run the required repository checks, the CRAP analysis check, the React rules check, and the
   changed-hunk assessment, as the contract's sections define them.
4. Record every finding and its disposition in the durable evidence.
5. In apply mode, run the bounded repair loop from the contract's assessment and
   repair section. In report mode, stop after step 4.

## Completion

Write the status record defined in `references/gate-contract.md`.
Report exactly one status: `PASS`, `FAIL`, `CAPPED`, or `BLOCKED`.
