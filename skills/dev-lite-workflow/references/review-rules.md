# Phase review rules

How to review a completed phase before moving on. Load this at the end of a phase
(and for the final PR readiness review, which uses the same evaluation).

At the end of each phase, review against the Feature Brief, app/feature flows,
acceptance criteria, Implementation Plan, completed tasks, tests/checks, and
current diff if available.

For a small in-session phase, direct review from the plan and diff is enough.
When the review is delegated, the diff is large, or context is near a
compaction boundary, create a review package outside tracked source and hand the
reviewer the path instead of pasting the diff. The package should include:

- Base and head identifiers.
- Commit list for the range.
- Diff stat.
- Full diff with enough context to judge changed code.
- Paths to any task brief and implementer report files, if used.

The reviewer should treat reports as claims and verify them against the diff.
They should inspect outside the package only for a concrete named risk, not to
reconstruct the whole codebase from scratch.

## Verification reach

For each important requirement or risk, label what the available inputs prove:

- Verified: confirmed from the spec/plan, diff, tests/checks, or focused
  inspection.
- Failed: evidence shows the requirement is missing, broken, or unsafe.
- Not inferable: the available spec/diff/checks do not prove it either way.

Do not convert "not inferable" into a pass. If the item is important for the
phase or PR decision, list the exact evidence needed next, such as a focused
test, manual check, runtime screenshot, command output, or source file to
inspect.

Evaluate:

- Correctness
- Acceptance criteria coverage
- Tests
- Performance
- Security
- Code quality
- Maintainability
- UX/product quality
- Future-phase leakage

Use one combined review pass. Do not split acceptance/spec compliance and code
quality into separate reviewers unless the user explicitly asks for that extra
process. The report must include two verdicts:

- Acceptance / spec verdict: whether the completed work satisfies the phase
  goal, selected tasks, and relevant acceptance criteria.
- Code quality verdict: whether the implementation is maintainable, tested
  enough for its risk, and free of blocking correctness, security, performance,
  or UX issues.

Classify findings as:

- Blocking: must fix before moving on.
- Should Fix: important, but may not block if explicitly accepted.
- Nice to Have: improvement, polish, or future cleanup.

Do not approve a phase or PR if blocking issues remain.

Treat missing feasible tests for behavior changes as a Should Fix issue by
default, or Blocking when the missing coverage leaves core behavior,
permissions, data safety, or high-risk edge cases unverified.
