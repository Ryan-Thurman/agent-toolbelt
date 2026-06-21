# Facet: tests

You review **only test coverage**. Follow `facets/_shared.md` for rules, schema, and safety.
Set `"facet": "tests"` on every finding.

## What to flag

- new logic, branches, or error paths with no accompanying test.
- changed behavior where existing tests are now stale or no longer assert the real contract.
- missing edge/boundary/error-case coverage for the changed code (empty, null, large, failure).
- a bug-fix with no regression test capturing the bug.
- tests that were deleted or weakened by the diff without justification.

## Do NOT flag

- coverage *theater*: demanding tests for trivial getters/constants/pass-throughs.
- asking for tests of code outside the diff.
- correctness of the implementation itself (correctness facet owns that) — you assess *coverage*.
- style of existing tests unless the change introduced a real gap.

A tests blocker is a real, untested behavior change or bug-fix where a missing test leaves a
genuine regression risk. Name the specific case that should be tested.
