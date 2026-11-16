# Deliver an approved ticket as phased pull requests

This page is for a developer who has an approved ticket and must ship it as reviewable pull requests (PRs). You get a plan with one PR for each phase and a readiness verdict. You also get phase 1 built test-first on its own branch, with a review that lists what no test proved.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`phased-delivery`](../../skills/phased-delivery/SKILL.md) (`/dev-plan`, `/plan-review`, `/dev-start-phase`, `/dev-implement-task`, `/dev-phase-review`) | No levels. The skill has no depth levels. | An approved ticket with acceptance criteria. A repository with a test runner and a clean default branch. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run the full tests and note which ones fail before any change (the sample needs `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`). Then plan the phases and check the plan: `/agent-toolbelt:dev-plan <ticket-id | ticket-file | plan-file>`, then `/agent-toolbelt:plan-review <plan-file>`. Read the phase and PR map. Tell the agent in the session which phase and PR map you approve, or what to change.
3. Build one phase test-first: `/agent-toolbelt:dev-start-phase <phase>`, then `/agent-toolbelt:dev-implement-task <plan-step>` for each step of the plan. Then run the full suite, the type check, and the lint, and compare the failures with your baseline.
4. Review the phase before its PR opens: `/agent-toolbelt:dev-phase-review <phase>`. Fix each Blocking finding on the same branch. Decide on the other findings and record each decision.
5. Open the phase PR yourself, or tell the agent to open it. Start the next phase after the parent PR merges, unless a person approved a stack (a child PR whose base is the parent's branch).

You get a plan with a phase and PR map and a readiness verdict. You also get a phase branch with red and green test evidence, and a phase review.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The ticket is CON-12, "Bookmark articles". It is the refined story from [Refine a vague story](qa-refine-a-vague-story.md). The story has 18 acceptance criteria (AC-1 to AC-18, each one a rule the feature must meet), nine open questions (Q-1 to Q-9), and the verdict `Not ready`. Question Q-1 blocks the start because the data model depends on it.

This run used the recommended default of each question as the approved answer. No person answered. That was the instruction of the run, and it is not an approval. On a real project, the ticket owners answer these questions before you plan.

| Question | Default used in this run |
| --- | --- |
| Q-1 Is a bookmark a private list that is separate from favorites? | Yes. Favorites stay as they are. |
| Q-2 Does the list show the newest bookmark first? | Yes. This needs a saved date on each bookmark. |
| Q-3 Is there a maximum number of bookmarks for each reader? | No maximum in this story. |
| Q-4 Does the list hide the articles that the main list hides? | Yes. Use the same visibility rule. |
| Q-5 Who builds the button and the list screen? | A separate client ticket. |
| Q-6 Does the release need a feature flag? | No flag. |
| Q-7 Which telemetry ships with the endpoints? | Count requests and errors, in the existing logging style. |
| Q-8 Does a negative paging value get a 422 error? | Yes, for the new list only. |
| Q-9 Is a bookmark list personal data? | Yes. Delete bookmarks with the account. |

The run did not follow Q-7. The sample has no logging to copy, so the run built no telemetry and recorded the gap.

The sample has no database in this run. Findings in the phase review carry IDs such as F-3. Unit tests use the Prisma mock (a fake database client in `src/tests/prisma-mock.ts`). Before any change, 7 of 27 tests fail with `PrismaClientInitializationError`, because no database runs at `localhost:5432`. The sample has no BDD runner (a tool that runs Given/When/Then feature files).

You must deliver CON-12 so that a person can review each step. A phase is one slice of the ticket that ships as one PR.

## Why this path

The obvious alternative is one branch and one PR for the whole ticket. That is the common default, and it is faster to start. In this ticket the PR holds a new table, a migration, three endpoints, and a paging rule. It also holds a flag in seven places that build an article response. A reviewer reads all of it in one diff. The skill states the goal: it turns approved scope into small, verifiable PRs, and a human reviews the plan and each PR. The review cost of the single PR is practice, not a skill claim.

The skill also checks scope before it plans. For approved tickets, one ticket maps to one phase. A ticket that is too broad for one PR needs a human decision. The story itself says it likely fits one PR and proposes a two-slice split if it does not. The run used the two slices as a default and marked the split as a decision for a person.

Two siblings cover other starting points. Use `/dev-intake` when you have a raw requirement and no approved ticket. It stops after the acceptance criteria, so you run `/dev-plan` after it. Use `/shape-up` when the idea has open product decisions. After a PR opens, `pr-review` gives code findings. It does not check the phase against the acceptance criteria of its ticket. The phase review in this skill checks the phase against the acceptance criteria of its ticket.

The procedure has this order because each step limits the next one. The plan comes first. The readiness check runs before approval, and approval comes before any edit. Each phase then gets its own branch, its own tests, and its own review.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all phased-delivery /path/to/project`. | The commands must be available in your session. | You type `/` and see `/agent-toolbelt:dev-plan` (plugin) or `/dev-plan` (installed copy). |
| 2 | Start in the repository folder. Run the full test suite before any change: `<your-test-command>`. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`. | You must know which tests fail before your change. The skill's test-first contract asks for this baseline. | You have the list of failing tests. The sample has 7 failures in `auth.service.test.ts`. |
| 3 | Run `/agent-toolbelt:dev-plan <ticket-id \| ticket-file \| plan-file>`. In the sample, the argument is the refined story file `CON-12-refined.md`. | The skill maps each criterion to a phase, a branch, a PR target, and a named test. In ticket mode it does not invent Foundation, Polish, or Testing phases. | The plan has one row for each PR. Each row has its source, its acceptance link, its dependency, its branch, and its target. |
| 4 | Run `/agent-toolbelt:plan-review <plan-file>`. | The command checks coverage, decisions, dependencies, test levels, negative cases, reliability, and right size. It changes nothing. | The result is `Ready`, `Ready with warnings`, `Needs revision`, or `Not verified`, with evidence. The command changes nothing. `/dev-plan` runs the revision passes, at most 2. |
| 5 | Read the phase and PR map. Approve it or change it. | The skill waits for approval of the map before implementation. A passing readiness check does not grant that approval. | The plan's `Plan approval` line names who approved the map and when, and each row has a status. |
| 6 | Run `/agent-toolbelt:dev-start-phase 1`. | The command creates the phase branch, confirms the PR target, and checks the preconditions that the phase names. | The branch exists, the base is known, and each precondition passed. |
| 7 | For each plan step, run `/agent-toolbelt:dev-implement-task <plan-step>`. The agent writes a test, runs it, and checks the failure before it writes code. The skill asks for one test for each cycle. This run grouped three to seven tests by function in each red run. | A test that never failed proves nothing. The skill says a setup or compile failure is not a valid red result. In a typed language, the shared test-first contract now asks for a stub that throws, so the failure comes from behavior. The run did this by hand. | Each behavior has a red result (the test fails for the right reason) and a green result (it passes). |
| 8 | Run the full suite, the coverage command, the type check, and the lint. Read the diff for next-phase work. | The skill requires proportionate checks before review and a diff without work from another phase. | The only failures are the ones in your baseline from step 2. `git diff --numstat <base>..HEAD` shows only files of this phase. |
| 9 | Run `/agent-toolbelt:dev-phase-review 1`. Fix each Blocking finding on the same branch. Decide on the other findings and record each decision. Write a failing test before a behavior fix. | The review checks the phase diff against its own criteria and its recorded red and green evidence. | The verdict is `Ready`, `Needs Work`, or `Blocked`. Each item that no test proved says `Not verified`. Each non-blocking finding has a recorded decision. |
| 10 | Open the phase PR only when you authorize it. Record the PR, base, head, checks, and next phase in the plan. | A human owns the merge decision. The skill opens a PR only when the user authorized delivery. | The plan shows the PR link and the next action. |

This run stopped before step 10. It opened no PR and pushed nothing.

## Decision points

- If the story verdict is `Not ready` or a question blocks the start, stop and get the owner's answers first.
- If the repository has no test runner, ask the owner how to set one up. The skill needs a runner for the red and green evidence.
- If the ticket fits one PR, use one phase. The skill says a small request can need only one phase.
- If a ticket is too broad for one PR, stop. Stop also when it needs another ticket's work. Stop when it has missing or conflicting criteria, or an unclear stack base. A person must decide the scope. Do not split or combine tickets to make the workflow fit.
- If you have no approved ticket or plan, run `/dev-intake` first. If the ticket is too vague to test, go to [Refine a vague story](qa-refine-a-vague-story.md).
- If `/plan-review` returns `Needs revision`, it changes nothing. Edit the plan file yourself, or run `/dev-plan <plan-file>` again, to fix the technical gaps inside the scope. Then run `/plan-review` again. After 2 revision passes, report the open findings and stop.
- If a warning row stays open, such as test levels, negative cases, reliability, or right size, continue. Those rows are warnings, not gates, unless your project instructions make them a gate.
- If no database is available, write `Not covered` for each database check in the plan. List the checks that a database must run.
- If a phase depends on a parent PR that is still open, wait for the parent merge. Then base the next phase on the updated default branch. Start a stacked child branch (a branch whose PR targets the parent's branch) only when a person approved the stack.
- If the review finds a defect, write a failing test for it first, fix it, and record both runs.
- Stop when the phase review verdict is `Ready`. Stop also when it names the decision or the check that blocks it. A `Ready` verdict can still list `Not verified` items and open questions. They must close before merge. In this run the reviewer of the PR runs the database checks, and the backend owner answers F-7.
- Choose [Fix a reported bug](dev-fix-a-reported-bug.md) when the work is a defect with a report, not a ticket.
- Choose [Gate each phase](ops-gate-each-phase.md) when a fresh agent must review each phase PR at the phase boundary.

## What you get

The run was headless. No person approved the map, and no subagent was available. The skill now marks a headless map `Draft for approval`. This run predates that rule. The plan review and the phase review are therefore a Self-review (one author checks their own work). They are not an independent review.

First, the phase and PR map. The run split the ticket in two, using the story's own slice. The phase review later moved AC-10 and AC-11 into phase 1, and the update notes in the map say so.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run plan: the outcome cells and the last cell of phase 2 are cut at `...`. The other text is verbatim.

| Phase / source | Outcome and acceptance link | Depends on | Work branch -> PR target | PR URL / status |
|---|---|---|---|---|
| 1 / CON-12 slice 1 | A signed-in reader can bookmark, remove, and list their own bookmarks. ... AC-1 to AC-9, AC-14, AC-15, AC-18. AC-12 and AC-13 for these responses only. (Update after the phase 1 review: AC-10 and AC-11 also moved here, see Plan updates.) | none | `feat/con-12-bookmarks-1` -> `master` | Not opened (no PR authorized) |
| 2 / CON-12 slice 2 | The flag in every other article response. AC-12 and AC-13 for the other responses. AC-16, AC-17 verified with a database. (Update after the phase 1 review: AC-10 and AC-11 left this phase.) | Phase 1 | `feat/con-12-bookmarks-2` -> `master` after phase 1 merges. ... | Not started |

The plan names each criterion's test. For example, AC-6 (remove a bookmark that does not exist) maps to `unbookmarkArticle > succeeds when no bookmark exists`. Without a BDD runner, a named test stands in for a scenario.

Next, the red and green evidence. In step 7, the run added a stub that throws `not implemented`. The first run of the new tests failed on that error, which is the intended failure.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the Jest output: only the file line, the test lines, the error line, and the totals are kept.

```text
FAIL api src/tests/services/bookmark.service.test.ts
      ✕ stores a bookmark for the reader and returns the article as bookmarked (1 ms)
      ✕ succeeds when the bookmark already exists and does not write a second row (2 ms)
      ✕ writes with skipDuplicates so that a parallel request cannot fail (2 ms)
      ✕ rejects an unknown article with status 404 and writes nothing (3 ms)
      ✕ does not change the favorites of the article (1 ms)
    Rejected to value: [Error: not implemented]
Tests:       5 failed, 5 total
```

After the service code and one flag change in `getArticle`, the same five tests passed (`Tests: 5 passed, 5 total`). One test passed on its first run. The test "does not write a bookmark when the reader favorites an article" passed before any change. The run recorded it as existing coverage, not as test-first evidence.

The totals before the change and after the last commit show that the only failures are the old ones.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The first line is the baseline. The second line is the full suite on branch `feat/con-12-bookmarks-1` at commit 6a33a58 (three commits above the base).

```text
Tests:       7 failed, 1 todo, 19 passed, 27 total
Tests:       7 failed, 1 todo, 52 passed, 60 total
```

Then the phase review. It found a defect that the tests had not covered. The new list accepted a negative `limit`. The review marked it `Should Fix`. Prisma documents a negative `take` as a read from the end of the list. The run did not execute this against a database. The fix started with a failing test.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the Jest output of the failing run after the review: the two new tests that failed, and the totals.

```text
      ✕ rejects a negative limit with status 422 that names the field (22 ms)
      ✕ rejects a negative offset with status 422 that names the field (9 ms)
Tests:       2 failed, 18 passed, 20 total
```

The next run, after the fix, ended with `Tests: 20 passed, 20 total`.

The run also checked that the tests can fail. It made seven deliberate changes to the code, one at a time, and restored the file after each run. A deliberate change of this kind is a mutation check. Each change made at least one test fail. The table shows four of the seven. The run made the route-move change by hand, on the earlier code, and it made two tests fail.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from `evidence/14-mutation-summary.txt`: 4 of 7 rows shown. The first column is the run's description of the change. The second column is the Jest test name that failed, with the group prefix cut.

| Change to the code | Test that failed |
| --- | --- |
| `skipDuplicates` set to `false` | `bookmarkArticle › writes with skipDuplicates so that a parallel request cannot fail` |
| The reader filter removed from the list query | `getBookmarks › reads only the rows of the signed-in reader, for the list and for the count` |
| The list route moved after `/articles/:slug` | `GET /articles/bookmarks reaches the bookmark list and not the article route`, and `GET /articles/bookmarks without a token returns 401 and changes nothing` |
| Sign-in made optional on the list route | `GET /articles/bookmarks without a token returns 401 and changes nothing` |

Last, the verdict of the phase review. The run took `Ready` although 7 baseline tests fail, because they fail before any change. The full text of the review says so.

Excerpt from a run on the Conduit sample API at commit 30b68e1. From the run's phase review. Lines are wrapped, and `...` marks skipped text.

```markdown
Ready for a human review, with 5 items `Not verified` (database).
Reason for `Ready`: no Blocking finding remains, and the required checks
that can run here pass. ... The `Not verified` items need a database. The
plan recorded them as `Not covered` before the work started.
A reviewer must run the database checks before merge.
```

What you must check in the output:

- The plan has one row for each PR, and no row is a Foundation, Polish, or Testing phase.
- Each red result fails for the intended reason. A compile error or a missing module is a setup failure. The run kept two such files and did not count them as red evidence.
- The final totals show only the failures from your baseline.
- Each item that needs a database says `Not verified` and names the evidence that is missing. In this run these are the five rows of the review table: the migration, parallel requests, list order with privacy and visibility, the cascade rule (AC-16), and the title-change rule (AC-17).
- The phase review lists findings with a severity. In this run, one fixed `Should Fix` finding and several open items remain.

What was not executed in this run:

- No database ran. No migration was applied. The migration SQL came from `prisma migrate diff` and was not run on Postgres.
- No server started. The controller tests call the routes inside the test process, with a mocked database.
- The Given/When/Then scenarios of the story did not run, because the sample has no BDD runner.
- A unit test with a mocked database does not prove ordering, privacy, or concurrency. It proves what the service asks the database for.
- No PR was opened, and nothing was pushed.

## Common mistakes

- You treat a story with the verdict `Not ready` as approved. Q-1 blocks the start in this sample. This run used defaults only because the run instruction said so. Get the owner's answers first.
- You treat a green mock test as proof of database behavior. The tests check the query that the service builds, and the real list order is untested. Write `Not verified` and run an integration check before merge.
- You count a test that fails on a compile error as red evidence. The skill says a setup or compile failure is not a valid red result. This run added a stub that throws, then ran the test again. That stub was practice from this run. The shared TDD contract now has a stub step for typed languages, added after this run.
- You skip the baseline run. The 7 old failures look like your own regressions, and a real regression hides among them.
- You let phase 1 take work from phase 2, or you leave a rule for the new endpoint in phase 2. The review in this run moved the paging rule into phase 1, because the new list must not ship without it. Check the diff against the plan before review.
- You report a Self-review as an independent review. Say which one you ran. Use a fresh reviewer when the risk and the delegation allow it.
- You leave scratch files in the commit. The skill keeps scratch output in `.atb-work/` and tells you to run `git status --short` before you commit.

## Next

- [Refine a vague story](qa-refine-a-vague-story.md): when the ticket is too vague to plan.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): when you want a test plan for a change that already exists.
- [Set up a BDD runner](qa-set-up-a-bdd-runner.md): when you want the story's scenarios to run as the outer test of each phase.
- [Self-review before a PR](dev-self-review-before-a-pr.md): when a phase is ready and you want one more check before you open the PR.
- [Answer review comments](dev-answer-review-comments.md): after the phase PR opens and reviewers comment.
- [Gate each phase](ops-gate-each-phase.md): when a fresh agent must review each phase PR.
- [Survive a context reset](dev-survive-a-context-reset.md): when the work crosses sessions.
- [`bdd-scenarios`](../../skills/bdd-scenarios/SKILL.md): when you want the criteria as feature files before phase 1.
