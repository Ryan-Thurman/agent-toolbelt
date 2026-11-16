# Pay down the debt in an old area of the code

This page is for a tech lead who must pay down debt in one old area and keep its behavior. You leave with an updated debt register, tests that pin the code, one cleanup, and one gate status. Each stage links to the use case that shows it.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead, with a developer for the code stages and a QA lead for the coverage stage | [`tech-debt-discovery`](../../skills/tech-debt-discovery/SKILL.md) (`/tech-debt-discovery`), [`tech-backlog-assessment`](../../skills/tech-backlog-assessment/SKILL.md) (`/tech-assess`), [`cover`](../../skills/cover/SKILL.md) (`/cover-gaps`, `/cover`), [`crap-analysis`](../../skills/crap-analysis/SKILL.md) (`/crap-config`, `/do-crap-analysis`, `/crap-refactor`), [`simplify`](../../skills/simplify/SKILL.md) (`/code-smell`, `/simplify`), [`retrofit`](../../skills/retrofit/SKILL.md) (`/retrofit`), [`code-quality-gate`](../../skills/code-quality-gate/SKILL.md) (`/code-quality-gate`) | No levels. None of these skills has depth levels. `retrofit` has three tiers (Discover, Apply, Fan out). | A repository checkout with its dependencies installed. Tests that run. A person who can answer ownership questions. For the optional score stage, a command in the repository that scores each function. A register is a ranked list of maintenance work with evidence for each item. The gate is a check of the branch that gives one status. CRAP is one score from the complexity and the coverage of a function. |

## Quick path

1. Start Claude Code in the repository root with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Run `<test-command>` and `<type-check-command>`. Write down the counts and the cause of each failing test. This is your baseline. If the test command cannot run, fix that first (see [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md)) or stop.
2. Find the debt and decide one item: `/agent-toolbelt:tech-debt-discovery <area>. Write the register to <register-file>.` Then run `/agent-toolbelt:tech-assess <ID> from <register-file>`. Continue only on a `Do` verdict. On `Defer` or `Reject`, record the reason in the register and stop. On `Spike`, plan the investigation. If the item is a confirmed defect, fix it first with [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md).
3. Pin the behavior of the code that you will change: `/agent-toolbelt:cover-gaps <area>`. Then run `/agent-toolbelt:cover <module-path-of-the-cleanup-target>`: the module that step 4 will change. The top gap is the right target only when it sits in that module.
4. Clean up one thing at a time: `/agent-toolbelt:code-smell <area>`. `/code-smell` saves its report to `.atb-work/simplify/<scope-slug>.md`. Then run `/agent-toolbelt:simplify <report-path>` and select one `safe` row by its `id`. Use `/agent-toolbelt:retrofit "<old> -> <new>. Discover only."` only when the assessment names a library switch. Commit the tests and the cleanup in separate commits, on a branch that differs from its base.
5. Optional, when the repository has a command that scores each function: `/agent-toolbelt:crap-config`, then `/agent-toolbelt:do-crap-analysis --target <target>`, then `/agent-toolbelt:crap-refactor <target>`. The Toolbelt ships no analyzer, so `/crap-config` records the analysis command of your repository.
6. Run the baseline commands again, then `/agent-toolbelt:code-quality-gate --mode=report`. The gate reads the committed changes of the checked-out branch since its merge base, plus the working tree. Update the register: `/agent-toolbelt:tech-debt-discovery <area>. Update the register <register-file>.`

You get a register with a status for each item, tests that pin the code, a cleanup in its own commit, and one gate status. The sections below explain each stage, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma as the database layer, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The commit is 30b68e1, "fix: missing user id".

The old area is the article service, `src/app/routes/article/article.service.ts`. It has 652 lines. The same 21-line query block (the `include` option that lists the relations to load) appears in 7 of its functions. The function `updateArticle` has 12 independent paths and no test. The repository has no CI file and no debt list. You must reduce the cost of changing this file without changing what the API returns, except for a repair that you choose.

This page connects earlier use cases. Each earlier run started alone from commit 30b68e1 on its own copy of the code. The runs did not build on each other. This journey applied the diffs of two of them (the tests and the cleanup) to one fresh copy and checked that they work together (see "What you get"). It did not run the skills again.

## Why this path

The obvious alternative is one large refactor of the service, reviewed as one pull request. That loses the order of the work. In this sample, the cleanup passes every test and keeps a defect: the favorite functions still return full user rows, including the password hash. The tests cannot see it, because they mock the database client. A single large change hides this in the diff.

The sibling alternatives are narrower. [Decide one technical backlog item](lead-decide-one-backlog-item.md) fits when you already hold one item. [Deliver an approved ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) fits when a ticket already exists and the change spans several pull requests. Both skip the choice of what to pay first. In this sample the register ranks the defect (D-01) above the cleanup (D-05). The two skills alone have a cost here. `/tech-assess` alone gives a verdict and changes no code. `/simplify` alone on the article service cleans the 7 repeated blocks and keeps the leak.

The stage order follows the Toolbelt workflow [`tech-debt-workflow.md`](../../workflows/tech-debt-workflow.md): discovery, assessment, scoring, cleanup, library change, tests, gate. The workflow says to start implementation only when it is authorized, and to keep discovery apart from repairs. This page moves the tests before the cleanup, and it moves the defect fix before both. That is practice, not a workflow rule. The reason is that the cleanup run found no existing test that can see a wrong `include`.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Start in the repository root. Install the dependencies, then run `<test-command>` and `<type-check-command>`. In the sample: `npm ci --ignore-scripts`, `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`, `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`, and `npx tsc --noEmit -p tsconfig.app.json`. | A later result means something only against this baseline. | You have the counts and the cause of each failure. In the sample: 7 failed, 19 passed, and 1 todo. The cause is import order in `auth.service.test.ts`, not a missing database. See [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md). |
| 2 | Find the debt: `/agent-toolbelt:tech-debt-discovery <area>. Write the register to <register-file>.` The page [Choose which technical debt to pay in the next sprint](lead-choose-tech-debt-to-pay.md) shows the run. | The register ranks items by evidence, so you do not choose by audit count. | The file has IDs, evidence, rejected look-alikes, and the tools that did not run. In the sample, D-05 is the article service. |
| 3 | Decide one item: `/agent-toolbelt:tech-assess <ID> from <register-file>`. Answer each open question with the owner. | The skill gives one verdict (`Do`, `Defer`, `Reject`, or `Spike`), options, and a test strategy. | The report has a verdict and each open question has an answer. The earlier run assessed D-01, not D-05. |
| 4 | If the item is a confirmed defect, fix it first with [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md). Give the register entry as the report text. | A cleanup keeps behavior, including a faulty behavior. | The defect has a test that failed before the fix and passes now. In the sample, D-01 is this defect. |
| 5 | Rank the weak tests: `/agent-toolbelt:cover-gaps <area>`. For a function score, use the optional path in step 6. | A rank shows which code has the weakest protection before you change it. | Each top gap says whether the run executed the behavior or only read the code. The words "executed" and "read" are this page's wording, not a label of the skill. |
| 6 | Pin the behavior of the code that you will change: `/agent-toolbelt:cover <module-path>`. Optional score path: `/agent-toolbelt:crap-config`, then `/agent-toolbelt:do-crap-analysis --target <target>`, then `/agent-toolbelt:crap-refactor <target>`. `/crap-refactor` applies only after the scan reports REFACTOR and you confirm. See [Refactor the riskiest function in a codebase](dev-refactor-a-risky-function.md). For planned cases, see [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md). | A cleanup is safe only when a test can fail if the cleanup is wrong. | Each new test fails when you change the code under test on purpose. To check: copy the repository, break one branch of the function, run the new test, and confirm that it fails for that reason (see `skills/cover/references/authoring.md`). This journey did not repeat the check on the stacked copy. The failing count of the suite equals the baseline. Commit the tests. |
| 7 | Clean up one thing: `/agent-toolbelt:code-smell <area>`, then `/agent-toolbelt:simplify <report-path>`, with the report that `/code-smell` saved to `.atb-work/simplify/<scope-slug>.md`. Select the `safe` rows by their `id`. The page [Clean up a feature before you open the pull request](dev-clean-up-after-a-feature.md) shows the run. | The skill edits only the rows that you select, and it runs the tests after each one. | The diff holds only the selected change. No test file changed. The baseline commands give the same results. Commit the cleanup on its own. |
| 8 | Swap a library only when the assessment gives `Do` for a switch: `/agent-toolbelt:retrofit "<old> -> <new>. Discover only."`. In the sample: `bcryptjs -> bcrypt`. See [Swap a library at every call site](dev-swap-a-library-everywhere.md). | Retrofit applies one defined change at every site and keeps the tree working between slices. | Each site is `done`, `skipped (reason)`, `needs-review` (its tests do not run), or `pending` with a slice number. |
| 9 | Run the baseline commands again. If you use a function score, scan again. | A cleanup moves line numbers, so a brief or register from before the cleanup is stale. | Only the baseline failures remain. The new tests pass. Each line reference that you reuse points at the right code. |
| 10 | Run the gate in report mode: `/agent-toolbelt:code-quality-gate --mode=report`. The page [Enforce a pre-PR gate on every branch](ops-enforce-a-pre-pr-gate.md) shows how to read the status. | The gate gives one status record for the branch. | The checked-out branch differs from its base. The status is `PASS`, or the report lists each failed check that also fails on the base commit under "Pre-existing failures", with the base evidence. |
| 11 | Update the register: `/agent-toolbelt:tech-debt-discovery <area>. Update the register <register-file>.` | The skill preserves IDs and earlier decisions only when it gets the old register. | Each item that you touched has a status and a reason. Stale line references are marked. |

## Decision points

- If you already hold one item, skip steps 2 and 3. Use [Decide one technical backlog item](lead-decide-one-backlog-item.md).
- If discovery finds no confirmed debt in the inspected scope, stop. The skill treats that as a valid result.
- If the test command cannot run in step 1, fix the run first (see [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md)) or stop. Do not start the cleanup without a baseline.
- If the verdict is `Defer` or `Reject`, stop and record the reason in the register. If it is `Spike`, plan a bounded investigation with an evidence target and a time limit.
- If the top item is a confirmed defect, do step 4 before steps 5 to 8. The workflow file [`tech-backlog-assessment-workflow.md`](../../workflows/tech-backlog-assessment-workflow.md) sends a confirmed bug to the lane of [`bug-to-fix-workflow.md`](../../workflows/bug-to-fix-workflow.md).
- If the repository has no command that scores each function, skip the score in steps 5, 6, and 9. `/cover-gaps` does not need a function score to run.
- If no existing test can fail when the cleanup is wrong, add a check before step 7. The cleanup page records the `include` argument of each function before and after.
- If the gate status is `BLOCKED`, read the reason. Fix the missing prerequisite or record it in the register. Do not call the cleanup done. `CAPPED` applies only to apply mode. On `FAIL`, place each failure: new, or already failing on the base commit.
- If the change reaches many files and needs several pull requests, use [Deliver an approved ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md).
- If the debt is a missing pipeline, use [Set up one quality command for local use, CI, and release](lead-set-up-quality-rails.md) before the gate.
- If the item is a security question only, use [Audit the auth area of existing code](sec-audit-existing-code.md).
- If the work started from a defect report and not from a debt scan, use [journey-bug-report-to-regression-test.md](journey-bug-report-to-regression-test.md).
- Stop when all five checks hold:
  - Each selected item has a verdict.
  - Tests pin the changed code.
  - The cleanup is in its own commit.
  - Results match the baseline, and the gate has a status.
  - The register is updated.

## What you get

The earlier runs were headless: no person answered, and no database ran. Each run used the Prisma mock (a fake database client that the sample tests already use). No run sent an HTTP request. The register, the assessment, and the gap list rest on code reads and on mocked tests.

Stage 2 (from [Choose which technical debt to pay in the next sprint](lead-choose-tech-debt-to-pay.md)). The register holds ten items. Two of them concern the article service.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: only the first column of two rows is quoted. The other four columns are left out. The run predates PR #60, and the register template now has seven columns, with `Rank` and `Status`.

| ID and owner |
| --- |
| D-01, unassigned. Favorite and unfavorite responses return full user rows |
| D-05, unassigned. The article service repeats one query block 7 times and uses `any` 21 times |

Stage 5 (from [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md)). The gap list ranks the weak tests. The IDs `G-1` and `G-2` are labels of that report. The run predates PR #60, and the skill now names each gap `GAP-n` in rank order, with a score from 1 to 9.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: two of 12 gaps. Each row keeps the title, family, risk, and likelihood.

| ID | Title | Family | Risk | Likelihood |
| --- | --- | --- | --- | --- |
| G-1 | The auth service tests do not use the mock | weak existing tests | high | high |
| G-2 | Article update and delete: not found and wrong owner | error and failure paths, and contract seams | high | high |

Stage 6 (from [Refactor the riskiest function in a codebase](dev-refactor-a-risky-function.md)). The refactor run scored the functions with a script that the run wrote. It added six tests for `updateArticle` and changed no production code. CRAP is one score from complexity and coverage.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run reports: two of four functions, with all six columns kept.

| Function | CRAP before | CRAP after | Complexity | Coverage before | Coverage after |
|---|---|---|---|---|---|
| `updateArticle` | 156 | 12 | 12 | 0 | 100 |
| `createArticle` | 42 | 42 | 6 | 0 | 0 |

Stage 7 (from [Clean up a feature before you open the pull request](dev-clean-up-after-a-feature.md)). The cleanup run found that the existing article tests cannot see a wrong `include`.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is one row of the Chesterton's fence table (a table of questions about why code exists, before you remove it) in the run report. The row is one line in the report. It is wrapped for this page.

```markdown
| What tests cover it? | `article.service.test.ts` covers `favoriteArticle`,
`unfavoriteArticle`, and `deleteComment` with a mocked Prisma. The mock
returns a fixed row and ignores the `include` argument, so no existing
test can see a wrong include. |
```

Stage 8 (from [Swap a library at every call site](dev-swap-a-library-everywhere.md)). The library swap run changed `bcryptjs` to `bcrypt` in the auth module, not in the article service. The method is the same for the article service. In that file, `slugify` has two call sites, at lines 178 and 317. That is a read of the code, not a run. The sample register has no item that names a library switch, so this stage is conditional.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: two of six lines.

```text
bcrypt verifies the bcryptjs hash: true
bcryptjs verifies the bcrypt hash: true
```

Stage 10 (from [Enforce a pre-PR gate on every branch](ops-enforce-a-pre-pr-gate.md)). The gate page ran on a different branch, with a change to message text only. Its CRAP row was `Skipped`, with the reason `No .crap-analysis.json on the base branch.` If you want the CRAP check in the gate, commit that file to the base branch first.

The combined check. This journey applied the cleanup diff and the test diff of the earlier runs to one fresh copy of commit 30b68e1. Both applied with no conflict. The run then used the outputs of the earlier runs: their scoring script, and the scratch test of the discovery run. The article service went from 652 to 535 lines.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the cleanup diff and the test diff applied. Condensed from four output files: one line from each, verbatim.

| Output file | Line |
| --- | --- |
| `stacked-article-tests.txt` | `Tests:       11 passed, 11 total` |
| `stacked-full-suite.txt` | `Tests:       7 failed, 1 todo, 25 passed, 33 total` |
| `stacked-crap-analyze.txt` | `crap-analyze: 27 functions, 1 above 30, max 42` |

The 7 failures are in the same file as in the baseline, `auth.service.test.ts`, with the same count. The 6 added passes are the new `updateArticle` tests. In the scan of this copy, `updateArticle` starts at line 232 and scores 12. Before the cleanup it started at line 289. `createArticle` still scores 42, so it is the next function to pin.

The leak check came from the discovery run. It still shows the defect on the cleaned copy. The two functions return the key `favoritedBy`, and a row in it holds a password hash. The row is test data from the mock.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the cleanup diff and the test diff applied. Condensed: one of the four printed lines of `stacked-favorite-leak-check.txt`, verbatim. All values are mock data from the test.

```text
favoriteArticle favoritedBy[1]: {"id":124,"email":"reader-b@example.test","username":"reader-b","password":"$2a$10$hashhashhashhashhashhashhashhashhashhashhashhashha","image":null,"bio":null,"demo":false}
```

Last, the register update. The journey run did it by hand from the skill procedure, one agent, with no reviewer (Self-review). It checked three items and left the others as `Not rechecked`.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the cleanup diff and the test diff applied. Condensed from the register update: the columns "Evidence" and "Reopen or next" are left out. The text of the columns that remain is verbatim.

| ID | Status in the input register | Status on the checked tree |
| --- | --- | --- |
| D-01 | Open, rank 1 | Open, unchanged. Line references are stale. |
| D-04 | Open, rank 4 | Open, unchanged. |
| D-05 | Open, rank 5 | Partly met. |

D-05 is partly met because the query block now exists once and 7 queries use it. Its completion condition also asks for `favoritedBy` as ids only. That part is not met.

What ran in the combined check: the type check for the app configuration (exit 0), the article tests, and the full unit suite. The scoring script ran after a coverage run, and so did the leak check. What did not run: a database, the end-to-end suite, any HTTP request, `code-quality-gate`, the assessment of D-05, and the library swap on the same copy. The swap touches the auth module and needs a native package, so it was not stacked.

What you must check in your own output:

- Each stage result matches the baseline from step 1, plus the new tests.
- The defect from step 4 is gone. A passing suite does not show this when the tests mock the database.
- Each line reference in the register and in a refactor brief comes from after the last change.
- The gate `FAIL` has a reason that you can place: a new failure, or a check that already fails on the base commit.

## Common mistakes

- You clean up before you fix the defect. In the sample, the shared `include` constant keeps `favoritedBy: true`, and every test that passed before still passes. Fix the defect first, or the cleanup copies it into one shared place.
- You reuse a brief or a register after a cleanup. The lines move. In the sample, `updateArticle` moved from line 289 to line 232.
- You read the 7 failing tests as a database problem. The cause is import order in one test file. A failing file also inflates the coverage of the code that it ran before it failed.
- You trust "tests pass" after the cleanup. The mock ignores the `include` argument. Record the argument before and after, or write a test that reads it.
- You assume that the outputs of the earlier pages add up. Each run started alone. Only the two diffs in this journey were applied together.
- You skip the base-branch commit of `.crap-analysis.json`. The gate then skips the CRAP check.
- You run discovery again without the old register file. The skill then cannot keep the IDs and decisions.
- You run `retrofit` because the stage exists. Run it only when the assessment gives `Do` for a library switch.

## Next

- [Follow up an incident after it is mitigated](sre-follow-up-an-incident.md): when a defect in the old area reached users.
- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): when the stages are done and you want a verdict on the branch.
- [Answer review comments on your pull request](dev-answer-review-comments.md): when a reviewer asks for more cleanup.
- [`tech-debt-workflow.md`](../../workflows/tech-debt-workflow.md): the stage chain that this page follows.
- [Wiki home](../Home.md): the wiki start page.

The other pages, by role:

| Role | Pages |
| --- | --- |
| QA | [Refine a vague story](qa-refine-a-vague-story.md), [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md), [Map risk areas](qa-map-risk-areas-in-an-inherited-repo.md), [Set up a BDD runner](qa-set-up-a-bdd-runner.md), [Turn test cases into tests](qa-turn-test-cases-into-tests.md), [Find coverage gaps](qa-find-coverage-gaps-before-release.md), [Plan staging failure tests](qa-plan-staging-failure-tests.md), [Review feature files](qa-review-feature-files.md) |
| Developer | [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md), [Fix a reported bug](dev-fix-a-reported-bug.md), [Self-review before a pull request](dev-self-review-before-a-pr.md), [Answer review comments](dev-answer-review-comments.md), [Clean up after a feature](dev-clean-up-after-a-feature.md), [Swap a library](dev-swap-a-library-everywhere.md), [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md), [Refactor a risky function](dev-refactor-a-risky-function.md), [Run agents in parallel](dev-run-agents-in-parallel.md), [Survive a context reset](dev-survive-a-context-reset.md) |
| Product | [Decide whether to build](product-decide-whether-to-build.md), [Shape an idea into tickets](product-shape-an-idea-into-tickets.md), [Compare an ask with the product](product-compare-an-ask-with-the-product.md), [Synthesize interview notes](product-synthesize-interview-notes.md), [Review outcomes after release](product-review-outcomes-after-release.md) |
| Architecture, SRE, and security | [Answer an architecture question](arch-answer-an-architecture-question.md), [Design a new capability](arch-design-a-new-capability.md), [Right-size a plan](arch-right-size-a-plan.md), [Run a production readiness review](sre-run-a-production-readiness-review.md), [Follow up an incident](sre-follow-up-an-incident.md), [Threat-model a design](sec-threat-model-a-design.md), [Audit existing code](sec-audit-existing-code.md) |
| Tech lead | [Set up a new team repository](lead-set-up-a-new-team-repo.md), [Set up quality rails](lead-set-up-quality-rails.md), [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md), [Decide one backlog item](lead-decide-one-backlog-item.md), [Run a retrospective with papercuts](lead-run-a-retrospective-with-papercuts.md), [Prepare a release](lead-prepare-a-release.md) |
| Operations and writing | [Install for a team](ops-install-for-a-team.md), [Review every PR on open](ops-review-every-pr-on-open.md), [Agent-to-agent review queue](ops-agent-to-agent-review-queue.md), [Gate each phase](ops-gate-each-phase.md), [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md), [Cursor hooks](ops-cursor-hooks.md), [Unattended agent runs](ops-unattended-agent-runs.md), [Make a runbook plain](write-make-a-runbook-plain.md) |
| Journeys | [Idea to release](journey-idea-to-release.md), [Bug report to regression test](journey-bug-report-to-regression-test.md), [Incident to prevention](journey-incident-to-prevention.md), [Modernize a legacy area](journey-modernize-a-legacy-area.md) |
