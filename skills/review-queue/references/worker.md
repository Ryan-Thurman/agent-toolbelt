# The worker — draining the queue

The consumer side. A worker claims jobs one at a time and runs `/pr-review … --comment` on each.
One invocation of `/review-queue-worker` drains the queue until it is empty or `--max` is reached,
then returns.

## The loop

Per claimed job:
1. **Claim.** `bash skills/review-queue/bin/review-queue.sh claim --worker <id>`. Parse the JSON. `[]`
   → nothing pending, end the pass. A non-zero exit → transient DB issue; end the pass and let the
   next tick retry (do **not** treat as a completed job).
2. **Review in a fresh sub-agent.** Run `/pr-review <target> --comment`. Pass the job's tier when it
   has one. Otherwise pass the worker's `--tier` when given, else let pr-review auto-tier. Spawn it as its own sub-agent (Task tool)
   so the reviewer is isolated from the worker and from the producer that wrote the PR. Run it in the
   job's `repo` directory. If `repo` is not an existing directory, `requeue` with a note; the attempt
   cap dead-letters a job that has a bad path.
   `/pr-review` reviews the current PR head. If that head differs from `head_sha`, add
   `--notes "reviewed <current-sha>"` at completion. The head-SHA marker in
   `skills/pr-review/references/posting.md` stops a later job from posting the same head again.
3. **Record the outcome.**
   - Review produced a verdict → `complete <id> --verdict "<APPROVE|REQUEST CHANGES|NEEDS DISCUSSION>"
     --findings <n>`.
   - Review errored (couldn't fetch the PR, posting failed, sub-agent died) → `requeue <id> --notes
     "<short reason>"`. The lease + attempt count mean a genuinely stuck job eventually dead-letters
     rather than spinning forever.
4. **Next.** Loop. Stop when `claim` returns `[]` or `--max` is reached (`log` how many were left).
5. **Summarize.** Print one line per job (id, target, verdict, SHA). Then print a tally:
   reviewed / requeued / dead-lettered / deferred.

## Multiple jobs / fan-out

For a backlog, you may claim several and review them as **parallel sub-agents** — claiming is atomic,
so each job goes to exactly one worker even if you run several `/review-queue-worker` instances or
fan out within one. Keep `--max` modest per pass so an unattended routine can't spend unbounded tokens
in one wake; the remainder is picked up next tick. Always `log` what was deferred — never silently drop.

## Self-loop guard

The SHA idempotency key and the host head-SHA marker prevent a second review of a commit. Posting a
review does not change the head SHA. If the **review bot also
opens PRs**, have the producer skip enqueuing its own bot-authored PRs (or filter them in the worker)
unless you explicitly want self-review.

## Scheduling

Do not build a sleep loop inside a pass. Repeat it with a local `/loop 5m /review-queue-worker`.
A `claim` that returns `[]` is a single local SQLite read, so a short interval is cheap.
Every op is idempotent or atomic, so missed or overlapping ticks are safe.
