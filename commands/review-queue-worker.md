---
description: Drain the local review queue — claim pending PR-review jobs and run /pr-review --comment on each in a fresh sub-agent. One pass; repeat with a local /loop. The consumer half of the review-queue pack.
argument-hint: "[--worker=id] [--max=N] [--tier=light|standard|deep] [--db=PATH]"
---

# /review-queue-worker

Use `/review-queue-worker` to review the jobs in the local queue. Use `/enqueue-review` to add jobs.

**Arguments:** `$ARGUMENTS`

- **`--worker=id`** — the worker label. Use distinct labels for parallel workers.
- **`--max=N`** — the most jobs to review in this pass.
- **`--tier=…`** — the tier for jobs that have no tier. Omit it to auto-tier.
- **`--db=PATH`** — the queue file. The default is `$REVIEW_QUEUE_DB` or `~/.review-queue/queue.db`.

Follow the consumer lane of the `review-queue` skill (`skills/review-queue/references/worker.md`).
