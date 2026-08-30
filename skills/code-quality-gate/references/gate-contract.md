# Code-quality-gate contract

## Modes and authority

`/code-quality-gate [--mode=report|apply] [--rounds N] [--scope path[,path]] [--disposition-json '<object>']`

## Target

This first version gates only the current checked-out branch and local working
tree. Its review set is the branch's committed changes since its frozen merge
base, plus staged, unstaged, and untracked changes. Derive `<target-slug>` from
that branch/current-local context (a sanitized branch name plus short local
`HEAD`; use a stable local `HEAD`-based slug when detached). It accepts no PR
number, remote branch, or other local branch as a target. Use `/pr-review` for
those reviews; check out the intended branch before running this gate.

- `report` is the default. It inspects and writes only generated evidence.
- `apply` permits only unambiguous, evidence-backed, behavior-preserving,
  in-scope repairs when the caller explicitly chose it or the surrounding
  implementation request already authorizes edits. It does not authorize
  commits, pushes, scope widening, broad refactors, behavior changes, or a
  structural remedy with meaningful tradeoffs. Those need a recorded human
  choice before implementation.
- `--rounds` defaults to `3`; it must be a positive integer. A cap is not
  convergence.
- `--scope` selects a subset of the frozen changed-path scope. Expand it into
  exact repository-relative paths within the worktree and write those
  NUL-delimited paths to `allowed-paths.nul`. Reject absolute paths and any
  `..` escape. An allowed scope may widen only with explicit authorization
  recorded in the evidence.
- `--disposition-json` is repeatable JSON, for example:

  ```json
  {"id":"QG-12","state":"deferred","reason":"Follow after release","owner":"frontend","follow_up":"PROJ-123"}
  ```

  Required fields by state are:

  - `accepted`: `id`, `state`. The finding is valid and remains unresolved
    until an in-scope fix is `verified`.
  - `rejected`: `id`, `state`, `reason`, `evidence`. Rejection may clear only
    that finding; it cannot suppress a related independent finding.
  - `deferred`: `id`, `state`, `reason`, `owner`, `follow_up`. It is permitted
    only for a low-impact nit.

  Store the JSON object verbatim or normalized in the evidence. Never silently
  omit a nit or treat an accepted-but-unfixed finding as resolved.

## Durable evidence

Use `.atb-work/code-quality-gate/<target-slug>/`. Ensure its parent has a
`.gitignore` containing `*`; never place these generated artifacts in tracked
source. Keep `baseline.md`, `allowed-paths.nul`, `report.md`, and (for apply mode) the
`pr-improve` ledger or a pointer to it. Start `report.md` from
`templates/code-quality-gate-report.md`.

The report frontmatter is the status interface:

```yaml
status: "PASS | FAIL | CAPPED | BLOCKED"
base_sha: "<canonical immutable merge-base commit SHA>"
head_fingerprint: "<fingerprint script output>"
scope_fingerprint: "<fingerprint script output>"
coverage: "final | partial"
allowed_paths_file: ".atb-work/code-quality-gate/<target-slug>/allowed-paths.nul"
round_bound: 3
rounds_completed: 0
```

Before assessment, write each frozen allowed path as a NUL-delimited,
repository-relative entry in `allowed-paths.nul`. With no `--scope`, it must
contain every tracked changed path and every untracked path. With `--scope`, it
contains only the selected exact paths.

Resolve the frozen merge base to its canonical commit SHA with
`git rev-parse "<base>^{commit}"`, record that SHA as `base_sha`, then run
`bash skills/code-quality-gate/scripts/fingerprint.sh --base <base_sha>
--allowed-paths-file <allowed-paths.nul>` at baseline and after every
assessment round. The script independently canonicalizes its `--base` input.
It computes:

- `head_fingerprint` by hashing the base SHA, the binary full-index diff from
  that base, and each sorted untracked path plus its `git hash-object` content
  hash. It writes no Git objects.
- `scope_fingerprint` by hashing the base SHA, sorted changed paths, sorted
  untracked paths, and sorted allowed paths.
- `coverage=final` only when the sorted allowed paths exactly equal every
  changed and untracked path; otherwise `coverage=partial`.

Rewrite the report after each assessment round. A consumer must rerun this
script and treat PASS as stale when either fingerprint differs. Only final
coverage PASS can satisfy a Dev Lite pre-PR gate; partial coverage may have its
own PASS/FAIL status but cannot satisfy `/dev-pr-review`.

## Status decision

- **PASS** — all required repository checks are green; the frozen scope is
  intact; every standards, naming, anti-slop, simplification, and
  maintainability finding is either `rejected` with required evidence,
  `deferred` as a low-impact nit with required follow-up, or `accepted` with a
  verified fix. No blocker or should-fix remains.
- **FAIL** — assessment completed but a required check failed, scope escaped,
  or any blocker, should-fix, unresolved evidence-backed quality issue, or
  undispositioned nit remains. Report mode does not edit to turn FAIL into PASS.
- **CAPPED** — apply mode reached its round bound with unresolved work. Record
  the remaining ledger rows and next owner; do not describe this as converged.
- **BLOCKED** — a necessary target, baseline, evidence source, required check,
  or authorization cannot be obtained. State the exact missing prerequisite and
  what would unblock it.

## Assessment and repair

1. Derive required checks from repository instructions, manifests, checked-in
   wrappers, CI, and changed-language conventions. Record commands, outcomes,
   and unavailable prerequisites. A check that cannot be run is BLOCKED unless
   the repository explicitly marks it non-required for this target.
2. Inspect every changed hunk against style evidence and the shared contracts.
   Run `/simplify` in report mode to identify high-conviction cleanup candidates;
   do not treat a generic-name cue as a finding without a consequence.
3. Run `/pr-review` on the frozen target with standards and maintainability in
   focus. Capture the facet outputs before normal rendering applies its
   severity/noise threshold, then retain every evidence-backed standards or
   maintainability nit in the gate record. The normal PR report remains the
   review source of truth for ordinary findings; this capture only prevents
   unrecorded nits and does not add a taxonomy.
4. For apply mode, use `/pr-improve`'s baseline, allowed-scope guard, stable
   IDs, behavior pins, rereview, and structural-escalation rules. Before any
   deletion or inlining, follow `/simplify`'s Chesterton's Fence and its rule
   that existing tests must pass unmodified. Rerun all required checks plus the
   changed-hunk assessment after each round.

Use the report table to list finding ID, source, severity, consequence,
decision, status, reason/evidence, owner/follow-up, verification, and round.
Do not make claims about whether a human or model authored the code.
