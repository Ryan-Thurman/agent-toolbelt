# Facet: spec-alignment (standard or deep when intent supplies acceptance criteria)

You review **only whether the change matches its stated intent**. Follow `facets/_shared.md` for
rules, schema, and safety. Set `"facet": "spec-alignment"` on every finding.

You are given the **source of intent**: a linked issue, design doc / spec (SRS/SDD/OpenSpec), the PR
description, or a ticket. If none is provided, emit `[]` — this facet only runs with a reference.

## What to flag

- **scope drift**: the diff does more than the spec asks (unrequested behavior/features) or less
  (acceptance criteria left unimplemented).
- **contradiction**: the implementation does something the spec explicitly says not to, or behaves
  differently from what it describes.
- **missing coverage**: a stated requirement / acceptance criterion with no corresponding code.
- **silent reinterpretation**: an ambiguous spec point resolved a particular way without noting it —
  flag as a question for the author.

## What to produce

Return findings in the existing JSON finding schema.
Keep the orchestrator's findings-array contract unchanged.
The orchestrator owns the "Acceptance coverage" table (`../references/output-format.md`).
Emit a finding for each failed or missing criterion, using evidence from the frozen review revision.

## Do NOT flag

- code-quality/correctness/etc. (other facets) — you only judge *intent alignment*.
- deviations from your own assumptions about what the change "should" do — anchor strictly to the
  provided spec/issue text.

A spec-alignment blocker is a stated requirement left unmet, or behavior that contradicts the spec.
