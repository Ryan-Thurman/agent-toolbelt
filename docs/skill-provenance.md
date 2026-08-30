# Skill Provenance

This document records non-runtime attribution for concepts adapted from external
sources with explicit license handling and neighboring packs in this repo. Runtime
`SKILL.md` files should stay focused on invocation, invariants, flow, and references.

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
- `dev-lite-workflow` and `auto-agent-dev-lite`: plan-scoped scratch state and
  bounded handoff concepts adapted and reworded from obra/superpowers; selective
  read-only task preconditions adapted from open-gsd/gsd-core. The local plan
  remains the durable source of truth, and normal tasks carry no added gate.
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
  mechanics; plus mattpocock/skills hotspot-first scope selection for
  architecture scans.
- `worktree`: one-worktree-per-unit discipline, managed worktree preference, and
  unchanged-worktree discard patterns adapted from obra/superpowers
  `using-git-worktrees` and `subagent-driven-development`.
- Style/anti-slop contracts and `style-guide-init`: independently reworded concepts
  from Scoville's anti-AI-slop skills and Wondel's clean-code materials (MIT), plus
  Anthropic official review/simplification plugins (Apache-2.0) and the Google
  TypeScript style-guide baseline when a target repository adopts it. Repository
  evidence remains authoritative.
- `pr-improve`: stable ledger, bounded rereview, scope guard, and convergence
  concepts independently reworded from Trail of Bits `code-improver`. That source
  is CC BY-SA 4.0; no upstream prose was copied.
- `code-quality-gate`: local orchestration that composes `simplify`, `pr-review`,
  and `pr-improve`; it reuses their source-attributed concepts and adds no copied
  upstream review or simplification prose.
- `product-discovery`: evidence/assumption, opportunity-risk, experiment, and
  threshold concepts adapted at a high level from Wondel product-oriented skills (MIT).
- `test-case-design`: general QA/test-case concepts adapted at a high level from
  gstack QA, Jeffallan `test-master`, and Anthropic `test-engineer` / `pr-test-analyzer`
  materials (Apache-2.0 for Anthropic). Trail of Bits' CC BY-SA 4.0 testing handbook
  is primarily specialized fuzzing/security tooling, not the main generic QA-case source.
- `threat-model` and `security-audit`: design-time threat, code-review, and
  verification concepts adapted at a high level from Anthropic code-modernization
  security material (Apache-2.0) and Trail of Bits security/testing skills
  (CC BY-SA 4.0; independently reworded concepts only, no prose copied).
  Specialized active techniques remain out of the core packs.
- `vercel-composition-patterns` and `vercel-react-best-practices`: substantial
  rule files copied from Vercel Labs' MIT-licensed Agent Skills repository at
  commit `063bee94c3f4df8453406c830b0a7df0f2860278`. Sources:
  [composition-patterns](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278/skills/composition-patterns)
  and
  [react-best-practices](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278/skills/react-best-practices).
  The upstream revision had no standalone LICENSE file; its README identifies
  the repository as MIT and both source skill manifests declare MIT. Local
  entrypoints adapt routing and applicability while preserving the rule files
  under progressive-disclosure references.

## Internal Pack Relationships

- `phase-gate`: phase-boundary orchestration over `pr-review`; it spawns the
  reviewer as a subagent, routes findings, and adds solo-mode fix and merge.
  Review logic and host posting remain owned by `pr-review`.
- `code-quality-gate`: pre-PR orchestration over style evidence, repository
  checks, `simplify`, `pr-review`, and `pr-improve`. It owns only the durable
  PASS/FAIL/CAPPED/BLOCKED status contract; cleanup, findings, and convergence
  mechanics remain owned by their existing packs.
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
