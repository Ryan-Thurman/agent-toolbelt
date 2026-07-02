---
name: cover
description: Author behavior-pinning tests for a diff, module, or bug reproduction, applied on opt-in. Use when adding regression coverage or strengthening tests. For finding untested areas use /cover-gaps; for a merge verdict use /pr-review.
---

# cover

The test-authoring lane the toolbelt lacks — the **active** counterpart to the detect-only
`/cover-gaps`, mirroring the `simplify` ↔ `code-smell` split. Where `/cover-gaps` *finds* missing
coverage and writes nothing, `cover` *authors the tests* and applies them on opt-in. It is the lane
that turns a bug reproduction into a committed regression test.

`cover` writes **tests only**. It never touches production code, and it never weakens an assertion to
make a test go green.

## Mutation Policy

Default: report-only.
Edit test files only when the user explicitly asks to apply selected tests.
Never edit production code to make a test pass.

## Two modes

- **`/cover`** — author/strengthen tests for a diff, a module, or a bug reproduction. Report the
  proposed tests → user selects → apply. Behavior-**pinning**: each test captures the current (or
  intended-and-agreed) behavior. For a bug repro it writes the test that **fails on the bug and
  passes after the fix** (red→green regression lock). This is the default authoring tool.
- **`/cover-gaps`** — detect-only scan of an area for missing/weak coverage, ranked by
  `risk × likelihood` (untested branches, error paths, boundary conditions, regressions waiting to
  happen). **Never writes a test** — it produces a prioritized gap report that `/cover` can act on.

## Principles (always)

- **Pin behavior, not implementation.** Assert observable behavior — return values, outputs, errors,
  side-effects, ordering — not private internals, call counts, or incidental structure.
- **Prove the test protects something.** Falsify each new test and handle red→green regression locks
  using `references/authoring.md`.
- **Keep tests deterministic.** Use the determinism rules in `references/authoring.md`; call out any
  behavior that cannot be tested reliably.
- **Behavior-preserving — never edit production code.** `cover` adds and strengthens tests. It does
  not change production code to make a test pass, and **existing tests must still pass unmodified**.
  If a green requires a production edit, that's a fix (hand to the dev/bug-to-fix lane), not a test.
- **Framework-detected, not assumed.** Detect the repo's test framework, runner, and conventions
  before writing — match them. Don't introduce a new framework or a parallel convention.
- **Make the case — what it locks and why.** Every proposed test states the behavior it pins and the
  risk it guards (what regression slips through if this test doesn't exist). A test without a named
  risk is a candidate to drop.
- **Report-then-apply.** Propose the tests first; apply only what the user opts into, then run them.
  Never silently add tests.

## Flow

1. **Scope** the target: a diff (default if the tree is dirty), a named module/path, or a bug
   reproduction (a `bug-investigation.md` with `Reproduction status`, or a failing-test/manual repro).
2. **Detect** the framework, runner, and test conventions from the repo
   (`references/authoring.md` — detection cues).
3. **Identify** what to lock: for a diff/module, the behaviors and branches worth pinning (lean on a
   `/cover-gaps` report if one exists); for a bug repro, the exact user-visible symptom.
4. **Propose** each test with the behavior it pins, the risk it guards, and its kind (pinning vs.
   red→green regression lock). Stop here is the report. Flag any determinism hazards.
5. **Apply on opt-in** (`references/authoring.md`): write the selected tests matching repo
   conventions, falsify each, confirm the relevant suite still passes, and keep new tests
   deterministic.

## Hand-offs

- **From bug-to-fix.** `/reproduce` establishes a manual or failing-test reproduction; `cover` is the
  lane that turns that repro into a committed **regression test** (the red→green lock). It does not
  re-diagnose — it consumes the recorded reproduction.
- **To ship-it.** `/ship-it`'s readiness checklist wants the suite green; the tests `cover` adds are
  part of that bar. `cover` runs *before* release, not as part of it.
- It does not duplicate `/pr-review` (which *finds* problems with a verdict and applies nothing) or
  `/simplify` (which cleans up code). `cover` owns test authoring.

## References

- `references/authoring.md` — framework/runner detection, behavior-pinning vs. implementation-
  coupling, the red→green regression-lock recipe, the falsify-the-test check, and the determinism
  rules. Load this before applying.
- `references/gap-scan.md` — the `risk × likelihood` ranking rubric and the gap families for
  `/cover-gaps`. Load this for the detect-only scan.

## Templates

- `templates/regression-test-brief.md` — *optional*: a one-screen brief for a single regression lock
  (symptom, red command, behavior pinned, risk guarded, determinism notes), handy when turning a bug
  reproduction into a committed test.
