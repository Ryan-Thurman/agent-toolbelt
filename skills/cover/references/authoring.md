# Authoring tests

How to write and apply tests safely. Load this before applying (the `/cover` apply step).
`/cover-gaps` never reaches here — it stops at the gap report (`references/gap-scan.md`).

## Framework detection (do this first — never assume)

Detect the runner, framework, and conventions from the repo before writing a line:

- **Manifest / config** — `package.json` scripts + devDeps (jest / vitest / mocha / node:test /
  playwright), `pyproject.toml` / `pytest.ini` / `tox.ini` (pytest / unittest), `go.mod` (`go test`),
  `Cargo.toml` (`cargo test`), `pom.xml` / `build.gradle` (JUnit), `*.csproj` (xUnit / NUnit),
  `Gemfile` (RSpec / minitest), `composer.json` (PHPUnit), etc.
- **Existing tests** — find the test dir/glob (`test/`, `tests/`, `__tests__/`, `*_test.go`,
  `*.spec.ts`, `*_test.py`). Read 2–3 nearby tests and **match their style**: file location, naming,
  assertion library, fixtures/factories, setup/teardown, mocking approach.
- **Run command** — the actual command the repo uses (`npm test`, `pytest -q`, `go test ./...`,
  `cargo test`). Prefer a single-file/single-test invocation for the fast falsify loop.

Match what's there. Do **not** introduce a new framework, a new assertion library, or a parallel
convention. If no test setup exists at all, say so and propose the minimal idiomatic one — don't
silently scaffold.

## Pin behavior, not implementation

A test should survive a refactor that preserves behavior and fail on one that changes it.

- **Assert observable behavior** — return values, emitted output, raised errors/error type, HTTP
  status/body, persisted state, side-effects, ordering when ordering is contractual.
- **Avoid implementation coupling** — don't assert private fields, internal call counts, mock
  invocation order, log strings, or incidental data structure shape unless that *is* the contract.
- **Intended vs. current.** Pin **current** behavior by default (that's what a regression lock
  protects). Only pin a *different* intended behavior when it's explicitly agreed — and then say so,
  because such a test is red until the behavior changes (that's a spec, not a regression lock).
- **One behavior per test.** Name the test for the behavior it locks, not the function it calls.

## The red→green regression-lock recipe (bug repro → committed test)

This is the bug-to-fix hand-off: `/reproduce` gave you a reproduction; turn it into a locked test.

1. **Anchor on the symptom.** Assert the *user's exact* observed wrong behavior becoming right — not
   a proxy. If the bug is "returns 500 on empty cart," assert the status/response, not an internal
   flag.
2. **Confirm red.** Run the new test against the **unfixed** code and watch it fail for the right
   reason (the symptom), not a setup error. A regression test that was never seen red proves nothing.
3. **Apply the fix** (in the dev / bug-to-fix lane — *not* here; `cover` doesn't edit production
   code) and **confirm green.**
4. **Falsify.** Re-break the behavior (revert the fix or mutate it) and confirm the test goes red
   again. Then restore. Now it's a real lock.
5. **Commit the test** alongside (or just before) the fix, with the bug reference, so the regression
   can't return silently.

## Falsify the test (every new test, not just regressions)

> A test that can't fail is worthless.

After writing, prove the test can fail: temporarily break the behavior under test (change a return
value, flip a condition, mutate the expected value) and confirm the test goes **red**, then restore.
If it stays green, the test asserts nothing meaningful — fix the assertion or drop it. This is the
single highest-value check; do it for every test you add.

## Determinism rules (no flaky tests)

A flaky test is worse than no test — it trains people to ignore red. Eliminate nondeterminism:

- **Time** — inject/freeze the clock; never assert on real `now()`, durations, or timeouts.
- **Randomness** — seed every RNG; never assert on unseeded random output.
- **Network** — stub/mock external calls; no real HTTP, DNS, or third-party services in unit tests.
- **Filesystem / global state** — use temp dirs and clean up; don't depend on or leak shared state.
- **Concurrency / async** — wait on the actual condition (poll/await the signal), never a fixed
  `sleep`. Avoid order-dependence between tests.
- **Locale / timezone / environment** — pin them when behavior depends on them.

If a behavior is *inherently* nondeterministic (a real race, a probabilistic output), **call it out**
in the report and either test the invariant that always holds or recommend a design change — do not
ship a test that passes "usually."

## Apply discipline

- **Report-then-apply.** Propose the test list first (behavior pinned, risk guarded, kind, file).
  Apply only the selected tests, in a second step. Never silently add tests.
- **Tests only.** Never edit production code to make a test pass. If green requires a production
  change, that's a fix — hand it to the dev / bug-to-fix lane and stop.
- **Existing suite stays green.** All existing tests must pass unmodified. If your new test forces an
  existing test to change, you misread the contract — reconsider.
- **One test at a time; run after each.** Falsify each as you go. Keep test-only additions in their
  own commit, separate from feature or fix changes.
- **Match conventions.** File location, naming, fixtures, assertion style — mirror the repo.
