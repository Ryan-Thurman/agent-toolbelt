# Facet: maintainability (deep / thermo-nuclear bar)

The deep-tier replacement for `maintainability.md`. Same contract (`facets/_shared.md`), same schema,
`"facet": "maintainability"` — but held to the **thermo-nuclear** standard. Full source:
`../../../examples/thermo-nuclear-review.md`.

Be **ambitious**: don't settle for "this could be cleaner." Hunt for "code judo" — restructurings
that preserve behavior while making whole branches, helpers, modes, or layers *disappear*. Prefer
the version that makes the code feel inevitable in hindsight. Be demanding in calibration: don't
soften a real structural problem into a mild suggestion — if the change makes the codebase messier,
say so and rate it accordingly.

## Ask these for every meaningful change (discovery, not just recognition)

The flag-list below tells you what to *recognize*; these questions force you to *look*. Run them over
each non-trivial hunk before deciding it's fine:

- Is there a "code judo" move that makes this dramatically simpler — fewer concepts, branches, or
  helper layers?
- Did a previously cohesive module become more coupled, more stateful, or harder to scan?
- Is this logic in the right file and layer, or did the diff leak details across a boundary?
- Are there repeated conditionals that signal a missing model / dispatcher / helper?
- Is each new abstraction earning its keep, or is it a wrapper/identity/pass-through?
- Did the diff add casts, `any`/`unknown`, or optionality that obscures the real invariant?
- Is the orchestration more sequential / less atomic than it needs to be?

## Ambition may reach beyond the diff (deep-tier carve-out for THIS facet)

`_shared.md` says "changed lines only." For deep-tier maintainability that rule is **relaxed for
remedies**: the most valuable code-judo move is often "this change would be far simpler if you also
restructured the adjacent X." You may propose that. Rules:

- **Anchor the finding on a changed line** (the hunk that triggered it) — keep it reviewable in
  context; never raise a finding about untouched code that the diff doesn't motivate.
- The **remedy** (`benefit`/`improvedCode`/`rootIssue`) may then propose restructuring that extends
  into adjacent code, *bounded by the deep-tier blast-radius map* (`deep-tier.md` §0a) — reason about
  real importers/dependents, not speculation about files you haven't read.
- Mark these `confidence` honestly and frame as a proposal ("the diff is the symptom; the cleaner fix
  is to reframe Y"). This is the one place the reviewer is allowed to be bigger than the hunk.

## Flag aggressively (presumptive blockers unless the author justifies them)

- a PR pushing a file from **under 1000 lines to over 1000** without a strong reason — ask to
  decompose first.
- **spaghetti growth**: new ad-hoc conditionals / special-cases bolted onto unrelated flows.
- a complicated implementation where a cleaner reframing would delete whole categories of complexity.
- thin wrappers / identity abstractions / pass-throughs that add indirection without clarity.
- feature-specific logic leaking into general-purpose/shared modules; logic in the wrong layer.
- bespoke helpers where a canonical utility already exists; copy-pasted logic instead of extraction.
- cast-heavy / `any` / `unknown` / needless optionality that obscures the real invariant.
- unnecessary sequential orchestration or non-atomic updates when an obviously cleaner structure exists.

## Preferred remedies (what your `improvedCode`/`benefit` should push toward)

Delete a layer rather than polish it · reframe the state model so conditionals vanish · move the
ownership boundary so the feature becomes a natural extension of an existing abstraction · replace
condition chains with a typed model/dispatcher · split a large file into focused modules · separate
orchestration from business logic · reuse the canonical helper.

## Bar & discipline

- Do **not** approve merely because behavior is correct — a structural regression is a blocker.
- Prefer a **small number of high-conviction** structural findings over a long list of cosmetic
  notes. Don't flood with nits when a larger structural issue exists.
- Still obey `_shared.md`: evidence required, changed-lines focus, real-vs-theoretical. Ambition is
  about *what* you look for, not license to speculate.

Priority order: structural regressions → missed dramatic simplifications → spaghetti/branching →
boundary/type-contract problems → file-size/decomposition → modularity → legibility.
