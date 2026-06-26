# workflows/

Portable multi-step orchestrations — the "when X, do Y1→Y2→Y3" procedures.
Folds in what might otherwise be playbooks/recipes: keep them here as
self-contained, copy-pasteable workflow docs or scripts.

- `ai-feature-delivery-lifecycle.md` - Feature Master Record-centered delivery
  lifecycle with refinement, development, QA, and release documentation gates.
- `cursor-first-ai-feature-delivery.md` - how to package the delivery process as
  Cursor rules, slash commands, workflow recipes, and templates.
- `dev-lite-feature-workflow.md` - lightweight feature/app loop from intake to
  phased implementation, phase review, and final PR review.
- `phase-context-workflow.md` - durable phase files, handoffs, and context
  packets so long agent work can survive `/clear` or `/compact`.
- `dev-ticket-to-pr.md` - bridge workflow from refined ticket through
  implementation, tests, doc deltas, diff review, and PR traceability.
- `bug-to-fix-workflow.md` - diagnostic lane from bug report through triage,
  reproduction, root-cause analysis, minimal fix, and verification.
- `retrofit-workflow.md` - apply one defined change across every site
  (discover → transform in isolation → verify exhaustively); opt-in fan-out.

Common entry command: `/workflow-router` chooses the smallest useful command or
workflow for the current state.

For a hands-on first run, follow `../docs/tutorial.md`.
