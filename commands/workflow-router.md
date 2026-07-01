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

If the request itself is vague or underspecified, shape it first with `/shape-up`
(interrogate -> agreed brief), then pick a track below.

Pick the track first — is this a new capability or broken behavior?
- **Bug-to-Fix** (broken behavior: a bug ticket / defect needs diagnosis and a
  fix): use the `/bug-*` chain below.
- **Dev Lite** (new capability, lightweight solo or small build, no
  cross-functional traceability needed): use the `/dev-*` chain below.
- **AI Feature Delivery** (new capability, cross-functional work where
  requirements, tickets, tests, docs, QA, and release eligibility must stay
  linked): use the feature-delivery commands below.
- **Phase Context** (long agent work where planning, implementation, test,
  review, or PR prep should survive `/clear` or `/compact`): use the
  `/phase-*` chain below, usually alongside Dev Lite or implementation work.

Routing guide:
- Long agent session, Agent Command Center work, context reset boundary, or
  phase handoff needed: `/phase-create` -> `/phase-start` -> do the phase work
  -> `/phase-close` -> `/clear` or `/compact`.
- Vague / underspecified request: `/shape-up` (then `/dev-intake` or `/to-issues`).
- Broken behavior / bug (Bug-to-Fix): `/bug-intake` -> `/reproduce` -> `/rca`
  (or `/rca --diagnose` for read-only) -> `/fix-plan` -> `/dev-implement-task`
  -> `/cover` (lock the repro as a regression test) -> `/pr-review` -> `/ship-it`
  (optional, on release).
- Lightweight / solo build (Dev Lite): `/dev-intake` -> `/dev-plan` ->
  `/dev-start-phase` -> `/dev-implement-task` -> `/dev-phase-review` ->
  `/dev-fix-review-issues` (if needed) -> `/dev-pr-review` -> `/ship-it`
  (optional, on release).
- Raw idea or stakeholder request: `/feature-start`, then `/feature-fleshout`.
- Existing feature with gaps: `/feature-fleshout`, `/steward-review`, or
  `/draft-pings`.
- Design/document work: `/sdd-draft`, `/doc-impact`, or `/doc-delta`.
- Ticket slicing: `/refine-to-tickets`.
- Publish sliced tickets to a tracker (GitHub Issues / Jira / Azure Boards): `/ticket-sync`.
- Starting implementation: `/start-dev-from-feature`, then
  `/implementation-plan`.
- Behavior change needing tests (regulated, traceable lane): `/write-tests`.
- Author/strengthen tests for a diff/module, or lock a bug repro as a regression
  test (standalone, apply on opt-in): `/cover`.
- Scan an area for missing/weak coverage (detect-only, ranked by risk × likelihood):
  `/cover-gaps`.
- Browser/user-flow verification: `/webapp-test`.
- Local diff review: `/review-diff`.
- PR readiness: `/pr-ready-check`, then `/pr-traceability-review`.
- Lifecycle gate: `/gate-check`.
- QA package: `/qa-handoff`.
- Release documentation: `/release-manifest`, then `/release-doc-check`.
- General PR/code review: `/pr-review --tier=light|standard|deep`.
- Respond to a human reviewer's PR threads (triage + reply, re-review only what
  changed since the review): `/pr-review-reply` (run after `/pr-review`).
- Release a merged change (readiness + rollback + notes + rollout): `/ship-it`.
- Clean up / slim a diff after a feature (apply): `/simplify`.
- Scan an area for structural smells (detect-only): `/code-smell`; for architecture/deepening
  candidates, use `/code-smell <path> --architecture`.
- Apply one defined change across many sites (library swap / API rename / upgrade): `/retrofit`.
- Isolate work so parallel agents in a shared polyrepo dir don't clobber each other's branch: `/worktree new`.
- Root-cause only, no fix: `/rca --diagnose`.
- Pause or transfer work to a fresh session/agent: `/handoff`.
- Repeated phase boundaries or planned context resets: `/phase-status`, then
  `/phase-start` or `/phase-close`.
