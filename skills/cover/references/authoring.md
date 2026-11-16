# Authoring tests

How to write and apply tests safely. Load this before applying (the `/cover` apply step).
`/cover-gaps` never reaches here. It stops at the gap report (`references/gap-scan.md`).

## Pin behavior, not implementation

Write a test that survives a refactor that preserves behavior and fails on one that changes it.

- Follow the unit-test rules in `shared/contracts/references/test-driven-development.md`.
- **Intended vs. current.** Pin **current** behavior by default (that is what a regression lock
  protects). Only pin a *different* intended behavior when it is explicitly agreed, and then say so,
  because such a test is red until the behavior changes (that is a spec, not a regression lock).
- **One behavior per test.** Name the test for the behavior it locks, not the function it calls.

## The red->green regression lock (recorded bug gap)

Use `shared/contracts/references/test-driven-development.md` for the red check and the green check.
Apply these additions:

1. **Anchor on the symptom.** Assert the user's exact observed wrong behavior becoming right, not a proxy.
   For "returns 500 on empty cart", assert the status and response, not an internal flag.
2. **Confirm red** against the unfixed revision. The failure must show the symptom, not a setup error.
3. **Confirm green** on the current revision, where the fix already landed. The fix belongs to the
   bug-to-fix lane.
4. **Name the bug.** Put the bug reference in the test name or a comment.

## Falsify the test

A test that cannot fail does not protect behavior. Falsify every new test with the method for its kind:

| Test kind | Method |
| --- | --- |
| Regression lock | Run the test against the pre-fix revision in an isolated worktree. |
| Pinning test | In an isolated worktree or copy, mutate the pinned behavior and run the test. |

- Get the new test into the pre-fix worktree by copying the test file into it. Do not commit the copy there.
  A worktree made from the test branch and reverted with `git revert` also holds the test.
- If the pre-fix revision lacks a symbol that the test imports, add a stub for it in the worktree first
  (the "Stub" rule in `shared/contracts/references/test-driven-development.md`). A compile error is not red.
- Keep the intended assertion. A changed expected literal or a setup error does not prove detection.
- Confirm that the mutation landed and that the test failed for the intended reason.
- Restore temporary changes, even after a failure, and verify the restoration.
- Keep user changes intact.
- If a test stays green, investigate the mutation, the code path, and the assertion.
- If a safe check cannot run, report `Not verified` and explain the limit.

## Determinism rules (no flaky tests)

A flaky test is worse than no test, because it trains people to ignore red. Eliminate nondeterminism:

- **Time**: inject/freeze the clock. Never assert on real `now()`, durations, or timeouts.
- **Randomness**: seed every RNG. Never assert on unseeded random output.
- **Network**: stub/mock external calls. No real HTTP, DNS, or third-party services in unit tests.
- **Filesystem / global state**: use temp dirs and clean up. Do not depend on or leak shared state.
- **Concurrency / async**: wait on the actual condition (poll/await the signal), never a fixed
  `sleep`. Avoid order-dependence between tests.
- **Locale / timezone / environment**: pin them when behavior depends on them.

If a behavior is *inherently* nondeterministic (a real race, a probabilistic output), **call it out**
in the report and either test the invariant that always holds or recommend a design change. Do not
ship a test that passes "usually."

## Apply discipline

- Apply only the tests that the user selected.
- **One test at a time. Run after each.** Falsify each test as you go.
- Run the relevant existing suite after the last test.
- Commit pinning tests and regression locks in a test-only commit, separate from feature or fix changes.
