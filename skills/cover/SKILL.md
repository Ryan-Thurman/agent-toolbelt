---
name: cover
description: Author behavior-pinning tests for a diff, module, or bug reproduction, applied on opt-in, or scan an area for missing and weak coverage (detect-only). Use when adding regression coverage, strengthening tests, or surveying coverage gaps. For a merge verdict use /pr-review.
---

# cover

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Author tests from existing code and behavior, or report coverage gaps. `cover` writes tests only.
To design cases from requirements before code exists, use `/test-case-design`.

## Mutation Policy

Default: report-only.
Edit test files only when the user explicitly asks to apply selected tests.
Never edit production code to make a test pass.

## Two modes

- **`/cover`** — author or strengthen tests for a diff, a module, or a bug reproduction.
  Report the proposed tests, let the user select, then apply. Each test pins current behavior,
  or intended behavior that the user agreed. For a bug reproduction, write the red→green regression lock.
- **`/cover-gaps`** — detect-only scan of an area for missing or weak coverage. Do not write a test.
  Read `references/gap-scan.md` for this mode.

## Principles (always)

- **Pin behavior, not implementation.** Assert observable behavior — return values, outputs, errors,
  side-effects, ordering — not private internals, call counts, or incidental structure.
- **Keep existing tests intact.** Existing tests must pass. Strengthen an existing test only by
  adding assertions. Never weaken or delete an existing assertion.
- **Hand production changes away.** If a green result needs a production edit, that is a fix.
  Hand it to the implementation or bug-to-fix lane.
- **Match the repository.** Detect the test framework, runner, and conventions before you write.
  Do not add a new framework or a parallel convention.
- **Make the case.** Every proposed test states the behavior it pins and the risk it guards.
  Drop a test that has no named risk.

## Flow

1. **Scope** the target: a diff (default if the tree is dirty), a named module/path, or a bug
   reproduction (a `bug-investigation.md` with `Reproduction status`, or a failing-test/manual repro).
2. **Detect** the framework, runner, and conventions. Read 2–3 nearby tests and match their style.
3. **Identify** what to lock: for a diff/module, the behaviors and branches worth pinning (lean on a
   `/cover-gaps` report if one exists); for a bug repro, the exact user-visible symptom.
4. **Propose** each test with the behavior it pins, the risk it guards, its kind (pinning or
   red→green regression lock), and its target file. Flag determinism hazards.
   Stop here and wait for the user's selection.
5. **Apply on opt-in.** Before you write a test, read `references/authoring.md`.

## Completion

The report lists each proposed test with its behavior, risk, and kind.
After apply, each written test was seen red when its behavior broke, or is marked `Not verified`.
The existing suite still passes, and no production code changed.

## Hand-offs

- **From bug-to-fix.** `cover` turns a recorded reproduction into a committed regression test.
  It does not re-diagnose the bug.
- **Other lanes.** `/pr-review` finds problems with a verdict. `/simplify` cleans up code.
  `/webapp-test` runs browser checks.

## References

- `references/authoring.md` — read before you apply tests: detection cues, pinning detail,
  the red→green regression lock, the falsify check, determinism rules, and apply discipline.
- `references/gap-scan.md` — read for `/cover-gaps`: gap families, ranking, and report shape.
- `templates/regression-test-brief.md` — use it to record a single regression lock.
