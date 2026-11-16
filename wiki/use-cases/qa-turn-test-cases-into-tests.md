# Turn approved test cases into automated unit tests

This page is for a QA engineer or developer who has approved test cases and must turn them into automated tests. You get unit tests that run in the repository's own test runner. Each test has a red run (the test fails) when the behavior it guards breaks. It also has a green run (the test passes) on the working code. This page covers a test that locks a fixed bug. That test is red on the code from before the fix. A test that pins current behavior is red when you break that behavior on purpose.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer, developer | [`cover`](../../skills/cover/SKILL.md) (`/cover`) | No levels. The skill has no depth setting. | A case report with an ID and a level for each case. [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md) produces one. A repository with a working test runner and installed dependencies. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run the existing tests and write down each failure: `<test-command>`. `cover` runs this baseline too and records it in its proposal.
3. Ask for the tests: `/agent-toolbelt:cover <case-report-path> <case-ids>`. Pass only the cases whose level is Unit here. `cover` writes each test at the level that its case names, and Integration cases need a database and a running API. The test command needs the project's environment variables. The sample needs `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x`. Read the proposal, which `cover` saves to `.atb-work/cover/<scope-slug>.md`. Answer with the tests to apply.
4. Read the report. Each new test must show a red run (seen failing for the expected reason), or the label `Not verified`. If the report shows no red run, repeat the check as in step 7 of the table below.
5. Run `<test-command>` again. Make sure that only the failures from step 2 remain and that no production file changed. Then commit the test files alone: `git add <test-files>` and `git commit`.

You get test files, a commit that holds only tests, and a red and green result for each test.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). Jest is the test runner. Prisma is the database layer. It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub.

The case IDs come from the plan. `TC-nnn` is the ID of one case. In the tests of this run, the letters a and b mark separate tests for one case, so TC-004a and TC-004b are two tests of TC-004.

Commit 30b68e1 has the message "fix: missing user id". It adds `id: true` to the `select` (the list of fields that a query returns) in `getCurrentUser`. Before the fix, the token that `getCurrentUser` signs has no user ID. Every route that reads the ID from the token then fails.

A plan for this change already exists. It came from the earlier small-PR run, and this run did not regenerate it, so it predates later changes to `test-case-design`. It has 8 cases. One case is a unit case: TC-004, which checks `getCurrentUser` with a mocked data layer. The other seven are integration cases. They need a running API and a database. This run had no database, so it wrote tests for TC-004 only.

You must produce tests that run without a database. You must also prove that the tests fail when the fix is missing. A test that cannot fail gives no protection.

Terms on this page:

- Red and green: a red test fails. A green test passes.
- Regression lock: a test that turns red when a fixed bug returns.
- Fake: a stand-in object that replaces a real part, such as the database layer.
- Worktree: a second checkout of the same repository in another folder.

## Why this path

The obvious alternative is to write the tests by hand from the case table. That costs you the red check. The existing `getCurrentUser` test in the sample shows the risk. It uses a mock that returns the ID whatever the query asks for. In a control run, that test passed on the code without the fix, but only after the run swapped its two import lines in a temporary copy. As written, it fails on that code for another reason, a database error (see "What you get"). `cover` falsifies each test it writes. Falsify means to break the behavior on purpose and confirm that the test fails.

The skill [`test-case-design`](../../skills/test-case-design/SKILL.md) comes before `cover`. Its description names it as the way to plan cases from requirements, and this page assumes that you did that step. Two other skills sit next to `cover`:

- [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md) owns the regression test of a bug that is not fixed yet. It diagnoses the bug first. Here the fix exists, so `bug-to-fix` has nothing left to diagnose. The `cover` skill says to use it for a bug only when `bug-to-fix` recorded a regression-coverage gap. The page [Fix a reported bug](dev-fix-a-reported-bug.md) shows that path.
- `/cover-gaps` is the detect-only mode of `cover`. It ranks weak coverage in code and writes no test. Use it when you have no approved cases. Here the plan already chose the cases, so a second ranking adds work.

The procedure has this order because each step limits the next one. The skill detects the runner and the style of nearby tests first. It then proposes tests and stops. It applies tests only when you select them. It applies one test at a time and falsifies each test before the next one. Practice: a test that was never red can hide a wrong assertion.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all cover /path/to/project`. Start the agent in the repository root. | The skill must be available in your session, and it reads the repository from the folder where you start. | You type `/` and see `/agent-toolbelt:cover` (plugin) or `/cover` (installed copy). |
| 2 | Make sure that the dependencies are installed. In the sample: `npm ci --ignore-scripts`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`. This run used a shared, prepared copy and installed nothing. | The tests import the Prisma client. The generated client must exist. | The folder `node_modules/.prisma/client` exists. |
| 3 | Select the cases to automate from your case report. Pick the unit cases. `cover` writes each test at the level that its case names (Flow step 1), and `shared/contracts/references/test-levels.md`, rule 5, says why. In the sample, that is TC-004. Write the reason for each case that you leave out. | A unit test with a mocked boundary does not prove that boundary (`shared/contracts/references/test-levels.md`, rule 5). Integration cases need the real boundary. | Each case ID is in "write" or in "not written, with a reason". |
| 4 | Run the existing tests and save the result: `<test-command>`. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src`. | The skill records the baseline in its proposal (Flow step 2), and Completion compares the final run with it. You must know the failures that exist before your change. | You have the count of passing and failing tests. If a test fails, go to the first decision point. |
| 5 | Run `/agent-toolbelt:cover <case-report-path> <case-ids>`. `test-case-design` saves its report in the folder that you name, or in `.atb-work/test-case-design/<scope-slug>.md`. In the sample, the run's file name was `test-case-design-report.md`: `/agent-toolbelt:cover <plan-folder>/test-case-design-report.md TC-004`. | The skill accepts selected cases from a case report, and it names the case ID in each test. It detects the runner and reads nearby tests. | A proposal lists each test with the behavior it pins, the risk it guards, its kind, and its target file. The skill has stopped and waits for your answer. With no person to answer, it applies no test, saves the proposal to `.atb-work/cover/<scope-slug>.md`, and stops. The proposal lists the baseline failures and names a nearby test whose convention makes it fail. |
| 6 | Read the proposal. Remove a test that has no named risk. Answer with the tests to apply, for example `Apply TC-004a and TC-004b`. | The skill edits test files only when you ask it to apply selected tests. | The test files exist, and no production file changed. The skill applies one test at a time and runs it after each. |
| 7 | Check the red run. The skill falsifies each test. To repeat the check yourself, make a worktree on a scratch branch, revert the fix there, and run the test: `git worktree add ../scratch -b scratch/revert-fix <test-branch>`, then in `../scratch`: `git revert --no-edit <fix-commit>`, then `<test-command> <test-file>`. The new worktree has no `node_modules`, so link or install them there. The sample fix commit is `30b68e1`. | A test counts as red only when you saw it fail for the expected reason. The failure must show the symptom, not a setup error. A compile error is not red. In TypeScript, if the test needs a function or type that does not exist yet, add it as a stub first (`shared/contracts/references/test-driven-development.md`). The sample needed no stub, because `getCurrentUser` already exists. | Each new test fails, and the message names the wrong value. Then remove the worktree and the scratch branch. Do this step only if the report shows `Not verified` or you doubt the red run, because the skill already falsifies each test. `git revert` needs a configured git identity. |
| 8 | Run `<test-command>` again, and commit the tests alone: `git add <test-files>` and `git commit`. | The skill requires that the existing suite passes, or matches the baseline with no new failing test, and it says to commit tests apart from feature changes. | Only the failures from step 4 remain. `git diff <base>..HEAD -- <production-folder>` prints nothing. |

## Decision points

- If no case in the report is Unit level, or the report has no levels, stop. `cover` has nothing to automate. Use your integration suite, or [`webapp-testing`](../../skills/webapp-testing/SKILL.md) for a browser flow.
- If the repository has no test runner, stop and ask the owner. The skill says never to add a new framework.
- If the existing tests fail before you start, find the cause first. Do not copy the style of the failing file. Do not edit the existing tests, because the skill says to keep them intact. In this run, 7 tests of one file failed, and the cause was the import order (see "What you get").
- If a case has the expected result `Confirm with the owner`, do not write a test for it. The skill pins current behavior by default. It pins a different intended behavior only when the user agreed on it. In the sample plan, TC-005 and TC-007 are such cases.
- If a case needs a running API or a database, leave it out of this run. Write it in your integration suite instead. The skill writes each test at the level that its case names. This run did not try `cover` on an integration case.
- If a new test stays green on the broken code, check the revert, the code path, and the assertion. Keep the intended assertion. A changed expected value does not count as proof.
- If you cannot run the falsify check, write `Not verified` and the reason. The skill says to report `Not verified` when a safe check cannot run.
- If the bug is not fixed yet, choose [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md). See [Fix a reported bug](dev-fix-a-reported-bug.md).
- If you have no approved cases and only a module, run `/cover-gaps <path>` first. See [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md).
- If a case is a browser flow, choose [`webapp-testing`](../../skills/webapp-testing/SKILL.md).
- Stop when each selected case has a test with a red run or the label `Not verified`. The suite must show no new failure, and no production file can change.

## What you get

The run was headless. It followed the current `SKILL.md` by hand, so it did not type the command from step 5. No person answered the skill's questions. Without a person, the skill saves the proposal and applies no test. This run treated its instruction to write the unit cases as the selection. It did not ask a person.

The proposal listed two tests for TC-004, and it said why the other seven cases are not selected (they are Integration). Condensed from the proposal: the first column is the test, and the second is the kind.

| Test | Kind |
| --- | --- |
| TC-004a: the token carries the ID of the user | Regression lock |
| TC-004b: the query selects the user ID | Regression lock, query shape |

The proposal did not list a pinning test for the response body, because the plan names no risk for it. TC-005 covers the open question about the `id` field. The run applied both tests and put them in a new file next to the existing auth test, which does not run (see the baseline).

First, the baseline from step 4.

Excerpt from a rerun on the Conduit sample API, on the fixed code (commit 30b68e1). The lines are the file results and the summary of the Jest output.

```text
PASS api src/tests/services/tag.service.test.ts
PASS api src/tests/utils/profile.utils.test.ts
PASS api src/tests/services/profile.service.test.ts (5.214 s)
PASS api src/tests/services/article.service.test.ts (5.219 s)
FAIL api src/tests/services/auth.service.test.ts (5.97 s)
Test Suites: 1 failed, 4 passed, 5 total
Tests:       7 failed, 1 todo, 19 passed, 27 total
```

The 7 failures have one cause. `auth.service.test.ts` imports the service before the mock helper. The helper's `jest.mock` call then comes too late, and the service uses the real Prisma client. The tests then fail with no database. The files that import the helper first pass. A copy of the auth file with the two import lines swapped passes 12 of 12 tests (see the control run below). The new test file imports the helper first.

Next, the new test file. The fake returns only the fields that the query selects, as Prisma does. TC-004a decodes the token and checks the ID. TC-004b records the arguments of the call.

Excerpt from a rerun on the Conduit sample API, with the test branch on top of the fixed code (commit 30b68e1). The file is `src/tests/services/auth.service.get-current-user.test.ts`. The run chose the fake's name. The lines of the setup that surround the fake are left out.

```ts
// Answers like Prisma: returns only the fields that the query selects.
const fakeFindUnique = (args: any) => {
  const row: Record<string, unknown> = storedUser;
  const picked: Record<string, unknown> = {};
  for (const [field, wanted] of Object.entries(args.select ?? {})) {
    if (wanted) {
      picked[field] = row[field];
    }
  }
  return Promise.resolve(picked);
};

  test('TC-004a: the token carries the ID of the user', async () => {
    // Given a data layer that returns only the selected fields
    findUnique.mockImplementation(fakeFindUnique);

    // When
    const result = await getCurrentUser(123);

    // Then the decoded token holds the user ID, so later requests can read it
    const payload = jwt.decode(result.token) as { user: { id?: number } };
    expect(payload.user.id).toBe(123);
  });
```

The run applied one test at a time. TC-004a compiled and passed on the fixed code before the run reverted anything. Then the run reverted commit 30b68e1 in a worktree on a scratch branch. This diff shows the revert.

Excerpt from a rerun on the Conduit sample API, on the revert of commit 30b68e1. Lines `diff --git` and `index` are left out.

```diff
--- a/src/app/routes/auth/auth.service.ts
+++ b/src/app/routes/auth/auth.service.ts
@@ -134,7 +134,6 @@ export const getCurrentUser = async (id: number) => {
       id,
     },
     select: {
-      id: true,
       email: true,
       username: true,
       bio: true,
```

On the reverted code, both new tests failed. On the fixed code, both passed.

Excerpt from a rerun on the Conduit sample API, on the revert of commit 30b68e1. Red run. Condensed from the run output. Left out: blank lines, the file header line, the describe line, the `expect(received).toBe(expected)` lines, the stack lines, the code frames, and the summary. The text that remains is verbatim and in the order of the output. The test list comes first. Then the two failure blocks follow: TC-004a, then TC-004b.

```text
    ✕ TC-004a: the token carries the ID of the user (4 ms)
    ✕ TC-004b: the query looks up the caller and selects the user ID (2 ms)
    Expected: 123
    Received: undefined
    Expected: true
    Received: undefined
```

The first pair of values belongs to TC-004a. The second pair belongs to TC-004b.

Excerpt from a rerun on the Conduit sample API, on the fixed code (commit 30b68e1). Green run. Condensed from the run output. Left out: blank lines, the `PASS` line, the describe line, and the summary.

```text
    ✓ TC-004a: the token carries the ID of the user (4 ms)
    ✓ TC-004b: the query looks up the caller and selects the user ID (2 ms)
```

Last, the control run on the existing `getCurrentUser` test, on the reverted code. As written, it fails with a database error. With its two import lines swapped in a temporary copy, the whole file passes.

Excerpt from a rerun on the Conduit sample API, on the revert of commit 30b68e1. Condensed from two runs. The first run is the existing file with the filter `-t getCurrentUser`. The second run is the swapped copy, named `tmp-order-check.test.ts` by the run, with no filter.

```text
      ✕ should return a token (15 ms)
    Rejected to value: [PrismaClientInitializationError:·
Tests:       12 passed, 12 total
```

The first two lines come from the first run. The last line comes from the second run. In the swapped copy, the existing test does not fail on the code with the bug. It asserts only that the result has a `token` property, so it cannot detect the lost ID. This run executed both results. The small-PR page reached the same claim by reading the code.

What you must check in the output:

- The proposal names a behavior and a risk for each test. A test with no risk is dropped.
- Each new test failed on the reverted code with the value that shows the symptom (`Expected: 123`, `Received: undefined`). A setup error does not count.
- The suite after your change has the same failures as the baseline and no new ones. Here, that is 7 failed and 21 passed. The baseline had 7 failed and 19 passed. The two new tests account for the difference.
- The worktree and the scratch branch are gone. In this run, `git status --short` showed only the untracked `.atb-work/` folder, and no production file differed from `master`.
- The tests are in a commit of their own.

What this run did not execute:

- The seven integration cases of the plan (TC-001 to TC-003, TC-005 to TC-008). No database and no running API existed. They are not written.
- The existing `auth.service.test.ts` as written. It fails with no database on every revision.
- A coverage measurement.
- The real Prisma `select` behavior. The fake models it, so these tests prove what the service asks for, not what the database returns.

## Common mistakes

- You copy the style of the existing auth test. It imports the service before the mock helper. The mock applies too late, and your tests call the real client. Import the helper first and check that the first run is green on the fixed code.
- You use a mock that returns a full row. The query can then drop the ID and the test stays green. Return only the selected fields, as the fake in this run does.
- You treat TC-004b as the main protection. It asserts the arguments of the query, so it breaks when someone renames the select. TC-004a asserts the behavior and survives the rename. Keep TC-004b only when the plan asks for it. The `cover` skill says to pin behavior, not call counts, so TC-004b follows the plan and not the skill's default.
- You count a compile error as a red test. A test counts only when you saw it fail for the expected reason. In TypeScript, add a stub for a missing symbol before the test, so that the failure is an assertion.
- You change the expected value to make the red check pass. The skill says to keep the intended assertion. A changed value proves nothing.
- You leave the revert in place. Remove the worktree and the scratch branch, then check `git status` and the production diff.
- You expect all eight cases to become tests. Seven need a database and a running API, and you must still run them.
- You see a Prisma type error (TS2615) on `prismaMock.user.findUnique`. The existing tests use `// @ts-ignore` for it. This run did the same on one line.

## Next

- [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md): the page that produced the cases used here.
- [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md): when you have code with weak tests and no case list.
- [Set up a BDD runner](qa-set-up-a-bdd-runner.md): when your cases are Given/When/Then scenarios and the repository has no runner for them.
- [Fix a reported bug](dev-fix-a-reported-bug.md): when the bug is not fixed yet.
- [From a bug report to a regression test](journey-bug-report-to-regression-test.md): the full path from a report to a locked test.
- [Use-case index](README.md): the full list of use-case pages.
