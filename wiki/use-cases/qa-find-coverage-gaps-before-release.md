# Find coverage gaps before a release

This page is for a QA lead who has one week before a release and does not know where the tests are weak. You get a ranked list of coverage gaps with a risk for each. You also get a list of risky functions, scored by complexity and coverage.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA lead, with a developer for step 5 | [`cover`](../../skills/cover/SKILL.md) (`/cover-gaps`), then [`crap-analysis`](../../skills/crap-analysis/SKILL.md) (`/crap-config`, `/do-crap-analysis`) | No levels. Neither skill has depth levels. | A repository with unit tests that run. For `crap-analysis` only, a command in the repository that scores functions (step 5). |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run the unit tests with coverage, and note each failing test: `<test-command> --coverage`. Find the cause of each failure before you trust a percentage.
3. Rank the gaps: `/agent-toolbelt:cover-gaps <path-or-area>` (`/cover-gaps` if you installed with `install.sh`). The command changes no file.
4. If a developer can supply a scoring command, run `/agent-toolbelt:crap-config`. The wizard asks for three commands: coverage, analysis, and verify. The analysis command must write the report that step 5 describes. Then run `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh execute --coverage --config .crap-analysis.json`, and the same command with `review` in place of `execute --coverage`.
5. Read the result. `review` prints only the worst function and a count. The full function list is the report file that `outputs.report` names in the config, for example `reports/crap/<target>.json`. If `review` prints `ERROR` with the command `coverage`, a test fails: see "Decision points". Exit code 1 from `execute` means that a function is over the threshold. It is not a tool failure.

You get one ranked gap list, and a CRAP list (CRAP is a score from complexity and coverage) when step 4 applies.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The commit on this page is 30b68e1, and the default branch is `master`.

The code that you scan is `src/app`: 23 TypeScript files and 1,509 lines. The repository has five test files and 27 tests (one is a todo), and no unit test calls an HTTP route. The release is in one week. You must say which parts of the application have the weakest protection, and in what order the team must fix them.

The run used Agent Toolbelt 1.3.0. The last commit that changed the `cover` and `crap-analysis` skill files before the run was ab64b08. PR #60 changed both skills later, and this page notes each change next to the run text.

## Why this path

The obvious alternative is to read the coverage percentage from the test runner. Here it is 25.72% of lines and 15.6% of branches. That number tells you how much code is untested. It does not tell you where the weakness is, or what a failure there costs. The number is also too high in this repository. Seven of the 27 tests fail, and a failing test still counts the lines that it ran before it failed.

The `cover` gap scan (`/cover-gaps`) ranks gaps by risk (what a regression costs) and likelihood (the chance that it breaks unnoticed). It reads the tests, not only the percentage. The skill treats coverage data as a lead and not as a verdict. It writes no test and changes no source file. It writes only its report. This page uses the scan for that reason. The scan has a cost too. It reads the code, so the order of the gaps rests on judgment. This run predates the number scale and tie-break in `gap-scan.md`. The current skill sets both. The scan also needs the unit tests to run, if you want a coverage lead (step 2).

Two sibling skills answer other questions. `test-case-design` (`/test-case-design`) plans cases from a requirement or a change, as in [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md). It does not scan the tests that exist. `/cover` writes the tests. Use `/cover` after this page, when you know which gaps come first. The page [Turn test cases into tests](qa-turn-test-cases-into-tests.md) covers that step.

`crap-analysis` is the second step. It adds a number for each function, so you can compare the list with the scan. The cost is a setup that the scan does not need. The skill does not calculate CRAP. The repository must supply a command that scores the functions (see step 5). The order of the two skills is practice. Neither skill requires it.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills into the project: `./install.sh --harness all cover crap-analysis /path/to/project`. Start the agent in the repository root. | The skills must be available in your session. | You type `/` and see `/agent-toolbelt:cover-gaps` (plugin) or `/cover-gaps` (installed copy). |
| 2 | Run the unit tests with coverage. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest --coverage --coverageDirectory=coverage/api --collectCoverageFrom='src/app/**/*.ts'`. The unit tests use a mock of the database client, so they need no database. They do need dependencies (`npm ci --ignore-scripts`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`). | The skill treats coverage data as a lead and not as a verdict (`gap-scan.md`). The next rule is this page's practice: a failing test counts the lines that it ran, so find the cause of each failure before you read any percentage. | You have the count of failing tests and the cause for each failing file. If a test fails with a database error, read the test file before you start a database. If the tests cannot run here, see "Decision points". |
| 3 | Run `/cover-gaps <path-or-area>`. In the sample: `/cover-gaps src/app`. | The skill scans for untested branches, error paths, boundaries, input domains, contract seams, regressions waiting to happen, and weak existing tests. It ranks the gaps by risk and likelihood. A family is a type of gap, for example error paths. | The report is a ranked list. Each gap has an ID (`GAP-1` and up), a file, lines, a family, a risk, a likelihood, a score (risk times likelihood, from 1 to 9), the unguarded behavior, why it matters, and a suggested test. The report also notes which gaps are ready for `/cover`. The skill saves it to `.atb-work/cover/<scope-slug>.md` unless you name a path. |
| 4 | Check each of the top three gaps against the code. Mark each one `Executed` (you ran a test or a command) or `Read` (you read the code only). These two marks are this page's practice. The skill does not prescribe them. | A gap that comes from a code read is a claim until a test runs it. | Each top gap has one of the two marks. |
| 5 | Make sure that a command exists that scores each function and writes a report in the format of `skills/crap-analysis/references/report-schema.md`. If it does not exist, ask a developer to write one. Skip this step and step 6 when nobody can. | `crap-analysis` runs the commands that you configure. It does not calculate CRAP. | The command writes a JSON report with `qualifiedName`, `filePath`, `startLine`, `crap`, and `exceeds` for each function. |
| 6 | Run `/crap-config` and answer the wizard. It asks for the threshold (default `30`) and the output folder (default `reports/crap`). For each target it asks for the source folder and three commands: coverage, analysis, and verify. In the sample, the source folder is `src/app`. Read the preview, then approve it. | The skill writes `.crap-analysis.json` only after you approve the preview. | The file exists. `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh validate-config --config .crap-analysis.json` prints `config valid`. |
| 7 | Run the whole repository with the script `crap-analysis.sh`, which is the orchestrator: `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh execute --coverage --config .crap-analysis.json`. Then run the same command with `review` in place of `execute --coverage`. | `/do-crap-analysis` scans only the files that the branch changed. A scan before a release needs every file. | `review` prints an outcome of `PASS` or `REFACTOR`. `WARN` appears only with `--changed`. `ERROR` and `NO_TARGETS` mean that the run is not finished (see "Decision points"). |
| 8 | If the outcome is `REFACTOR`, read the refactor brief, a file that lists the worst function and the actions to take. The config names it in `outputs.refactorBrief`. Copy the template block from `skills/crap-analysis/references/review.md`. | The skill requires the full brief in context before it replies. | You have the worst function, its location, and the recommended actions. |
| 9 | Merge the two lists. For each gap in the scan, look for the function in the CRAP report. Keep the scan order. | The two lists measure different things (see "What you get"). A gap that only the scan finds is a weak test or a missing check, which a score cannot show. | Each of the top gaps has one of three marks for the CRAP list: `In CRAP list`, `Below threshold`, or `Not visible`. These marks are this page's practice, not a skill rule. |

## Decision points

- If tests fail in step 2, find the cause before you read the coverage numbers. In the sample the cause was the import order in one test file. Swapping two lines made all 12 tests of that file pass.
- If the `review` outcome is `ERROR` with the command `coverage` and exit code `1`, a test fails. The orchestrator stops when the coverage command exits with a non-zero code. Fix the tests, or end the coverage command with `|| true`. The second choice hides failing tests from the tool. Record the failing tests in your report.
- If the outcome is `NO_TARGETS`, the run looked at changed files only. No changed file is under the target source folder. Run `execute --coverage` without `--changed`. The outcome `NO_TARGETS` is not a pass.
- If the tests cannot run here (for example, they need a database or another service), skip step 2. Run `/cover-gaps` without a coverage lead, and say so in your report. If the repository has no tests, read [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md).
- If nobody can supply a scoring command, skip steps 5 to 9. The gap list from `/cover-gaps` is complete without them.
- If you want more functions in the CRAP list, lower `defaults.threshold` in the config. The skill default of `30` flags only high scores. The bundled fixtures use `16`. A lower threshold adds review work.
- If a gap depends on behavior that no source states, ask the owner. An example is the status for an unknown slug in G-7. The report in this run wrote "The owner must say" for these gaps. That wording is the run's choice, not a marker of the skill. Do not write a test that pins behavior that nobody agreed.
- Stop when you have one ranked list. Each top gap must have an `Executed` or `Read` mark, and each open question must have an owner.
- Choose [Turn test cases into tests](qa-turn-test-cases-into-tests.md) when you want tests for the gaps. Choose [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md) when the question is about one change. Choose [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md) when you must declare which parts of the code carry the highest impact.

## What you get

The run was headless, so no person answered questions. The `/cover-gaps` procedure has no question step. The run answered the `/crap-config` wizard with the defaults, and nobody approved the preview. You must approve it. The run did not start a database, and it did not run the `e2e` tests or any HTTP route.

First, the test result and the coverage lead. The Jest output shows 7 failed tests. All 7 are in `auth.service.test.ts`.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report and the two Jest outputs. The Branches and Functions columns are cut. The last column is the `auth.service.ts` row of each Jest output. The row labels are shortened. The second row comes from a second run. In that run, one test file had its first two imports swapped, and the file was restored afterwards.

| Run | Tests | Statements | Lines | `auth.service.ts` lines |
| --- | --- | --- | --- | --- |
| As the repository is | 7 failed, 19 passed, 1 todo | 30.67% | 25.72% | 71.73% |
| With the two imports swapped | 26 passed, 1 todo | 34.16% | 29.76% | 100% |

The skill sets no coverage threshold, so the run states no pass level. A failing test counts the lines that it ran before it failed, so the first row overstates the protection of `auth.service.ts`. The cause is that the test file imports `auth.service` before `../prisma-mock`. The service then uses the real database client, and the 7 tests fail because no database runs.

Next, the gap report. The IDs G-1 to G-12 are labels that this report uses. This run predates the `GAP-n` scheme in `gap-scan.md`. The ranking uses the skill's scale of high, medium, and low. This run predates the numeric scale too. The run multiplied high = 3, medium = 2, and low = 1, the same values that `gap-scan.md` now gives.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the table shows 8 of the 12 gaps. Each row keeps the title, family, risk, and likelihood. The other text of each entry is cut.

| ID | Title | Family | Risk | Likelihood |
| --- | --- | --- | --- | --- |
| G-1 | The auth service tests do not use the mock | weak existing tests | high | high |
| G-2 | Article update and delete: not found and wrong owner | error and failure paths, and contract seams | high | high |
| G-3 | Route authentication is not tested anywhere | contract and interface seams | high | medium |
| G-4 | The article list filters and the visibility rule | untested branches and boundary conditions | medium | high |
| G-5 | The user tests assert only that a token exists | weak existing tests, and error paths | high | medium |
| G-6 | Create article: blank fields and duplicate title | error paths and input domains | medium | high |
| G-7 | Tests named "no user found" pass for another reason | weak existing tests | medium | high |
| G-11 | Tokens fall back to a fixed secret | contract and interface seams | high | low |

Here is the text of the first gap.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
- Gap: the test file imports `auth.service` before `../prisma-mock`. The
  mock is not active when the service loads, so the service uses the
  real Prisma client. Without a database, 7 of 12 tests fail with
  `PrismaClientInitializationError`.
- Evidence that the run observed: with the two imports swapped in a
  scratch copy, 12 of 12 tests pass ...
- Suggested test: no new test. Swap the two import lines in the existing
  test file, then run the file again.
- Hand to `/cover`: yes. It is a test-only change.
```

The report marks which gaps are ready for `/cover`, as the skill requires. It also gives a first slice: G-1 first, then G-2 and G-5.

The CRAP part follows. The sample has no scoring command, so the run wrote one. It has 168 lines of JavaScript and exists only in the copy of the sample. It counts complexity with `if`, loops, `case`, `catch`, `?:`, `&&`, `||`, and `??`. Coverage is the share of statements in a function body that ran, so the `Coverage` column below is statement coverage. The skill sets no coverage kind: the repository's own command does. This tool belongs to the run. The Toolbelt does not ship it.

The skill output for the whole repository follows.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped.

```text
CRAP analysis: REFACTOR REQUIRED
Target: api
Threshold: 30
Worst in scope (all): updateArticle @
  src/app/routes/article/article.service.ts:289 — CRAP 156
Functions over the threshold in scope: 2

The refactor brief has been loaded. Summary:
- Function: `updateArticle`
- Location: `src/app/routes/article/article.service.ts:289`
- CRAP: 156 (threshold 30)

Recommended actions (from brief):
1. Add tests for uncovered paths (priority lines: 290, 292, 306, 307, 310).
2. Reduce branching: extract helpers for control-flow blocks at lines
   306, 310, 316, 319, 329.

→ Run `/crap-refactor api` to apply behavior-preserving fixes, or confirm
  here to proceed.
```

The outcome explains itself by one rule: a function in scope scored above 30. Two functions did. The full report has 46 functions, and 33 of them have 0% coverage.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the report `api.json`: five of the 46 functions and four of the fields are shown.

| Function | Complexity | Coverage | CRAP | Above 30 |
| --- | --- | --- | --- | --- |
| `updateArticle` | 12 | 0% | 156 | yes |
| `createArticle` | 6 | 0% | 42 | yes |
| `buildFindAllQuery` | 5 | 0% | 30 | no |
| `getTokenFromHeaders` | 5 | 0% | 30 | no |
| `deleteArticle` | 3 | 0% | 12 | no |

A function must score above the threshold to count. Two functions score exactly 30 and are not flagged.

The two lists agree on some code and differ on the rest.

| Gap | In the CRAP list? | Reason |
| --- | --- | --- |
| G-2 `updateArticle` | Yes, rank 1 | Complex and untested. |
| G-6 `createArticle` | Yes, rank 2 | Complex and untested. |
| G-4 `buildFindAllQuery` | Below threshold, 30 | The score equals the threshold. |
| G-3 `getTokenFromHeaders` | Below threshold, 30 | The score equals the threshold. |
| G-2 `deleteArticle` | Below threshold, 12 | It has little branching, but it removes data. |
| G-1, G-5, G-7 | Not visible | The functions have 50% to 100% statement coverage, so their scores are 1 to 8. The tests are weak or do not run. |

In this run, CRAP reads statement coverage, not assertions. It cannot see a test that passes for the wrong reason.

What to check in the output:

- The section "What this scan did not do" and the lines "Evidence that the run observed". This is the layout of this run's report, not a skill rule. The gaps G-3, G-8, G-9, G-10, and G-11 and the null user part of G-5 come from reading the code.
- The test count next to each coverage figure.
- The command and the exit code of an `ERROR` outcome.
- The scope in the review (`all` or `changed`).

## Common mistakes

- You read 71.73% for `auth.service.ts` as protection. Seven tests of that file fail, and the lines that they ran before they failed count. Run the tests first and read the failures.
- You run `/do-crap-analysis` on a branch with no change under the source folder and read the result as a pass. The outcome is `NO_TARGETS` with exit code 0, and the run scanned nothing. In this run, `execute --changed --coverage` returned `NO_TARGETS`. Use `execute --coverage` without `--changed`. `/do-crap-analysis` loads the config from the base branch, so without a merged config it fails with a config error (exit code 2). Pass `--config` to avoid this.
- You trust a test because its name promises a check. The tests named "no user found" for `favoriteArticle` pass because of a `TypeError`. The function never looks up the user. The run called the function and saw `Cannot destructure property '_count'` and 0 calls to `user.findUnique`.
- You write the config on a branch and expect `/do-crap-analysis` to find it. The orchestrator loads the config from the base branch. Until you merge it, pass `--config .crap-analysis.json` to each op.
- You expect `/crap-config` to supply the scoring command. The wizard stores the commands that you give it. The template now holds placeholder commands (`REPLACE_WITH_ANALYSIS_COMMAND`), and the Toolbelt ships no analyzer. This run predates the placeholders. Then the template named `npm run crap:analyze`, which most repositories do not have.
- You expect a list of tests from the scan. It writes no test. `/cover` writes tests after you select them.

## Next

- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when you want tests for the top gaps.
- [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md): when the question is about one change and not the whole code base.
- [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md): when the scan ranks by judgment and you want the high-impact areas declared.
- [`cover`](../../skills/cover/SKILL.md): for `/cover`, which writes the tests that you select.
- [`crap-analysis`](../../skills/crap-analysis/SKILL.md): for `/crap-refactor`, which refactors a flagged function after you confirm.
