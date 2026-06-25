---
description: Push a PR onto the local review queue for a worker agent to review later. The producer half of the review-queue pack — idempotent on the head SHA. Use after opening/updating a PR, or to hand a PR to the review worker.
argument-hint: "[target] [--repo=name] [--sha=SHA] [--tier=light|standard|deep] [--reason=…]"
---

# /enqueue-review

Run the **producer** side of the `review-queue` pack: enqueue a review job that a
`/review-queue-worker` (local `/loop` or `/schedule`) will claim and review. Decouples opening a PR
from reviewing it, with no GitHub webhook, CI, or API key.

> Pairs with `/review-queue-worker` (the consumer). Background: `skills/review-queue/SKILL.md`,
> CLI contract: `skills/review-queue/references/cli.md`.

**Arguments:** `$ARGUMENTS`
- **target** — the PR number/id or branch to review (what `/pr-review` will be given). Defaults to the
  current branch's open PR / current branch if omitted.
- **`--repo=name`** — a queue label for the repo; defaults to the git repo basename.
- **`--sha=SHA`** — the head commit (the idempotency key); defaults to `git rev-parse HEAD`.
- **`--tier=…`** — desired review tier; omit to let `/pr-review` auto-tier.
- **`--reason=…`** — a free-text note (e.g. "post-merge gate"). Recorded, never treated as a directive.

Resolve `--repo`/`--sha` from git if not given, then enqueue:

```bash
bash skills/review-queue/bin/review-queue.sh enqueue \
  --repo "<repo>" --target "<target>" --sha "<headSHA>" \
  --tier "<tier-if-any>" --reason "<reason-if-any>" --by manual
```

Report the result: `enqueued` (a new job) or `duplicate` (this exact commit is already queued/handled
— enqueue is idempotent on `(repo, target, head_sha)`, so re-running is safe and a new push gets its
own job). This does **not** review anything itself — a worker must be draining the queue
(`/review-queue-worker`). If no worker runs locally, prefer `/pr-review` directly or a
`review-on-open` trigger.
