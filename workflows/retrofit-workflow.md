# Retrofit workflow

Use the `retrofit` skill for this workflow.
The skill owns the scope, the mutation tiers, the principles, and the completion criteria.
Run this fan-out only when the user explicitly asks for parallel agents.

## Steps

1. **`/shape-up`** (if needed): if the transform is not defined, define it first (rule +
   before -> after example + sharp edges).
2. **Discover (inline)**: enumerate every site (grep / AST), classify mechanical vs. judgment,
   decide codemod vs. hand-edit, and slice into independent units. Record them in
   a plan file made from `templates/retrofit-plan.md` only when the user asks for a durable plan.
   You need the work-list before fanning out.
3. **Transform (fan out)**: `pipeline()` over the units: one agent per unit, `isolation: 'worktree'`
   so parallel edits do not collide, with a codemod for the mechanical bulk and per-site edits for judgment
   sites. Each unit self-verifies. Keep the tree working via the chosen coexistence strategy.
4. **Loop until dry**: re-discover. If the first sweep missed sites, transform those too. Repeat
   until a pass finds nothing new.
5. **Verify and aggregate**: run the full test suite and build. Run the whole-change checks in
   "Verify the whole" in `skills/retrofit/references/transform-and-verify.md`.
6. **Remove the old path**: delete the old library, API, or pattern, with its tests, config, and docs.
