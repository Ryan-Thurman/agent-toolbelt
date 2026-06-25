# The worker — draining the queue

The consumer side. A worker claims jobs one at a time and runs the existing reviewer on each. It holds
no review logic of its own — `/pr-review … --comment` does the work. One invocation of
`/review-queue-worker` drains the queue **until it's empty**, then returns; repetition across time is
delegated to `/loop` or `/schedule`.

## The loop

```
loop:
  job = review-queue claim --worker <id>          # JSON: a job, or []
  if job == []: break                             # queue drained → stop this pass
  run /pr-review <job.target> --comment            # + --tier=<job.tier> if non-empty; fresh sub-agent
      success → review-queue complete <job.id> --verdict <V> --findings <N>
      failure → review-queue requeue <job.id> --notes "<why>"   # lease/attempts handle the rest
  honor --max (stop after N this pass; the rest wait for the next tick)
```

Concretely, per claimed job:
1. **Claim.** `bash skills/review-queue/bin/review-queue.sh claim --worker <id>`. Parse the JSON. `[]`
   → nothing pending, end the pass. A non-zero exit → transient DB issue; end the pass and let the
   next tick retry (do **not** treat as a completed job).
2. **Review in a fresh sub-agent.** Run `/pr-review <target> --comment`, passing `--tier=<tier>` only
   if the job carried one (empty → let pr-review auto-tier). Spawn it as its own sub-agent (Task tool)
   so the reviewer is isolated from the worker and from the producer that wrote the PR. The job gives
   you `repo`, `target`, and `head_sha` — if the worker runs outside that repo's checkout, `cd` to /
   resolve the right clone first (the queue is host-agnostic; `/pr-review` resolves the target through
   the `pr-review` provider layer).
3. **Record the outcome.**
   - Review produced a verdict → `complete <id> --verdict "<APPROVE|REQUEST CHANGES|NEEDS DISCUSSION>"
     --findings <n>`.
   - Review errored (couldn't fetch the PR, posting failed, sub-agent died) → `requeue <id> --notes
     "<short reason>"`. The lease + attempt count mean a genuinely stuck job eventually dead-letters
     rather than spinning forever.
4. **Next.** Loop. Stop when `claim` returns `[]` or `--max` is reached (`log` how many were left).

## Multiple jobs / fan-out

For a backlog, you may claim several and review them as **parallel sub-agents** — claiming is atomic,
so each job goes to exactly one worker even if you run several `/review-queue-worker` instances or
fan out within one. Keep `--max` modest per pass so an unattended routine can't spend unbounded tokens
in one wake; the remainder is picked up next tick. Always `log` what was deferred — never silently drop.

## Self-loop guard

The SHA idempotency key already prevents re-reviewing a commit: posting a review doesn't change the
head SHA, and `enqueue` dedups on it, so a reviewed commit won't be re-queued. If the **review bot also
opens PRs**, have the producer skip enqueuing its own bot-authored PRs (or filter them in the worker)
unless you explicitly want self-review.

## Scheduling

One `/review-queue-worker` pass drains what's currently queued and exits — don't build a sleep loop
inside it. Repeat it with the runtime's schedulers:

- **Local, while you work:** `/loop 5m /review-queue-worker` — every 5 minutes, drain any jobs other
  agents have pushed. Cheap: a `claim` returning `[]` is a single local SQLite read (no API, no host
  calls), so a short interval is fine.
- **Hands-off:** a `/schedule` cloud routine running `/review-queue-worker` on a cron. Best when
  producers enqueue around the clock and you don't want a session open.

Either way the queue is the rendezvous: producers `enqueue` whenever they finish a PR; the worker
drains on its own cadence. Because every op is idempotent/atomic, missed or overlapping ticks are safe.

## Where this sits

This is the push-based third trigger of the review family (`skills/review-on-open/SKILL.md` has the CI
event + host poller). Use the queue when the work originates from **other local agents**; use the CI
event for GitHub's webhook; use the poller for host PRs with no local producer. After a review posts,
`pr-review-reply` handles the inbound human threads.
