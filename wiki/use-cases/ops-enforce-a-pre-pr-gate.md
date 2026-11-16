# Enforce a pre-PR gate on every branch

This page is for a tech lead whose policy says every pull request passes a quality gate. You get one status for the checked-out branch: `PASS`, `FAIL`, `CAPPED`, or `BLOCKED`. You also get a folder of evidence and a way to see when the status is stale. The sample run ends `PASS`. Two required checks were already red on the base commit, and the gate lists them as pre-existing failures, apart from new ones.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`code-quality-gate`](../../skills/code-quality-gate/SKILL.md) (`/code-quality-gate --mode=report`) | No levels. The gate runs `/pr-review` at the standard tier. `/pr-improve` bounds the repair rounds in apply mode. | A branch that is checked out in a local clone. The repository dependencies installed. Whatever the repository tests need, such as a database. |

## Quick path

1. Check out the branch to gate: `git switch <branch>`. Install the dependencies and set the environment that the repository tests need.
2. Start Claude Code in the repository root with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
3. Run the gate in report mode: `/agent-toolbelt:code-quality-gate --mode=report`.
4. Open `.atb-work/code-quality-gate/<target-slug>/report.md`. The slug is the sanitized branch name plus the short head commit (`copy-clearer-403-messages-e814f59` in the sample). Read `status` and `coverage` in the header, then the "Required checks" and "Pre-existing failures" tables.
5. Count only `status: "PASS"` with `coverage: "final"` as a pass. If the status is `FAIL` or `BLOCKED`, read "Status rationale". `FAIL` means a new failure or an open finding. A check that fails the same way on the base does not set `FAIL`.
6. Before you open the pull request, run `bash <toolbelt-folder>/skills/code-quality-gate/scripts/fingerprint.sh --base <base-sha>` from the repository root. Use the `base_sha` value of the report header. Compare the output with `head_fingerprint` (step 9 has the path for an installed copy). If it differs, the status is stale. Run the gate again.

You get one status record and the evidence behind it. The status stays valid only while the branch is unchanged. The evidence folder is ignored by git, so it is not part of the pull request. To show the status to a reviewer, copy `report.md` into the pull request description. That hand-off is practice, not a skill step.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma as the database layer, Jest for tests). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run used commit 30b68e1 as the base.

The run added one commit, e814f59, on the branch `copy/clearer-403-messages`. The commit message is "copy: clearer 403 messages for article and comment owners". It changes three message strings in `src/app/routes/article/article.service.ts`. Each string sits in a branch that returns status 403 to a user who does not own the article or comment. For example, "You are not authorized to update this article" becomes "You can only update your own articles".

Your policy says that every pull request passes the gate before it opens. The sample has no `AGENTS.md`, `CLAUDE.md`, or `.pr-review.md`, so the run counts as a user request for the gate. You must decide if this branch can open a pull request.

## Why this path

The obvious alternative is to open the pull request and run `/pr-review <pr-number>`. The review is the same skill that the gate calls. The cost is that the pull request is already visible to your reviewers. The review also gives findings only. It runs no repository check and writes no status record with a fingerprint that you can show later. `SKILL.md` splits the work in the same way: `/pr-review` owns findings and `/pr-improve` owns the fix loop.

The second alternative is `/review-diff`, which reviews your local branch before you push. It never posts. It also gives findings only, with no required checks and no status record. Use it when no policy calls for a gate. The page [Self-review before a pull request](dev-self-review-before-a-pr.md) covers it.

The gate has this order because each step limits the next one:

- It freezes the base commit, the changed paths, and the head fingerprint (a hash of the base commit, the diff, and the untracked files) first. A later change to the branch then makes the status stale.
- It runs `/pr-review --tier=standard --show-nits` next. One call gives the findings and the nits. `/pr-review` loads the style sources itself, and the contract allows a style finding only for a policy violation or a concrete consequence.
- It runs the required checks after that, and writes every finding with its decision.
- In report mode it stops there. The contract says that report mode does not edit to turn `FAIL` into `PASS`.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all code-quality-gate /path/to/project`. | The command must exist in your session. The install script also adds `pr-review`, `pr-improve`, and `crap-analysis`, which the gate calls. | You type `/` and see `/agent-toolbelt:code-quality-gate` (plugin) or `/code-quality-gate` (installed copy). |
| 2 | Check out the branch: `git switch <branch>`. In the sample: `git switch copy/clearer-403-messages`. Run `git status`. | The gate accepts no PR number, remote branch, or other local branch. It reviews the branch commits since the merge base (the commit where the branch left the target branch), plus staged, unstaged, and untracked changes. | `git branch --show-current` prints the branch, and `git status` lists only changes that you want in the gate. |
| 3 | Install the dependencies. Export the environment values that the tests need before you start the agent. In the sample: `export DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x`, then `npm ci --ignore-scripts`, then `npx prisma generate`. | The gate runs the checks that the repository requires. A check that cannot start, or starts and does not finish (a timeout), is `BLOCKED`, unless the repository marks it non-required. | The test and lint commands of the repository start in your shell. The sample run had no database. 7 tests started and failed at the connection. That is a failed check, not `BLOCKED`. The same 7 fail on the base, so they are pre-existing. If a new failure and a `BLOCKED` check exist together, `FAIL` outranks `BLOCKED`. |
| 4 | Run `/agent-toolbelt:code-quality-gate --mode=report`. | Report mode is the default. It writes only generated evidence and changes no source, test, configuration, or documentation file. The skill gives no step that asks a question in report mode. The headless run asked none. | The agent names one status and the path of `report.md`. |
| 5 | Open the report header. Read `status`, `base_sha`, `head_fingerprint`, and `coverage`. | The contract calls the header the status interface. `coverage` is always `final`, because the gate covers the whole diff. | You can say which base the status is for. |
| 6 | Read the "Required checks" and "Pre-existing failures" tables. For each failed check, open `baseline.md`. It holds the run of the same command at the base commit. | The contract requires this base run in a separate worktree (a second working folder of the same repository: `git worktree add <folder> <base-sha>`). A check that fails the same way on the base (same test names, or same lint rule IDs at the same paths) is pre-existing. It does not set the status, and the owner of the fix is different. Install the dependencies in the worktree first. The contract does not say how. | Each failed row says if the failure is new or also exists on the base. The sample run gave the same 33 lint errors and the same 7 test failures on both commits. |
| 7 | Read "Findings and dispositions". For each finding, read the decision (`accepted`, `rejected`, or `deferred`) and its reason. | Every standards, naming, anti-slop, simplification, and maintainability finding needs a decision. The contract says to never omit a nit. A `deferred` nit needs a reason, an owner, and a follow-up. | Each finding has a decision, or the table says that there are none. |
| 8 | Read "Status rationale". Act on its "Remaining work or unblocker" line. | The template has fields for the unblocker and the next owner. | You know who does what next, or the status is `PASS` with `coverage: "final"`. |
| 9 | Before you open the pull request, start in the repository root and run `bash <script> --base <base-sha>`. For `<script>`, use `<toolbelt-folder>/skills/code-quality-gate/scripts/fingerprint.sh` in plugin mode, or `.agents/skills/code-quality-gate/scripts/fingerprint.sh` in the project after `install.sh`. Compare the value with the report. | The contract says to run every script from the target repository, with the Toolbelt path in front in plugin mode. It says to treat `PASS` as stale when the fingerprint differs. | The value equals the report header. If it differs, run the gate again. |

## Decision points

- The gate always covers the whole diff. Only a `PASS` with `coverage: "final"` can satisfy a policy-required gate.
- If no policy, request, or risk of the change calls for a gate, skip it. Use `/review-diff` for findings.
- If a required check fails on the base commit too, as in this run, the contract lists it as a pre-existing failure, and it does not set the status. The red check stays open for its owner. Fixing it on the base is a separate change.
- Stop when `git diff <base>...HEAD` is empty. There is nothing to gate. This is practice, not a contract rule.
- If the status is `BLOCKED`, supply the prerequisite that the report names and run the gate again. A missing `crap-analysis` pack and a missing React rule scanner are examples that the contract gives.
- If the status is `FAIL` because of a finding, decide who fixes it. Run `/code-quality-gate --mode=apply` only when you authorize edits. Apply mode hands the accepted findings to `/pr-improve`, which owns the scope, the rounds, and its ledger. The gate then runs again in report mode. It never commits or pushes. If `/pr-improve` reports `capped-not-converged`, the status is `CAPPED`, which is not a pass.
- If a finding is a nit, the gate still needs a decision. A `deferred` decision needs a reason, an owner, and a follow-up.
- Stop when the status is `PASS` with `coverage: "final"` and the fingerprint still matches the branch. Also stop when you know the cause and the owner of each `FAIL` or `BLOCKED` row.
- Choose [Set up one quality command](lead-set-up-quality-rails.md) when the repository has no single command for its checks.
- Choose [Gate each phase](ops-gate-each-phase.md) when the gate belongs to each phase of a phased delivery, not to one branch.
- Choose [Review every pull request on open](ops-review-every-pr-on-open.md) when the review must start when the pull request opens, with no person to run it.

## What you get

The run was headless. No person answered. The host had no sub-agent tool, so the run followed the Self-review path of `/pr-review`: one agent ran the facets (correctness, tests, standards, and maintainability) one after the other, with an inline critic pass. The report says `Self-review: facets not independent`. With sub-agents, each facet runs apart. The gate names the tier, so the review depth does not follow the size of the diff.

The status is one of four values. The contract defines them as follows.

| Status | Meaning in the contract |
| --- | --- |
| `PASS` | Every required check is green or is a pre-existing failure, and the scope is intact. Each finding is rejected with evidence, deferred as a low-impact nit with a follow-up, or accepted with a verified fix. No blocker or should-fix remains. |
| `FAIL` | The assessment finished, but a new required-check failure, a scope escape, a blocker, a should-fix, an unresolved quality issue, or a nit with no decision remains. |
| `CAPPED` | Apply mode ended with `/pr-improve` reporting `capped-not-converged`. |
| `BLOCKED` | A target, baseline, evidence source, required check, or authorization cannot be obtained. |

First, the status record. It is the header of `report.md`.

Excerpt from a run on the Conduit sample API at commit e814f59 (base 30b68e1). The line `allowed_paths_file` is left out because it is long. It names `allowed-paths.nul` in the evidence folder.

```yaml
status: "PASS"
base_sha: "30b68e1e881462b2f4164ea09ab4c4f5699c7b0b"
head_fingerprint: "7b8f75daccc83fc98d677b18bf230dec9c40345d"
coverage: "final"
```

An earlier run on the same change, with a different commit hash (057bf6c), gave the same `head_fingerprint`. The value covers the base and the diff, not the commit. A rebuilt commit with the same diff keeps a `PASS` valid.

The evidence folder is `.atb-work/code-quality-gate/<target-slug>/`. The contract names `.atb-work/.gitignore`, which contains `*`, so git ignores all generated files, and `git status` stayed clean.

Excerpt from a run on the Conduit sample API at commit e814f59. Condensed from four listings. Blank lines separate them: the folder `.atb-work`, the folder `.atb-work/code-quality-gate`, its slug folder, and the `checks` folder inside the slug folder.

```text
.gitignore
code-quality-gate
pr-review

copy-clearer-403-messages-e814f59

allowed-paths.nul
baseline.md
checks
fingerprint-baseline.txt
report.md

coverage
crap-config-lookup.txt
eslint-base.txt
eslint-head.txt
fingerprint-after-checks.txt
jest-article-coverage.txt
jest-base.txt
jest-head.txt
react-rule-scan.json
tsc-app-head.txt
tsc-spec-head.txt
```

The contract names `baseline.md`, `allowed-paths.nul`, and `report.md`. The review report sits in `.atb-work/pr-review/`. The other files are the run's own saved check output.

Now the "Required checks" table. CRAP (Change Risk Anti-Patterns) combines complexity and test coverage into one risk score. Two rows failed.

Excerpt from a run on the Conduit sample API at commit e814f59. Condensed from the run report: the columns "Required because" and "Evidence" are left out. The text of the columns that remain is verbatim.

| Command | Result |
|---|---|
| `npx jest` (the `test` script runs `nx test`. Run directly so Nx writes no cache into the shared `node_modules`) | Failed (pre-existing) |
| `npx eslint src` (the `lint` target of `project.json`) | Failed (pre-existing) |
| `npx tsc --noEmit -p tsconfig.app.json` and `-p tsconfig.spec.json` | Passed |
| CRAP analysis (`crap-analysis`) | Skipped |
| React rules | Skipped |
| `fingerprint.sh` after all checks | Passed |

The text `Failed (pre-existing)` is the run's own choice. The contract names the "Pre-existing failures" table and no Result value. The CRAP row has the text that the contract prescribes: `No .crap-analysis.json on the base branch.` The React row has `No React files changed.`

The base comparison sits in `baseline.md`. The run compared failing test names and lint rule IDs with their paths, not raw output, because raw output holds machine paths.

Excerpt from a run on the Conduit sample API at commit e814f59. Condensed from `baseline.md`: the `tsc` rows are left out. The text of the other cells is verbatim.

| Check | Base | Head | Same failure |
|---|---|---|---|
| `npx jest` | 7 failed, 19 passed, 1 todo (27 tests). All 7 in `auth.service.test.ts`. | Same counts. Same 7 test names. | Yes |
| `npx eslint src` | 33 errors, 0 warnings | 33 errors, 0 warnings. 33 of 33 pairs of rule ID and path match. | Yes |

The summary lines of the two commands, from `checks/jest-head.txt` and `checks/eslint-head.txt`, are these.

Excerpt from a run on the Conduit sample API at commit e814f59. Each line is the summary line of its command output. Other lines follow it in the file.

```text
Tests:       7 failed, 1 todo, 19 passed, 27 total
✖ 33 problems (33 errors, 0 warnings)
```

All 7 test failures print `Can't reach database server at localhost:5432`. The cause is the import order in `auth.service.test.ts`: it loads the service before the Prisma mock, so the real client loads. The 7 tests ran and failed at the connection. They fail at the database call, so the run shows nothing about the behavior they test. 14 of the 33 lint errors are in the changed file. None is on a changed line (309 to 314, 403 to 408, and 548 to 553).

The review found no blocker and no should-fix. It found one nit, from the tests facet. The gate record gives it a decision.

Excerpt from a run on the Conduit sample API at commit e814f59. Lines are wrapped. The `/pr-review` report is `.atb-work/pr-review/copy-clearer-403-messages-e814f59.md`, and the second block is the findings row of `report.md`.

```markdown
## PR Review — local branch copy/clearer-403-messages  ·  tier: standard (explicit)  ·  **APPROVE**
Head: e814f59d9ca2e340b259e0c6e2448560f2b325d8
...
### 💡 Suggestions / nits (1)
- **src/app/routes/article/article.service.ts:312, 406, 551** — The three
  403 branches run in no test (tests facet, nit, confidence 0.55). ...
```

```markdown
| N-1 | `/pr-review` tests facet | nit (low) | The three 403 branches
  run in no test, so a typo in the new text passes the suite. | deferred
  | deferred | Low-impact: the branches had no test before the change,
  and the change adds no logic. ... | Owner: the branch author.
  Follow-up: add one test per 403 branch in a separate change. | n/a |
```

The run chose to disposition this nit in the gate record. The contract lists standards and maintainability findings and nits, and it points to the PR report for other findings. It does not say if a tests-facet nit needs a decision.

Last, the rationale. It explains the verdict by both failed checks, and it names what stays open.

Excerpt from a run on the Conduit sample API at commit e814f59. Lines are wrapped.

```markdown
- Status: PASS
- Reason: both failed required checks are pre-existing failures (same
  test names, same lint rule IDs at the same paths on `30b68e1`), so
  they do not change the status. No new failure. The scope is intact.
  The one nit has a deferral with owner and follow-up. No blocker or
  should-fix remains.
- Remaining work or unblocker: none for this gate. The pre-existing
  red checks stay open for the repository owner.
```

The gate gave `PASS` for a three-line copy change. Two failures stay red, and the branch did not cause them. The earlier version of the gate gave `FAIL` for the same change, because it had no rule that separates failures on the base from new ones.

## Not exercised

Each item names the evidence that verifies it.

- The behavior that the 7 database tests check. Evidence: a run of `npx jest` with a database, where the 7 pass or fail on their assertions.
- `nx build`. The run used `tsc --noEmit` for the app and spec configurations instead. This substitution was the run's choice. Evidence: a `nx build` exit code in the evidence folder.
- Apply mode, `/pr-improve`, and the CRAP commands. No `.crap-analysis.json` exists on the base. Evidence: an apply run with the `/pr-improve` ledger pointer, and the `review` outcome of `crap-analysis` for a base that has the config.
- Independent facet sub-agents, and a `BLOCKED` status. The `FAIL` over `BLOCKED` order is read in the contract, not run. Evidence: a run on a host with sub-agents, and a run with one new failure and one blocked check.
- A search of other repositories for clients that match the old 403 text. No file in the repository contains the old text. With `article.service.test.ts` alone, the three changed lines run in no test (`checks/jest-article-coverage.txt` shows 5 tests pass). Evidence: a search result from the client repositories.
- A pull request that opens after the gate, and a reviewer who reads the pasted `report.md`. Evidence: the pull request itself.

## What to check in the output

- `coverage` is `final` when the policy covers the whole pull request.
- Each failed row in "Required checks" says if the failure is new or exists on the base.
- The `base_sha` is the merge base that you expect, and the fingerprint still matches when you open the pull request.
- Skipped rows give the contract text as the reason. A blank cell does not mean a passed check.

## Common mistakes

- You pass a pull request number or a remote branch to the gate. The gate accepts no such target. Check out the branch, or use `/pr-review` for that target.
- You show an old `PASS` after you added a commit. `head_fingerprint` changes with any change to the diff, also a new commit in a file that was already changed. The `PASS` is stale when the value differs. Run the gate again.
- You expect report mode to repair the branch. It edits nothing, and a `FAIL` stays a `FAIL` until the checks or the policy change.
- You skip `baseline.md` and blame the branch for a red check. In this run, the base commit gave the same lint rule IDs and the same 7 test failures.
- You read a `PASS` as "all checks are green". The pre-existing failures stay red, and the report lists them in their own table.
- You read `CAPPED` as a pass. A cap means that `/pr-improve` ended with work left.
- You expect the gate to commit or push. No mode of the gate does either.

## Next

- [Self-review before a pull request](dev-self-review-before-a-pr.md): when you want findings without a status record.
- [Set up one quality command](lead-set-up-quality-rails.md): when the repository lacks one command for its checks, so the gate has no clear required checks.
- [Gate each phase](ops-gate-each-phase.md): when a phased delivery needs a review at each phase boundary.
- [Review every pull request on open](ops-review-every-pr-on-open.md): when the review must start when the pull request opens.
- [Clean up after a feature](dev-clean-up-after-a-feature.md): when you want cleanups applied, not only reported.
