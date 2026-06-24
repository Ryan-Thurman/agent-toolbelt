---
description: Slice an approved brief into vertical-slice tickets — each a narrow but complete path through every layer, demoable on its own, published in dependency order. Use after /shape-up to break a brief into independent issues.
argument-hint: "<approved-brief-or-context>"
---

# /to-issues

Slice an agreed brief into implementation-ready, **vertical-slice** tickets using the `shape-up`
skill.

> **When to use vs related:** `/to-issues` is the lightweight slicer for the dev lane (use after
> `/shape-up`). For the regulated feature-delivery lane with traceability to a Feature Master
> Record, use `/refine-to-tickets` instead.

**Arguments:** `$ARGUMENTS`

## Rules

- Work from an **approved** brief (from `/shape-up`). If none exists, run `/shape-up` first.
- **Vertical slices, not layers.** Each ticket delivers a narrow but COMPLETE path through every
  layer (schema, API, UI, tests) and is demoable/verifiable on its own. Any prefactoring goes first.
- Use `templates/shape-up-issues.md` for each ticket.

## Steps

1. Read the approved brief.
2. Cut the work into vertical slices; put any required prefactoring as the first slice.
3. For each slice, write `What to build` (end-to-end behavior, not layer-by-layer), `Acceptance
   criteria` (checkboxes), and `Blocked by` (or "None - can start immediately").
4. **Quiz the breakdown** before finalizing: is the granularity right (too coarse / too fine)? are
   the dependency relationships correct? should any slices merge or split?
5. Order the tickets by dependency (blockers first) so the `Blocked by` references are real.

## Output

A dependency-ordered list of vertical-slice tickets following `templates/shape-up-issues.md`, each
demoable on its own, ready to hand to `/dev-plan` or `/dev-implement-task`.
