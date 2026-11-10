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
  `*.spec.ts`, `*_test.py`). Match their file location, naming,
  assertion library, fixtures/factories, setup/teardown, mocking approach.
- **Run command** — the actual command the repo uses (`npm test`, `pytest -q`, `go test ./...`,
  `cargo test`). Prefer a single-file/single-test invocation for the fast falsify loop.

If no test setup exists at all, say so and propose the minimal idiomatic one — don't
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

## The red→green regression lock (bug repro → committed test)

Use `shared/contracts/references/test-driven-development.md` for the red check and the green check.
Apply these additions for a bug reproduction:

1. **Anchor on the symptom.** Assert the user's exact observed wrong behavior becoming right, not a proxy.
   For "returns 500 on empty cart", assert the status and response, not an internal flag.
2. **Confirm red** against the unfixed revision. The failure must show the symptom, not a setup error.
3. **Confirm green** after the fix lands. The fix belongs to the implementation or bug-to-fix lane.
4. **Ship the lock with the fix.** Commit the regression test in the same change as the fix,
   with the bug reference.

## Falsify the test

A test that cannot fail does not protect behavior. Falsify every new test with the method for its kind:

| Test kind | Method |
| --- | --- |
| Regression lock | Run the test against the pre-fix revision in an isolated worktree. |
| Pinning test | In an isolated worktree or copy, mutate the pinned behavior and run the test. |

- Keep the intended assertion. A changed expected literal or a setup error does not prove detection.
- Confirm that the mutation landed and that the test failed for the intended reason.
- Restore temporary changes, even after a failure, and verify the restoration.
- Keep user changes intact. This check does not authorize production edits.
- If a test stays green, investigate the mutation, the code path, and the assertion.
- If a safe check cannot run, report `Not verified` and explain the limit.

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

- Apply only the tests that the user selected.
- **One test at a time; run after each.** Falsify each test as you go.
- Run the relevant existing suite after the last test.
- Commit pinning tests in their own test-only commit, separate from feature or fix changes.
  Regression locks ship with their fix.
