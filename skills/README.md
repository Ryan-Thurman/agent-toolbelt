# skills/

Agent **skills** you want to keep or adapt — each in its own subfolder with a
`SKILL.md`. Lifted from reviewed repos or written from scratch.

The AI Feature Delivery skills are installed into pilot repos by
`../install-ai-feature-delivery.sh`. See `../docs/tutorial.md` for the first-run
workflow.

- `pr-review/` - tiered multi-agent PR/code review.
- `bug-to-fix/` - diagnostic lane: triage, reproduce, root-cause analysis,
  minimal fix, and verification for a reported bug.
- `shape-up/` - interrogate a vague request into an agreed brief before
  building (the front-door to the dev lanes).
- `simplify/` - active code cleanup: apply high-conviction simplifications on
  opt-in (the counterpart to pr-review).
- `dev-lite-workflow/` - lightweight dev workflow for feature/app ideas,
  phased implementation, per-task commits, phase reviews, and final PR review.
- `ai-feature-delivery/` - release-traceable feature definition, design docs,
  refinement tickets, QA handoff, and release document control.
- `webapp-testing/` - browser/webapp verification for user-facing changes and
  QA evidence.

## Optional rct acceleration

`pr-review`, `bug-to-fix`, `simplify`, and `shape-up` each ship a
`references/rct-acceleration.md`. If the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt)
MCP tools are available in the session, the skill uses the code graph for the
retrieval-heavy steps (blast radius, callers, scope, localization) at a fraction
of the tokens. It is strictly optional — every skill works by reading files
directly when rct is not present.

## Canonical copies

`skills/dev-lite-workflow/SKILL.md` is the **canonical** source. The repo also
ships `.agents/skills/dev-lite-workflow/SKILL.md` (the repo-scoped Codex copy);
it must stay byte-identical. Edit the canonical file, then mirror the change.
Run `scripts/check-skill-sync.sh` to verify the two copies match (also runnable
in CI).
