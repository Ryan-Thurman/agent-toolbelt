# Refactor the riskiest function in a codebase

This page is for a developer who must change a function with high complexity and low test coverage. You find the riskiest function by score, add tests that pin its behavior, and read the new score. The skill ships no scorer, so the repository must supply a command that scores each function.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`crap-analysis`](../../skills/crap-analysis/SKILL.md) (`/crap-config`, `/do-crap-analysis`, `/crap-refactor`). The refactor step names [`cover`](../../skills/cover/SKILL.md) for test discipline. | No levels. The skill has no depth levels. | A repository with unit tests that run. A command that scores each function and writes the report format of [`report-schema.md`](../../skills/crap-analysis/references/report-schema.md) (step 3). The skill ships none. Write access to the base branch, or a person who merges the config. |

## Quick path

1. Start Claude Code in the repository root with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Run every command below from the repository root.
2. Check that the repository has a command that scores each function. It must write the report format of [`report-schema.md`](../../skills/crap-analysis/references/report-schema.md) and a refactor brief (a short file that names the function, its score, and the actions). If it has none, stop. Writing one is the main cost (step 3). Read step 3, or run `/code-smell` instead (see "Decision points").
3. Run `/agent-toolbelt:crap-config` and approve the preview. A target is one named source folder in the config. Commit `.crap-analysis.json` to the base branch that the tool finds first (`origin/HEAD`, then `origin/main`, `origin/master`, `main`, `master`), or set `CRAP_BASE=<branch>`.
4. Scan the whole repository. `<target>` is the target key in `.crap-analysis.json`. Exit `1` is expected when a function is over the threshold.
   - `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh execute --target <target> --coverage`
   - `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh review`
5. `review` prints one outcome. On `REFACTOR` (a function is above the threshold), run `/agent-toolbelt:crap-refactor <target>` and confirm. Stop on `PASS`. On `ERROR`, read the review block and fix the tooling. Then open the report file (`outputs.report` in the config). The new score of the function must be below the threshold, and the failing-test count must equal the count from before (step 2). Check that each new test can fail (step 9).

You get a ranked list of risky functions, a brief for the worst one, tests that pin its behavior, and a second score to compare.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. This page uses commit 30b68e1, whose message is "fix: missing user id".

You must change a function, and you do not know which function in the code is the riskiest to touch. The repository has 27 scored functions, and its tests mock the database. The goal is to name the worst function, make it safe to change, and prove with a second score that the risk fell.

The run in this page had no database. The test suite in the sample has 7 failing tests in `auth.service.test.ts` before any change (7 failed, 19 passed). You find the same failures if you have no database at `localhost:5432`.

## Why this path

The obvious alternative is to read the code and refactor the function that looks worst. That costs you a guess. In the sample, `updateArticle` has complexity 12 and no test calls it. A reader of the file sees a long function. A score for every function also shows that `createArticle` is the next one at risk (CRAP 42).

CRAP (Change Risk Anti-Patterns) is one score from cyclomatic complexity (the number of independent paths through a function) and test coverage. The skill describes the usual formula as `complexity² × (1 − coverage)³ + complexity`.

Two sibling commands do part of the job:

- [`/code-smell`](../../skills/simplify/SKILL.md) scans an area for structural smells, ranked by severity and confidence. It needs no setup and no coverage run. It gives no number that you can compare before and after, and it does not read coverage.
- `/cover-gaps` (from [`cover`](../../skills/cover/SKILL.md)) ranks missing or weak tests by risk and likelihood. It does not score complexity. The page [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md) shows it.

The cost of `crap-analysis` is setup. The skill does not calculate CRAP, so the repository must supply a scoring command (step 3). The config must also sit on the base branch before the first run (step 5). Use `crap-analysis` when you want one number to compare before and after.

The procedure has this order because each step limits the next one. The config names the commands, the base branch fixes which config the run trusts, the scan produces the brief, and the refactor reads the brief. The skill requires the full brief in context before it replies.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir <toolbelt-folder>`. Or install the skill into the project: `<toolbelt-folder>/install.sh --harness all crap-analysis <project-folder>`. Start the agent in the repository root. | The commands must exist in your session. | You type `/` and see `/agent-toolbelt:crap-config` (plugin) or `/crap-config` (installed copy). |
| 2 | Run your tests and note each failure that exists before your change. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`. | A failure that predates you must not look like a result of your change. | You have a count of passed and failed tests. The sample run gave 7 failed, 19 passed, 1 todo. All 7 failures need a database. |
| 3 | Find or write the scoring command. It must run after the coverage command. It must write the JSON report in [`report-schema.md`](../../skills/crap-analysis/references/report-schema.md). It must also write a refactor brief. The brief has the bullets `Function`, `Location`, and `CRAP`, a `## Recommended actions` section, and a `## Complexity drivers` section. Exit codes: `0` when no function is above the threshold, `1` when one is, `2` on a tooling error. | The skill reads the report and the brief. It does not calculate any score. | The command writes both files. It scores source files that are missing from the coverage file, because lcov-style formats list only the files that tests load ([`scoring.md`](../../skills/crap-analysis/references/scoring.md)). The script of this run gives `coveragePercent` 0 for a function that no test calls. That is this script's behavior, not a skill rule. |
| 4 | Run `/agent-toolbelt:crap-config`. Give the threshold (default `30`), the output folder (default `reports/crap`), and for each target the source folder and three commands: coverage, analysis, and verify. In the sample the target is `api` and the source folder is `src/app`. Read the preview and approve it. | The skill writes `.crap-analysis.json` only after you approve the preview. | The file exists. `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh validate-config --config .crap-analysis.json` prints `config valid`. |
| 5 | Add the output folder and the coverage folder to `.gitignore`, as [`config-schema.md`](../../skills/crap-analysis/references/config-schema.md) says. The run also ignored `.atb-work`, which was its own choice. Commit `.crap-analysis.json` and the scoring command to the base branch that the tool finds first, or set `CRAP_BASE=<branch>`. Then start your working branch. | The orchestrator loads the config from the base branch, not from your working tree. It tries `origin/HEAD` first. In the sample run, that ref had no config, so the run set `CRAP_BASE=master` (exit `2` without it). A branch cannot change the rules that review it. | `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh validate-config` prints `config valid` and the line `from base <branch>`. |
| 6 | Scan every function. Run `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh execute --target <target> --coverage`. Then run `bash <toolbelt-folder>/skills/crap-analysis/bin/crap-analysis.sh review`. `<target>` is the target key in `.crap-analysis.json`. In the sample, it is `api`. Exit `1` from `execute` is expected when a function is over the threshold. | `/do-crap-analysis` runs `execute --changed`. On a branch with no changed file it returns `NO_TARGETS` (see "What you get"). A scan for the worst function needs every file. | `review` prints an outcome and exits `1` for `REFACTOR`. The review JSON names `worstInScope`. |
| 7 | Read the refactor brief in full: the file that `outputs.refactorBrief` names. Then read the source of the function. Write the block from the `REFACTOR` template in [`review.md`](../../skills/crap-analysis/references/review.md). | The skill requires the full brief in context before it replies. The brief lists the lines that drive the score. | You can name the function, its CRAP, its complexity, its coverage, and the numbered actions. |
| 8 | Run `/agent-toolbelt:crap-refactor <target>` and confirm when it asks. In the sample: `/agent-toolbelt:crap-refactor api`. The skill then runs `verify --target <target> --changed` once and `review` itself ([`refactor.md`](../../skills/crap-analysis/references/refactor.md), flow step 5). Do not run `verify` again. Read the skill output, then open the report file and read the new score of the function. | The skill edits code only after you confirm. It follows the numbered actions of the brief, keeps behavior, and prefers the smallest change that goes below the threshold. The review looks only at changed files. A fix that adds tests changes no file under the target source folder, so the review cannot show the function. The report file does. | No test that passed in step 2 fails now. The failing count equals step 2. The new tests pass. No existing assertion changed. You have the verify exit code, the outcome, and the new `crap` value of the function from the report file. |
| 9 | Prove that each new test can fail. Change the code under test in your copy, run the tests, then restore the code. Do this for each branch that a test pins. | A test that stays green after a change in behavior does not lower the risk. `/crap-refactor` does not do this step. It is added practice. The `cover` skill prescribes the method for a pinning test ([`authoring.md`](../../skills/cover/references/authoring.md), "Falsify the test"). | Each change makes at least one test fail for the intended reason. The code is restored, and `git diff` shows no production change. |
| 10 | Stop, or repeat step 8 for the next function. | The skill does not loop `verify`. If the target still exceeds the threshold, it reports the new score and stops. | The function is below the threshold, or you wrote down the next function and its score. |

## Decision points

- If you cannot supply a scoring command, run [`/code-smell`](../../skills/simplify/SKILL.md) instead. It needs no scorer and gives no number to compare.
- If your repository already has a command that scores each function, skip the writing part of step 3. Check that it matches the report schema and the exit codes.
- If `.crap-analysis.json` exists, run `/agent-toolbelt:crap-config edit` and change fields. Do not write a second file.
- If your coverage command fails because some tests fail, the orchestrator stops with exit `2`. Fix the tests, or wrap the command so that it exits `0` when the coverage file exists. The sample run used the wrapper, because no database was available. With a database, remove the wrapper.
- If `validate-config` exits `2` with `config not found on base`, the remote base branch has no config. Commit the config there, pass `--config .crap-analysis.json` to test it first, or pass `--base <branch>` for a local base branch.
- If the outcome is `PASS`, stop. No function is above the threshold. The skill does not read the brief for a `PASS`.
- If the outcome is `WARN`, no function in the scope of the run exceeds the threshold, but one outside it does. Open the report file. After a test-only fix, `WARN` can mean that the target function is fixed (see "What you get").
- If the outcome is `ERROR`, read the tail of the failing command in the review block, fix the tooling, and run again. Do not refactor on an `ERROR`.
- If the outcome is `NO_TARGETS`, no changed file is under a target source folder. Scan with `execute --target <target>` as in step 6.
- If coverage is already high and the score comes from complexity, the brief lists the complexity drivers. The skill points to the tactics in [`maintainability-taxonomy.md`](../../shared/contracts/references/maintainability-taxonomy.md). Extract helpers at those lines.
- Stop when the target function is below the threshold in the report file. Also make sure that the new tests pass and that the count of failing tests equals the count from step 2. `git diff` must show only the changes that you chose.
- Choose [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md) when you want a ranked list of weak tests across the repository, not one function.
- Choose [Fix a reported bug](dev-fix-a-reported-bug.md) when the function is risky because it is wrong. A refactor that preserves behavior must not change it.
- Choose [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) when the change reaches many files and needs more than one pull request.

## What you get

The run was headless, so nobody answered the wizard. The run used the wizard defaults for the threshold and the output folder. It chose the target name, the source folder, and the commands itself. No subagent reviewed the result. The refactor step ran because the task named it, which stands in for your confirmation.

First, the run on a branch with no change. This is what `/do-crap-analysis` does by itself.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from two run files: the error output of the execute step, and the outcome line of the review JSON. `...` marks skipped text.

```text
config: .crap-analysis.json from base master
no configured target contains a changed file (base master)
...
  "outcome": "NO_TARGETS",
```

The whole-repository scan gives the ranked report. The target name, the threshold, and the worst function come from the review JSON.

Excerpt from a run on the Conduit sample API at commit 30b68e1. `...` marks skipped text.

```json
      "name": "api",
      "outcome": "REFACTOR",
      "threshold": 30,
...
      "worstInScope": {
        "qualifiedName": "updateArticle",
        "filePath": "src/app/routes/article/article.service.ts",
        "startLine": 289,
        "crap": 156,
        "riskLevel": "High",
        "cyclomaticComplexity": 12,
        "coveragePercent": 0
      },
...
      "exceedingInScope": 2,
```

The skill defines no coverage level for a good result. It sets only the threshold (default `30`). Two functions are above it. Here is the brief for the worst one.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The sections "Complexity drivers" and "Verify" are left out.

```markdown
# Refactor target

- Function: `updateArticle`
- Location: `src/app/routes/article/article.service.ts:289`
- CRAP: 156 (threshold 30)
- Complexity: 12
- Coverage: 0.0%

## Recommended actions

1. Add tests for uncovered paths (priority lines: 290, 292, 306, 307, 310, 311).
2. Reduce branching: extract helpers for control-flow blocks at lines 306, 310, 316, 319.
```

The coverage is the larger driver. A function with 12 paths and no test scores 156. The same function with every statement covered scores 12. The skill says to prefer the smallest change that goes below the threshold, so the run did action 1 and skipped action 2. It added six tests to `src/tests/services/article.service.test.ts`. Production code did not change.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are the test names that Jest printed for the new block.

```text
    updateArticle
      ✓ should throw a 404 if the article does not exist (2 ms)
      ✓ should throw a 403 if the user is not the author (2 ms)
      ✓ should throw a 422 if the new title gives a slug that is taken (2 ms)
      ✓ should not check for a duplicate if the title keeps the same slug (2 ms)
      ✓ should clear the old tags, then save the new title, slug, and tags (3 ms)
      ✓ should leave out fields that are not in the request (2 ms)
```

The run then made six changes to `updateArticle`, one at a time, and restored each. Each change made one to five of the 11 tests in the file fail. The run changed the author check, the tag clearing, the `body` field, the 404 check, the same-slug check, and the duplicate-title check.

Now the verify step. The only changed file is a test file, outside `src/app`, so the review scope has no function in it.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from two run files: the verify result and the review JSON. `...` marks skipped text.

```json
  "changed": [
    "src/tests/services/article.service.test.ts"
  ],
...
      "outcome": "WARN",
      "threshold": 30,
      "worstInScope": null,
      "worstInTarget": {
        "qualifiedName": "createArticle",
        "filePath": "src/app/routes/article/article.service.ts",
        "startLine": 162,
        "crap": 42,
        "riskLevel": "High",
        "cyclomaticComplexity": 6,
        "coveragePercent": 0
      },
```

The review block says that no function in the changed files exceeds the threshold. That sentence is true because no function is in the changed files. It does not show that `updateArticle` is fixed. The report file does.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run reports: four of 27 functions, and the fields `qualifiedName`, `crap`, `cyclomaticComplexity`, and `coveragePercent`. The values are verbatim.

| Function | CRAP before | CRAP after | Complexity | Coverage before | Coverage after |
|---|---|---|---|---|---|
| `updateArticle` | 156 | 12 | 12 | 0 | 100 |
| `createArticle` | 42 | 42 | 6 | 0 | 0 |
| `buildFindAllQuery` | 30 | 30 | 5 | 0 | 0 |
| `getTokenFromHeaders` | 30 | 30 | 5 | 0 | 0 |

The two functions at 30 do not exceed the threshold, because the skill flags a score above it. A review of the reports on disk with the whole target as scope still returns `REFACTOR`, with one function over: `createArticle` at 42. The skill does not refactor it, because you named the worst function. Run step 8 again for it.

What was run and what was not:

- Executed: the Jest suite with coverage, before and after. Before, 7 tests failed and 19 passed. After, 7 failed and 25 passed. The run also ran the six new tests and the six changes that they must catch.
- Not executed: any test that needs a database, including the 7 failing auth tests. No request reached `PUT /api/articles/:slug`. The new tests use the Prisma mock (a fake database client that the sample tests already use), so they pin the calls that the function makes and the errors it throws. They do not prove the real query.
- Score basis: the scoring script of this run counts statement coverage, not branch coverage. Your tool can differ, and its numbers can differ.

What you must check in the output:

- The brief names the function that the review JSON names as worst. If they differ, the report on disk is stale.
- The coverage of an untested function is 0 in the report. A nonzero value for a function that no test calls points to a fault in the scoring command. The first version of the sample script gave 5.6 for `updateArticle`, because it counted the statement that wraps the function as covered.
- The count of failing tests after the change equals the count before. The sample kept 7.
- The complexity of the fixed function. It stayed at 12 here. The score fell because of coverage, and the function still has 12 paths.

## Common mistakes

- You trust a score from a script that you wrote the same day. A scoring bug hides the real risk or invents a risk. Check one function that no test calls, and one that tests cover fully.
- You read `WARN` after a test-only fix as "done" or as "failed". It means that no function in the changed files exceeds the threshold. Open the report file and read the score of the function.
- You expect complexity to fall. Tests change coverage only. The sample function still has complexity 12, so a later change to it is still hard to read.
- You count a test with a mocked database as proof of the query. The new tests check the arguments that the function passes to Prisma and the errors that it throws. A query mistake needs a test with a database.
- You skip the check that each test can fail. A test that cannot fail adds coverage and no protection.
- You run `/do-crap-analysis` on a clean branch and read `NO_TARGETS` as a pass. The scope was empty. Use the scan in step 6.
- You edit `.crap-analysis.json` on your working branch and expect the run to use it. The run uses the base-branch version and prints a `CONFIG_CHANGE` line.
- You format a whole test file with the project formatter before the commit. If the file was not clean before, the diff hides your change. Format only the new block.

## Next

- [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md): when you need a ranked list for the whole repository.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when you have planned cases and want them as tests.
- [Self-review before a pull request](dev-self-review-before-a-pr.md): when the refactor is done and you open a pull request.
- [Clean up after a feature](dev-clean-up-after-a-feature.md): when the aim is to simplify code you changed, not to lower a score.
- [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md): when a lead must decide which risky function to fix first.
- [`cover`](../../skills/cover/SKILL.md): when you want more tests written for the next function.
- [Use-case index](README.md): the full list of use-case pages.
