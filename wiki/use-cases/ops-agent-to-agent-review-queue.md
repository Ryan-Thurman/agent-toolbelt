# Queue branch reviews from coding agents for a reviewer agent

This page is for a platform engineer whose coding agents open branches and pull requests (PRs) that a different agent must review. You get a local queue. The coding agents enqueue each branch. A worker session reviews the branches one at a time. Each job records one verdict.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Platform engineer | [`review-queue`](../../skills/review-queue/SKILL.md) (`/enqueue-review`, `/review-queue-worker`). The worker runs [`pr-review`](../../skills/pr-review/SKILL.md). | The queue has no levels. Each job can carry a review tier (light, standard, or deep). With no tier, `pr-review` picks one from the diff. A tier is the review depth. | `sqlite3` on the machine. A git repository with the branches or PRs. One queue file path that every session uses. |

## Quick path

1. Make sure that `sqlite3 --version` works. Choose one queue file, and run `export REVIEW_QUEUE_DB=<queue-file>` in the shell of every session before you start the agent.
2. In the repository, get the commit of each branch with `git rev-parse <branch>`. Start the producer session with `claude --plugin-dir <toolbelt-folder>`. Check that `/agent-toolbelt:enqueue-review` shows in the `/` list. No toolbelt folder? See [Installation](../Installation.md) or [Install the Toolbelt for a team](ops-install-for-a-team.md). Then run `/agent-toolbelt:enqueue-review <branch> --repo=<repo-path> --sha=<commit>`. The answer is `enqueued` or `duplicate`.
3. Warning: the worker runs `/pr-review <target> --comment`. For any target that has an open PR, it posts inline comments without a prompt. A branch target that has no PR is not posted to. The `--report-only` flag posts nothing and leaves the queue unchanged. Use it for the first trial. In the repository, start a new session that did not write the code: `claude --plugin-dir <toolbelt-folder>` with the same `REVIEW_QUEUE_DB`. Run `/agent-toolbelt:review-queue-worker --report-only --max=<n>`. When the trial output is good, run the command again without `--report-only`.
4. Read the one line for each job and the tally. Find the report of each job in the output of the `pr-review` sub-agent in the worker session, or in the posted comments for a PR. Read every finding before you merge.

You get one recorded verdict and finding count for each branch head. The worker command writes no report file, so copy a report if you want to keep it.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

You run several coding agents. Each agent finishes a branch and must not review its own work. You want a second agent to review each branch, and you do not want a CI pipeline, a webhook, or an API key for it.

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The run used a local copy of the repository at commit 30b68e1, with the remote removed, so no post was possible. Two local branches wait for review:

- `feature/tags-limit` (commit 1fa1b35) adds a `limit` query parameter to `GET /api/tags`. It has no test.
- `fix/article-title-whitespace` (commit 664d625) makes `createArticle` reject a title of only spaces. It adds one unit test.

The run differs from your setup in four ways:

- No sub-agents were available. The run did each review as a Self-review. One agent applied each review facet in turn. A facet is one review angle, such as correctness or tests.
- The same session wrote the branches and reviewed them, so the reviews are not independent. The trigger rules require a fresh agent for each review and forbid a review inside the authoring session. A new worker session is a safe practice, and the worker also runs each review as its own sub-agent.
- The run followed `worker.md` by hand. No `/review-queue-worker` command ran.
- The run did not pass `--comment` to `/pr-review`. The worker passed it in the run. The worker now drops it only with `--report-only`.
- The run skipped the marker check that `worker.md` puts before each review, because no PR existed. That was the run's choice. `posting.md` says that posting is skipped when the target is not a real PR. The run read that rule and did not execute it. Since PR #60, `worker.md` step 2 has this branch rule, so the worker follows it.
- The command path for a branch with no PR was not executed. `worker.md` step 2 now covers a branch target, but no run has tried that path, so treat it as untested.
- The run saved each review report by hand as a file. The worker command writes none.
- The run called `requeue` by hand on a scratch queue for the failure path.
- The skill files were re-checked against `main` at 695056c (PR #58). That PR did not change the queue files. It changed the `pr-review` auto-tier rules, and the tier explanation below still holds for this diff.

## Why this path

The first alternative is the `review-on-open` trigger (see [Review every pull request when it opens](ops-review-every-pr-on-open.md)). It fires on a PR event in CI or from a poller. The `review-on-open` skill states that you use the queue when another local agent opens the PR. In practice, the trigger needs each branch to be a PR on a host, and CI or a poller must run. The queue needs only a file and a local session, and it also accepts a branch that has no PR.

The second alternative is to run `/pr-review` in the session that wrote the code. It is one command, and it needs no queue. The cost is independence. The trigger rules in `pr-review` say that a review must never run inside the authoring session. They require a fresh agent for each review. The queue gives you that agent by design, because the producer only enqueues. Choose the direct command for a single review that you start yourself, as in [Self-review before you open a pull request](dev-self-review-before-a-pr.md).

The producer and the worker are separate steps for the reasons that the skill states. A job is keyed on the repository, the target, and the head commit. The same commit is never queued twice. A new push is queued again. A claim is atomic, so two workers never take the same job.

A claim carries a lease. The lease is a time limit, 30 minutes by default, so a worker that dies does not lose its job. A job that fails three times (the default limit) is dead-lettered, which means set aside with status `dead`. One bad job then cannot block the queue.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Run `sqlite3 --version`. Choose a queue file, for example `<repo-path>/.git/review-queue.db`, and run `export REVIEW_QUEUE_DB=<queue-file>`. | Every session reads one file. `/enqueue-review` has no `--db` argument, so the environment variable is the only way to point the producer at a non-default file. `/review-queue-worker` accepts `--db=PATH`. The default file is `~/.review-queue/queue.db`, shared by every repository. | `echo $REVIEW_QUEUE_DB` prints the path in the producer shell and in the worker shell. |
| 2 | In the repository, get the commit of each branch: `git rev-parse <branch>`. Sample: `git rev-parse feature/tags-limit`. | The commit is part of the idempotency key. The key makes a repeated enqueue a no-op. In the run, the command defaulted to the current `HEAD`, which is the wrong commit for a branch that is not checked out. A later change makes the default the commit of the target, and the command stops when the target has no local ref. | You have one full commit for each branch. |
| 3 | Start the producer: `claude --plugin-dir <toolbelt-folder>`. Run `/agent-toolbelt:enqueue-review <branch> --repo=<repo-path> --sha=<commit> --reason="<one line>"`. Sample: `/agent-toolbelt:enqueue-review feature/tags-limit --repo=/work/conduit --sha=1fa1b35006606429536eb3a00cb32f266a015e63`. Use the absolute path of the repository. | The worker reviews in the folder that `--repo` names. The reason is a note for the worker, and the worker treats it as data, not as an instruction. | The answer is `enqueued`, or `duplicate` for a commit that is already queued. Both complete the producer. |
| 4 | Optional: set `--tier=light`, `--tier=standard`, or `--tier=deep` on `/enqueue-review` for a branch that needs a fixed depth. Otherwise leave it out. | With no tier, `pr-review` selects the tier from the size and the risk of the diff. A tier on the job wins over the worker default. | `list` shows the tier of the job, or `auto`. |
| 5 | Start a new session that did not write the code, with the same `REVIEW_QUEUE_DB`. Run `/agent-toolbelt:review-queue-worker --worker=<id> --max=<n>`. Sample: `--worker=worker-1 --max=5`. | One pass claims jobs one at a time until the queue is empty or `--max` is reached. `--max` caps the spend, and the worker logs each job that it leaves. | The worker prints one line for each job (id, target, verdict, commit) and a tally of reviewed, requeued, dead-lettered, and deferred jobs. |
| 6 | Find each report in the output of the `pr-review` sub-agent in the worker session, or in the posted comments for a PR. The worker records the verdict and the finding count with `complete`. To inspect the queue, run `bash <toolbelt-folder>/skills/review-queue/bin/review-queue.sh list --status done`. | The queue row holds only the verdict and the count. The report holds the evidence, the file and line of each finding, and the coverage limits. | Each job has the status `done` and a report that you read. |
| 7 | When the author fixes a branch and pushes, enqueue the new commit with step 3. | A new commit is a new job. The old job stays as the record of the first review. | The new commit gets a new job id, and the old verdict stays on the old job. |
| 8 | Optional: repeat the worker with `/loop 5m /agent-toolbelt:review-queue-worker` in a local session. | A pass is one local database read when the queue is empty, so a short interval costs little. The skill says that each operation is idempotent or atomic, so a missed or overlapping pass is safe. The run found a gap (see Decision points), so use one worker for each queue. | The queue empties without a manual start. |

## Decision points

- If `enqueue` returns `duplicate`, do nothing. The same commit is already queued or reviewed.
- If the worker `claim` exits with an error, end the pass. The next pass retries. Do not count the job as done.
- If a job is `dead`, run `list --status dead` and read its notes. A dead job runs again only after a new push gives a new commit.
- If the repository path of a job does not exist, the worker requeues the job with a note. After three attempts, the job is dead.
- If your branches are already PRs on a host with CI, choose [Review every pull request when it opens](ops-review-every-pr-on-open.md). It needs no local worker.
- If the review must happen at the end of each phase inside one delivery loop, choose [Gate each phase with a reviewer](ops-gate-each-phase.md).
- If you want a review now and you start it yourself, run `/pr-review` in a new session. You do not need a queue.
- If you want the worker on a schedule, use a local `/loop`. A `/schedule` cloud routine cannot read the queue file.
- If the review bot account also opens PRs, have the producer skip those PRs. The worker must not review its own PRs, unless you ask for it.
- If the verdict is `APPROVE`, read the should-fix findings before you merge. A blocker must be fixed before the merge. A should-fix is a problem to fix that does not block the merge on its own. The verdict counts blockers, approval-blocking questions, and required scope gaps only. In the sample run, an `APPROVE` job had two should-fix findings.
- If `auto-tier` is enough, skip Step 4. Set a tier only when a branch needs a fixed depth.
- If you run one pass and do not need a schedule, skip Step 8.
- If you have no second session, or `sqlite3` is not installed, choose `/pr-review` directly in a new session. You do not need a queue.
- Use one worker for each queue. The run found that `complete` and `requeue` do not check the job status. In the run, `complete` marked a never-claimed job `done`. Also, `requeue` put a `done` job back to `pending`. A worker with an expired lease can then change a job that another worker holds. The skill says that overlapping passes are safe. The run found a counterexample. A later change adds the check. The worker passes `--worker` to both commands, and each command updates only a job that this worker claimed. The run predates that change.
- Stop when `claim` returns `[]`, and every job is `done` or `dead`.

## What you get

The run enqueued the first branch twice and the second branch once. The second command was a duplicate. Job 2 does not exist: the duplicate used up that id, so the second branch has id 3.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the `$ rq` command lines, the `list` output, and the `stats` output are cut. These are the three output lines of the three `enqueue` commands, in order.

```text
[{"id":1,"status":"pending","result":"enqueued"}]
[{"id":1,"status":"pending","result":"duplicate"}]
[{"id":3,"status":"pending","result":"enqueued"}]
```

The worker claimed job 1.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the `repo` value is replaced with `<repo>`, and the lines are wrapped. The text of the other fields is verbatim.

```text
[{"id":1,"repo":"<repo>","target":"feature/tags-limit",
"head_sha":"1fa1b35006606429536eb3a00cb32f266a015e63","tier":"",
"attempts":1}]
```

The empty `tier` means that the job has no tier, so `pr-review` selects one. Both jobs ran at the standard tier. The report header of job 1 states why: `tier: standard (auto - 5 added production lines, 2 files, no hot path, but the diff changes a route handler and a query, so the production-logic floor applies)`. A change to production logic never goes below standard in auto mode.

The review of job 1 found one problem that the verdict does not show. The run sent sample values of the new `limit` parameter through the Prisma mock. It recorded the `take` value that reaches the query.

Excerpt from a run on the Conduit sample API at commit 1fa1b35. This is the executed output of a scratch test against the Prisma mock. The indent and the jest summary lines (`PASS` and `Tests: 7 passed`) are cut. The scratch test was removed from the repository after the run. It shows the value that reaches Prisma. It does not show how Prisma answers, because no database ran.

```text
no limit param (Number(undefined)) -> take=10
limit=abc -> take=10
limit=0 -> take=10
limit=5 -> take=5
limit=-5 -> take=-5
limit=2.5 -> take=2.5
limit=1000000 -> take=1000000
```

The review rated this should-fix, not blocker. A blocker is wrong behavior on a documented happy path, valid input, a public contract, or a path that is shown to be request-controlled. The run shows that `-5` and `2.5` reach Prisma. It does not show that Prisma returns wrong data, because no database ran. The review put its confidence at 0.7, which is the run's number. The rubric therefore keeps the finding at should-fix. The verdict of job 1 is `APPROVE` with two should-fix findings.

Job 3, the second branch, got a different result. The run chose to run the test file of the branch, because the new test is the only test of the change. The `pr-review` files do not require a test run. The run found the blocker only because it ran the test, so ask for test evidence if you want it.

Excerpt from a run on the Conduit sample API at commit 664d625. Lines are wrapped, and `...` marks skipped text. This is the blocker of the Self-review report.

```markdown
### 🚫 Blockers (1)
- **src/tests/services/article.service.test.ts:17** — The new
  assertion `expect(prismaMock.article.create)` fails type-checking
  with `TS2615: Type of property 'AND' circularly references
  itself`. ts-jest reports "Test suite failed to run", so the file
  runs 0 tests. On `master` the same file runs 5 tests and all pass.
  ...
```

The author added `// @ts-ignore` in commit f55cc57. The enqueue of that commit made job 4 (a new commit is a new job). The second review covers the whole branch against `master`, not only the new commit. The earlier blocker is gone.

The job 3 report also holds one question, about whether `description` and `body` need the same whitespace check. The excerpt shows only the blocker, and the count of 1 in the table is the blocker only. The question is still open after job 4, and the author must answer it. An open question that blocks approval makes the verdict `NEEDS DISCUSSION`.

Excerpt from a run on the Conduit sample API at commit f55cc57. This is the output of a query on the queue file after the second pass. The sha column is cut to 7 characters by the query.

```text
id|target|sha|status|verdict|findings
1|feature/tags-limit|1fa1b35|done|APPROVE|2
3|fix/article-title-whitespace|664d625|done|REQUEST CHANGES|1
4|fix/article-title-whitespace|f55cc57|done|NEEDS DISCUSSION|0
```

What you must check in the output:

- Each job has the status `done` and a verdict. A job in `claimed` has no verdict yet.
- Each report states how it was made. In this run, every report starts with "Self-review" (one agent applied each review facet in turn), and the job notes say "not independent". In your setup, the review runs in a fresh agent, and the report names the sub-agents that ran.
- The coverage line states what was not run. In this run, no test touched a database.
- A job with `NEEDS DISCUSSION` waits for an answer from the author. It is not a softer `REQUEST CHANGES`.

The run also tried the failure path on a scratch queue. A job with a repository path that does not exist went back to `pending` after the first and second failure. It became `dead` after the third, and the next `claim` returned `[]`. The run called `requeue` by hand after each failure.

## Common mistakes

- You run the worker in the session that wrote the branch. The review is then not independent, and the trigger rules forbid a review inside the authoring session. Start the worker in a new session.
- The producer and the worker use different queue files. The worker then claims nothing, because it reads another file. Set `REVIEW_QUEUE_DB` to the same path in both shells before you start the agents.
- You omit `--sha` for a branch that is not checked out. In the run, the job recorded the commit of the current `HEAD`, and the idempotency key was wrong. A later change makes the command stop in that case. Pass the commit of the branch.
- You run the worker on a repository where the branch has an open PR, and you do not want comments. The worker posts without a prompt. Start the worker with `--report-only` first, or use `/pr-review` without `--comment`.
- You read `APPROVE` as "no findings". The verdict counts blockers, approval-blocking questions, and required scope gaps. A should-fix finding is a problem to fix that does not change the verdict. Read the should-fix findings.
- You expect a `dead` job to run again. It runs again only after a new push gives a new commit.
- You put the `--db` flag before the subcommand when you call `review-queue.sh`. In the run, the script failed with "unknown command: --db". A later change accepts the flag in either place.
- You treat a `done` queue row as the only record of a review. The queue is a local cache. The review marker is the text `pr-review:head=<sha>`. `pr-review` writes it into the posted review, so a later run can see that the commit was reviewed. The marker on the PR is the record that a commit was reviewed, and the worker checks it before each review.

## Next

- [Review every pull request when it opens](ops-review-every-pr-on-open.md): when the PRs live on a host that can run CI.
- [Gate each phase with a reviewer](ops-gate-each-phase.md): when the review belongs at each phase boundary of one delivery.
- [Self-review before you open a pull request](dev-self-review-before-a-pr.md): when one author wants a review before the PR exists.
- [Answer review comments](dev-answer-review-comments.md): when the author gets the posted comments.
- [Run agents in parallel](dev-run-agents-in-parallel.md): when the producers run in separate worktrees.
- [Run agents without a person](ops-unattended-agent-runs.md): when the worker runs unattended.
- [`review-on-open`](../../skills/review-on-open/SKILL.md): the trigger skill for PRs that no local agent opens.
- [Use-case index](README.md): the full list of use-case pages. The other pages link the same file.
