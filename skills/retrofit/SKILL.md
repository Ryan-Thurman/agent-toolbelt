---
name: retrofit
description: Apply one defined change across every required site, such as a library swap, API rename, framework upgrade, or pattern replacement. Use for codebase-wide mechanical changes. Not for deciding the change or database migrations.
---

# retrofit

Apply **one defined transformation across the whole codebase**, everywhere it's needed, without
missing a site and without breaking the build along the way. The classic targets: a library swap
(moment → dayjs), an API/symbol rename across N call sites, a framework upgrade, a pattern
replacement.

> The name is deliberate: this *retrofits* a defined change onto existing code. It is **not** a
> database migration, and it does **not** decide *what* the change is.

> Lifts concepts (MIT) from addyosmani/agent-skills (deprecation-and-migration) and obra/superpowers
> (using-git-worktrees, subagent-driven-development) — see **Credits**.

## What this is and isn't

- **It applies a *defined* transform.** You (or `/shape-up`) decide what the change is; retrofit
  applies it everywhere, exhaustively, and verifies. If the transform isn't defined yet, define it
  first — retrofit is the fan-out, not the design.
- **Know the mechanical/judgment split** (this decides whether it even fits):
  - **Mechanical** (retrofit's sweet spot) — every site changes the *same* way. moment → dayjs call
    swaps, a renamed function's call sites, an import path change. Often scriptable as a codemod.
  - **Hybrid** — a per-unit *redesign* plus a repetitive consumer sweep. Redux → Zustand: redesigning
    each store is judgment work (do that first, per slice, with `/shape-up` + dev); updating every
    `useSelector`/`useDispatch` consumer of that slice is the repetitive sweep retrofit owns. Run it
    **slice-by-slice**: design the unit, then retrofit its consumers, then verify.
  - **Pure redesign** (no repetition) → not a retrofit; it's normal feature/refactor work.

## Principles (always)

- **Exhaustive, or say what you skipped.** The whole point is to hit *every* site. If you cap
  coverage (sampling, top-N, a class of sites deferred), state exactly what was left and why — a
  half-done retrofit that reads as complete is the dangerous failure mode.
- **Keep the build working throughout.** Migrate incrementally; don't leave the tree broken between
  sites. Use a strangler / adapter / feature-flag strategy (`references/transform-and-verify.md`) so
  old and new can coexist until the sweep finishes.
- **Isolate parallel work.** When transforming many sites concurrently, each runs in its own
  worktree so edits don't collide (`references/transform-and-verify.md`).
- **Verify each site, then the whole.** Every transformed site self-verifies (compile/test the unit);
  a final pass runs the full suite and adversarially checks the risky sites.
- **Don't remove the old path until usage is zero.** Verify no remaining references (the graph or a
  fresh grep) before deleting the old library/API/pattern.
- **Codemod-first above a threshold.** If the change is mechanical and touches more than ~a few
  dozen sites, write and apply an AST codemod rather than hand-editing each; retrofit's value is then
  catching the judgment cases the codemod misses.

## The loop

```
Discover  →  Transform (per site, isolated)  →  Verify + aggregate
 enumerate     apply the defined change,           full test suite,
 every site,   each site self-verifying;           adversarial pass on
 slice it      codemod for the mechanical bulk      risky sites, report skips
```

1. **Discover** (`references/discover-and-slice.md`) — enumerate every site (grep / AST / `rct
   impact_of` when available), classify mechanical vs. judgment, and slice the work into independent
   units. Capture it in `templates/retrofit-plan.md` (durable + resumable). Do this **inline first**
   — you need the work-list before you can fan out.
2. **Transform** — apply the defined change to each site. For the mechanical bulk, a codemod. For
   judgment sites, per-site edits. Run concurrent sites in worktree isolation, each self-verifying.
3. **Verify + aggregate** — run the full test suite, adversarially verify the risky transforms,
   confirm zero references to the old path before any removal, and report what changed and what was
   skipped.

## Orchestration

Retrofit is a deterministic fan-out — the textbook case for the `Workflow` tool: `pipeline()` over
the discovered sites with `isolation: 'worktree'`, a loop-until-dry pass to catch sites the first
sweep missed, and a completeness critic. **Scope it to what's asked** — a retrofit can spawn many
agents and consume a lot of tokens, so it is **explicitly opt-in**; don't auto-launch one. When a
Workflow runner isn't available, walk the sites sequentially from the plan.

## References

- `references/discover-and-slice.md` — enumerating every site, the mechanical-vs-judgment split, the
  codemod-vs-hand-edit decision, and slicing into independent units.
- `references/transform-and-verify.md` — worktree isolation, the strangler/adapter/feature-flag
  coexistence strategies, per-site + whole-suite verification, the no-silent-truncation rule, and
  the verify-zero-usage-before-removal gate.

## Credits

Concepts adapted (MIT, reworded) from addyosmani/agent-skills `deprecation-and-migration` (the
incremental per-consumer migration loop, strangler/adapter/feature-flag patterns, verify-zero-usage-
before-removal) and obra/superpowers `using-git-worktrees` + `subagent-driven-development` (isolation
discipline, parallel subagent fan-out).
