---
description: Round-trip a PR review — read the human reviewer's threads, triage each against code changed since the review, and reply per-thread. Posting is opt-in and idempotent.
argument-hint: "[target] [--post] [--since=<sha>]"
---

# /pr-review-reply

Use `/pr-review-reply` to answer a human reviewer's PR threads. Use `/pr-review --comment` to post new findings.

**Arguments:** `$ARGUMENTS`

- **target** — a PR URL or number, or empty for the current branch's open PR.
- **`--post`** — post one reply per thread to the PR. Confirm before posting.
- **`--since=<sha>`** — the reviewed SHA to diff against. The default is the review's commit.

Follow the `pr-review-reply` skill (`skills/pr-review-reply/SKILL.md`).
