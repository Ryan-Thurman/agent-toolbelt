# Skill Provenance

This document records non-runtime attribution for skills whose concepts were
adapted from other MIT-licensed skill packs or neighboring packs in this repo.
Runtime `SKILL.md` files should stay focused on invocation, invariants, flow,
and references.

## External Sources

- `bug-to-fix`: concepts adapted and reworded from obra/superpowers
  `systematic-debugging`, `defense-in-depth`, and
  `verification-before-completion`; addyosmani/agent-skills
  `doubt-driven-development` and `debugging-and-error-recovery`;
  mattpocock/skills `diagnosing-bugs`, `triage`, and `handoff`;
  Jeffallan/claude-skills `debugging-wizard`; msitarzewski/agency-agents
  `minimal-change-engineer` and `incident-commander`;
  VoltAgent/awesome-claude-code-subagents `debugger`; and open-gsd/gsd-core
  durable debug-file state patterns.
- `handoff`: handoff concept adapted and reworded from mattpocock/skills
  `handoff`, including reference-don't-duplicate, redact,
  suggested-next-skills, and temp-location guidance.
- `retrofit`: concepts adapted and reworded from addyosmani/agent-skills
  `deprecation-and-migration`, including incremental per-consumer migration,
  strangler/adapter/feature-flag patterns, and verify-zero-usage-before-removal;
  plus obra/superpowers `using-git-worktrees` and
  `subagent-driven-development` for isolation and fan-out discipline.
- `shape-up`: concepts adapted and reworded from mattpocock/skills, including
  one-question-at-a-time grilling, repo-first resolution, vertical-slice issues,
  lean brief sections, and domain-term contradiction checks; plus
  obra/superpowers scope gates, recommended-answer questions, hard approval
  gates, and spec self-review.
- `ship-it`: concepts adapted and reworded from addyosmani/agent-skills
  `shipping-and-launch`, including pre-launch checklist, feature-flag lifecycle,
  staged rollout, decision thresholds, and rollback triggers; plus gstack
  `land-and-deploy` and `document-release` for deploy handoff and release-note
  audit boundaries.
- `simplify`: concepts adapted and reworded from pi-simplify, including smell
  taxonomy, thin-wrapper detectors, risk tiers, and
  rootIssue-to-consequence-to-benefit framing; plus addyosmani/agent-skills
  code-simplification discipline, Chesterton's Fence, and simplify-ignore
  mechanics.
- `worktree`: one-worktree-per-unit discipline, managed worktree preference, and
  unchanged-worktree discard patterns adapted from obra/superpowers
  `using-git-worktrees` and `subagent-driven-development`.

## Internal Pack Relationships

- `phase-gate`: phase-boundary orchestration over `pr-review`; it spawns the
  reviewer as a subagent, routes findings, and adds solo-mode fix and merge.
  Review logic and host posting remain owned by `pr-review`.
- `pr-review-reply`: complements `pr-review`; it reuses the provider layer and
  mirrors the opt-in, idempotent, confirm-first posting model for inbound review
  threads. Reply triage statuses and reply-block contracts are owned by
  `pr-review-reply`.
- `review-on-open`: trigger layer over `pr-review`; it reuses provider detection
  and posting behavior, adds event/poller ignition, and does not add review
  logic.
- `review-queue`: trigger and handoff layer over `pr-review`; it carries jobs,
  not findings. SHA idempotency mirrors `review-on-open` ledger behavior, and
  the producer/consumer split lets a separate fresh agent do the review.
