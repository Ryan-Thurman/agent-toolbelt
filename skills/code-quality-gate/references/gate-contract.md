# Code-quality-gate contract

## Target

The gate covers only the current checked-out branch and local working tree.
Its review set is the branch's committed changes since its frozen merge
base, plus staged, unstaged, and untracked changes. Derive `<target-slug>` from
that branch/current-local context (a sanitized branch name plus short local
`HEAD`, or a stable local `HEAD`-based slug when detached). It accepts no PR
number, remote branch, or other local branch as a target. Use `/pr-review` for
those reviews. Check out the intended branch before running this gate.

A path that starts with `skills/` or `shared/` is relative to the Toolbelt root. In plugin mode, put
`${CLAUDE_PLUGIN_ROOT}/` in front of it, or the absolute Toolbelt path. Run every script from the
target repository.

## Modes and authority

`/code-quality-gate [--mode=report|apply]`

No mode commits or pushes. The gate always covers the whole diff, so `coverage` is always `final`.

- `report` is the default. It inspects and writes only generated evidence.
  It does not change source, tests, configuration, or documentation.
- `apply` hands the accepted findings to `/pr-improve`. `/pr-improve` owns the frozen scope,
  the rounds, the round bound, and its ledger. The gate does not edit files itself.
  Use it only when the caller explicitly chose it or the surrounding implementation request
  already authorizes edits. It does not authorize commits, pushes, scope widening, broad
  refactors, behavior changes, or a structural remedy with meaningful tradeoffs. Those need
  a recorded human choice first. After `/pr-improve` ends, run the gate again in report mode
  and write the status from that run. If `/pr-improve` reports `capped-not-converged`, the status is `CAPPED`.

Record each decision in the report's findings table. These fields are required by state:

- `accepted`: `id`, `state`. The finding is valid and remains unresolved
  until an in-scope fix is `verified`.
- `rejected`: `id`, `state`, `reason`, `evidence`. Rejection can clear only
  that finding. It cannot suppress a related independent finding.
- `deferred`: `id`, `state`, `reason`, `owner`, `follow_up`. It is permitted
  only for a low-impact nit.

Never silently omit a nit or treat an accepted-but-unfixed finding as resolved.

## Durable evidence

Use `.atb-work/code-quality-gate/<target-slug>/`. Ensure `.atb-work/.gitignore` contains the
line `*`, as the durable-output rule in `shared/contracts/references/execution.md` requires. Never place these generated artifacts in tracked
source. Keep `baseline.md`, `allowed-paths.nul`, `report.md`, and (for apply mode) a pointer to the
`/pr-improve` ledger. Start `report.md` from `templates/code-quality-gate-report.md`.

The report frontmatter is the status interface:

```yaml
status: "PASS | FAIL | CAPPED | BLOCKED"
base_sha: "<canonical immutable merge-base commit SHA>"
head_fingerprint: "<fingerprint script output>"
coverage: "final"
allowed_paths_file: ".atb-work/code-quality-gate/<target-slug>/allowed-paths.nul"
```

Before assessment, write every tracked changed path and every untracked path as a
NUL-delimited, repository-relative entry in `allowed-paths.nul`.

Resolve the frozen merge base to its canonical commit SHA with
`git rev-parse "<base>^{commit}"`, record that SHA as `base_sha`, then run
`bash skills/code-quality-gate/scripts/fingerprint.sh --base <base_sha>` at baseline and after
the assessment. The `--allowed-paths-file <allowed-paths.nul>` argument is optional.
The script independently canonicalizes its `--base` input.
It computes `head_fingerprint` by hashing the base SHA, the binary full-index diff from
that base, and each sorted untracked path plus its `git hash-object` content
hash. It writes no Git objects. It also prints `coverage=final`.

A consumer must rerun this script with the report's `base_sha` and treat PASS as stale when
`head_fingerprint` differs. Only a PASS with `coverage: "final"` can satisfy a policy-required pre-PR gate.

## Status decision

A **pre-existing failure** is a required check that also fails at `base_sha`
with the same failure. The same failure means no new failure at head. Count the failures per
failing test name, and per lint rule ID and repository-relative path. A pair at head is new when
it is absent at base or its count is higher than at base. A lower count is not new. Compare
names, IDs, and counts, not raw output, because raw output holds machine paths and timings.
A new error of a rule that already fails in the same file is a new failure.
Run each failed required check at `base_sha` in a separate worktree, and save the output in
`baseline.md`, before you classify a failure.

The base worktree needs the same dependencies and environment as the head run. Install them
with the repository's own install command from the base lockfile. You can link the head
dependency folder when the lockfile is the same at both commits. Record the install command
and its result in `baseline.md`. A base failure that comes from a missing install or
environment is not a pre-existing failure. Mark that check `BLOCKED`, and name the missing
prerequisite.

Write the `Required checks` Result column with one of these values: `Passed`, `Failed`,
`Failed (pre-existing)`, `Skipped`, or `BLOCKED`. List each pre-existing failure in the report's
"Pre-existing failures" table, apart from the new failures. A pre-existing failure does not
change the status by itself. A check that starts but does not finish, such as a timeout,
is `BLOCKED` for that check.

- **PASS**: every required repository check is green or is a pre-existing
  failure. The frozen scope is intact. Every standards, naming, anti-slop,
  simplification, and maintainability finding is either `rejected` with
  required evidence, `deferred` as a low-impact nit with required follow-up, or
  `accepted` with a verified fix. No blocker or should-fix remains.
- **FAIL**: assessment completed but a new required-check failure, a scope
  escape, or any blocker, should-fix, unresolved evidence-backed quality issue,
  or undispositioned nit remains. Report mode does not edit to turn FAIL into
  PASS.
- **CAPPED**: apply mode ended with `/pr-improve` reporting `capped-not-converged`. Record
  the remaining ledger rows and next owner. Do not describe this as converged.
- **BLOCKED**: a necessary target, baseline, evidence source, required check,
  or authorization cannot be obtained. State the exact missing prerequisite and
  what unblocks it.

**Precedence:** FAIL outranks BLOCKED. A confirmed new failure makes the status
FAIL even when another required check is BLOCKED. The rationale names both. The
status is BLOCKED only when no new failure is confirmed.

## Assessment and apply

1. Derive required checks from repository instructions, manifests, checked-in
   wrappers, CI, and changed-language conventions. Record commands, outcomes,
   and unavailable prerequisites. A check that cannot be run is BLOCKED unless
   the repository explicitly marks it non-required for this target. The CRAP
   check below is a required check when its config exists on the base.
2. Run `/pr-review --tier=standard --show-nits` on the frozen target. `/pr-review` loads the
   project style sources itself. The gate names the standard tier, so the depth does not change
   with the size of the diff. `--show-nits` keeps every nit that the posting threshold hides.
   Record every evidence-backed finding and nit from every facet of that review, including
   the tests and correctness facets, in the gate record. Give each nit a disposition.
   Add one line that names the style sources `/pr-review` used.
   The PR report remains the review source of truth for the finding text.
3. For apply mode, pass the accepted findings to `/pr-improve`. Then rerun all required checks
   and this assessment in report mode.

Use the report table to list finding ID, source, severity, consequence,
decision, status, reason/evidence, owner/follow-up, and verification.
Do not make claims about whether a human or model authored the code.

## CRAP analysis check

CRAP (Change Risk Anti-Patterns) combines complexity and coverage into one risk score.
The `crap-analysis` skill runs the repository's own CRAP commands.

1. Look for `.crap-analysis.json` or `.agents/crap-analysis.json` at `<base_sha>` with `git cat-file -e`.
   Accept `.atb/crap-analysis.json` for existing base commits.
2. If no configuration file exists, add one `Required checks` row with result `Skipped`.
   Use this evidence text: `No .crap-analysis.json on the base branch.` Then continue the gate.
3. If `skills/crap-analysis/bin/crap-analysis.sh` is not installed, record BLOCKED.
   Name the missing `crap-analysis` pack as the unblocker.
4. Run these commands in sequence, and wait for each to exit:

   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh execute --changed --coverage --base <base_sha>
   bash skills/crap-analysis/bin/crap-analysis.sh review --base <base_sha>
   ```

   `--base <base_sha>` makes the CRAP config and changed paths use the frozen base.
   An `execute` exit code of `1` is not a check failure. The `review` outcome decides.
5. Run `skills/code-quality-gate/scripts/fingerprint.sh` again with the same arguments.
   If the fingerprint changed, the CRAP commands wrote a path that git does not ignore.
   Record BLOCKED, and name the new paths from `git status --porcelain`.
6. Record the review JSON `outcome`, and each target outcome, threshold, and `worstInScope`, as `Required checks` evidence.
   If `config.changedInDiff` is `true`, also record the `CONFIG_CHANGE` line from the crap-analysis review contract.
7. Apply the review outcome:

   | Review outcome | Gate effect |
   |---|---|
   | `PASS`, `WARN`, or `NO_TARGETS` | The check passes. `WARN` failures are outside the frozen scope. |
   | `REFACTOR` | The check passes. Record one `should-fix` finding with source `crap-analysis` for each `REFACTOR` target. Cite its `worstInScope` and `refactorBrief`. |
   | `ERROR` | The check fails. Cite `error.command`, `error.exitCode`, and `error.reason`. |

## React rules check

1. Run the scan from `shared/contracts/references/typescript-react-baseline.md`
   with `--base <base_sha>`. If the scanner is not installed, record BLOCKED and
   name the `code-quality-gate` reinstall as the unblocker.
2. If `react_files` is empty, add one `Required checks` row with result `Skipped`.
   Use this evidence text: `No React files changed.`
3. Otherwise, read every listed rule. Record each one in the durable evidence as
   `Applied` or `Not applicable` with a one-line reason.
4. Record one `Required checks` row: `React rules: N listed · N applied · N not applicable`.
   Name any `missing` specialist in the evidence. A missing specialist does not fail the check.
5. Record one finding with source `react-rule-scan` for each violation of an applied rule
   in an allowed path. Set its severity with `shared/contracts/references/react-acceptance.md`.
   A listed rule without a record fails the check.
