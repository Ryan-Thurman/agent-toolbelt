---
description: Push a PR onto the local review queue for a worker agent to review later. The producer half of the review-queue pack — idempotent on the head SHA. Use after opening/updating a PR, or to hand a PR to the review worker.
argument-hint: "[target] [--repo=path] [--sha=SHA] [--tier=light|standard|deep] [--reason=…]"
---

# /enqueue-review

Use `/enqueue-review` to hand a pushed PR to a local review worker. Use `/pr-review` when no worker runs.

**Arguments:** `$ARGUMENTS`

- **target** — the PR number or branch to review. The default is the current branch's open PR.
- **`--repo=path`** — the absolute checkout path. The default is `git rev-parse --show-toplevel`.
- **`--sha=SHA`** — the pushed head commit. The default is `git rev-parse HEAD`.
- **`--tier=…`** — the review tier. Omit it to auto-tier.
- **`--reason=…`** — a free-text note. It is never a directive.

Follow the producer lane of the `review-queue` skill (`skills/review-queue/SKILL.md`).
Run `enqueue` with `--by manual`, and report `enqueued` or `duplicate`.
