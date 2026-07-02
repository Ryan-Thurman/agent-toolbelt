---
description: Actively simplify a diff or area of code — propose high-conviction cleanups (dead code, debug remnants, thin wrappers, reuse, small inefficiencies) and apply them on opt-in. Use after a feature or to slim a diff before PR.
argument-hint: "[target-or-focus] (default: working diff)"
---

# /simplify

Drive cleanup of existing code with the `simplify` skill. Proposes simplifications, then applies
the ones you opt into. Biased toward small, behavior-preserving deletions — not rewrites.

> **When to use vs related:** `/simplify` *applies* cleanups; `/pr-review` *finds* problems and
> applies nothing; `/code-smell` scans an area for structural smells without applying. For bugs or
> a merge verdict use `/pr-review`.

**Arguments:** `$ARGUMENTS`

## Rules

- Read `shared/contracts/references/maintainability-taxonomy.md` and the skill's
  `references/apply-discipline.md`.
- **Make the case** for every candidate (`rootIssue → consequence → benefit`). Drop anything
  without a real, non-trivial consequence — "shorter" / "cleaner" is not one.
- **Behavior-preserving only.** All existing tests must pass unmodified; if a change needs a test
  edit, revert it. Keep cleanup in its own commit, separate from features/fixes.
- **Report first, apply on opt-in.** Never silently rewrite.

## Steps

1. **Scope** the target: default to the working diff if the tree is dirty; otherwise the path or
   focus in the arguments.
2. **Detect** candidates across reuse / quality / efficiency (and the thin-wrapper taxonomy). For
   reuse candidates, search the codebase and quote the existing symbol you'd use.
3. **Make the case** and assign each a `risk` tier (`safe` / `confirm` / `review`) and an `action`
   (`delete` / `inline` / `refactor` / `parallelize`).
4. **Report** the findings list (file, lines, rootIssue, consequence, benefit, risk, action). Skip
   `simplify-ignore` blocks.
5. **Apply on opt-in** per `references/apply-discipline.md`: one change at a time, run tests after
   each, revert on failure, run the Chesterton's-Fence check before any deletion.

## Output

A findings list (empty if nothing survives the consequence test), then — for the items the user
selects — the applied changes with the tests run, kept in a separate cleanup commit. Default-apply
only `safe` items; `confirm`/`review` require explicit selection.
