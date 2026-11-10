# workflows/

Portable multi-step orchestrations — the "when X, do Y1→Y2→Y3" procedures.
The [offline portal](../portal/generated/index.html) owns discovery, examples,
and the common workflow map; these files provide deeper copy-pasteable
operational procedures for skills and the project installer.

`SKILL.md` remains the canonical behavior source. Commands are optional
project-scoped compatibility UX, while workflow files hold reusable supporting
detail rather than native plugin skill copies.

- `phased-delivery-workflow.md` - requirement or ticket delivery as one PR per
  phase, with human review and optional stacked PRs.
- `product-learning-workflow.md` - research synthesis, opportunity decisions, experiments, and outcome review.
- `tech-debt-workflow.md` - debt discovery, selected assessment, authorized repair, and baseline verification.
- `system-design-workflow.md` - design documents, threat review, security requirements, and implementation evidence.
- `delivery-retrospective-workflow.md` - evidence-backed process improvements after delivery.
- `tech-backlog-assessment-workflow.md` - decision workflow for technical
  backlog items before implementation.
- `ticket-discovery-workflow.md` - narrow workflow for tickets that point to an
  existing precedent to copy or adapt.
- `phase-context-workflow.md` - durable phase files, handoffs, and context
  packets so long agent work can survive `/clear` or `/compact`; composes
  `handoff` for phase closeout.
- `phase-gate-solo-workflow.md` - in-loop subagent review at each phase
  boundary, with feedback and merge in one session.
- `phase-gate-team-workflow.md` - phase-boundary review that posts comments
  for a human reviewer and does not merge.
- `dev-ticket-to-pr.md` - redirect to `phased-delivery-workflow.md`.
- `bug-to-fix-workflow.md` - diagnostic lane from bug report through triage,
  reproduction, root-cause analysis, minimal fix, and verification.
- `retrofit-workflow.md` - apply one defined change across every site
  (discover → transform in isolation → verify exhaustively); opt-in fan-out.

Common entry command: `/workflow-router` chooses the smallest useful command or
workflow for the current state.

For installation and workflow entry points, use [the wiki](../wiki/Home.md).
