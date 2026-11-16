# Take a bug from report to a locked regression test

This page is for a developer and a QA engineer who share one bug. It takes the bug from the first report to a branch that is ready for review. You get a fix with a regression test (a test that fails when the bug returns). You also get a QA case list for the change and a readiness verdict. Each stage links to the use-case page that shows it in detail.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer, QA engineer | [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md) (`/bug-intake`, `/reproduce`, `/rca`, `/fix-plan`), [`test-case-design`](../../skills/test-case-design/SKILL.md) (`/test-case-design`), [`cover`](../../skills/cover/SKILL.md) (`/cover`), [`pr-review`](../../skills/pr-review/SKILL.md) (`/review-diff`, `/pr-ready-check`) | Only the review has levels. It picks light, standard, or deep from the diff, and `--tier=<level>` overrides the choice. The other skills have none. | A bug report with steps, the repository at the version in the report, and a way to run its tests. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Run `git switch -c fix/<slug> <sha-from-the-report>`. Run the existing tests and save the list of failing tests, for example with `npx jest src 2>&1 | tee baseline-tests.txt`. Decide how to treat each failure that exists before your change (see Decision points).
2. Developer: run `/agent-toolbelt:bug-intake <report text or ticket>`. Then run `/agent-toolbelt:reproduce`, `/agent-toolbelt:rca`, and `/agent-toolbelt:fix-plan`, each with `bug-investigation-<slug>.md`. Stop at `/reproduce` if the bug does not reproduce. Ask: `Implement the fix brief for bug-investigation-<slug>.md. Run the failing test before you change code, then again after.` Commit the fix and its test. Write down `<sha-from-the-report>` as the base commit.
3. QA: run `/agent-toolbelt:test-case-design <sha-from-the-report>..HEAD`. Ask the owner about each case that says `Confirm with the owner`.
4. Run `/agent-toolbelt:cover <report-path> <case-ids>` only for a unit case that the regression test does not already pin. If every unit case is pinned, skip this line.
5. Developer: run `/agent-toolbelt:review-diff`, fix the findings, and run `/agent-toolbelt:pr-ready-check <branch>`. The readiness check runs the required checks itself, and it records each command, exit code, and date. On the sample, 7 old tests fail on every commit, so the verdict is `Needs Work` until you fix them in a separate commit or agree that they are a known baseline failure.
6. QA: start the API with a database and register a user. Run the `High` cases.
7. Open the PR when the verdict is `Ready`. After the re-test passes, set the investigation file to `status: resolved` and add the knowledge-base entry. When an end-to-end check cannot run, set `resolved-unverified` instead.

You get one branch with the fix and its tests, a QA case list with open questions, and a readiness verdict.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The bug is real. At commit 88b258c, `GET /api/user` returns a token that every other route rejects. Commit 30b68e1 ("fix: missing user id") is the upstream fix. It adds one line, `id: true`, to the `select` in `getCurrentUser`, in `src/app/routes/auth/auth.service.ts`.

You start with a user report and no cause. The report says that a client stores the token from `GET /api/user` and then fails on `POST /api/articles`. You must end with a fix that a reviewer can trust. You also need a test that fails when the bug returns, and a QA list of what else to check.

The path has four stages. Each stage has one earlier use-case page, and this page runs none of the skills again.

| Stage | Who | Skill | What it hands on | Use-case page |
| --- | --- | --- | --- | --- |
| 1. Fix with a failing test first | Developer | `bug-to-fix` | The investigation file, the fix, and a regression test | [Fix a reported bug](dev-fix-a-reported-bug.md) |
| 2. Plan the QA cases | QA engineer | `test-case-design` | A case list for the change, and open questions for the owner | [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md) |
| 3. Write the tests that are still missing | QA engineer or developer | `cover` | Unit tests with a red and a green run | [Turn test cases into tests](qa-turn-test-cases-into-tests.md) |
| 4. Review before the pull request | Developer | `pr-review` | A review report and a readiness verdict | [Check a branch before you open a pull request](dev-self-review-before-a-pr.md) |

This page uses these terms:

- Red and green: a red test fails. A green test passes.
- Regression test: a test that is red on the code with the bug and green on the fixed code.
- Investigation file: the file `bug-investigation-<slug>.md`. The `bug-to-fix` skill keeps the state of the work in it, so another session can resume.
- Case ID: `TC-nnn` is one case in the QA plan. The letters a and b mark separate tests for one case.

## Why this path

The obvious alternative is to let each role work alone. The developer fixes the bug and opens the PR. QA then plans cases from the PR. In practice this costs you twice. QA must wait for the PR, and nobody connects the two test sets. The probe below shows the result. The developer's regression test and the QA unit case TC-004a fail with the same values for the same cause. Both are green after the fix. You then keep two tests for one behavior.

The other alternative is the feature path, `/dev-intake` from the [`phased-delivery`](../../skills/phased-delivery/SKILL.md) skill. See [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md). It has no reproduction step and no root-cause gate, and it has no two gates for a bug fix: a confirmed cause and a red test first. Use it for a missing feature, not for broken behavior.

The order of the stages has these reasons:

- `bug-to-fix` comes first. It allows no fix without a confirmed root cause, and it captures the symptom in a failing test before the repair. The workflow file [`bug-to-fix-workflow.md`](../../workflows/bug-to-fix-workflow.md) lists the bug-to-fix steps up to the fix and the close-out. It uses `/dev-implement-task` for the fix and `/pr-review` for the review, and it has no QA step. The QA stages, `/review-diff`, and `/pr-ready-check` are this page's practice.
- The QA plan comes second, because the skill needs a change to plan from. The change can be a pull request, a branch, a commit range, or a diff. The skill can also take a requirement, so QA can write cases from the report before the fix exists. No run shows that path.
- `cover` comes third, because it takes case IDs from the plan. Its own text says that `bug-to-fix` owns the regression test of a bug. Use `cover` for a bug only when `bug-to-fix` recorded a regression-coverage gap.
- The review comes last. This order is practice, not a skill rule: the review and the readiness check read the final branch and its check results. A test that you add after the review makes the review stale.

You can open the PR first and run `/pr-review <pr-number>` on it. The review is the same skill. The cost is that your reviewers see the PR before the findings arrive. With `--comment`, `/pr-review` can also post to the PR. `/review-diff` never posts.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Both roles: load the Toolbelt with `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills into the project: `./install.sh --harness all bug-to-fix test-case-design cover pr-review /path/to/project`. | The commands must exist in your session. | You type `/` and see `/agent-toolbelt:bug-intake` and the other commands (plugin), or `/bug-intake` (installed copy). |
| 2 | Developer: check out the version in the report, and run the existing tests. Start the agent in this folder. Sample: `git switch -c fix/token-from-get-user 88b258c`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src 2>&1 | tee baseline-tests.txt`. | You must know which failures exist before your change. Otherwise you blame your change for them. | You have a list of failing tests in `baseline-tests.txt` (save the output with `tee`). In the sample, 7 of 12 tests in `auth.service.test.ts` fail with `PrismaClientInitializationError`, because no database runs. |
| 3 | Developer: run `/agent-toolbelt:bug-intake <report text or ticket>`, then `/agent-toolbelt:reproduce bug-investigation-<slug>.md`. Answer "Did you or QA reproduce this yourself before dev?" | The skill freezes the symptoms at intake, and it needs a reproduction before it looks for a cause. | The investigation file shows `Reproduction status: automated-red`, and the test fails with the reporter's symptom, not a compile error. |
| 4 | Developer: run `/agent-toolbelt:rca bug-investigation-<slug>.md`, then `/agent-toolbelt:fix-plan bug-investigation-<slug>.md`. Read the ranked hypotheses and the out-of-scope list. | The cause must be confirmed before the code changes. The brief bounds the diff. | The five checkpoint fields have concrete answers. The brief has a scope self-check and a verification plan. |
| 5 | Developer: ask for the fix with the prompt in the quick path. Commit the fix and the regression test together. This is practice. Write down the base SHA (the `<sha-from-the-report>` commit from step 2). | The test must be red before the repair and green after it. QA needs a fixed range to plan from. | `git log --format='%h %s' <base-sha>..HEAD` lists only the fix and its test. The test fails before the change and passes after it. |
| 6 | QA: run `/agent-toolbelt:test-case-design <base-sha>..HEAD`. The base is the first commit of the range. | The skill plans cases from the diff, finds the callers, and reads the existing tests. | The report has a "Change scope" section with the base and head commits. The "Coverage notes" section names each existing test and says whether it can fail. |
| 7 | QA: send each `Confirm with the owner` case to the owner. Add the open questions from the fix brief. | When no source states the intended behavior, the skill does not copy it from the new code. | Each such case has an answer, or it stays on your list of open questions. |
| 8 | QA and developer: compare the unit cases of the plan with the regression test. Run `/agent-toolbelt:cover <report-path> <case-ids>` only for a unit case with no test. Read the proposal, then answer with the tests to apply. | One test for one behavior is enough. `cover` proposes tests and stops. It edits test files only after you select them. | Each unit case is pinned by a test, or has a reason that it is not written. The new tests show a red run or the label `Not verified`. |
| 9 | Developer: run `/agent-toolbelt:review-diff`. Fix each blocker and should-fix finding. This is practice. Run `/agent-toolbelt:pr-ready-check <branch>`. | The readiness check runs the required checks itself. Without a project check list, it runs the test, lint, and build or type-check commands. The review reads the final branch. | The `/review-diff` report has no blocker, and the `/pr-ready-check` report says `Ready`. |
| 10 | QA: prepare a running API, a database, and a registered user. Run the `High` cases. | A unit test with a mocked database does not prove the request path. Only the original steps show that the reporter's request works. | Each `High` case has a pass or fail result. |
| 11 | Developer: open the PR. Put the open questions, the check results, and the QA results in the description. After the QA re-test passes, set the investigation file to `status: resolved` and add the knowledge-base entry. When an end-to-end check cannot run here, the skill sets `resolved-unverified` and records that check as `Not verified`. The knowledge base is `.atb-work/bug-to-fix/bug-knowledge-base.md` unless you name a tracked path. | The reviewer sees what you checked and what you did not. The skill sets `resolved` only after verification passes. | The description names each open question. The investigation file has `status: resolved`. |

## Decision points

- If the bug cannot be reproduced, or the report has no usable steps, stop at step 3. Ask the reporter for more data. Do not run `/rca`.
- If the repository has no test harness (no test runner set up), `/reproduce` records `confirmed-manual` and a follow-up to add an automated test. Then step 8 is not optional. Run `/cover bug-investigation-<slug>.md` to close that gap.
- If the regression test already pins a unit case of the plan, skip `cover` for that case. In the sample, the regression test is the same check as TC-004a. Keep a second test, such as TC-004b, only when the team wants a guard on the query shape. It breaks when someone renames the select.
- If the bug is live in production at severity SEV1 or SEV2, mitigate first (rollback, feature flag, or failover). Then run the full path. Choose [Follow up an incident](sre-follow-up-an-incident.md) when you must also prevent a repeat.
- If three fixes fail in different places, stop. The skill treats this as a sign of a design problem and says not to try a fourth fix.
- If the existing test file fails before your change, decide before step 9 how to treat it. In the sample, one import order makes 7 tests fail on every commit. The fix brief puts it out of scope, so do not mix it into the bug fix. Either fix it in a separate commit or PR, or agree with the team that the readiness check counts it as a known baseline failure. This choice is practice. The skill gives no rule for it.
- If the owner answers that the response body must not hold the new `id`, the fix is not complete. The same holds if old tokens must be rejected or refreshed. Go back to step 4 and write a new brief for that change. This is practice.
- If the readiness verdict is `Needs Work`, fix the gap and run the check again. If it is `Blocked`, a required check cannot run. Get it to run, or ask your team.
- Stop when the regression test is red before and green after, and each `High` case has a result. Each owner question must have an answer or sit on your list. The verdict must be `Ready`.
- Choose [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md) when your team requires a quality gate before each PR.
- Choose [Answer review comments](dev-answer-review-comments.md) after the PR gets comments from a reviewer.

## What you get

Each excerpt comes from the earlier run of that stage. This page did not run a skill again. The earlier runs were headless, with no person to answer questions. They used each skill's default where a question came up. Each linked page lists what that run did not execute. No run had a database, so no HTTP request ran in any stage.

Stage 1, the failing test. The developer run wrote it before the fix, and it fails on the symptom. Read the page [Fix a reported bug](dev-fix-a-reported-bug.md) for the root cause and the one-line diff.

Excerpt from the run folder `dev-fix-a-reported-bug`, file `02-repro-red-at-88b258c.txt`, on the Conduit sample API at commit 88b258c. The marker `...` replaces skipped text. A copy of the file is in this run's `outputs/stage1-repro-red.txt`.

```text
FAIL api src/tests/services/auth.current-user-token.test.ts
  getCurrentUser token
    ✕ returns a token that carries the id of the user (5 ms)
...
    Expected: 123
    Received: undefined
```

Stage 2, the QA plan. The plan was made on commit 30b68e1, which holds the fix and no test. It has 8 cases. The excerpt shows the two rows that matter for the other stages. TC-003 is the manual re-test of the fix brief in plan form. TC-004 is the unit case.

Excerpt from the run `qa-plan-tests-for-a-small-pr`, report `test-case-design-report.md`, on the Conduit sample API at commit 30b68e1. A copy is in `outputs/stage2-test-case-design-report.md`. Condensed from the run report: the Requirement / risk and Automation candidate columns are left out. The text of the columns that remain is verbatim. T2 is the `token` field that the response of TC-001 returns.

| ID | Preconditions / data | Steps | Expected result | Level | Priority |
|---|---|---|---|---|---|
| TC-003 | T2 from TC-001. 14 uses outside the auth controller read the ID from the token. | Send `POST /api/articles` with T2 and a valid article body. | Status 201. The author of the article is the user with ID n. | Integration | High |
| TC-004 | A mocked data layer | Call `getCurrentUser(123)`. Read the arguments of the `findUnique` mock. | `select.id` is `true`. The decoded token has `user.id` 123 when the mock returns ID 123. | Unit | Medium |

The run predates PR #60. `test-case-design` now writes an expected result as observable behavior and not as a mock call argument, so a new plan words TC-004 as the token behavior. The developer's manual re-test in the fix brief is the same request. Register, call `GET /api/user`, store the new token, call `POST /api/articles` with it, and expect 201. So the QA run of the `High` cases in step 10 is that re-test. The plan also lists two cases with `Confirm with the owner` (TC-005 and TC-007). They match two items that the fix brief puts out of scope: the new `id` in the response body, and the old tokens.

Stage 3, the tests that `cover` wrote. This run wrote them from the plan, after the fix. Both were red on the reverted code.

Excerpt from the run `qa-turn-test-cases-into-tests`, file `red-on-reverted-code.txt`, on the Conduit sample API, on the revert of commit 30b68e1. A copy is in `outputs/stage3-red-on-reverted-code.txt`. Condensed from the run output: all other lines are left out. The text that remains is verbatim and in the order of the output. The first pair of values belongs to TC-004a. The second pair belongs to TC-004b.

```text
    ✕ TC-004a: the token carries the ID of the user (4 ms)
    ✕ TC-004b: the query looks up the caller and selects the user ID (5 ms)
    Expected: 123
    Received: undefined
    Expected: true
    Received: undefined
```

Here is the overlap. This page's run copied the developer's regression test from stage 1 and the two `cover` tests from stage 3 into one copy of the sample. It ran the three tests at 88b258c, then with the one-line fix. The run did not use a skill for this probe.

Excerpt from `outputs/overlap-probe.txt`, the probe of this page's run on the Conduit sample API. The first block is commit 88b258c. The second block is 88b258c with the one-line fix from 30b68e1. Condensed from the probe output: the failure values and the `Test Suites:` lines are left out. The lines that remain are verbatim.

```text
## base 88b258c (no fix), both test files
FAIL api src/tests/services/auth.current-user-token.test.ts
FAIL api src/tests/services/auth.service.get-current-user.test.ts
Tests:       3 failed, 3 total
## head: 88b258c plus the one-line fix from 30b68e1, both test files
PASS api src/tests/services/auth.service.get-current-user.test.ts
PASS api src/tests/services/auth.current-user-token.test.ts
Tests:       3 passed, 3 total
```

The developer's test and TC-004a fail with the same values, `Expected: 123` and `Received: undefined`. Both check that the token carries the user ID. When the bug-to-fix run has already written this test, `cover` adds only TC-004b, or nothing.

Stage 4, the review. This run reviewed commit 667bbe6, the copy of 30b68e1 on a branch. That branch had no regression test, so the review reports one as a should-fix finding.

Excerpt from the run `dev-self-review-before-a-pr`, report `14-review-diff-report.md`, on the Conduit sample API at commit 667bbe6 (the cherry-pick of 30b68e1). A copy is in `outputs/stage4-review-diff-report.md`. Lines are wrapped, and `...` marks skipped text.

```markdown
### Questions (1)
- **src/app/routes/auth/auth.service.ts:137** - Tokens that `GET /user` signed
  before this fix carry no user ID and stay valid for 60 days
  (`token.utils.ts`, `expiresIn: '60d'`). Does the API need to reject or
  refresh them, or is it enough that new tokens carry the ID? ...
```

The same question appears in the fix brief, in TC-007 of the plan, and in this review. One answer from the owner closes it in all three places. The verdict of that run was `NEEDS DISCUSSION` for the review and `Needs Work` for the readiness check. The readiness check failed because the test file that holds the only `getCurrentUser` test did not run, and the 7 failures were the import-order problem.

What you must check across the stages:

- The regression test fails with the reporter's symptom, and the investigation file says `automated-red`.
- The plan names the regression test in "Coverage notes". By the skill's procedure, a behavior that an existing test covers gets no new case. The earlier plan run had no such test, so it wrote TC-004. No run shows the plan on a branch that holds the test.
- Each owner question has one written answer, and the answer reaches the fix brief, the plan, and the PR description.
- Each check that did not run has the label `Not run` or `Not verified`. It does not count as a pass.

What this page did not execute:

- The four skills. Each stage quotes an earlier run.
- The QA plan and the review on one branch that holds both the fix and the regression test. The earlier runs used the upstream fix commit and a copy of it, which hold no test. With the test in the branch, the review can still report the same open question, but the should-fix finding about a missing test can change. No run checked this.
- Any HTTP request, the `High` integration cases (TC-001 to TC-003), and the manual re-test. No database was available.
- The skill texts changed after the QA plan run. A later skill update named the change mode and set the base of a commit range. It also added the rule that a test that does not run is not coverage. PR #60 added the rule that a regression test in the range counts as existing coverage only when it was seen red on the base commit. This page checks its claims against the current skill files.

## Common mistakes

- You write the regression test in stage 1 and ask `cover` for TC-004a in stage 3. Both tests check the same behavior. Check the regression test first, and run `cover` only for a unit case that has no test.
- You plan the QA cases on a commit range that has no regression test. The plan then reports the gap that the developer already closed. Pass the final range.
- You count the existing `getCurrentUser` test as coverage. Its mock returns `id: 123` whatever the query selects, so by its code it passes on the bug. In this repository the test file also fails to run, because it imports the service before the mock helper.
- You review the branch before QA adds tests. The review is then stale. Run `/review-diff` on the final branch.
- You set `status: resolved` before the re-test. Use `awaiting_human_verify` while QA runs the re-test. The skill defines that status for this case.
- You fix the import order of the old test file inside the bug-fix commit. The diff then holds more than the fix, and the reviewer cannot tell the fix lines from the cleanup.
- You forget the data that the bug already created. By its code, tokens that the buggy server issued stay valid for 60 days and carry no user ID. The fix does not repair them. Put this question to the owner.
- You copy the output of `git show` or a cherry-pick into a note or the PR. It prints the name and email of the commit author. Use `git log --format='%h %s'`.

## Next

- [Fix a reported bug](dev-fix-a-reported-bug.md): stage 1 in detail, with the root-cause steps and the manual path.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): stage 2 in detail.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): stage 3 in detail.
- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): stage 4 in detail.
- [Survive a context reset](dev-survive-a-context-reset.md): when the investigation spans several sessions.
- [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md): when the plan says `None declared` and the code handles access control.
- [From an incident to prevention](journey-incident-to-prevention.md): when the bug came from a production incident.
- [From an idea to a release](journey-idea-to-release.md): when the report is a missing feature, not broken behavior.
- [Use-case index](README.md): the full list of use-case pages.
