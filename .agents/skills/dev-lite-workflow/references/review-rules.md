# Phase review rules

How to review a completed phase before moving on. Load this at the end of a phase
(and for the final PR readiness review, which uses the same evaluation).

At the end of each phase, review against the Feature Brief, app/feature flows,
acceptance criteria, Implementation Plan, completed tasks, tests/checks, and
current diff if available.

## Independent review protocol

When a phase review or final PR readiness review is delegated to a separate
agent session, preserve reviewer independence. The reviewer gets intent and
evidence, not the coding agent's framing.

Give the reviewer only:

- The Feature Brief or track entry that defines scope, flows, acceptance
  criteria, done-when clauses, and expected tests.
- The Implementation Plan sections that bind the reviewed phase or PR; omit
  unrelated future or out-of-scope sections.
- These review rules and any explicit standing rules for the repo.
- The diff, diff stat, base/head identifiers, commit list, and test/check
  evidence.

Withhold the coding agent's private in-session plan, transcript, self-summary,
and implementation report. Do not include "I implemented X by doing Y" style
claims in the review package. They anchor the reviewer on the implementer's
assumptions; the reviewer must derive what the diff does from the diff and
check that against the brief, scoped durable plan text, and tests.

The reviewer checks in this order:

1. Done-when in substance: every done-when or acceptance clause is satisfied,
   with proving tests or explicit evidence in tree. Letter-only compliance is
   not enough; when a guard, error path, or behavior is required, the review
   should look for a failing test or focused evidence that demonstrates it.
2. Scope completeness: every referenced plan rule for this phase or PR is
   implemented, not a quiet subset.
3. Contract drift: trait, schema, command, template, or public interface changes
   are Blocking unless the scoped plan explicitly owns that contract change.
4. Track boundaries: files outside the phase or track's file/responsibility map
   are findings unless the scoped plan or review evidence explains why they are
   required.
5. Ordinary code review: correctness, error handling, security, performance,
   maintainability, UX/product quality, and idiom.

Verdicts must cite the done-when or acceptance clauses verified. Request-changes
findings should name the specific plan, acceptance, contract, or boundary clause
violated. The reviewer reports findings only; fixes go back to the coding
agent.

For a small in-session phase, direct review from the plan and diff is enough.
When the review is delegated, the diff is large, or context is near a
compaction boundary, create a review package outside tracked source and hand the
reviewer the path instead of pasting the diff. The package should include:

- Base and head identifiers.
- Commit list for the range.
- Diff stat.
- Full diff with enough context to judge changed code.
- Paths to the scoped Feature Brief, plan sections, review rules, and
  tests/check evidence.

The reviewer should inspect outside the package only for a concrete named risk,
not to reconstruct the whole codebase from scratch.

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
