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

## Mutation Policy

Default: report-only discovery.
Edit files only when the user explicitly asks to apply the defined
transformation.
Keep each applied slice behavior-preserving and verified before moving on.

## Scope

- **It applies a *defined* transform.** You (or `/shape-up`) decide what the change is; retrofit
  applies it everywhere, exhaustively, and verifies. If the transform isn't defined yet, define it
  first — retrofit is the fan-out, not the design.
- **It owns repetitive fan-out.** Pure redesign is normal feature/refactor work. Hybrid work can use
  retrofit only for the repetitive consumer sweep after each unit's design is settled.

## Principles (always)

- **Exhaustive, or say what you skipped.** The whole point is to hit *every* site. If you cap
  coverage (sampling, top-N, a class of sites deferred), state exactly what was left and why — a
  half-done retrofit that reads as complete is the dangerous failure mode.
- **Keep the build working throughout.** Migrate incrementally; don't leave the tree broken between
  sites. Use a strangler / adapter / feature-flag strategy (`references/transform-and-verify.md`) so
  old and new can coexist until the sweep finishes.
- **Verify each site, then the whole.** Every transformed site self-verifies (compile/test the unit);
  a final pass runs the full suite and adversarially checks the risky sites.
- **Don't remove the old path until usage is zero.** Verify no remaining references (the graph or a
  fresh grep) before deleting the old library/API/pattern.

## The loop

```
Discover  →  Transform  →  Verify + aggregate
 enumerate    apply the     prove completeness,
 every site   defined       report skips
 and slice    change
```

1. **Discover** (`references/discover-and-slice.md`) — define the transform, enumerate every site,
   classify the work, and capture a durable plan before any fan-out.
2. **Transform** (`references/transform-and-verify.md`) — apply the defined change slice by slice,
   preserving behavior and verifying each slice before moving on.
3. **Verify + aggregate** (`references/transform-and-verify.md`) — prove the whole tree, enforce the
   zero-usage gate before removal, and report every skipped or deferred site explicitly.

## Orchestration

Retrofit can be run sequentially from the plan or fanned out with orchestration. Because it can
spawn many agents and consume a lot of tokens, orchestration is **explicitly opt-in**; scope it to
what the user asked for.

## References

- `references/discover-and-slice.md` — enumerating every site, the mechanical-vs-judgment split, the
  codemod-vs-hand-edit decision, and slicing into independent units.
- `references/transform-and-verify.md` — worktree isolation, the strangler/adapter/feature-flag
  coexistence strategies, per-site + whole-suite verification, the no-silent-truncation rule, and
  the verify-zero-usage-before-removal gate.
