# Smell taxonomy and detection cues

What to look for. `/code-smell` scans by family; `/simplify` scans by axis. Treat cheap regex/lexical
cues as untrusted leads to verify by reading, never as truth.

This file is the shared maintainability vocabulary for `/code-smell`, `/simplify`, and the
`pr-review` maintainability facet. Keep it as the single source of truth: other prompts may point
here, but should not copy this taxonomy.

## Baseline rules

Use the smell names below as heuristics, not hard violations. A documented repo standard or local
architecture note wins over the baseline; if the repo intentionally endorses a pattern, suppress the
smell. Every finding still needs concrete evidence and a consequence.

## `/code-smell` families (structural scan)

- **Complexity** — long functions, mixed responsibilities, deep nesting, boolean-flag control flow,
  branch-heavy conditionals.
- **Duplication** — copy-paste blocks, repeated condition chains, parallel representations of the
  same concept.
- **Coupling** — modules reaching through boundaries, feature code importing internals,
  circular-feeling dependencies.
- **State** — redundant derived state, mutable globals, caches without invalidation, multiple
  sources of truth.
- **Errors** — swallowed errors, empty catch blocks, broad catch that hides failures, inconsistent
  error mapping.
- **Performance** — N+1 loops, repeated I/O, sequential awaits for independent work, hot-path
  blocking work.
- **Maintainability** — debug remnants, commented-out code, TODO/HACK hiding required design,
  stringly-typed constants.
- **Architecture** — shallow modules, weak seams, leakage across module interfaces, low locality,
  and scattered edits that suggest a deeper module would concentrate behavior.

## Compact Fowler-style baseline

Use these as always-available maintainability cues when repo standards are missing or thin. Fold any
hit back into the family list above rather than creating a separate report axis.

- **Mysterious name** — a symbol name hides the concept or behavior it represents.
- **Duplicated code** — the same logic shape appears in multiple places.
- **Feature envy** — code spends more effort reaching into another module/object than using its own
  data.
- **Data clumps** — the same group of fields or parameters travels together and wants a named type.
- **Primitive obsession** — strings, numbers, or booleans stand in for domain concepts with real
  invariants.
- **Repeated switches** — matching condition chains recur on the same kind of value.
- **Shotgun surgery** — one logical change forces scattered edits across many files.
- **Divergent change** — one module changes for unrelated reasons.
- **Speculative generality** — abstractions, knobs, or hooks exist for needs that are not real yet.
- **Message chains** — callers navigate through object/module internals they should not know.
- **Middle man** — a wrapper mostly delegates without protecting an API, boundary, or policy.
- **Refused bequest** — an inheritance/interface relationship is mostly ignored or worked around.

Rank each by **severity** (high = likely bug/perf/user impact; medium = concrete maintenance cost;
low = useful cleanup) **× confidence** (high only after reading enough to verify; medium for strong
lexical hints; low = worth human inspection). Do not flag subjective style. Do not recommend large
rewrites unless a small first slice is clear.

## Architecture mode (`/code-smell --architecture`)

Use this mode for no-code architecture review. It absorbs the useful `improve-codebase-architecture`
vocabulary without adding a separate visual report command.

Vocabulary:

- **Module** — a coherent unit with an interface and implementation.
- **Interface** — the surface other code uses; judge whether it is smaller than the implementation.
- **Implementation** — the hidden work the module owns.
- **Depth** — a deep module has a small interface over meaningful implementation; a shallow module
  exposes nearly as much complexity as it hides.
- **Seam** — a substitution point worth naming only when it buys leverage.
- **Adapter** — code that connects the module to an external or replaceable dependency.
- **Locality** — related behavior can be understood and changed in one place.
- **Leverage** — one change or test covers many call sites.

Deepening cues:

- A module is shallow: deleting it would just move the same complexity to the caller.
- Callers must know implementation details, message chains, data shapes, or ordering rules.
- One concept requires bouncing through several files with little behavior in each.
- The same change repeatedly touches scattered files or parallel condition chains.
- Tests target extracted helpers because the real interface is too hard to exercise.
- A seam has one adapter and no realistic substitution point.
- Feature-specific logic leaks into a shared module, or shared policy leaks into feature code.

Report architecture candidates as `candidate, strength, files, current shape, deepening opportunity,
locality/leverage gain, smallest next slice, ADR or constraint notes`. Strength is `strong`,
`worth exploring`, or `speculative`. Keep it detect-only: no HTML reports, no domain-doc edits, no
ADR creation, and no full interface proposal until the user chooses a candidate.

## `/simplify` axes (cleanup scan)

### Reuse
Before flagging, **search the codebase for an existing helper and quote the symbol you'd use.**
- Duplicates an existing function.
- Inline logic that already has a utility (hand-rolled string manipulation, manual path handling,
  custom env checks, ad-hoc type guards).
- Reinvented framework primitive.

### Quality
- **Dead code (safe)** — unused exports, orphan files, zombie variables, empty try/catch/if blocks.
- **Debug remnants (safe)** — `console.log/warn/error`, `debugger`, temporary feature flags, stale
  TODOs.
- **Commented-out code (review)**.
- **Over-engineering / thin wrappers (confirm)** — see the taxonomy below.
- **Hacky patterns (confirm)** — redundant state (cache what could be derived), parameter sprawl,
  copy-paste with variation, leaky abstractions, stringly-typed code, unnecessary wrapper elements,
  nested conditionals 3+ deep (flatten with early returns or a lookup table), useless comments (keep
  only the non-obvious WHY).

### Efficiency (confirm)
- Unnecessary work (N+1, repeated reads), missed concurrency (sequential awaits for independent
  work), hot-path bloat, recurring no-op updates (add a change-detection guard), unnecessary
  existence checks (TOCTOU — operate directly and handle the error), memory leaks/unbounded growth,
  overly broad operations.

## Thin-wrapper taxonomy (the standout)

Flag and inline/remove unless the keep-rule applies:

- **Rename-only wrapper** — `foo()` just calls `bar()` with the same inputs. Inline unless `foo` is
  a real public/domain concept.
- **Constructor/factory wrapper** — `createX(args)` only returns `new X(args)`. Inline unless the
  factory selects implementations or enforces policy.
- **Scope-specific alias** — `SlackThing`/`ConversationThing` only wraps a generic helper. Delete
  if the generic name is already clear at call sites.
- **Single-call-site helper** — used once, especially one-line formatting/parsing/path helpers.
  Inline it.
- **Duplicated write APIs** — several `saveFooConfig` functions. Consolidate into one
  `updateSettings(patch)`-style API.
- **Test-only export** — exists only so a test can reach internals. Test the underlying public
  helper or observable behavior instead.
- **Pass-through class method** — method only forwards to a function. Remove it or call the function
  directly.

**Keep rule:** keep a wrapper if it protects a public API, documents a domain boundary, centralizes
cross-cutting behavior, or isolates an unstable dependency.

## Lexical leads (verify before trusting)

- Large/complex function: > ~80 lines or > ~12 branches (`if|for|while|catch|case|&&|\|\|`); > ~140
  lines or > ~18 branches = high.
- Repeated line: a normalized non-comment line (> ~20 chars) appearing 3+ times = duplication lead.
- Debug remnant: `console.(log|debug|warn|error)` / `debugger` (the latter = high).
- Commented-out code: a `//`-prefixed line starting with `if|for|while|return|const|let|var|
  function|class|import|export`.
- Loose markers: `any`, `TODO`, `FIXME`, `HACK`, `XXX`.
