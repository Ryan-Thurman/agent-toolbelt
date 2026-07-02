---
name: simplify
description: Apply behavior-preserving cleanup on opt-in: delete dead code, inline thin wrappers, reuse helpers, and fix small inefficiencies. Use after feature work, before PR, or when asked to simplify. For verdicts use pr-review.
---

# simplify

The **active** counterpart to `pr-review`. Where pr-review is a passive gate that *finds problems
and applies nothing*, simplify *drives the cleanup* — it proposes high-conviction simplifications
and applies them on opt-in. It is biased toward small, behavior-preserving deletions, not ambitious
rewrites.

Use it after feature work, before PR, or when the user explicitly asks to simplify. Use `pr-review`
for verdicts.

## Mutation Policy

Default: report-only.
Edit files only when the user explicitly asks to apply selected cleanup.
Never change behavior or edit tests to make cleanup pass.

## Core principles

- **Make the case — `rootIssue → consequence → benefit`.** Every candidate states the underlying
  flaw, what it leads to if left alone, and the concrete win of fixing it. If you cannot name a
  real, non-trivial consequence, do not flag it.
- **Behavior-preserving.** Same output, errors, side-effects, and ordering. All existing tests must
  still pass without modification.
- **Report-then-apply.** Propose findings first; apply only what the user opts into, in a separate
  step. Never silently rewrite.
- **Fewer, higher-conviction.** A short list of defensible deletions beats a flood of style nits.
- **Use the shared vocabulary.** Load `shared/contracts/references/maintainability-taxonomy.md` for
  smell families, `/simplify` axes, risk/action vocabulary, thin-wrapper rules, and detection cues.
- **Respect fences and boundaries.** Honor `simplify-ignore` block markers and existing abstraction
  boundaries; be careful around error handling, security logic, migration files, and dynamic callers.

## Mode routing

- **`/simplify`** — diff- or feature-scoped cleanup. Report → user selects → apply. Biased to
  `safe`/`confirm` changes. This is the default, post-feature tool.
- **`/code-smell`** — detect-only scan of a path/area (not diff-bound). Surfaces deeper structural
  smells ranked by `severity × confidence`. **Never auto-applies** — it hands findings to a human
  (or to `/simplify` for the safe subset). Use `/code-smell <path> --architecture` for no-code
  architecture/deepening candidates.

## Flow

1. **Scope** the target (default: the working diff if dirty; or a named path/area for `/code-smell`).
2. **Detect** candidates using `shared/contracts/references/maintainability-taxonomy.md`. For reuse
   candidates, search the codebase for the existing helper first and quote the symbol you'd use.
3. **Make the case** for each (rootIssue → consequence → benefit) and assign a `risk` tier; drop
   anything without a real consequence.
4. **Report** the findings list (no prose dump). Stop here for `/code-smell`.
5. **Apply on opt-in** (`/simplify`) following `references/apply-discipline.md`: one change at a
   time, run relevant tests, revert on failure, keep cleanup commits separate.

## Reference map

- `shared/contracts/references/maintainability-taxonomy.md` — shared smell families, compact
  Fowler-style baseline, architecture/deepening mode, `/simplify` axes, risk/action vocabulary,
  thin-wrapper rules, and detection cues.
- `references/apply-discipline.md` — the report-then-apply contract, the Chesterton's-Fence
  pre-removal checklist, behavior-preserving rules, red flags, and scope/ignore handling.
