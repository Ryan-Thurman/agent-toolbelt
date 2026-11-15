---
description: Review your local diff before you push or open a PR. Reports findings only and never posts
argument-hint: "[--tier=light|standard|deep] [--intent=<path|url>] [--focus=<facet>] [--focus-note=\"<text>\"]"
---

# /review-diff

Use `/review-diff` to review your local changes and the current branch against its base before you push or open a PR.

**Arguments:** `$ARGUMENTS`

Accept only the tier, intent, and focus options: `--tier`, `--intent`, `--focus`, and `--focus-note`.
Do not accept `--comment`, `--repost`, or any other posting option. This command never posts.
If the arguments name a PR, a PR URL, or a branch, stop. Tell the user to run `/pr-review` for that target.

Follow the `pr-review` skill (`skills/pr-review/SKILL.md`) with an empty target.
An empty target reviews the working changes and the branch commits against the merge base with the base branch.
It never resolves to a PR and never fetches PR metadata (`skills/pr-review/references/targets-and-diff.md`).
Supply acceptance criteria only from `--intent`.

Use `/pr-review` for an open PR. `/simplify` applies cleanups, but `/review-diff` only reports findings.
