---
name: retrofit
description: Apply one defined change across every required site, such as a library swap, API rename, framework upgrade, or pattern replacement. Use for codebase-wide mechanical changes. Not for deciding the change or database migrations.
---

# retrofit

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Apply **one defined transformation across the whole codebase**, everywhere it's needed, without
missing a site and without breaking the build along the way. The classic targets: a library swap
(moment → dayjs), an API/symbol rename across N call sites, a framework upgrade, a pattern
replacement.

## Mutation Policy

| Tier | When | Allowed changes |
| --- | --- | --- |
| Discover | Default. | Report the transform, sites, and slices. Write the plan file from `templates/retrofit-plan.md` only when the user asks for a durable plan. |
| Apply | The user explicitly asks to apply the defined transformation. | Record site status in `templates/retrofit-plan.md`. Edit sites slice by slice. Keep each slice behavior-preserving and verified before the next. |
| Fan out | The user explicitly asks for parallel agents. | Use the `Workflow` tool: `pipeline()` over units with `isolation: 'worktree'`, loop until dry, then a completeness critic. This can spawn many agents and use many tokens. Without the tool, walk the plan sequentially. |

## Scope

- **It applies a *defined* transform.** You (or `/shape-up`) decide what the change is; retrofit
  applies it everywhere, exhaustively, and verifies. If the transform isn't defined yet, define it
  first — retrofit is the fan-out, not the design. It is not a database migration.
- **It owns repetitive fan-out.** Pure redesign is normal feature/refactor work. Hybrid work can use
  retrofit only for the repetitive consumer sweep after each unit's design is settled.

## Principles (always)

- **Exhaustive, or say what you skipped.** The whole point is to hit *every* site. If you cap
  coverage (sampling, top-N, a class of sites deferred), state exactly what was left and why — a
  half-done retrofit that reads as complete is the dangerous failure mode.
- **Keep the build working throughout.** Migrate incrementally; don't leave the tree broken between
  sites. Use a strangler / adapter / feature-flag strategy so old and new can coexist until the
  sweep finishes.
- **Verify each site, then the whole.** Every transformed site self-verifies (compile/test the unit);
  a final pass runs the full suite and adversarially checks the risky sites.
- **Don't remove the old path until usage is zero.** Verify no remaining references before deleting
  the old library/API/pattern.

## The loop

```
Discover  →  Transform  →  Verify + aggregate
 enumerate    apply the     prove completeness,
 every site   defined       report skips
 and slice    change
```

1. **Discover.** Read `references/discover-and-slice.md`. Define the transform, enumerate every
   site, classify the work, and slice it before any change.
2. **Transform.** Read `references/transform-and-verify.md`. Apply the defined change slice by
   slice, preserve behavior, and verify each slice before the next.
3. **Verify and aggregate.** Use the same reference. Repeat discovery until a pass finds no new
   site. Prove the whole tree, enforce the zero-usage gate before removal, and report every skipped
   or deferred site explicitly.

The work is complete when every discovered site is `done` or `skipped (reason)`, the full suite and
build pass, and the old path is removed or its blockers are recorded.
