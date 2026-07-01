---
name: simplify
description: Apply behavior-preserving cleanup on opt-in: delete dead code, inline thin wrappers, reuse helpers, and fix small inefficiencies. Use after feature work, before PR, or when asked to simplify. For verdicts use pr-review.
---

# simplify

The **active** counterpart to `pr-review`. Where pr-review is a passive gate that *finds problems
and applies nothing*, simplify *drives the cleanup* — it proposes high-conviction simplifications
and applies them on opt-in. It is biased toward small, behavior-preserving deletions, not ambitious
rewrites.

> Lifts concepts (MIT) from pi-simplify and addyosmani/agent-skills — see **Credits**.

## Mutation Policy

Default: report-only.
Edit files only when the user explicitly asks to apply selected cleanup.
Never change behavior or edit tests to make cleanup pass.

## Two modes

- **`/simplify`** — diff- or feature-scoped cleanup. Report → user selects → apply. Biased to
  `safe`/`confirm` changes. This is the default, post-feature tool.
- **`/code-smell`** — detect-only scan of a path/area (not diff-bound). Surfaces deeper structural
  smells ranked by `severity × confidence`. **Never auto-applies** — it hands findings to a human
  (or to `/simplify` for the safe subset). Use `/code-smell <path> --architecture` for no-code
  architecture/deepening candidates.

## Principles (always)

- **Make the case — `rootIssue → consequence → benefit`.** Every candidate states the underlying
  flaw, what it leads to if left alone, and the concrete win of fixing it. **If you cannot name a
  real, non-trivial consequence, do not flag it.** "Slightly shorter" / "a bit cleaner" is not a
  consequence. Each item must survive *"what actually goes wrong if we leave this?"*
- **Behavior-preserving.** Same output, errors, side-effects, and ordering. **All existing tests
  must still pass without modification** — if a "simplification" needs test edits, you changed
  behavior; back it out.
- **Report-then-apply.** Propose findings first; apply only what the user opts into, in a separate
  step. Never silently rewrite.
- **Fewer, higher-conviction.** A short list of defensible deletions beats a flood of style nits.
- **Keep one maintainability vocabulary.** `references/smell-taxonomy.md` is the shared source for
  `/code-smell`, `/simplify`, and `pr-review` maintainability. This skill owns the *apply* side.
  Leave ambitious structural "code judo" rewrites to `pr-review --tier=deep` (advisory);
  simplify stays small and safe.
- **Respect fences.** Honor `simplify-ignore` block markers and existing abstraction boundaries;
  be especially careful with error handling, security logic, migration files, and code that looks
  unused but is called via reflection/eval.

## Risk tiers (drive what gets applied)

- **safe** — apply by default (dead code, debug remnants like `console.log`/`debugger`).
- **confirm** — apply after the user confirms (reuse swaps, thin-wrapper inlines, hacky patterns,
  efficiency fixes).
- **review** — user looks first (commented-out code, anything ambiguous).

Each finding carries an `action` verb that bounds the edit: `delete | inline | refactor |
parallelize` (`/simplify`); `inspect | delete | inline | extract | refactor | guard`
(`/code-smell`).

## Flow

1. **Scope** the target (default: the working diff if dirty; or a named path/area for `/code-smell`).
2. **Detect** candidates using `references/smell-taxonomy.md`. For reuse candidates, search the
   codebase for the existing helper first and quote the symbol you'd use.
3. **Make the case** for each (rootIssue → consequence → benefit) and assign a `risk` tier; drop
   anything without a real consequence.
4. **Report** the findings list (no prose dump). Stop here for `/code-smell`.
5. **Apply on opt-in** (`/simplify`) following `references/apply-discipline.md`: one change at a
   time, run tests after each, revert on failure, keep cleanup commits separate.

## References

- `references/smell-taxonomy.md` — the shared smell families, compact Fowler-style baseline,
  architecture/deepening mode, `/simplify` reuse/quality/efficiency axes, thin-wrapper taxonomy and
  keep-rule, and detection cues.
- `references/apply-discipline.md` — the report-then-apply contract, the Chesterton's-Fence
  pre-removal checklist, behavior-preserving rules, red flags, and scope/ignore handling.
- `references/rct-acceleration.md` — *optional*: when the rct MCP tools are available, use the graph
  for reuse-search and caller checks (file-reading fallback otherwise).

## Credits

Concepts adapted (MIT, reworded) from pi-simplify (smell taxonomy, thin-wrapper detectors, risk
tiers, rootIssue→consequence→benefit) and addyosmani/agent-skills (code-simplification discipline,
Chesterton's Fence, the simplify-ignore mechanism).
