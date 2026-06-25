---
description: Author or strengthen tests for a diff, a module, or a bug reproduction — behavior-pinning tests applied on opt-in. For a bug repro, write the test that fails before the fix and passes after (a red→green regression lock). Detects the test framework first; never edits production code.
argument-hint: "[target] (default: working diff; or a module path / bug-investigation file)"
---

# /cover

Author and strengthen tests with the `cover` skill. Proposes behavior-**pinning** tests, then writes
the ones you opt into and runs them. It writes tests only — it never changes production code.

> **When to use vs related:** `/cover` *writes* tests; `/cover-gaps` *finds* missing coverage and
> writes nothing; `/pr-review` finds bugs with a merge verdict; `/simplify` cleans up code. For a bug
> reproduction, `/reproduce` (bug-to-fix) establishes the repro and `/cover` turns it into a
> committed regression test.

**Arguments:** `$ARGUMENTS`

## Rules

- Read the skill's `references/authoring.md` before writing. **Detect the framework, runner, and test
  conventions from the repo first — never assume.**
- **Pin behavior, not implementation.** Assert observable behavior (returns, output, errors, side-
  effects, ordering), not private internals or call counts. Pin current behavior by default; pin a
  different *intended* behavior only when explicitly agreed (and say so).
- **Falsify every new test.** Confirm it goes red when the behavior is broken, then restore. A test
  that can't fail is worthless.
- **No flaky tests.** No real network, wall-clock, unseeded RNG, or fixed-`sleep` races — pin time,
  seed randomness, stub the network, wait on the actual condition. Call out inherent nondeterminism.
- **Tests only — never edit production code**, and the existing suite must pass unmodified. If green
  requires a production change, that's a fix for the dev / bug-to-fix lane, not a test.
- **Report first, apply on opt-in.** Never silently add tests.

## Steps

1. **Scope** the target: default to the working diff if the tree is dirty; otherwise a named
   module/path, or a bug reproduction (a `bug-investigation.md` / failing-test / manual repro).
2. **Detect** the framework, runner, and conventions; read 2–3 nearby tests and match their style.
3. **Identify** what to lock: the behaviors and branches worth pinning (lean on a `/cover-gaps`
   report if one exists); for a bug repro, the user's *exact* symptom.
4. **Propose** each test — behavior pinned, risk guarded, kind (pinning vs. red→green regression
   lock), target file — and flag any determinism hazards. This is the report; stop here for review.
5. **Apply on opt-in** per `references/authoring.md`: write the selected tests to repo conventions,
   **falsify each**, confirm the full existing suite still passes, keep them deterministic. For a
   regression lock, confirm red on the bug; after the fix lands, confirm green. Keep test-only
   additions in their own commit. The `templates/regression-test-brief.md` template helps for a
   single regression lock.

## Output

A proposed test list (each with the behavior it pins and the risk it guards) — then, for the items
the user selects, the written tests with their run results: each falsified (seen red when broken),
the existing suite still green, and any determinism notes. For a bug repro, the red→green regression
lock. No production code is modified.
