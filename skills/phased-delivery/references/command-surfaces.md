# Command surfaces

The skill is the primary interface. In Codex, invoke `$phased-delivery` or use
`/skills`, then name the desired action. The existing `/dev-*` commands remain
compatibility shortcuts in Cursor and Claude Code; they should follow this
skill's source-of-truth, ticket, phase, and PR boundaries.

- `/dev-intake`: optional concise requirement clarification for raw input.
- `/dev-plan`: source-aware phase/PR map.
- `/dev-start-phase`: reconcile source, branch, base, and checks.
- `/dev-implement-task`: implement a bounded step within the selected phase.
- `/dev-phase-review`: review that phase's diff and evidence.
- `/dev-fix-review-issues`: fix scoped review findings.
- `/dev-pr-review`: readiness review for *this phase's* PR.

Command sources live in the toolbelt repository's `commands/` directory; project
installs place them under `.cursor/commands/` or `.claude/commands/`. When a
persistent plan is needed, use
`../../../templates/phased-delivery-plan.md` unless an existing plan can hold
the same fields. `../../../templates/dev-feature-brief.md` is optional for a
raw, ambiguous idea; it is not required for ticket or approved-plan input.
The review templates `../../../templates/dev-phase-review.md` and
`../../../templates/dev-pr-review.md` may be used for per-phase evidence.
