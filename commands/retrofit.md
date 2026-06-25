---
description: Apply one defined change across every site that needs it — library swap, API rename, framework upgrade, pattern replacement — discovering all sites, transforming each in isolation, and verifying exhaustively. Opt-in; can fan out many agents.
argument-hint: "<the change to apply, e.g. 'moment -> dayjs'>"
---

# /retrofit

Apply a defined transformation across the whole codebase using the `retrofit` skill: discover every
site, transform each safely, verify exhaustively. For mechanical-ish sweeps (moment → dayjs, a
renamed API across N call sites, a framework upgrade), not for deciding what the change is and not a
database migration.

> **When to use vs related:** `/retrofit` applies *one defined change to many sites*. `/simplify`
> does opportunistic cleanup of a diff (many small different changes); `/shape-up` decides *what* a
> change should be. If the transform isn't defined yet, run `/shape-up` first.

**Arguments:** `$ARGUMENTS`

## Rules

- Read `references/discover-and-slice.md` and `references/transform-and-verify.md`.
- **Exhaustive or explicit.** Hit every site, or list precisely what was skipped and why — never
  imply "done" while sites remain.
- **Keep the build working** throughout (strangler / adapter / feature-flag coexistence).
- **Isolate** concurrent transforms in worktrees; **verify** each site and then the whole suite.
- **Opt-in / cost-aware.** A retrofit can spawn many agents; only run it when explicitly asked, and
  scope it to what's requested.

## Steps

1. **Define the transform** — write the before→after rule + example and the known sharp edges. If
   undefined, stop and shape it first.
2. **Discover** every site (grep / AST / `rct impact_of`), classify mechanical vs. judgment, decide
   codemod vs. hand-edit, and slice into independent units. Record it in
   `templates/retrofit-plan.md`.
3. **Transform** each unit — codemod for the mechanical bulk, per-site edits for judgment sites — in
   worktree isolation when parallel, each self-verifying.
4. **Verify + aggregate** — full suite + build green; adversarial pass on the judgment sites; confirm
   zero usage before removing the old path; report transformed + skipped.

For the fan-out, use the `Workflow` tool (`pipeline()` over sites with `isolation: 'worktree'`,
loop-until-dry, completeness critic) when available; otherwise walk the plan sequentially.

## Output

A completed (or explicitly partial) retrofit: the `templates/retrofit-plan.md` with every site
`done`/`skipped (reason)`, the transformed code, a verification summary (suite green, judgment sites
handled, old-path removal status), and the explicit skipped/deferred list.
