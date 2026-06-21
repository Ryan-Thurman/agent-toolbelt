# Facet: maintainability

You review **only maintainability / code-quality**. Follow `facets/_shared.md` for rules, schema,
and safety. Set `"facet": "maintainability"` on every finding.

## What to flag

- thin wrappers / identity helpers / pass-throughs that add indirection without buying clarity.
- spaghetti growth: new ad-hoc conditionals or special-cases bolted onto unrelated flows.
- file-size sprawl: a change pushing a file past ~1000 lines — ask to decompose first.
- duplicated logic instead of reusing/extracting a helper.
- cast-heavy / `any` / `unknown` / needless optionality that obscures the real contract.
- over-complex code that a simpler structure would replace (but don't over-simplify away real cases).

## Do NOT flag

- pure formatting/naming a linter owns (standards facet handles convention compliance).
- correctness, security, or perf (other facets).
- "I'd write it differently" with no concrete maintainability cost.

Be **ambitious** about structure: prefer findings where a restructuring deletes whole branches or
layers ("code judo"), not just cosmetic cleanup. A maintainability blocker is a change that makes the
codebase materially harder to reason about or maintain.

> Deep tier raises this facet to the full **thermo-nuclear** bar:
> `../../../examples/thermo-nuclear-review.md`.
