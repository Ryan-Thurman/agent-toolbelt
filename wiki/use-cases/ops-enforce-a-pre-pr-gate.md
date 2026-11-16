# Enforce a pre-PR gate on every branch

This page is for a tech lead whose policy says every pull request passes a quality gate. You get one status for the checked-out branch: `PASS`, `FAIL`, `CAPPED`, or `BLOCKED`. You also get a folder of evidence and a way to see when the status is stale. The sample run ends `FAIL`, because two required checks were already red on the base commit. The run predates the pre-existing failure rule. Under the current contract, those two checks are pre-existing failures, and only a new failure sets `FAIL`. The run also predates the right-sizing change of the gate. The excerpts below keep the run's text verbatim. That text names `scope_fingerprint`, `round_bound`, `rounds_completed`, `--scope`, and a separate `/simplify` pass. The current gate has none of them. It has one `head_fingerprint` and one `/pr-review --tier=standard --show-nits` call.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`code-quality-gate`](../../skills/code-quality-gate/SKILL.md) (`/code-quality-gate --mode=report`) | No levels. The gate runs `/pr-review` at the standard tier. `/pr-improve` bounds the repair rounds in apply mode. | A branch that is checked out in a local clone. The repository dependencies installed. Whatever the repository tests need, such as a database. |

## Quick path

1. Check out the branch to gate: `git switch <branch>`. Install the dependencies and set the environment that the repository tests need.
2. Start Claude Code in the repository root with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
3. Run the gate in report mode: `/agent-toolbelt:code-quality-gate --mode=report`.
4. Open `.atb-work/code-quality-gate/<target-slug>/report.md`. The slug is the branch name plus the short head commit. Read `status` and `coverage` in the header, then the "Required checks" table.
5. Count only `status: "PASS"` with `coverage: "final"` as a pass. If the status is `FAIL` or `BLOCKED`, run each failed command again at the base commit (steps 6 and 8) and read "Decision points" before you act. The run predates the pre-existing failure rule. Under the current contract, a check that already fails on the base does not set `FAIL` by itself.
6. Before you open the pull request, run `fingerprint.sh` from the repository root and compare the value with the report header (step 9). If it differs, the status is stale. Run the gate again.

You get one status record and the evidence behind it. The status stays valid only while the branch is unchanged. The evidence folder is ignored by git, so it is not part of the pull request. To show the status to a reviewer, copy `report.md` into the pull request description. That hand-off is practice, not a skill step.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma as the database layer, Jest for tests). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run used commit 30b68e1 as the base.

The run added one commit, 057bf6c, on the branch `copy/clearer-403-messages`. The commit message is "copy: clearer 403 messages for article and comment owners". It changes three message strings in `src/app/routes/article/article.service.ts`. Each string sits in a branch that returns status 403 to a user who does not own the article or comment. For example, "You are not authorized to update this article" becomes "You can only update your own articles".

Your policy says that every pull request passes the gate before it opens. The sample has no `AGENTS.md`, `CLAUDE.md`, or `.pr-review.md`, so the run counts as a user request for the gate. You must decide if this branch can open a pull request.

## Why this path

The obvious alternative is to open the pull request and run `/pr-review <pr-number>`. The review is the same skill that the gate calls for its style review. The cost is that the pull request is already visible to your reviewers. The review also gives findings only. It runs no repository check and writes no status record with fingerprints that you can show later. `SKILL.md` splits the work in the same way: `/pr-review` owns findings and `/pr-improve` owns the fix loop.

The second alternative is `/review-diff`, which reviews your local branch before you push. It never posts. It also gives findings only, with no required checks and no status record. Use it when no policy calls for a gate. The page [Self-review before a pull request](dev-self-review-before-a-pr.md) covers it.

The gate has this order because each step limits the next one:

- It freezes the base commit, the changed paths, and the head fingerprint (a hash of the diff and the untracked files) first. A later change to the branch then makes the status stale.
- It runs `/pr-review --tier=standard --show-nits` next. `/pr-review` loads the style sources itself, and the contract allows a style finding only for a policy violation or a concrete consequence.
- It runs the required checks after that, and writes every finding with its decision.
- In report mode it stops there. The contract says that report mode does not edit to turn `FAIL` into `PASS`.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all code-quality-gate /path/to/project`. | The command must exist in your session. The install script also adds `pr-review`, `pr-improve`, and `crap-analysis`, which the gate calls. | You type `/` and see `/agent-toolbelt:code-quality-gate` (plugin) or `/code-quality-gate` (installed copy). |
| 2 | Check out the branch: `git switch <branch>`. In the sample: `git switch copy/clearer-403-messages`. Run `git status`. | The gate accepts no PR number, remote branch, or other local branch. It reviews the branch commits since the merge base (the commit where the branch left the target branch), plus staged, unstaged, and untracked changes. | `git branch --show-current` prints the branch, and `git status` lists only changes that you want in the gate. |
| 3 | Install the dependencies. Export the environment values that the tests need before you start the agent. In the sample: `export DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x`, then `npm ci --ignore-scripts`, then `npx prisma generate`. | The gate runs the checks that the repository requires. A check that cannot run makes the status `BLOCKED`, unless the repository marks it non-required. | The test and lint commands of the repository start in your shell. If a prerequisite is missing, read the Evidence cell of the row. In this run, a check that ran and failed for a missing database was recorded as `Failed`. By the contract, a check that cannot start is `BLOCKED`. The current contract also makes a check that starts and does not finish, such as a timeout, `BLOCKED`, and `FAIL` outranks `BLOCKED`. The sample run had no database, and 7 tests failed. |
| 4 | Run `/agent-toolbelt:code-quality-gate --mode=report`. | Report mode is the default. It writes only generated evidence and changes no source, test, configuration, or documentation file. The skill gives no step that asks a question in report mode. The headless run asked none. | The agent names one status and the path of `report.md`. |
| 5 | Open the report header. Read `status`, `base_sha`, `head_fingerprint`, and `coverage`. | The contract calls the header the status interface. `coverage` is always `final`, because the gate covers the whole diff. | You can say which commit the status is for. |
| 6 | Read the "Required checks" table. For each row with the result `Failed`, run the same command at the base commit. Check out `<base-sha>` in a separate worktree (a second working folder of the same repository: `git worktree add <folder> <base-sha>`) and install the dependencies there. | The run's contract had no rule for a check that fails on the base. The current contract requires this base run, saves its output in `baseline.md`, and lists such a check in the "Pre-existing failures" table of the report. A failure that exists on the base is not caused by this branch, and the owner of the fix is different. This comparison is practice, not a skill step. | Each failed row says if the failure is new or also exists on the base. The sample run gave identical lint output on both commits and the same 7 test failures on both commits. |
| 7 | Read "Findings and dispositions". For each finding, read the decision (`accepted`, `rejected`, or `deferred`) and its reason. | Every standards, naming, anti-slop, simplification, and maintainability finding needs a decision. A nit must have a decision or a follow-up. | Each finding has a decision, or the table says that there are none. |
| 8 | Read "Status rationale". Act on its "Remaining work or unblocker" line. | The template has fields for the unblocker and the next owner. | You know who does what next, or the status is `PASS` with `coverage: "final"`. |
| 9 | Before you open the pull request, start in the repository root and run `bash <script> --base <base-sha>`. For `<script>`, use `<toolbelt-folder>/skills/code-quality-gate/scripts/fingerprint.sh` in plugin mode, or `.agents/skills/code-quality-gate/scripts/fingerprint.sh` in the project after `install.sh`. Compare the value with the report. | The run's contract gave the script path relative to the Toolbelt root, so it fails in the target repository. The current contract puts `${CLAUDE_PLUGIN_ROOT}/` in front of that path in plugin mode. The contract says to treat `PASS` as stale when the fingerprint differs. | The value equals the report header. If it differs, run the gate again. |

## Decision points

- The gate always covers the whole diff. Only a `PASS` with `coverage: "final"` can satisfy a policy-required gate.
- If no policy, request, or risk of the change calls for a gate, skip it. Use `/review-diff` for findings.
- If a required check fails on the base commit too, as in this run, the current contract lists it as a pre-existing failure, and it does not set `FAIL` by itself. The run's contract had only one exit: the repository marks the check non-required for the target. It does not name the file. Fixing the red check on the base is the other practical exit. This run tried neither exit.
- Stop when `git diff <base>...HEAD` is empty. There is nothing to gate. This is practice, not a contract rule.
- If the status is `BLOCKED`, supply the prerequisite that the report names and run the gate again. A missing `crap-analysis` pack and a missing React rule scanner are examples that the contract gives.
- If the status is `FAIL` because of a finding, decide who fixes it. Run `/code-quality-gate --mode=apply` only when you authorize edits. Apply mode hands the accepted findings to `/pr-improve`, which owns the scope, the rounds, and its ledger. The gate then runs again in report mode. It never commits or pushes. If `/pr-improve` reports `capped-not-converged`, the status is `CAPPED`, which is not a pass.
- If a finding is a nit, the gate still needs a decision. A `deferred` decision needs a reason, an owner, and a follow-up.
- Stop when the status is `PASS` with `coverage: "final"` and the fingerprint still matches the branch. Also stop when you know the cause and the owner of each `FAIL` or `BLOCKED` row.
- Choose [Set up one quality command](lead-set-up-quality-rails.md) when the repository has no single command for its checks.
- Choose [Gate each phase](ops-gate-each-phase.md) when the gate belongs to each phase of a phased delivery, not to one branch.
- Choose [Review every pull request on open](ops-review-every-pr-on-open.md) when the review must start when the pull request opens, with no person to run it.

## What you get

The run was headless. No person answered and no subagent started. The run did a `/simplify` pass and a `/pr-review --focus=standards,maintainability --show-nits` pass itself and labeled both Self-review (one agent, no separate reviewer). The run's contract set no review tier. The current contract has one call, `/pr-review --tier=standard --show-nits`, and no `/simplify` pass. By the rules in `auto-tier.md`, a diff of this size gets the light tier (one review pass, the lowest effort level). That is a reading of the rules. The run did not start a tier.

The status is one of four values. The contract defines them as follows.

| Status | Meaning in the contract |
| --- | --- |
| `PASS` | All required checks are green and the scope is intact. Each finding is rejected with evidence, deferred as a low-impact nit with a follow-up, or accepted with a verified fix. No blocker or should-fix remains. |
| `FAIL` | The assessment finished, but a required check failed, the scope escaped, or a blocker, a should-fix, an unresolved quality issue, or a nit with no decision remains. |
| `CAPPED` | Apply mode ended with `/pr-improve` reporting `capped-not-converged`. |
| `BLOCKED` | A target, baseline, evidence source, required check, or authorization cannot be obtained. |

First, the status record. It is the header of `report.md`.

Excerpt from a run on the Conduit sample API at commit 057bf6c (base 30b68e1). The line `allowed_paths_file` is left out because it is long. It names `allowed-paths.nul` in the evidence folder.

```yaml
status: "FAIL"
base_sha: "30b68e1e881462b2f4164ea09ab4c4f5699c7b0b"
head_fingerprint: "7b8f75daccc83fc98d677b18bf230dec9c40345d"
scope_fingerprint: "eb5b2f61a964b9d98020f418f1090dfd8eea0e50"
coverage: "final"
round_bound: 3
rounds_completed: 1
```

The evidence folder is `.atb-work/code-quality-gate/<target-slug>/`. The run's contract put the `.gitignore` in the parent folder. The current contract names `.atb-work/.gitignore`, which contains `*`, so git ignores all generated files. The run wrote `rounds_completed: 1` in report mode. The current contract has no round fields. The slug is the branch name plus the short head commit.

Excerpt from a run on the Conduit sample API at commit 057bf6c. Condensed from three listings. Blank lines separate them: the folder `.atb-work/code-quality-gate`, then its slug folder `copy-clearer-403-messages-057bf6c`, then the `checks` folder inside the slug folder.

```text
.gitignore
copy-clearer-403-messages-057bf6c

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

The contract names `baseline.md`, `allowed-paths.nul`, and `report.md`. The other files are the run's own saved check output.

Now the "Required checks" table. CRAP (Change Risk Anti-Patterns) combines complexity and test coverage into one risk score. Two rows failed.

Excerpt from a run on the Conduit sample API at commit 057bf6c. Condensed from the run report: the columns "Required because" and "Evidence" are left out. The text of the columns that remain is verbatim.

| Command | Result |
|---|---|
| `npx jest` (the `test` script runs `nx test`. Run directly so Nx writes no cache into the shared `node_modules`) | Failed |
| `npx eslint src` (the `lint` target of `project.json`) | Failed |
| `npx tsc --noEmit -p tsconfig.app.json` and `-p tsconfig.spec.json` | Passed |
| CRAP analysis (`crap-analysis`) | Skipped |
| React rules | Skipped |
| `fingerprint.sh` after all checks | Passed |

The evidence cells say why. The CRAP row has the text that the contract prescribes: `No .crap-analysis.json on the base branch.` The React row has `No React files changed.` The two failed rows need a comparison with the base commit.

Excerpt from a run on the Conduit sample API at commit 057bf6c. This is the table in `baseline.md`, verbatim.

| Check | Base | Head |
|---|---|---|
| `npx jest` | 7 failed, 19 passed, 1 todo (27 tests). All failures in `auth.service.test.ts`. | Same counts, same file. |
| `npx eslint src` | 33 errors, 0 warnings | Same 33 errors (output identical) |

The summary lines of the two failed commands, from `checks/jest-head.txt` and `checks/eslint-head.txt`, are these.

Excerpt from a run on the Conduit sample API at commit 057bf6c. Each line is the summary line of its command output. Other lines follow it in the file.

```text
Tests:       7 failed, 1 todo, 19 passed, 27 total
✖ 33 problems (33 errors, 0 warnings)
```

All 7 test failures print `Can't reach database server at localhost:5432`. The 7 tests ran and failed at the database connection. Their assertions were not reached, so the run shows nothing about the behavior they test. The lint errors have a different cause: the repository has them already. 14 of the 33 are in the changed file. None is on a changed line (309 to 314, 403 to 408, and 548 to 553).

The findings table has no finding. The run labeled each source row Self-review. This row format is the run's own choice, because the template has no format for an empty result.

Excerpt from a run on the Conduit sample API at commit 057bf6c. Lines are wrapped, and `...` marks skipped text.

```markdown
| none | `/simplify` (report mode, Self-review) | n/a | n/a | n/a | n/a |
  No candidate with a named consequence in the three changed hunks. ...
| none | `/pr-review --focus=standards,maintainability --show-nits`
  (light tier, Self-review) | n/a | n/a | n/a | n/a | No standards or
  maintainability finding and no nit in the changed lines. ...
```

Last, the rationale. It explains the verdict by both failed checks, and it names the owner.

Excerpt from a run on the Conduit sample API at commit 057bf6c. Lines are wrapped, and `...` marks skipped text.

```markdown
- Status: FAIL
- Reason: the assessment finished, and two required checks failed
  (`npx jest`, `npx eslint src`). The changed hunks have no finding.
  Both failures exist unchanged on the base commit, and neither
  touches the changed lines.
- Remaining work or unblocker: (1) Give the test check a reachable
  database, or record in repository instructions that the check is
  not required for this target. (2) Fix the 33 lint errors, or record
  in repository instructions that the lint check is not required for
  this target. ...
- Next owner/action: the tech lead who owns the policy decides
  between the two options. Rerun the gate after the decision. ...
```

The gate gave `FAIL` for a three-line copy change, and the branch did not cause the failure. The run's contract had no rule that separates failures on the base from new ones. The current contract has that rule, so the same two checks do not set `FAIL` by themselves. The run followed the contract text and reported what it found.

What the run did not execute:

- The assertions of the 7 tests that need a database. The tests ran and failed at the connection, because no database was available.
- `nx build`. The run used `tsc --noEmit` for the app and spec configurations instead. This substitution was the run's choice.
- Apply mode, `/pr-improve`, and the CRAP commands. No `.crap-analysis.json` exists on the base.
- A search of other repositories for clients that match the old 403 text. The report lists this as a note for the next person. No file in the repository contains the old text. With `article.service.test.ts` alone, the three changed lines run in no test.

What you must check in the output:

- `coverage` is `final` when the policy covers the whole pull request.
- Each failed row in "Required checks" says if the failure is new or exists on the base.
- The `base_sha` is the merge base that you expect, and the fingerprint still matches when you open the pull request.
- Skipped rows give the contract text as the reason. A blank cell does not mean a passed check.

## Common mistakes

- You pass a pull request number or a remote branch to the gate. The gate accepts no such target. Check out the branch, or use `/pr-review` for that target.
- You show an old `PASS` after you added a commit. `head_fingerprint` changes with any change to the diff, also a new commit in a file that was already changed. The `PASS` is stale when the value differs. Run the gate again.
- You expect report mode to repair the branch. It edits nothing, and a `FAIL` stays a `FAIL` until the checks or the policy change.
- You blame the branch for a red check without a base comparison. In this run, the base commit gave the same lint output and the same 7 test failures.
- You read `CAPPED` as a pass. A cap means that `/pr-improve` ended with work left.
- You expect the gate to commit or push. No mode of the gate does either.

## Next

- [Self-review before a pull request](dev-self-review-before-a-pr.md): when you want findings without a status record.
- [Set up one quality command](lead-set-up-quality-rails.md): when the repository lacks one command for its checks, so the gate has no clear required checks.
- [Gate each phase](ops-gate-each-phase.md): when a phased delivery needs a review at each phase boundary.
- [Review every pull request on open](ops-review-every-pr-on-open.md): when the review must start when the pull request opens.
- [Clean up after a feature](dev-clean-up-after-a-feature.md): when you want cleanups applied, not only reported.
