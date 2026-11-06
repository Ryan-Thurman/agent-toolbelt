# Phase PR review

Read this before opening or updating each phase PR. Review the phase's own diff
against its source acceptance criteria, plan, test evidence, and parent branch.
For a stacked PR, compare parent branch to child head, not default branch to
child head; otherwise predecessor work can be mistaken for this ticket's scope.

Check in this order:

1. Every phase or ticket acceptance clause is met or explicitly unresolved,
   with test or manual evidence. Distinguish verified, failed, and not inferable.
   Trace behavior through implementation and component connections.
   File existence, symbol presence, and implementer summaries do not prove runtime behavior.
   Record the observation and revision; retain `Not verified` when execution evidence is unavailable.
2. The diff stays within this phase's boundary. Any contract, schema, or API
   change beyond it has source approval; there is no next-ticket leakage.
3. Tests, error paths, permissions, security, performance, UX, and maintainable
   implementation are proportionate to the change. Missing feasible tests are
   a finding, blocking when core behavior or high-risk boundaries are unproved.
4. Branch and PR metadata are correct: ticket/phase ID, parent ticket and PR,
   base/head, target, merge order, checks, risks, and rollback or migration notes
   where relevant.
5. Apply the project's required document, QA, release, and evidence checks.
   Keep the project's source records authoritative. Run `code-quality-gate` only if repository policy, user request, or
   the phase's risk warrants it; a stale result never proves a later diff.

Classify findings as Blocking, Should Fix, or Nice to Have. Do not call a PR
ready while Blocking findings or required checks remain. Fix within the same
phase branch, rerun affected checks, and review the changed diff. A human owns
the review and merge decision; a passing agent review is not merge approval.

For an independent reviewer, give the source acceptance criteria, phase plan,
base/head, diff, and test/check evidence. Do not give the implementer's private
transcript or self-assessment as evidence. Record the result and PR URL in the
plan. After a parent merges, verify and update each child PR's target and diff.
