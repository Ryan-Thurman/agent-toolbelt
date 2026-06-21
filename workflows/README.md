# workflows/

Portable multi-step orchestrations — the "when X, do Y1→Y2→Y3" procedures.
Folds in what might otherwise be playbooks/recipes: keep them here as
self-contained, copy-pasteable workflow docs or scripts.

- `ai-feature-delivery-lifecycle.md` - Feature Master Record-centered delivery
  lifecycle with refinement, development, QA, and release documentation gates.
- `cursor-first-ai-feature-delivery.md` - how to package the delivery process as
  Cursor rules, slash commands, workflow recipes, and templates.
- `dev-ticket-to-pr.md` - bridge workflow from refined ticket through
  implementation, tests, doc deltas, diff review, and PR traceability.

Common entry command: `/workflow-router` chooses the smallest useful command or
workflow for the current state.

For a hands-on first run, follow `../docs/tutorial.md`.
