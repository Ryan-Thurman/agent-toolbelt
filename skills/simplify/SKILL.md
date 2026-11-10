---
name: simplify
description: "Apply behavior-preserving cleanup on opt-in: delete dead code, inline thin wrappers, reuse helpers, and fix small inefficiencies. Use after feature work, before PR, when asked to simplify, or to scan an area for structural smells (detect-only). For verdicts use pr-review."
---

# simplify

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Propose high-conviction, behavior-preserving cleanup and apply it on opt-in.
Prefer small deletions to ambitious rewrites. `pr-review` finds problems and applies nothing.

## Mutation Policy

Default: report-only.
Edit files only when the user explicitly asks to apply selected cleanup.
Never change behavior or edit tests to make cleanup pass.

## Core principles

- **Make the case — `rootIssue → consequence → benefit`.** Every candidate states the underlying
  flaw, what it leads to if left alone, and the concrete win of fixing it. If you cannot name a
  real, non-trivial consequence, do not flag it. "Shorter" or "cleaner" alone is not a consequence.
- **Behavior-preserving.** Keep the same output, errors, side-effects, and ordering.
  The apply rules are in `references/apply-discipline.md`.
- **Fewer, higher-conviction.** A short list of defensible deletions beats a flood of style nits.
- **Use the shared vocabulary.** Load `shared/contracts/references/maintainability-taxonomy.md` for
  smell families, `/simplify` axes, the risk and action vocabulary, thin-wrapper rules, and detection cues.
  Load `shared/contracts/references/anti-slop-naming.md` for concrete misleading-name,
  narration-comment, and speculative-abstraction cues; never turn generic-name cues into regex bans.
- **Run the React rule scan.** For TypeScript or React changes, load
  `shared/contracts/references/typescript-react-baseline.md` and run its scan. Record each listed
  rule as `Applied` or `Not applicable`. Verify versions, and require concrete impact before
  you apply a performance cleanup.
- **Respect fences and boundaries.** Skip blocks between `simplify-ignore-start: <reason>` and
  `simplify-ignore-end` comments, in any comment syntax. Take care with error handling,
  security logic, migration files, and dynamic callers.

## Mode routing

- **`/simplify`** — diff- or feature-scoped cleanup. Report, let the user select, then apply.
  This is the default mode after feature work.
- **`/code-smell`** — detect-only scan of a path or area, not bound to a diff. Rank smells by
  `severity × confidence`. Do not edit files. Hand the `safe` subset to `/simplify`.
  With `--architecture`, report no-code deepening candidates from the taxonomy's architecture mode.

## Flow

1. **Scope** the target. Default to the working diff if the tree is dirty.
   Otherwise use the named path, area, or focus. Use `previous` for `git diff HEAD~1..HEAD`.
2. **Detect** candidates using `shared/contracts/references/maintainability-taxonomy.md`. For reuse
   candidates, search the codebase for the existing helper first and quote the symbol you'd use.
   Use the anti-slop contract only where the consequence is concrete.
   Flag legacy or untouched code only when the current change touches it.
3. **Make the case** for each candidate (rootIssue → consequence → benefit).
   Give it a `risk` and an `action` from the taxonomy. Drop anything without a real consequence.
4. **Report** the findings as a table, with no prose dump. Return an empty list if nothing survives.
   - `/simplify` fields: `category, file, lines, rootIssue, consequence, benefit, risk, action`.
   - `/code-smell` fields: `category, severity, confidence, file, lines, smell, evidence, impact,
     recommendation, action`. Mark the findings that are `safe` to route to `/simplify`.
   - `--architecture` fields: use the taxonomy's architecture report shape.
   Stop here for `/code-smell`.
5. **Apply on opt-in** (`/simplify`). Before you edit, read `references/apply-discipline.md`.

## Completion

The report lists each surviving finding with its risk and action.
After apply, the relevant tests pass, and the cleanup stays separate from feature or fix changes.

## Reference map

- `shared/contracts/references/maintainability-taxonomy.md` — smell families, `/simplify` axes,
  architecture mode, risk and action vocabulary, thin-wrapper rules, and detection cues.
- `references/apply-discipline.md` — selection, behavior-preserving rules, the Chesterton's Fence
  checklist, the apply loop, and red flags.
- `references/rct-acceleration.md` — read it when rct graph tools such as `impact_of` or
  `build_context_pack` are in the tool list.
