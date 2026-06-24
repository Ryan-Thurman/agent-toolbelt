---
description: Pick the right toolbelt command, skill, or workflow for the current work
argument-hint: "<goal-or-current-state>"
---

# /workflow-router

Route the current goal to the smallest useful command, skill, or workflow.

**Arguments:** `$ARGUMENTS`

Steps:
1. Identify the work type: discovery, planning, implementation, testing,
   review, QA, release, or handoff.
2. Check whether feature metadata exists: feature ID, release ID, ticket,
   Feature Master Record, doc impact map, QA plan, or PR.
3. Recommend the next 1-3 commands to run, in order, with a one-line reason for
   each.
4. If the work is ambiguous, ask only the questions needed to choose the next
   command.
5. Do not run a heavy workflow when a narrower command is enough.

Pick the track first — is this a new capability or broken behavior?
- **Bug-to-Fix** (broken behavior: a bug ticket / defect needs diagnosis and a
  fix): use the `/bug-*` chain below.
- **Dev Lite** (new capability, lightweight solo or small build, no
  cross-functional traceability needed): use the `/dev-*` chain below.
- **AI Feature Delivery** (new capability, cross-functional work where
  requirements, tickets, tests, docs, QA, and release eligibility must stay
  linked): use the feature-delivery commands below.

Routing guide:
- Broken behavior / bug (Bug-to-Fix): `/bug-intake` -> `/reproduce` -> `/rca`
  (or `/rca --diagnose` for read-only) -> `/fix-plan` -> `/dev-implement-task`
  -> `/pr-review`.
- Lightweight / solo build (Dev Lite): `/dev-intake` -> `/dev-plan` ->
  `/dev-start-phase` -> `/dev-implement-task` -> `/dev-phase-review` ->
  `/dev-fix-review-issues` (if needed) -> `/dev-pr-review`.
- Raw idea or stakeholder request: `/feature-start`, then `/feature-fleshout`.
- Existing feature with gaps: `/feature-fleshout`, `/steward-review`, or
  `/draft-pings`.
- Design/document work: `/sdd-draft`, `/doc-impact`, or `/doc-delta`.
- Ticket slicing: `/refine-to-tickets`.
- Starting implementation: `/start-dev-from-feature`, then
  `/implementation-plan`.
- Behavior change needing tests: `/write-tests`.
- Browser/user-flow verification: `/webapp-test`.
- Local diff review: `/review-diff`.
- PR readiness: `/pr-ready-check`, then `/pr-traceability-review`.
- Lifecycle gate: `/gate-check`.
- QA package: `/qa-handoff`.
- Release documentation: `/release-manifest`, then `/release-doc-check`.
- General PR/code review: `/pr-review --tier=light|standard|deep`.
- Root-cause only, no fix: `/rca --diagnose`.
- Pause or transfer work to a fresh session/agent: `/handoff`.
