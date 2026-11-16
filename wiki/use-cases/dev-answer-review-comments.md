# Answer review comments on your pull request

This page is for a developer whose pull request has open reviewer comments. You fix the comments that you accept, with tests and a record of each decision. Then you get a drafted answer for every comment, and the draft cites the code that changed.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`pr-improve`](../../skills/pr-improve/SKILL.md) (`/pr-improve`), then [`pr-review-reply`](../../skills/pr-review-reply/SKILL.md) (`/pr-review-reply`) | No levels. `pr-improve` limits the work with a round bound (`--rounds`, default 3). | A branch with open reviewer threads, and a test command that runs without the full environment. `gh` or `az` signed in, to fetch host threads (without it, paste the comments). A PR number is optional. |

## Quick path

1. Check out the PR branch and start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Run your tests and note which ones already fail, so you can tell them from failures that your fix causes.
2. Fix the comments that you accept: `/agent-toolbelt:pr-improve <pr-number | branch> --scope <folder>[,<folder>]`. Add every folder that holds a file you must change, tests included. In the same message, say that the findings are the open review threads of the PR, and paste them if the agent cannot fetch them. Name the accepted threads and the deferred ones.
3. Read `.atb-work/pr-improve/<target-slug>/ledger.md`. Each accepted row is verified, and the scope check says in scope. Commit and push the fix yourself. `pr-improve` does not commit unless you authorize it.
4. Draft the answers: `/agent-toolbelt:pr-review-reply <pr-number>`. With no open PR or no host CLI, paste the comments and add `--since=<reviewed-commit>`. Read each block and make sure that its citations match your fix commit.

You get fixes with test evidence for the accepted comments, and one drafted reply for each open thread. Nothing is posted.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub (MIT license). The branch in this run, `feat/comments-count`, is local. It adds a `commentsCount` field to the article JSON. Commit baa6d31 makes the change, and commit 5c6378e is the later fix. The commits and the branch name on this page are examples. Replace them with your own.

You have reviewer threads on the change and you must do two jobs. You must change the code for the comments that are right, and you must answer every thread, also the ones that you do not change.

No human reviewer was available, so the run used a stand-in. It reviewed baa6d31 with the `pr-review` skill (`/review-diff`, standard tier: the middle depth of light, standard, and deep) and used the four `should-fix` findings (findings that a reviewer wants fixed before merge) as four reviewer threads. No subagent tool existed, so one agent ran each review lens in turn. The run labels this a Self-review, because it is not independent of the code that it reviews. The page [Self-review before a pull request](dev-self-review-before-a-pr.md) shows `/review-diff` on its own.

The four threads, as the run pasted them (`threads.md`). The ID `T-n` on this page means thread `pasted-n`. A pasted thread cannot be posted. A real thread has a host ID instead.

Excerpt from a run on the Conduit sample API at commit baa6d31. Lines are wrapped, and `...` marks skipped text.

```text
pasted-1 (src/app/routes/article/article.mapper.ts:13)
commentsCount is missing from the favorite and unfavorite responses.
favoriteArticle and unfavoriteArticle build their own result and never
set the field (article.service.ts:607, :653). ...

pasted-2 (src/tests/utils/article.mapper.test.ts:4-24)
No test shows that the service queries select the comment count. The new
test builds _count by hand, so it cannot fail when a query drops
comments: true or a path skips the field.

pasted-3 (src/app/routes/article/article.service.ts:102)
The comment count on the list queries has no index on Comment.articleId.
The migrations create the foreign key only. ... Not measured.

pasted-4 (src/app/routes/article/article.mapper.ts:13)
The mapper throws when a caller does not select _count. ... A new caller
that omits _count returns a 500.
```

There is no database. The run used the Prisma mock for unit tests. The sections below name what the run did not execute.

## Why this path

The obvious alternative is `pr-review-reply` alone. It reads the threads, checks each one against the code that changed since the review, and drafts a reply per thread. It edits files only when you ask for code changes. Alone, it marks each thread that needs a code change as `needs-follow-up`. You then fix the code by hand, with no ledger and no test evidence. A reply written before the fix has no changed line to cite.

The other alternative is `/simplify`. Its command file describes it as cleanup of a diff, applied on opt-in. It starts from no findings and keeps no record of which comments you accept (this reason is practice, not stated by the skill). Use it when no reviewer finding exists.

The order is fix first, then reply, because of the evidence rule in `pr-review-reply`. A `changed` reply must cite a line in the diff since the reviewed commit. `pr-improve` first freezes a baseline and a ledger of findings and decisions, fixes only inside a scope that you set, and re-reviews after each round. The skill states one reason in its text: the baseline is the durable source, not the chat history. The reasons for the scope and for the re-review after each round are practice, not stated by the skill: they keep the fix loop and the number of rounds bounded.

The two-skill path costs more than either alternative. You run two commands, read a ledger, and make one commit before the reply. In a phased delivery, `/dev-fix-review-issues` is the equivalent command for review findings. This page covers a single PR.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the packs into the project: `./install.sh --harness all pr-improve pr-review pr-review-reply /path/to/project`. `pr-improve` re-runs `pr-review` after each round. | Both skills must be available in your session. | You type `/` and see `/agent-toolbelt:pr-improve` and `/agent-toolbelt:pr-review-reply` (plugin), or the same names without the prefix (installed copy). |
| 2 | Check out the branch. Write down the commit that the reviewer saw: `git rev-parse --short HEAD`. In the sample, run `git switch feat/comments-count`. The commit is baa6d31. | `pr-review-reply` reads this commit from each GitHub thread. You need it yourself for `--since`, after a force push, or for pasted comments. | You have the branch name and the reviewed commit. |
| 3 | Run the tests before you change anything. In the sample: `npm ci --ignore-scripts`, `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`. The dummy URL makes the Prisma client load. It does not connect to a database. | You learn which tests already fail, so you do not blame your fix for them. | You have a list of failing tests. In the sample, `auth.service.test.ts` fails 7 tests at 30b68e1 and on the branch, because no database exists. If your suite needs a database, start it first. |
| 4 | Read the threads. Decide for each one: accept (fix it), defer (not now), or reject (keep the code, with a reason). | `pr-improve` fixes only accepted findings. The skill records an agent recommendation as `deferred` until you accept it. | Each thread has a decision and a reason that you can say in one sentence. |
| 5 | Run `/agent-toolbelt:pr-improve <pr-number \| branch> --scope <folder>[,<folder>]`. Add the decisions in the same message, for example: "Findings are the open review threads. I accept threads 1 and 2. Defer thread 3. Reject thread 4 because ...". In the sample: `/agent-toolbelt:pr-improve feat/comments-count --scope src/app/routes/article,src/tests`. | The skill fixes only inside the scope. The default scope is the changed paths of the baseline. A test in a file that your change did not touch needs a wider scope. | The report names the baseline, the scope, the ledger status, the checks, and one of `converged`, `capped-not-converged`, or `escalated`. |
| 6 | Open `.atb-work/pr-improve/<target-slug>/ledger.md`. Read the finding rows, the round log, and the final status. | The ledger is the record of what was fixed, with which evidence. A behavior fix needs a failing test first, or a decisive behavior pin with a recorded reason. | Each accepted row is `verified` with test evidence (or a recorded behavior pin). The scope check says "in scope", with no untracked file. |
| 7 | Read the re-review that ends the round. Add each new finding to the ledger and decide on it. | The skill runs `pr-review` on the round's delta again. A fix can raise a new finding. | No accepted finding is open, or the round bound is reached and you know why. |
| 8 | Commit and push the fix yourself. | `pr-improve` does not commit or push unless you authorize it. `pr-review-reply` reads the diff from the reviewed commit to `HEAD`, so it cannot see uncommitted work. | `git log <reviewed-commit>..HEAD --oneline` lists your fix commit. In the sample run, the commit 5c6378e was local only. Nothing was pushed. |
| 9 | Run `/agent-toolbelt:pr-review-reply <pr-number>`. Without an open PR or a host CLI, the skill runs report-only and triages comments that you paste. In the sample, run `/agent-toolbelt:pr-review-reply --since=baa6d31` and paste the four comments into the message. | The skill triages each open, unresolved, human thread as `answered`, `changed`, or `needs-follow-up`, and drafts one reply block each. | The output has one block per open thread and a summary line, such as `1 answered · 2 changed · 1 needs-follow-up`. |
| 10 | Read each block. Run `git diff <reviewed-commit>..HEAD --stat` and make sure that each cited line exists. Edit a reply that claims more than the code shows. Post the replies yourself. | A `changed` reply must cite a line in the diff since the review. The skill does not resolve a thread unless you ask it to. The reviewer decides whether to resolve it. | Each citation matches the diff and each reply says what the thread needs. |

## Decision points

- If a thread needs a design choice or an environment that you do not have, defer it. Reply `needs-follow-up` with the exact question or the missing change. Thread T-3 needed an index migration and a query plan. The run had no database, so it deferred.
- If a thread rests on a wrong reading, or the code already behaves as the reviewer wants, reject it in the ledger with evidence. Do not change the code. The reply is `answered` and cites the existing line.
- If you decline a correct finding and give a reason, the fit is looser. Thread T-4 is an example: the mapper does fail when a caller omits `_count`, and the run kept that behavior. The run used `answered` and stated the reason in Response. This is the run's choice. The skill defines `answered` as a concern that existing code already addresses, and it has no status for declined. Use `needs-follow-up` with a question when you want the reviewer to agree.
- If a thread asks only a question, skip `pr-improve`. Go to step 9, and the reply is `answered`.
- If a fix covers only part of what the thread asks, write the gap in the reply. Thread T-2 asked for tests of the service paths. The run covered 4 of 7 paths and said so. Use `needs-follow-up` when the reviewer wants all of them.
- If the report says `capped-not-converged`, read the remaining ledger rows. Raise `--rounds` only when each round still lowered the open count. Otherwise stop and decide by hand. This rule is practice, not stated by the skill.
- If an edit leaves the scope, the loop must stop. Widen the scope only with a recorded reason.
- If the same issue returns, severity changes back and forth, or a fix only moves the defect, stop editing. `pr-improve` escalates the design question to you. A cap of three rounds is not convergence.
- If the host CLI is missing or the branch has no open PR, `pr-review-reply` runs report-only and says why. Paste the comments, and give the reviewed commit with `--since`.
- Stop when each accepted ledger row is `verified` and each open thread has a reply block that you read.
- Choose [Turn test cases into tests](qa-turn-test-cases-into-tests.md) when the reviewer asks for new tests and you need the cases first.
- Choose [Self-review before a pull request](dev-self-review-before-a-pr.md) when you want to find the issues before a reviewer does.
- Choose [Review every PR on open](ops-review-every-pr-on-open.md) when a bot or a poller must post the reviews that you answer here.
- Choose [Gate each phase](ops-gate-each-phase.md) when the PR is one phase of a larger delivery. The gate runs `pr-improve` for blockers in solo mode, as the [solo gate workflow](../../workflows/phase-gate-solo-workflow.md) shows.
- Choose [`/simplify`](../../skills/simplify/SKILL.md) when no reviewer finding exists and you only want cleanup.

## What you get

The run was headless, so no person made the decisions in steps 4 and 5. The run made them and labeled each one in the ledger as "run (stand-in for the author)". The skill reserves these decisions for you. The run also made a local commit for step 8, which the skill does not do on its own.

The ledger after one round. It shows the four decisions and the result of each. The row T-5 is left out: it is a deferred nit from the re-review of the round, with status `open`.

Excerpt from a run on the Conduit sample API at commit 5c6378e. Condensed from the ledger: the Source, Owner, and Round columns and the row T-5 are left out. Each cell keeps its first sentence, `...` marks a cut, and the file references inside the Verification cells are removed.

| ID | Decision | Evidence | Status | Verification |
| --- | --- | --- | --- | --- |
| T-1 | accepted | article.service.ts:607 and :653 set favoritesCount and no commentsCount | verified | Red: 2 favorite tests failed. Green: 13 of 13 tests pass. |
| T-2 | accepted | article.service.test.ts has no test for the five mapper callers | verified | 2 of 4 new tests already passed before the fix (tests that describe the current behavior of getArticle and getArticles). ... |
| T-3 | deferred | No index on Comment.articleId ... | open | Not run: needs a database and a query plan. |
| T-4 | rejected | article.mapper.ts:11-12 (before the change) already read article.favoritedBy with no guard ... | open | Not applicable: no change made. |

Two rows show a gap in the ledger vocabulary. T-3 and T-4 end with the status `open`, because the skill lists no final status for a deferred or rejected row. The final status of the run reads "converged for the accepted findings", which is the run's wording.

The first test run before the fix, for T-1. The two favorite tests failed for the intended reason: the field was absent.

Excerpt from a run on the Conduit sample API at commit baa6d31 plus the new tests. These are verbatim lines of the test output. `...` marks skipped lines.

```text
    commentsCount
      ✕ favoriteArticle should return the number of comments (4 ms)
      ✕ unfavoriteArticle should return the number of comments (3 ms)
...
    Expected path: "commentsCount"
    Received path: []
```

The two other new tests (T-2) passed before the fix, so they describe existing behavior. The run then deleted `comments: true` from the `getArticle` and `getArticles` queries. Both tests failed, and the run restored the file. This check was the run's own practice. The skill does not require it. It shows that the tests can fail. The tests assert the arguments of the mocked query, so they do not prove that a database returns the count.

Last, the drafted replies. This is the `pr-review-reply` output in report-only mode. The run read the diff since baa6d31, which holds one commit with 2 files and 87 added lines.

Excerpt from a run on the Conduit sample API at commit 5c6378e. Lines are wrapped. The header lines are left out, and `...` marks the block for `pasted-2`. That block has status `changed` and names the four tests and the three paths without a test. The text of the other blocks is verbatim.

```text
[[thread:pasted-1]]
Status: changed
Response: `favoriteArticle` and `unfavoriteArticle` now select `comments`
in `_count` and return `commentsCount` (`article.service.ts:597`, `:609`,
`:645`, `:657`, commit 5c6378e). Two new tests assert the field on both
routes (`article.service.test.ts:168-190`).

...

[[thread:pasted-3]]
Status: needs-follow-up
Response: Not changed. The fix is an index on `Comment.articleId`
(`@@index([articleId])` in `src/prisma/schema.prisma` plus a migration),
and a query plan of `GET /articles` with a seeded Comment table to show
the cost before and after. Question for the reviewer: add the index in
this PR, or in a separate PR?

[[thread:pasted-4]]
Status: answered
Response: The existing mapper already assumes its caller selects the
relations it reads: `article.favoritedBy.some(...)` at `article.mapper.ts:11`
throws the same way when `favoritedBy` is missing. All 5 mapper callers
select `_count.comments` (`article.service.ts:102`, `:152`, `:235`, `:267`,
`:381`). A fallback of 0 would show a wrong count where a missing select
now fails at once. No change was made.

1 answered · 2 changed · 1 needs-follow-up
```

What you must check in the output:

- Each `changed` reply cites a line that exists in `git diff <reviewed-commit>..HEAD`. The line numbers belong to commit 5c6378e. They move after your next commit, so cite them at the commit that the reply names.
- A `needs-follow-up` reply names the missing change or asks one concrete question. It does not say "will fix".
- No reply says that a thread is resolved. The skill does not resolve threads unless you ask it to.
- Each accepted ledger row has test evidence. A test that passes before the fix only describes existing behavior.

Not executed in this run: any test against a real database, any HTTP request, the query plan for T-3, any call to a host CLI (`gh` or `az`), and any posting. The run also skipped `npm ci` and `prisma generate`, because the copy of the sample already had its dependencies and a generated client. The full suite at the branch head gives 24 passed and 7 failed tests. The 7 failures are the `auth.service.test.ts` tests that also fail at 30b68e1. The page text was checked against the skill files at Toolbelt commit 695056c, which includes the skill fixes of PR #58.

## Common mistakes

- You draft the replies before you commit the fix. The skill reads the diff from the reviewed commit to `HEAD`, so it finds no change to cite. By the skill text, you get `needs-follow-up` for threads that you already fixed. The run did not test this order.
- You let the agent decide which findings to accept. The skill keeps an agent recommendation as `deferred` until you accept it, so nothing gets fixed. Name the accepted threads in your message.
- You leave the test folder out of `--scope`. The default scope is the changed paths of the baseline. A fix that needs a test in an untouched file stops at the scope guard.
- You count a test that mocks the database as proof of the database behavior. T-2 asserts the arguments of a mocked query. The reply says so. Confirm the behavior against a real database before you merge.
- You write `changed` for a thread that the fix covers only in part. Name the gap in the reply, or use `needs-follow-up`.
- You treat `changed` as "resolved". The reviewer decides whether to resolve the thread. By default the skill does not change a thread's resolved state. It sets one only when you explicitly ask it to resolve answered threads.
- You post with `--post` before you read the blocks. This page drafts only. The skill asks for confirmation first. It writes each reply into its thread with an idempotency marker, so a rerun does not repeat it. It does not resolve the thread unless you ask. Read each block before you post.

## Next

- [Self-review before a pull request](dev-self-review-before-a-pr.md): find the issues before your reviewer does.
- [Review every PR on open](ops-review-every-pr-on-open.md): when reviews arrive automatically on each PR.
- [Gate each phase](ops-gate-each-phase.md): when each phase of a delivery gets a review and a bounded fix loop.
- [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md): when the PR is one phase of a larger change.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when a reviewer asks for tests that need cases first. The [`cover`](../../skills/cover/SKILL.md) skill writes them.
