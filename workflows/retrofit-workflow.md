# Retrofit Workflow

Use the `retrofit` skill for this workflow.
The skill owns the scope, the mutation tiers, the principles, and the completion criteria.
Run this fan-out only when the user explicitly asks for parallel agents.

## Steps

1. **`/shape-up`** (if needed) — if the transform isn't defined, define it first (rule +
   before→after example + sharp edges).
2. **Discover (inline)** — enumerate every site (grep / AST), classify mechanical vs. judgment,
   decide codemod vs. hand-edit, and slice into independent units. Record them in
   `templates/retrofit-plan.md`. You need the work-list before fanning out.
3. **Transform (fan out)** — `pipeline()` over the units: one agent per unit, `isolation: 'worktree'`
   so parallel edits don't collide; codemod for the mechanical bulk, per-site edits for judgment
   sites; each unit self-verifies. Keep the tree working via the chosen coexistence strategy.
4. **Loop until dry** — re-discover; if the first sweep missed sites, transform those too; repeat
   until a pass finds nothing new.
5. **Verify and aggregate** — run the full test suite and build. Run a completeness critic and an
   adversarial pass over the judgment sites. Confirm zero references to the old path.
6. **Remove the old path** — delete the old library, API, or pattern, with its tests, config, and docs.
