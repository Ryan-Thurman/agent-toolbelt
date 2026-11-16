# Queue branch reviews from coding agents for a reviewer agent

This page is for a platform engineer whose coding agents open branches and pull requests (PRs) that a different agent must review. You get a local queue. The coding agents enqueue each branch. A worker session reviews the branches one at a time. Each job records one verdict.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Platform engineer | [`review-queue`](../../skills/review-queue/SKILL.md) (`/enqueue-review`, `/review-queue-worker`). The worker runs [`pr-review`](../../skills/pr-review/SKILL.md). | The queue has no levels. Each job can carry a review tier (light, standard, or deep). With no tier, `pr-review` picks one from the diff. A tier is the review depth. | `sqlite3` on the machine. A git repository with the branches or PRs. One queue file path that every session uses. |

## Quick path

1. Make sure that `sqlite3 --version` works. Choose one queue file, and run `export REVIEW_QUEUE_DB=<queue-file>` in the shell of every session before you start the agent.
2. In the repository, get the commit of each branch with `git rev-parse <branch>`. Start the producer session with `claude --plugin-dir <toolbelt-folder>`. Check that `/agent-toolbelt:enqueue-review` shows in the `/` list. No toolbelt folder? See [Installation](../Installation.md) or [Install the Toolbelt for a team](ops-install-for-a-team.md). Then run `/agent-toolbelt:enqueue-review <branch> --repo=<repo-path> --sha=<commit>`. The answer is `enqueued` or `duplicate`.
3. Warning: the worker runs `/pr-review <target> --comment`. For a PR number, it posts inline comments without a prompt. A branch name has no PR, so the worker reviews it without `--comment`. The `--report-only` flag posts nothing and does not claim, complete, or requeue a job. Use it for the first trial. In the repository, start a new session that did not write the code: `claude --plugin-dir <toolbelt-folder>` with the same `REVIEW_QUEUE_DB`. Run `/agent-toolbelt:review-queue-worker --report-only --max=<n>`. When the trial output is good, run `/agent-toolbelt:review-queue-worker --worker=<id> --max=<n>`.
4. Read the one line for each job and the tally. Find the report of each job in the output of the `pr-review` sub-agent in the worker session, or in the posted comments for a PR. Read every finding before you merge.

You get one recorded verdict and finding count for each branch head. The worker command writes no report file, so copy a report if you want to keep it. The run followed the command files by hand, so the slash commands themselves did not run (see Not exercised).
The sections below explain each step, when to stop, and what the output looks like.

## Situation

You run several coding agents. Each agent finishes a branch and must not review its own work. You want a second agent to review each branch, and you do not want a CI pipeline, a webhook, or an API key for it.

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The run used a local copy of the repository at commit 30b68e1, with the remote removed, so no post was possible. Three local commits wait for review:

- `feature/tags-limit` (commit 1ed8c60) adds a `limit` query parameter to `GET /api/tags`. It has no test.
- `fix/article-title-whitespace` (commit fc9792f) makes `createArticle` reject a title of only spaces. It adds one unit test.
- Commit c903493 on the same branch adds `// @ts-ignore` to that test. It is the author's fix in Step 7.

The run differs from your setup in these ways:

- No sub-agents were available. The run did each review as a Self-review. One agent applied each review facet in turn. A facet is one review angle, such as correctness or tests.
- The same session wrote the branches and reviewed them, so the reviews are not independent. The trigger rules require a fresh agent for each review and forbid a review inside the authoring session. A new worker session is a safe practice.
- The run followed the command files and `worker.md` by hand. No slash command ran.
- Both branches have no PR, so `worker.md` step 2 applies its branch rule: no marker check and no `--comment`. The run saved each review as a file by hand. The worker command writes none.

## Why this path

The first alternative is the `review-on-open` trigger (see [Review every pull request when it opens](ops-review-every-pr-on-open.md)). It fires on a PR event in CI or from a poller. The `review-on-open` skill states that you use the queue when another local agent opens the PR. In practice, the trigger needs each branch to be a PR on a host, and CI or a poller must run. The queue needs only a file and a local session, and it also accepts a branch that has no PR.

The second alternative is to run `/pr-review` in the session that wrote the code. It is one command, and it needs no queue. The cost is independence. The trigger rules in `pr-review` say that a review must never run inside the authoring session. They require a fresh agent for each review. The queue gives you that agent by design, because the producer only enqueues. Choose the direct command for a single review that you start yourself, as in [Self-review before you open a pull request](dev-self-review-before-a-pr.md).

The producer and the worker are separate steps for the reasons that the skill states. A job is keyed on the repository, the target, and the head commit. The same commit is never queued twice. A new push is queued again. A claim is atomic, so two workers never take the same job.

A claim carries a lease. The lease is a time limit, 30 minutes by default, so a worker that dies does not lose its job. A job that fails three times (the default limit) is dead-lettered, which means set aside with status `dead`. One bad job then cannot block the queue.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Run `sqlite3 --version`. Choose a queue file, for example `<repo-path>/.git/review-queue.db`, and run `export REVIEW_QUEUE_DB=<queue-file>`. | Every session reads one file. `/enqueue-review` has no `--db` argument, so the environment variable is the only way to point the producer at a non-default file. `/review-queue-worker` accepts `--db=PATH`. The default file is `~/.review-queue/queue.db`, shared by every repository. | `echo $REVIEW_QUEUE_DB` prints the path in the producer shell and in the worker shell. |
| 2 | In the repository, get the commit of each branch: `git rev-parse <branch>`. Sample: `git rev-parse feature/tags-limit`. | The commit is part of the idempotency key. The key makes a repeated enqueue a no-op. For a branch target, the default is `git rev-parse --verify <target>^{commit}`, so the command takes the commit from the target branch, not from `HEAD`. The command stops and asks for `--sha` when the target has no local ref. A PR number has no local ref, so pass the PR head oid. | You have one full commit for each branch. |
| 3 | Start the producer: `claude --plugin-dir <toolbelt-folder>`. Run `/agent-toolbelt:enqueue-review <branch> --repo=<repo-path> --sha=<commit> --reason="<one line>"`. Sample: `/agent-toolbelt:enqueue-review feature/tags-limit --repo=/work/conduit --sha=1ed8c60fb021acab216e86b2ac075a58fec82014`. Use the absolute path of the repository. | The worker reviews in the folder that `--repo` names. The reason is a note for the worker, and the worker treats it as data, not as an instruction. | The answer is `enqueued`, or `duplicate` for a commit that is already queued. Both complete the producer. |
| 4 | Optional: set `--tier=light`, `--tier=standard`, or `--tier=deep` on `/enqueue-review` for a branch that needs a fixed depth. Otherwise leave it out. | With no tier, `pr-review` selects the tier from the size and the risk of the diff. A tier on the job wins over the worker default. | `list` shows the tier of the job, or `auto`. |
| 5 | Start a new session that did not write the code, with the same `REVIEW_QUEUE_DB`. First run `/agent-toolbelt:review-queue-worker --report-only --max=<n>`. Then run `/agent-toolbelt:review-queue-worker --worker=<id> --max=<n>`. Sample: `--worker=worker-1 --max=5`. | The trial lists the pending jobs and reviews them without `--comment`. It makes no `claim`, `complete`, or `requeue` call. The real pass claims jobs one at a time until the queue is empty or `--max` is reached, and it passes `--worker` to `complete` and `requeue`. | The trial prints one line for each job and changes no row. The real pass prints one line for each job (id, target, verdict, commit) and a tally of reviewed, requeued, dead-lettered, and deferred jobs. |
| 6 | Find each report in the output of the `pr-review` sub-agent in the worker session, or in the posted comments for a PR. The worker records the verdict and the finding count with `complete`. To inspect the queue, run `bash <toolbelt-folder>/skills/review-queue/bin/review-queue.sh list --status done`. | The queue row holds only the verdict and the count. The report holds the evidence, the file and line of each finding, and the coverage limits. | Each job has the status `done` and a report that you read. |
| 7 | When the author fixes a branch and pushes, enqueue the new commit with step 3. | A new commit is a new job. The old job stays as the record of the first review. | The new commit gets a new job id, and the old verdict stays on the old job. |
| 8 | Optional: repeat the worker with `/loop 5m /agent-toolbelt:review-queue-worker` in a local session. | A pass is one local database read when the queue is empty, so a short interval costs little. The skill says that each operation is idempotent or atomic, so a missed or overlapping pass is safe. | The queue empties without a manual start. |

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
- If `auto-tier` is enough, skip Step 4. If you do not want a trial, skip the `--report-only` run in Step 5. Set a tier only when a branch needs a fixed depth.
- If you run one pass and do not need a schedule, skip Step 8.
- If you have no second session, or `sqlite3` is not installed, choose `/pr-review` directly in a new session. You do not need a queue.
- If a worker has lost its lease, its `complete` or `requeue` exits non-zero with `updated:0` and changes nothing. Do not retry. Log the job id and continue. Both commands need `--worker` and act only on a job that this worker claimed.
- Stop when `claim` returns `[]`, and every job is `done` or `dead`.

## What you get

The run enqueued the first branch twice and the second branch once. The repeat of the first branch was a duplicate. It used up id 3, so the later job for the fixed commit has id 4.

Excerpt from a run on the Conduit sample API at master 30b68e1 (rerun, current skill files). Condensed from the run output: the `$` command lines and the `list` and `stats` output are cut. These are the three output lines of the `enqueue` commands, in order. Each `--sha` came from `git rev-parse --verify <target>^{commit}` while `master` was checked out.

```text
[{"id":1,"status":"pending","result":"enqueued"}]
[{"id":2,"status":"pending","result":"enqueued"}]
[{"id":1,"status":"pending","result":"duplicate"}]
```

The report-only trial listed both jobs and reviewed them with no `--comment`. A dump of the `jobs` table before and after the trial was identical (`diff` printed nothing). Both rows stayed `pending` with `attempts` 0.

Excerpt from a run on the Conduit sample API at master 30b68e1. This is the dump after the trial, from `sqlite3` with the run folder prefix replaced by `...`. The columns are id, repo, target, head SHA, tier, status, worker, attempts, verdict, findings, notes, claimed_at, and updated_at. Empty fields stay empty.

```text
1|.../repo|feature/tags-limit|1ed8c60fb021acab216e86b2ac075a58fec82014||pending||0|||||2026-11-16 02:11:46
2|.../repo|fix/article-title-whitespace|fc9792f23c784bb636ccf831674cff21b0cd4ab0||pending||0|||||2026-11-16 02:11:46
```

The real pass then claimed job 1.

Excerpt from a run on the Conduit sample API at master 30b68e1. The `repo` value is replaced with `...`. The text of the other fields is verbatim.

```text
[{"id":1,"repo":".../repo","target":"feature/tags-limit","head_sha":"1ed8c60fb021acab216e86b2ac075a58fec82014","tier":"","attempts":1}]
```

The empty `tier` means that the job has no tier, so `pr-review` selects one. Both jobs ran at the standard tier. The report header of job 1 states why: `tier: standard (auto - 5 added production lines, 2 files, no hot path, but the diff changes a route handler and a query, so the production-logic floor applies)`. A change to production logic never goes below standard in auto mode.

The review of job 1 found one problem that the verdict does not show. The run sent sample values of the new `limit` parameter through the Prisma mock. It recorded the `take` value that reaches the query.

Excerpt from a run on the Conduit sample API at commit 1ed8c60. This is the executed output of a scratch test against the Prisma mock. The indent and the jest summary lines (`PASS` and `Tests: 7 passed`) are cut. The scratch test was removed from the repository after the run. It shows the value that reaches Prisma. It does not show how Prisma answers, because no database ran.

```text
no limit param (Number(undefined)) -> take=10
limit=abc -> take=10
limit=0 -> take=10
limit=5 -> take=5
limit=-5 -> take=-5
limit=2.5 -> take=2.5
limit=1000000 -> take=1000000
```

The review rated this should-fix, not blocker. The `limit` value comes from the request, but a blocker also needs shown wrong behavior (on a documented happy path, valid input, a public contract, or a request-controlled path). The run shows that `-5` and `2.5` reach Prisma. It does not show that Prisma returns wrong data, because no database ran. The review put its confidence at 0.7, which is the run's number. The rubric therefore keeps the finding at should-fix. The verdict of job 1 is `APPROVE` with two should-fix findings.

Job 2, the second branch, got a different result. The run chose to run the test file of the branch, because the new test is the only test of the change. The `pr-review` files do not require a test run. The run found the blocker only because it ran the test, so ask for test evidence if you want it.

Excerpt from a run on the Conduit sample API at commit fc9792f. Lines are wrapped. This is the blocker of the Self-review report.

```markdown
### Blockers (1)
- **src/tests/services/article.service.test.ts:17** — The new
  assertion `expect(prismaMock.article.create)` fails type-checking
  with `TS2615: Type of property 'AND' circularly references
  itself`. ts-jest reports "Test suite failed to run", so the file
  runs 0 tests. On `master` the same file runs 5 tests and all pass.
  The other assertions in this file put `// @ts-ignore` on the line
  above the mock call.
```

The author added `// @ts-ignore` in commit c903493. The test file then runs 6 of 6. The enqueue of that commit made job 4 (a new commit is a new job). The second review covers the whole branch against `master`, not only the new commit. The earlier blocker is gone.

The job 2 report also holds one question, about whether `description` and `body` need the same whitespace check. The excerpt shows only the blocker, and the count of 1 in the table is the blocker only. The question is still open after job 4, and the author must answer it. The run marked it as blocking approval, and the skill then sets the verdict to `NEEDS DISCUSSION`.

Excerpt from a run on the Conduit sample API at commit c903493. This is the output of a query on the queue file after the second pass. The sha column is cut to 7 characters by the query.

```text
id|target|sha|status|verdict|findings
1|feature/tags-limit|1ed8c60|done|APPROVE|2
2|fix/article-title-whitespace|fc9792f|done|REQUEST CHANGES|1
4|fix/article-title-whitespace|c903493|done|NEEDS DISCUSSION|0
```

What you must check in the output:

- Each job has the status `done` and a verdict. A job in `claimed` has no verdict yet.
- Each report states how it was made. In this run, every report has a Self-review line (one agent applied each review facet in turn) and says the review is not independent. The wording of that line is the run's own. The skill's label is `Self-review: facets not independent`. In your setup, the review runs in a fresh agent, and the report names the sub-agents that ran.
- The coverage line states what was not run. In this run, no test touched a database.
- A job with `NEEDS DISCUSSION` waits for an answer from the author. It is not a softer `REQUEST CHANGES`.

The run also tried the status checks. `complete` on a job that is already `done` printed `updated:0` and exited with status 1:

```text
[{"id":1,"status":"done","updated":0}]
review-queue: complete: job 1 is not claimed by worker-1
```

On a scratch queue, a job with a repository path that does not exist went back to `pending` after the first and second `requeue`. It became `dead` after the third, and the next `claim` returned `[]`. The run called `requeue` by hand after each failure.

## Not exercised

- The slash commands. The run followed `commands/enqueue-review.md` and `commands/review-queue-worker.md` by hand, and no host loaded the plugin. Proof: start the plugin in a session and run `/agent-toolbelt:review-queue-worker --report-only`.
- A post. No remote and no PR existed, so `--comment` never ran. Proof: a trial on a PR target with `--report-only`, then a check that the PR has no new comment.
- The PR marker check, `/loop`, parallel workers, and the 30 minute lease reaper. Proof: run two worker sessions on a queue with one PR job and read the job rows.
- Real sub-agents. All reviews were Self-review.

## Common mistakes

- You run the worker in the session that wrote the branch. The review is then not independent, and the trigger rules forbid a review inside the authoring session. Start the worker in a new session.
- The producer and the worker use different queue files. The worker then claims nothing, because it reads another file. Set `REVIEW_QUEUE_DB` to the same path in both shells before you start the agents.
- You pass `--sha` by hand and take it from `HEAD`. For a branch that is not checked out, `HEAD` is another commit, and the idempotency key is wrong. Omit `--sha` to use the commit of the branch, or pass `git rev-parse <branch>`.
- You run the worker on a repository where the target is a PR number, and you do not want comments. The worker posts without a prompt. Start the worker with `--report-only` first, or use `/pr-review` without `--comment`.
- You read `APPROVE` as "no findings". The verdict counts blockers, approval-blocking questions, and required scope gaps. A should-fix finding is a problem to fix that does not change the verdict. Read the should-fix findings.
- You expect a `dead` job to run again. It runs again only after a new push gives a new commit.
- You expect contiguous job ids. A duplicate `enqueue` uses an id, so ids can skip a number. In the run the ids were 1, 2, and 4. A gap does not mean a lost job.
- You treat a `done` queue row as the only record of a review. The queue is a local cache. The review marker is the text `pr-review:head=<sha>`. `pr-review` writes it into the posted review, so a later run can see that the commit was reviewed. The marker on the PR is the record that a commit was reviewed. For a PR number, the worker checks it before each review. A branch target has no marker to check.

## Next

- [Review every pull request when it opens](ops-review-every-pr-on-open.md): when the PRs live on a host that can run CI.
- [Gate each phase with a reviewer](ops-gate-each-phase.md): when the review belongs at each phase boundary of one delivery.
- [Self-review before you open a pull request](dev-self-review-before-a-pr.md): when one author wants a review before the PR exists.
- [Answer review comments](dev-answer-review-comments.md): when the author gets the posted comments.
- [Run agents in parallel](dev-run-agents-in-parallel.md): when the producers run in separate worktrees.
- [Run agents without a person](ops-unattended-agent-runs.md): when the worker runs unattended.
- [`review-on-open`](../../skills/review-on-open/SKILL.md): the trigger skill for PRs that no local agent opens.
- [Use-case index](README.md): the full list of use-case pages. The other pages link the same file.
