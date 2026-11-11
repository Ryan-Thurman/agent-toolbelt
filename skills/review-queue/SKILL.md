---
name: review-queue
description: Queue PR-review jobs locally with SQLite. Use when PR-opening agents need review workers without webhooks, CI, or API keys. Producers enqueue PRs; workers claim jobs and run /pr-review --comment.
---

# review-queue

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

A **local producer/consumer work queue** for PR review. The agent that opens or updates a PR
enqueues a job. A separate local **worker** claims jobs and runs `/pr-review <target> --comment`.
The queue adds no review logic. Any harness (Claude Code, Cursor, Codex) can produce or consume.

The queue does not run reviews by itself. A local worker session must drain it.
Use the `review-on-open` CI event or poller when no local agent produces the PRs.

## Store And CLI

State is one SQLite file: `$REVIEW_QUEUE_DB`, else `~/.review-queue/queue.db`.
All access goes through the shipped `review-queue` CLI
(`bin/review-queue.sh`, pure bash + `sqlite3`). Load `references/cli.md` for
the schema, subcommands, flags, output formats, and env overrides.

## Principles (always)

- **Idempotent on head SHA.** The (repo, target, head_sha) key means re-enqueuing the same commit
  never creates a second job, and a new push (new SHA) *does* enqueue a fresh review. Producers pass
  the PR's pushed head SHA.
- **The repo field is a checkout path.** Producers pass the absolute repo checkout path as `--repo`.
  The worker runs each review in that directory.
- **Exactly-once claim.** Claiming is a single `BEGIN IMMEDIATE` transaction with `RETURNING`, so two
  workers never review the same job.
- **Crash-safe via leases.** A claim sets `claimed_at` and a lease (default 30m). If a worker dies
  mid-review, the next `claim` reaps the stale job back to pending so it isn't lost. A job attempted
  `MAX_ATTEMPTS` times (default 3) is **dead-lettered** (`status=dead`), never retried forever — one
  poison PR can't wedge the queue. Inspect dead letters with `list --status dead`.
- **Local workers only.** The queue file is on this machine. Run the worker in a local session
  (`/loop`). A `/schedule` cloud routine cannot read the queue.
- **Trigger invariants.** The worker is a review trigger. Apply
  `skills/pr-review/references/triggers.md`.

## The two lanes

**Producer** — wherever an agent finishes opening/updating a PR (e.g. end of
`ship-it`, a dev PR step, or a manual `/enqueue-review`), it enqueues through
`references/cli.md`.

**Consumer** — the worker drains the queue with `/review-queue-worker`. Follow
`references/worker.md`. Because claiming is atomic, more than one worker can run.

## Completion

A producer is complete when `enqueue` returns `enqueued` or `duplicate`.
A worker pass is complete when `claim` returns `[]`, or when it reaches `--max` and logs the rest.
Each claimed job ends as `done`, `pending` (requeued), or `dead`.

## References

- `references/cli.md` — the full CLI contract: every subcommand + flags, the SQLite schema, the
  idempotency key, the lease/reaper and dead-letter semantics, env overrides, and exit/output formats.
- `references/worker.md` — the consumer loop: claim→review→complete, failure→requeue, multi-job
  fan-out, the self-loop guard, and scheduling via `/loop`.
- `skills/pr-review/SKILL.md` — the reviewer every claimed job runs.
- `skills/pr-review/references/triggers.md` — the invariants that apply to every review trigger.
