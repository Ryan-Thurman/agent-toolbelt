# workflows/

Two kinds of files live here. Catalog stage maps give the order of skills for one kind of work.
Hand-written playbooks describe a loop or lane in prose.
The skill for each stage owns its steps and completion rules.
The [offline portal](../portal/generated/index.html) owns discovery and examples.

## Catalog stage maps

`catalog/agent-toolbelt.json` owns the stage lists.
`scripts/build-workflow-stages.js` writes each stage table between the `catalog stages` markers.
Do not edit a table by hand. `scripts/check-catalog.sh` fails when a table does not match the catalog.

- `feature-refinement-workflow.md` - ticket or story refinement into a ready-to-build spec, with
  owner questions, Given/When/Then criteria, feature files, and a readiness verdict.
- `risk-based-testing-workflow.md` - risk areas mapped once from code, history, and a workspace map,
  then a focused test plan and a deeper review for each pull request.
- `product-learning-workflow.md` - research synthesis, opportunity decisions, experiments, and outcome review.
- `tech-debt-workflow.md` - debt discovery, selected assessment, authorized repair, and baseline verification.
- `system-design-workflow.md` - design documents, threat and reliability reviews, failure scenarios, security and reliability requirements, and implementation evidence.
- `production-readiness-workflow.md` - readiness evidence for each reliability requirement, staging
  experiment plans for the missing evidence, and a release with SLO burn-rate rollback triggers.
- `incident-follow-up-workflow.md` - root-cause fix with a regression test, the failure mode in the
  register, and tests that prove detection and recovery.

## Hand-written playbooks

- `phased-delivery-workflow.md` - requirement or ticket delivery as one PR per
  phase, with human review and optional stacked PRs.
- `delivery-retrospective-workflow.md` - evidence-backed process improvements after delivery.
- `tech-backlog-assessment-workflow.md` - decision workflow for technical
  backlog items before implementation.
- `ticket-discovery-workflow.md` - narrow workflow for tickets that point to an
  existing precedent to copy or adapt.
- `phase-context-workflow.md` - durable phase files, handoffs, and context
  packets so long agent work can survive `/clear` or `/compact`. It composes
  `handoff` for phase closeout.
- `phase-gate-solo-workflow.md` - in-loop subagent review at each phase
  boundary, with feedback and merge in one session.
- `phase-gate-team-workflow.md` - phase-boundary review that posts comments
  for a human reviewer and does not merge.
- `bug-to-fix-workflow.md` - diagnostic lane from bug report through triage,
  reproduction, root-cause analysis, minimal fix, and verification.
- `retrofit-workflow.md` - apply one defined change across every site
  (discover -> transform in isolation -> verify exhaustively). It is opt-in fan-out.

Common entry command: `/workflow-router` (installed with `phased-delivery` or `all`) chooses the smallest useful command or
workflow for the current state.

For installation and workflow entry points, use [the wiki](../wiki/Home.md).
