---
description: Auto-review trigger for pr-review — poll open PRs and run /pr-review --comment on the ones not yet reviewed at their current head SHA (drive on an interval with /loop or /schedule). Event-driven GitHub Actions path ships as a template.
argument-hint: "[repo-or-filter] [--tier=light|standard|deep] [--max=N] [--host=auto|github|azure] [--dry-run]"
---

# /review-on-open

Use `/review-on-open` to review open PRs that have no review at their current head. Use `/pr-review` for one target.

**Arguments:** `$ARGUMENTS`

- **target filter** — a repo slug, `--author=<x>`, or `--label=<y>`. Empty means all open PRs.
- **`--tier=light|standard|deep`** — passed to `/pr-review`. Omit it to auto-tier.
- **`--max=N`** — the most PRs to review in this poll.
- **`--host=auto|github|azure`** — override host detection.
- **`--dry-run`** — list the due PRs and stop. Do not review or post.

Follow the `review-on-open` skill (`skills/review-on-open/SKILL.md`).
