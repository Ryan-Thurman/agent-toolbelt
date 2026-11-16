# The worker: draining the queue

The consumer side. A worker claims jobs one at a time and runs `/pr-review … --comment` on each.
One invocation of `/review-queue-worker` drains the queue until it is empty or `--max` is reached,
then returns. `--comment` is the posting flag. The worker passes it on every job except in a
`--report-only` trial (see "Report-only trial").

## The loop

Per claimed job:
1. **Claim.** `bash skills/review-queue/bin/review-queue.sh claim --worker <id>`. Parse the JSON. `[]`
   -> nothing pending, end the pass. A non-zero exit -> transient DB issue. End the pass and let the
   next tick retry (do **not** treat as a completed job).
2. **Check the target, then review in a fresh sub-agent.** A numeric `target` is a PR number. Any
   other `target` is a branch name, and no PR exists to post to. For a branch name, skip the marker
   check and run the review without `--comment`. Step 3 records it with the note
   `branch target, not posted`.
   For a PR number, first check the PR for the `pr-review:head=<head_sha>` marker. Use the marker rule
   in `skills/pr-review/references/posting.md`, section "Idempotency (re-running `--comment`)".
   If the marker exists, run `complete <id> --worker <id> --notes "already reviewed"` and skip the review.
   Otherwise run `/pr-review <target> --comment` as its own sub-agent (Task tool). Pass the job's
   tier when it has one. Otherwise pass the worker's `--tier` when given, else let pr-review
   auto-tier. Run it in the job's `repo` directory. If `repo` is not an existing
   directory, `requeue` with a note. The attempt cap dead-letters a job that has a bad path.
   `/pr-review` reviews the current PR head. If that head differs from `head_sha`, add
   `--notes "reviewed <current-sha>"` at completion.
3. **Record the outcome.** Pass the same `--worker` id that `claim` used.
   - Review produced a verdict -> `complete <id> --worker <id> --verdict "<APPROVE|REQUEST CHANGES|NEEDS DISCUSSION>"
     --findings <n>`. For a branch target, add `--notes "branch target, not posted"`.
   - Review errored (unable to fetch the PR, posting failed, sub-agent died) -> `requeue <id> --worker <id>
     --notes "<short reason>"`. The lease + attempt count mean a genuinely stuck job eventually dead-letters
     rather than spinning forever.
   - `complete` or `requeue` exits non-zero with `updated:0` -> this worker no longer holds the job.
     Its lease expired. Another worker can hold the job now. Do not retry. Log the job id and continue.
4. **Next.** Loop. Stop when `claim` returns `[]` or `--max` is reached (`log` how many were left).
5. **Summarize.** Print one line per job (id, target, verdict, SHA). Then print a tally:
   reviewed / requeued / dead-lettered / deferred.

## Report-only trial

Start a new worker with `--report-only`. A trial reviews the queue and posts nothing. It also does not
change the queue: the trial never calls `claim`, `complete`, or `requeue`, so the real worker still
reviews every job later.

1. List the pending jobs: `bash skills/review-queue/bin/review-queue.sh list --status pending`. Take up to
   `--max` jobs, oldest first. An empty list ends the pass.
2. For each job, run `/pr-review <target>` in a fresh sub-agent (Task tool). Do not pass `--comment`.
   Run it in the job's `repo` directory. Pass the job's tier when it has one.
3. Print one line per job: id, target, verdict, and head SHA. Print the full review output for each job.
   Post nothing and change no job.

## Multiple jobs / fan-out

For a backlog, you can claim several and review them as **parallel sub-agents**. Claiming is atomic,
so each job goes to exactly one worker, even when several `/review-queue-worker` instances run or one
worker fans out. Keep `--max` modest per pass. The next tick picks up the remainder.

## Self-loop guard

Apply "Do not loop on yourself" in `skills/pr-review/references/triggers.md`.
To skip the PRs of the review bot account, have the producer not enqueue them, or filter them in
the worker.

## Scheduling

Do not build a sleep loop inside a pass. Repeat it with a local `/loop 5m /review-queue-worker`.
A `claim` that returns `[]` is a single local SQLite read, so a short interval is cheap.
Every op is idempotent or atomic, so missed or overlapping ticks are safe.
