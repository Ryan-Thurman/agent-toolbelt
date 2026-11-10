---
description: In-loop PR-review gate for a phased build — a fresh subagent reviews the phase PR and posts the review as PR comments (GitHub/Azure), then either stops for human merge (team, default) or, with --merge, the main agent fixes blockers, re-reviews, and merges (solo).
argument-hint: "[target] [--merge] [--tier=light|standard|deep] [--intent=path|url] [--rereview] [--no-post]"
---

# /phase-gate

Use `/phase-gate` at a phase boundary to review the phase PR in a fresh subagent. Use `review-on-open` or `review-queue` for asynchronous review.

**Arguments:** `$ARGUMENTS`

Follow the `phase-gate` skill (`skills/phase-gate/SKILL.md`). Its "Inputs" section defines each argument.
