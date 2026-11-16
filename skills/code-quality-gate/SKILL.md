---
name: code-quality-gate
description: Run a focused pre-PR quality gate when repository policy, user request, or change risk calls for repository checks and changed-code maintainability evidence; not for broad cleanup.
---

# code-quality-gate

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Orchestrate the existing quality owners into one current, durable verdict. This
is not another reviewer: `/pr-review` owns findings and `/pr-improve` owns the
frozen-scope fix and rereview ledger.

Read `references/gate-contract.md` before step 1.
It owns the target, modes, dispositions, evidence files, and status decisions.

## Run

1. Freeze the target, `base_sha`, and `head_fingerprint` as the contract defines.
   Use `scripts/fingerprint.sh` for the fingerprint.
2. Run `/pr-review --tier=standard --show-nits` on the frozen target. Record each finding
   and nit, and name the style sources that `/pr-review` used.
3. Run the required repository checks, the CRAP analysis check, and the React rules check,
   as the contract's sections define them.
4. Record every finding and its disposition in the durable evidence.
5. In apply mode, hand the accepted findings to `/pr-improve`, then run steps 1 to 4 again in
   report mode. In report mode, stop after step 4.

## Completion

Write the status record defined in `references/gate-contract.md`.
Report exactly one status: `PASS`, `FAIL`, `CAPPED`, or `BLOCKED`.
