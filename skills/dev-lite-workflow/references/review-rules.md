# Phase review rules

How to review a completed phase before moving on. Load this at the end of a phase
(and for the final PR readiness review, which uses the same evaluation).

At the end of each phase, review against the Feature Brief, app/feature flows,
acceptance criteria, Implementation Plan, completed tasks, tests/checks, and
current diff if available.

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

Classify findings as:

- Blocking: must fix before moving on.
- Should Fix: important, but may not block if explicitly accepted.
- Nice to Have: improvement, polish, or future cleanup.

Do not approve a phase or PR if blocking issues remain.

Treat missing feasible tests for behavior changes as a Should Fix issue by
default, or Blocking when the missing coverage leaves core behavior,
permissions, data safety, or high-risk edge cases unverified.
