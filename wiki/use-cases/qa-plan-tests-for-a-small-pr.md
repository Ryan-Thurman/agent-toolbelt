# Plan tests for a small authentication pull request

This page is for a QA engineer who gets a small pull request in an authentication area and must decide what to test. You get a short, prioritized case list, a list of the code that the change affects, and a statement about whether the existing tests cover it.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer | [`test-case-design`](../../skills/test-case-design/SKILL.md) (`/test-case-design`) | Not applicable. The skill has no depth levels. | A pull request number, a branch, or a commit range. Read access to the repository. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Plan cases for the change: `/agent-toolbelt:test-case-design <pr-number | branch | first..last>`.
3. Read "Change scope", answer each `Confirm with the owner` case, and check "Coverage notes" for tests that do not run or cannot fail.
4. Run the `High` cases first. Send unit-level cases to `/cover`.

You get a short, prioritized case list, the code that the change reaches, and a statement about whether the existing tests cover it.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The commands that name commit 30b68e1 on this page are examples. Replace the commit with your own range. Commit 30b68e1 has the message "fix: missing user id". It changes one line. It adds `id: true` to the `select` in `getCurrentUser`, in `src/app/routes/auth/auth.service.ts`.

You must decide which cases to run, and whether the existing tests already cover the change. A reader of the diff sees one added line in a query. The change is larger than it looks, and the steps below show why.

The repository has no declared risk areas (a risk area is a part of the code where a defect has high impact). No ticket exists. The only statement of intent is the commit message.

## Why this path

The obvious alternative is to read the diff and run the full regression suite. That costs you two things here. The diff gives no hint about the 14 places in other controllers that read the user ID from the token. The existing `getCurrentUser` test also gives no proof about the fix. Read as code, the test gives the same result with and without the added line, because the mock returns `id: 123` whatever the query asks for. In this run the test did not run at all (see "What you get"). Either way, a green suite proves nothing about the fix.

The other alternative is the `cover` gap scan (`/cover-gaps`). It also accepts a diff. It ranks missing or weak coverage in the code, and it reads no ticket or commit message for intended behavior. It cannot write `Confirm with the owner` for an unstated behavior, and it does not check what the change needs. Use `test-case-design` when the question is "what does this change need".

The procedure has this order because each step limits the next one. The skill first fixes the commit range, then finds the callers, then reads the risk areas, then finds the intended behavior, and only then checks the existing tests. A test check before you know the intended behavior has no target.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all test-case-design /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:test-case-design` (plugin) or `/test-case-design` (installed copy) in the list. |
| 2 | Open the repository at the head commit. Get the diff of your change. For a branch, run `git diff <base>...HEAD`, where `<base>` is the merge base with the default branch. For a GitHub pull request, run `gh pr diff <number>`. For an Azure Repos pull request, fetch the source branch and run `git diff` against the target branch. In the sample, run `git diff 30b68e1~1..30b68e1`. | You see the exact range that the plan covers. | You can name the base commit and the head commit. |
| 3 | Run `/test-case-design <input>`. For a GitHub pull request, pass its number. For an Azure Repos pull request or a branch, pass the branch name. For a commit range, pass the range. In the sample, run `/test-case-design 30b68e1~1..30b68e1`. | The skill follows its change procedure when the input is a pull request, a branch, a commit range, or a diff. | The report has a "Change scope" section with the base and head commits. The skill saves the report to `.atb-work/test-case-design/<scope>.md`, which git ignores, unless you name another folder. |
| 4 | Read "Change scope". Check each search and its result count. | The count shows how far the change reaches. A search that was not possible must say `Not searched` with a reason. | Each affected function has a search and a count, or a reason. |
| 5 | Read the risk-area line in "Change scope". | A declared risk area gives a case high impact. The skill does not invent one. | The line names a matched area with its impact, or says `None declared`. |
| 6 | Read the "Inputs and assumptions" section. Answer each case whose expected result is `Confirm with the owner`. | When no source states the intended behavior, the skill does not copy it from the new code. | Each such case has an answer from the owner, or stays on your list of open questions. |
| 7 | Read what "Coverage notes" says about each named test. If the skill did not run a test, run it yourself. In the sample: `npm ci --ignore-scripts`, `npx prisma generate`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx jest src/tests/services/auth.service.test.ts`. | The skill reads each named test, runs it when it can, and flags a test that does not run or cannot fail. You confirm the result in your environment. | The test has a result, and you know if it asserts the changed behavior. If the file does not run on the base commit either, record that as a finding and judge the test by reading its body. Do not count it as coverage. |
| 8 | Prepare a running API, a database, and a registered user. Run the High cases first, then the Medium cases. Send the unit-level cases, such as TC-004, to `/cover`. | The case list is ordered by impact and likelihood. The skill uses `High`, `Medium`, and `Low`. The High cases are integration cases, so they need the running API and the database. | Each High case has a pass or fail result. |

## Decision points

- If the change is test-only or documentation-only, stop. The skill adds no case unless the change removes a test.
- If no ticket, pull request description, or acceptance criterion states the intended behavior, ask the owner. The skill writes `Confirm with the owner` as the expected result. Do not accept the behavior of the new code as correct.
- If the report says `None declared` for risk areas and you want the authentication paths to count as high impact, declare them first. Use [`risk-area-mapping`](../../skills/risk-area-mapping/SKILL.md) (`/risk-areas`). The page [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md) shows the procedure. A declared area adds effort. It never removes a case.
- If the case set has more than ten cases and a person can answer, the skill shows the five to ten highest cases and stops. Answer its questions about terms, level, priority, and case size. This run had eight cases, so the step did not apply. Expect a report of about this size for a one-line change.
- If the existing test cannot fail when the change is wrong, treat the behavior as not covered. A unit test with a mocked boundary does not prove that boundary. A test that does not run, as in this run, also counts as no coverage.
- Stop when each High case has a result, and each `Confirm with the owner` case has an answer or sits on your list of open questions.
- Choose [`story-refinement`](../../skills/story-refinement/SKILL.md) when the pull request links a ticket, but the ticket is too vague to test against. The page [Refine a vague story](qa-refine-a-vague-story.md) shows that path.
- Choose [`cover`](../../skills/cover/SKILL.md) when you want tests written for unit-level cases, such as TC-004. The High cases here need a running API and a database. In the sample, no test in the repository calls `GET /user` today. `test-case-design` reports cases and edits no tests.

## What you get

The run was headless, so no person answered the skill's questions. The skill asked no calibration question, because the set had eight cases. Two cases (TC-005 and TC-007) carry `Confirm with the owner`, because no source states the behavior. The skill requires this in its change procedure (`change-risk-planning.md`, step 5). These are the questions that the report leaves for a person.

First, the "Change scope" section. The count of 14 comes from a search for the token ID reads across the controllers.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
- Base and head commits: `30b68e1~1` (88b258c) to `30b68e1`. The plan
  applies to that range only.
...
- Affected callers and consumers, with each search and its result:
  - `grep -rn "getCurrentUser" src e2e`: 1 production caller
    (`auth.controller.ts:47`, route `GET /user`) and 1 test file.
  - `grep -rn "generateToken" src`: 4 call sites, all in
    `auth.service.ts` (`createUser`, `login`, `getCurrentUser`,
    `updateUser`). The other three already select `id`.
  - `grep -rn "auth?.user?.id" src`: 14 production uses in the
    article, profile, and tag controllers, plus 2 in the auth
    controller. Each reads the user ID from the token. A token
    without an ID breaks each of these routes.
  - Consumers of the `GET /user` response in other repositories (a
    front end): `Not searched`. No workspace map is available and the
    user gave no path.
- Matched risk areas and their impact lines: `None declared`. ...
```

The report explains the cause. Before the fix, `getCurrentUser` did not select the ID. The code then signed a token for `undefined`. The run decoded both tokens.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are the two raw lines of the token check. The first line is the token that `generateToken(undefined)` signs, which is the code before the fix. The second line is the token for ID 123. The fields `iat` and `exp` are the issue and expiry times.

```text
{"user":{},"iat":1794781475,"exp":1799965475}
{"user":{"id":123},"iat":1794781475,"exp":1799965475}
```

A client that stores the token from `GET /user` then sends a token with no ID to every route that reads the ID. Next, the first three cases.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the Requirement and Automation candidate columns are left out. The text of the columns that remain is verbatim.

| ID | Preconditions / data | Steps | Expected result | Level | Priority |
|---|---|---|---|---|---|
| TC-001 | A registered user with ID n and a valid token T1 | 1. Send `GET /api/user` with T1. 2. Decode the `token` field of the response. | Status 200. The decoded payload has `user.id` equal to n. | Integration | High |
| TC-002 | T2 is the `token` field from TC-001 | Send `GET /api/user` with T2. | Status 200 for the same user. | Integration | High |
| TC-003 | T2 from TC-001. 14 uses outside the auth controller read the ID from the token. | Send `POST /api/articles` with T2 and a valid article body. | Status 201. The author of the article is the user with ID n. | Integration | High |

T1 is the token that you send in TC-001. T2 is the `token` field that the TC-001 response returns. Use T2, not T1, in TC-002 and TC-003. T1 already carries an ID, so a test that reuses it proves nothing.

Last, the answer to your coverage question.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
- Existing test: `src/tests/services/auth.service.test.ts`, test
  "getCurrentUser > should return a token" (lines 202 to 224). It
  sets the mock to return an object with `id: 123` whatever the
  `select` asks for. It asserts only that the result has a `token`
  property. The test passes with and without the added line, so it
  does not cover this change. It cannot fail when the select drops
  the ID.
- The same test file does not run here. With the dependencies
  installed and a dummy `DATABASE_URL`, 7 of 12 tests fail on both
  `30b68e1` and `30b68e1~1` with `PrismaClientInitializationError`
  (no database at `localhost:5432`). The `getCurrentUser` test is one
  of the 7. ... The cause was not investigated. ...
```

The report says the test passes with and without the line. That is a reading of the test code. In this run the test failed on both commits before it reached the assertion.

What you must check in the output:

- The risk-area line says `None declared`, and no case has a "declared area" reason in its priority. The skill did not invent an area.
- Each High case maps to the fix: the token must carry the ID, and the next request must work.
- "Coverage notes" names the existing test and says why it cannot fail. In this run the test file did not run (7 of 12 tests failed on both commits). Record this as a finding for the team. The cause is not known.
- Cases with `Confirm with the owner` are open questions. Do not mark them as passed.

## Common mistakes

- You count the existing `getCurrentUser` test as coverage. It uses a mocked data layer that returns the ID even when the query omits it. By its code, the test never fails on this bug, and in this run it did not run at all. Read the test body before you accept it.
- You treat the path `src/app/routes/auth/` as a risk area because it handles login. The skill uses only the declared list. Without a list, priority comes from the change. Declare the area to change that.
- You skip the old-token case. The code signs tokens with a 60-day expiry (`expiresIn: '60d'` in `token.utils.ts`). Tokens that clients got before the fix have no user ID, and the fix does not repair them. TC-007 asks what the API must do with such a token.
- You take the new `id` field in the response body as correct because the code returns it. The commit message does not say that the body needs it. Ask the owner (TC-005).
- You expect the skill to run the tests or to write them. It reports cases only. You run the tests, or hand unit-level cases to `/cover`.

## Next

- [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md): when the report says `None declared` and the repository handles access control or personal data.
- [Refine a vague story](qa-refine-a-vague-story.md): when the linked ticket is too vague to test against.
- [`cover`](../../skills/cover/SKILL.md): when you want unit-level tests written from the cases, such as TC-004.
- [`webapp-testing`](../../skills/webapp-testing/SKILL.md): when the change has a browser flow. This API has none.
- [Use-case index](README.md): the full list of use-case pages.
