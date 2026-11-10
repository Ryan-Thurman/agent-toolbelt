---
description: In-loop PR-review gate for a phased build — a fresh subagent reviews the phase PR and posts the review as PR comments (GitHub/Azure), then either stops for human merge (team, default) or, with --merge, the main agent fixes blockers, re-reviews, and merges (solo).
argument-hint: "[target] [--merge] [--tier=light|standard|deep] [--intent=path|url] [--rereview] [--no-post]"
---

# /phase-gate

Use `/phase-gate` at a phase boundary to review the phase PR in a fresh subagent. Use `review-on-open` or `review-queue` for asynchronous review.

**Arguments:** `$ARGUMENTS`

- **target** — the phase PR number, URL, or branch. Empty means the current branch's open PR.
- **`--merge`** — solo mode: fix blockers, re-review, and merge when approved. Without it, stop for human review.
- **`--tier=…`** — the review depth passed to `pr-review`.
- **`--intent=<path|url>`** — the phase's acceptance criteria.
- **`--rereview`** — run one confirming review before merge, even with no fix commit.
- **`--no-post`** — print the review. Do not post to the PR.

Follow the `phase-gate` skill (`skills/phase-gate/SKILL.md`).
