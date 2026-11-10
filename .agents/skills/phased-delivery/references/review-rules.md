# Phase PR review

Read this before you open or update a phase PR, or when you check its readiness.
Review the phase's own diff against its source acceptance criteria, plan, test
evidence, and base branch. Check this phase's PR, not one final PR for the
whole requirement. For a stacked PR, compare parent branch to child head, not
default branch to child head; otherwise predecessor work can be mistaken for
this ticket's scope.

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
   Check recorded red/green evidence and uncovered branches in changed behavior.
   Distinguish passing tests from measured coverage and checks that did not run.
4. Branch and PR metadata are correct: ticket/phase ID, parent ticket and PR,
   base/head, target, merge order, checks, risks, and rollback or migration notes
   where relevant.
5. Apply the project's required document, QA, release, and evidence checks.
   Keep the project's source records authoritative. Run `code-quality-gate` when
   repository policy or the user requires it. Otherwise, recommend it in the handoff
   when the phase changes security, persistence, or a public interface.
   A stale result never proves a later diff.

## Findings and verdict

Give each finding a severity: `Blocking`, `Should Fix`, or `Nice to Have`.
Give the phase PR a separate readiness verdict:

| Verdict | Use when |
| --- | --- |
| `Ready` | No Blocking finding remains, and required checks have current passing results. |
| `Needs Work` | A Blocking finding or failed required check remains, and this phase can fix it. |
| `Blocked` | Progress needs an outside decision, a dependency, or a check that is not available. |

Record the verdict, findings, evidence, and PR URL in the plan.
Use `../../../templates/dev-phase-review.md` or `../../../templates/dev-pr-review.md`
only when a separate report is useful.
Open the phase PR only when the user authorized delivery.
Merge authority follows `shared/contracts/references/execution.md`.

## Fix findings

Fix findings on the same phase branch and inside the phase boundary.
For a behavior fix, capture the defect in a failing test before the repair.
Rerun the affected checks and review the changed diff.
Record fixed and unresolved findings, checks, and the next action in the plan.
Keep next-phase work out of the fix.

## Independent reviewer

Give an independent reviewer the source acceptance criteria, phase plan,
base/head, diff, and test/check evidence. Do not give the implementer's private
transcript or self-assessment as evidence.
