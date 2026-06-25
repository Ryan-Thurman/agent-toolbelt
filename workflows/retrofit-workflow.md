# Retrofit Workflow

Apply one defined change across every site that needs it — exhaustively, in isolation, verified.
Backed by the `retrofit` skill (`skills/retrofit/SKILL.md`). Use for mechanical-ish codebase-wide
changes (library swap, API rename, framework upgrade, pattern replacement) — **not** a database
migration, and **not** for deciding what the change is.

This is a deterministic fan-out, so it maps onto the `Workflow` orchestration tool. It is
**explicitly opt-in** — it can spawn many agents and consume significant tokens; only run it when
asked.

## Steps

1. **`/shape-up`** (if needed) — if the transform isn't defined, define it first (rule +
   before→after example + sharp edges). retrofit applies a *defined* change; it doesn't design one.
2. **Discover (inline)** — enumerate every site (grep / AST / `rct impact_of`), classify mechanical
   vs. judgment, decide codemod vs. hand-edit, slice into independent units. Record in
   `templates/retrofit-plan.md`. You need the work-list before fanning out.
3. **Transform (fan out)** — `pipeline()` over the sites: one agent per unit, `isolation: 'worktree'`
   so parallel edits don't collide; codemod for the mechanical bulk, per-site edits for judgment
   sites; each unit self-verifies. Keep the tree working via the chosen coexistence strategy
   (strangler / adapter / feature-flag).
4. **Loop-until-dry** — re-discover; if the first sweep missed sites, transform those too; repeat
   until a pass finds nothing new.
5. **Verify + aggregate** — full test suite + build green; a completeness critic / adversarial pass
   over the judgment sites; confirm zero references to the old path before removing it.
6. **Remove the old path** — only once usage is provably zero: delete the old library/API/pattern,
   its tests, config, and docs.

## Gates

- Transform must be defined (rule + example) before discovery.
- The tree stays building between units (coexistence strategy).
- Every site ends `done` or `skipped (reason)` in the plan — no silent truncation.
- No removal of the old path until references are provably zero.

## Completion criteria

- Every discovered site transformed or explicitly skipped with a reason.
- Full suite + build green; judgment sites adversarially verified.
- Old path removed (or the blockers to removal recorded).
- `templates/retrofit-plan.md` is the durable record — a partial retrofit can resume from it.
