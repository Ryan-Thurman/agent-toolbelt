# Fix a reported bug with a failing test first

This page is for a developer who gets a bug report with steps and must fix it with proof. You get a written root cause and a failing test (red) that turns passing (green). You also get a fix with no extra lines and a record that another person can resume.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md) (`/bug-intake`, `/reproduce`, `/rca`, `/fix-plan`), then [`cover`](../../skills/cover/SKILL.md) (`/cover`) only when the reproduction was manual | No levels. The skill has no depth setting. | A bug report with steps, the repository at the version in the report, and a way to run its tests. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Then run `git checkout <sha-from-the-report>`.
2. Triage and reproduce: `/agent-toolbelt:bug-intake <report text or ticket>`, then `/agent-toolbelt:reproduce bug-investigation-<slug>.md`.
3. Find the cause and plan the fix: `/agent-toolbelt:rca bug-investigation-<slug>.md`, then `/agent-toolbelt:fix-plan bug-investigation-<slug>.md`.
   If `/reproduce` cannot reproduce the bug, stop and see "Decision points".
4. Ask for the fix: `Implement the fix brief for bug-investigation-<slug>.md. Run the failing test before you change code, then again after. The test must also check the arguments of the database call.` With no test harness, `/reproduce` writes no failing test. Skip the test runs and keep the manual re-test of step 5.
5. Start the API (`npx prisma migrate deploy`, then `npx nx serve api`, with `DATABASE_URL` and `JWT_SECRET` set). Repeat the report's steps by hand. Then set the status in the investigation file to `resolved` and add the knowledge-base entry (by default `.atb-work/bug-to-fix/bug-knowledge-base.md`. Add `.atb-work/` to `.gitignore` first, or git lists it as untracked). If you cannot run the API, set `resolved-unverified` and record the re-test as `Not verified` with its command. Use `awaiting_human_verify` only when QA re-tests by hand.

You get an investigation file, a failing test, one small fix, and a passing test.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The history has a real bug. At commit 88b258c, `GET /api/user` returns a token that no other route accepts.

The report below is the input of this run. The historical bug is real, but the run wrote the report in the words of a user. It does not name the cause, and it has no error text.

Excerpt from the rerun on the Conduit sample API at commit 88b258c. Condensed from the report file: the title, the environment line, and the paragraphs after the "Actual" line are left out. Lines are wrapped. The words that remain are verbatim.

```text
Steps:

1. Register with POST /api/users, or log in with POST /api/users/login.
   The response has a `token`. Call it token A.
2. Call GET /api/user with the header `Authorization: Token <token A>`.
   The response is 200 and has a new `token` field. Call it token B.
   My client stores the token from every response, so it now holds token B.
3. Call any request that needs a login with token B, for example
   POST /api/articles or GET /api/articles/feed.

Expected: the request works, as it does with token A.
Actual: the request fails with an error. I did not save the error text.
```

You must fix the bug and keep it fixed. No database runs in the sample environment, so no request to the API can run. The existing tests do not show the bug, as "Common mistakes" explains.

## Why this path

The obvious alternative is to read the code, change the line that looks wrong, and run the suite. That costs you the proof. Here the suite gives no proof, because the existing `getCurrentUser` test uses a mock that returns `id: 123` whatever the query asks for. That test also does not use its mock in this run (see "What you get"). A green suite says nothing about the bug.

The other alternative is `/dev-intake` from the [`phased-delivery`](../../skills/phased-delivery/SKILL.md) skill. It clarifies a raw requirement before phased delivery, and its command file sends an idea with open product decisions or an unknown gap with the current system to `/shape-up`. It has no reproduction step and no root-cause gate. Use it for a missing feature, not for broken behavior.

The order of the loop comes from the skill. The skill allows no fix without a confirmed root cause. It requires reproduction first, because nobody can verify a fix for a bug that they cannot reproduce. It also keeps the investigation in one file that survives a context reset. The workflow file [`bug-to-fix-workflow.md`](../../workflows/bug-to-fix-workflow.md) lists the same steps.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all bug-to-fix /path/to/project`. | The commands must exist in your session. | You type `/` and see `/agent-toolbelt:bug-intake` (plugin) or `/bug-intake` (installed copy). |
| 2 | Check out the version in the report. Run the existing tests and record which fail. Sample: `git checkout 88b258c`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/auth.service.test.ts`. | The test-driven rule of the Toolbelt records baseline failures before any change. You can then tell old failures from yours. | You have a list of failing tests. In the sample, 7 of 12 tests fail with `PrismaClientInitializationError` because no database runs. Without a database, treat these 7 as the baseline. The full suite later shows 8 failures before the fix, because the new regression test is red then. |
| 3 | Run `/agent-toolbelt:bug-intake <report text or ticket>`. Sample: paste the report. | The skill freezes the symptoms (they stay unchanged after intake), so later steps fix this bug and not another. It also sets a severity. | The investigation file exists with `status: gathering`. Each missing field says `TBD`. The summary names the next command. |
| 4 | Run `/agent-toolbelt:reproduce bug-investigation-<slug>.md`. Answer the question "Did you or QA reproduce this yourself before dev?" If no person can answer, the skill takes "No or not sure" and records that no person answered. | A bug that nobody can reproduce cannot be verified as fixed. | `Reproduction status` is `automated-red`. The test fails with the reporter's symptom, not a compile error and not a different failure. |
| 5 | Run `/agent-toolbelt:rca bug-investigation-<slug>.md`. Read the ranked hypotheses before the probes run. | The skill needs 3 to 5 hypotheses that a test can disprove, and one variable changes at a time. | The five checkpoint fields (hypothesis, confirming evidence, falsification test, fix rationale, blind spots) hold concrete answers. |
| 6 | Run `/agent-toolbelt:fix-plan bug-investigation-<slug>.md`. Read the fix brief and its out-of-scope list. | The brief bounds the diff before the code changes. A bug-fix diff holds only the fix. | The brief has a scope self-check and a verification plan. The investigation file has `status: fixing`. |
| 7 | Ask the agent to implement the brief test-first. Use the prompt in the quick path. | The skill requires a failing regression test before the repair, then a passing one. In this run, the test from step 4 was the regression test (the run's choice). | The test fails before the change and passes after it. The diff holds only lines of the fix. |
| 8 | Start the API (`npx prisma migrate deploy`, then `npx nx serve api`, with `DATABASE_URL` and `JWT_SECRET` set). Repeat the report's steps by hand. Then set `status: resolved` and add the knowledge-base entry from the skill. If you cannot run the API, set `status: resolved-unverified` and record the re-test as `Not verified` with its command. Use `awaiting_human_verify` only when QA re-tests by hand. The rerun had no database and set `resolved-unverified`. | A unit test shows the cause. Only the original steps show that the reporter's request works. | The request with the new token works. The investigation file has `status: resolved` and the knowledge-base entry exists. |

## Decision points

- If the repository has no test harness (no test runner set up), take the manual path. `/reproduce` records `confirmed-manual` and adds the follow-up "Add an automated regression test when a harness exists". Run [`cover`](../../skills/cover/SKILL.md) (`/cover`) on the investigation file later. `/cover` only proposes tests and edits test files after you select them.
- If neither a manual nor an automated reproduction works, or the report has no usable steps, stop. Ask the reporter for more data. Do not run `/rca` and do not guess at a cause.
- If the bug is live in production at severity SEV1 or SEV2 (the two highest severity levels in the skill), mitigate first (rollback, feature flag, or failover). Then run the full investigation. An emergency does not remove the loop.
- If you want the cause but no code change, run `/rca --diagnose`. It makes no source edits, and the investigation file is the only permitted write.
- If the next doubt cycle of the root-cause check finds only trivial points, stop. After three cycles, stop and ask a person. The skill allows a skip only for a trivially obvious cause with a small blast radius. The run judged that this cause did not qualify, so it ran a Self-review. This was the choice of the run: the grep above finds 16 places that read the id.
- If three fixes fail in different places, stop. The skill treats this as a sign of a design problem and says not to try a fourth fix.
- Stop when the investigation file has `status: resolved`, the test is red before and green after, and the knowledge-base entry exists. In the rerun the status stopped at `resolved-unverified`. The hand re-test needs a database, and the run had none. The skill requires `resolved`, or `resolved-unverified` when an end-to-end check cannot run.
- Choose [Follow up an incident](sre-follow-up-an-incident.md) when the bug came from a production incident and you must prevent a repeat.
- Choose [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) when the report is a missing feature or the fix needs several phases.

## What you get

The run had no person and no subagent tool, so it differs from a real session in these ways. The question in step 4 took the skill's default "not sure", so the run reproduced the bug itself. The root-cause check was a Self-review (the author ran the doubt cycle alone), which is not independent of the claim. The run stopped at `resolved-unverified` (see "Decision points").

The first excerpt is the failing test. The regression test calls `getCurrentUser(123)`. It uses a mock (a stand-in for the database) that returns only the columns that the query selects, as a real database does, and the mock records each call. The test sends the returned token through `auth.required`, the middleware that the routes use. It expects the user id to arrive. Then it checks the recorded arguments of the query. The test proves what the service asks for, not what the real database returns.

Excerpt from the rerun (run dev-fix-a-reported-bug-r2) on the Conduit sample API at commit 88b258c. Condensed from the regression test file: the imports, the stored user, the `describe` wrapper, the comments on the mock and the helper, the middleware helper, and the closing braces are left out. The lines that remain are verbatim.

```ts
const answerLikeDatabase = async (args: any) =>
  Object.keys(storedUser)
    .filter((column) => args.select?.[column])
    .reduce((row, column) => ({ ...row, [column]: storedUser[column] }), {});
...
  test('returns a token that carries the id of the user', async () => {
    // Given
    (prismaMock.user as any).findUnique.mockImplementation(answerLikeDatabase);

    // When
    const { token } = await getCurrentUser(123);

    // Then
    await expect(readUserIdFromToken(token)).resolves.toBe(123);
    expect((prismaMock.user as any).findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 123 }, select: expect.objectContaining({ id: true }) })
    );
  });
```

The test fails at commit 88b258c for the right reason.

Excerpt from the rerun on the Conduit sample API at commit 88b258c. The mark `...` replaces skipped text.

```text
FAIL api src/tests/services/auth.current-user-token.test.ts
  getCurrentUser token
    ✕ returns a token that carries the id of the user (5 ms)
...
    Expected: 123
    Received: undefined
```

The first attempt did not compile (error TS2615 on the Prisma mock types). A compile error is not a red test, because it does not match the symptom. The run fixed the type cast. A version with the arguments check first was red too, but on the select, not on the missing id. The run moved the arguments check after the token check, so that the first failure names the symptom.

To see why the mock records its calls, the run reverted the fix and swapped in a mock with a fixed answer (the full stored user). The token check then passes on the bug, and only the arguments check fails.

Excerpt from the rerun on the Conduit sample API at commit 88b258c. The mark `...` replaces skipped text.

```text
    ✕ returns a token that carries the id of the user (6 ms)
...
    Expected: ObjectContaining {"select": ObjectContaining {"id": true}, "where": {"id": 123}}
    Received: {"select": {"bio": true, "email": true, "image": true, "username": true}, "where": {"id": 123}}
```

The root-cause step ranked five hypotheses before it ran any probe. The IDs in the next excerpt are H1 to H5 for the hypotheses and P1 to P4 for the probes. H1 says that the token from `getCurrentUser` has no user id. H2 to H5 name other parts of the chain: the middleware (H2), the token maker (H3), the controllers (H4), and the secret or lifetime of token B (H5). In the probe output, `lifetimeDays` is the token lifetime that the probe computes. Token B is the token from `GET /api/user`.

Excerpt from the rerun on the Conduit sample API at commit 88b258c. These are the probe lines of the run. The probe file printed them with a test runner prefix that the excerpt leaves out.

```text
P1 {"user":{},"lifetimeDays":60}
P1 through auth.required: {"user":{}}
P2 {"user":{"id":123},"lifetimeDays":60}
P2 through auth.required: {"user":{"id":123}}
P3 {"user":{"id":123},"lifetimeDays":60}
P4 select={"email":true,"username":true,"bio":true,"image":true}
```

Read the lines in this order. P1 is token B. It passes the middleware, so the signature is valid, but the `user` object is empty. P2 is a control: a token made for id 123 passes the same middleware with the id. This eliminates H2 and H3, because the middleware and the token maker work. P1 shows that token B has a valid signature and a 60-day lifetime (H5). A grep shows that the routes read the id from the token (H4): `grep -rn -F "req.auth?.user?.id" src/app`. P3 changes one variable, the query answer, and the id appears. P4 shows the cause: the query selects four columns and no `id`.

The cause is in `getCurrentUser`. The function signs the token with `user.id`, but the query did not select `id`. The other three functions in the same file select it. The cast `as User` hides this from the compiler, because the `User` type always has an id. The history shows the origin. Commit 5eeccf1 ("chore: update to latest demo version") changed the token call in four functions. It added `id` to three selects.

The fix is one line. The run applied it and ran the test again.

Excerpt from the rerun on the Conduit sample API at commit 88b258c. This is the diff of the run. The file header lines are left out.

```diff
@@ -134,6 +134,7 @@ export const getCurrentUser = async (id: number) => {
       id,
     },
     select: {
+      id: true,
       email: true,
       username: true,
       bio: true,
```

The regression test passes after the change. The whole suite goes from 8 failed tests to 7 failed tests. Repeat each count with `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`, once without and once with the fix line. The "Tests:" line is what jest printed.

Excerpt from the rerun on the Conduit sample API at commit 88b258c. These are the summary lines of two full runs, before and after the fix.

```text
Tests:       8 failed, 1 todo, 19 passed, 28 total
Tests:       7 failed, 1 todo, 20 passed, 28 total
```

The 7 remaining failures are the baseline from step 2. The comparison with the upstream fix gives the same result: `git hash-object` of the fixed file equals the blob at 30b68e1. The command `git diff 88b258c 30b68e1` ("fix: missing user id") shows the same one-line hunk. The upstream commit adds no test, so the regression test of this run is new coverage.

What you must check in the output:

- The red test fails on the symptom. Here it reports a missing id, not a setup error.
- The checkpoint names a falsification test with a result that can disprove the cause. Here P3 changes only the query answer.
- The fix brief lists what the fix does not do. Here it leaves the response body, the old tokens, and the existing test file as follow-ups.
- The investigation file lists what was not run.

What this run did not execute:

- The HTTP steps of the report. The test shows the missing id. It does not show the error that the reporter saw.
- The real Prisma client. The mock answers by `select`, as the other three functions in the file imply. The run had no database, so it did not check this.
- The hand re-test (step 8). The status stays `resolved-unverified` until a person runs it.

## Common mistakes

- You trust the existing `getCurrentUser` test. Its mock returns `id: 123` whatever the query selects, so by its code it passes on the bug. In this run it also does not use the mock, because the test file imports the service before `../prisma-mock`. The real client loads, and 7 of 12 tests fail with no database.
- You write a mock that returns a fixed answer. The regression test then passes on the bug. Make the stand-in answer like the real boundary, here by selected columns, and assert on the recorded call arguments.
- You count a compile error as red. A red test must fail with the reporter's symptom. Check the failure text before you start the repair.
- You add a guard in `generateToken` for an undefined id. The skill says to fix where the bug starts. The guard hides the start, and the next caller with the same mistake gets an error at a new place.
- You forget the data that the bug already created. By its code, tokens from the buggy server stay valid for 60 days and carry no id. `GET /api/user` reads the id from the token, so a client with such a token cannot refresh it. The client must log in again. The fix does not repair these tokens.
- You miss a side effect of the fix. The function spreads the selected fields into the response, so the body of `GET /api/user` now has an `id`. The brief lists this as a question for the owner.
- You read the upstream fix before you finish the root cause. The fix commit can sit in the copy's history. Compare after the regression test is green.

## Next

- [Self-review before a pull request](dev-self-review-before-a-pr.md): when the fix is ready and you want to review the diff first.
- [Answer review comments](dev-answer-review-comments.md): when the reviewer asks for changes to the fix.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): when QA wants cases for the same one-line change.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when the QA cases need automated tests.
- [Survive a context reset](dev-survive-a-context-reset.md): when the investigation spans several sessions.
- [Follow up an incident](sre-follow-up-an-incident.md): when the bug came from a production incident.
