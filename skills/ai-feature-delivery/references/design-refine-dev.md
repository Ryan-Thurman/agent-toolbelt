# Design, refine to tickets, and start dev

Load this for SDD / doc-impact drafting, slicing tickets, and starting dev work
from feature context. Paths are relative to this file (three levels up to the
repo root).

## When Drafting Design Docs

Use the master record as source material. For SDD work, start from
`../../../templates/sdd-template.md`. For document impact, start from
`../../../templates/doc-impact-template.md`.

Required checks:
- Filename and frontmatter include release, feature ID, doc type, status, owner,
  and source master record.
- Each requirement or design decision cites a master-record section.
- Open assumptions are marked as assumptions, not facts.
- Future-release work is marked `WITHHELD_FUTURE_RELEASE` or excluded from the
  current release manifest.

## When Refining to Tickets

Use `../../../templates/refinement-ticket-template.md`. Every ticket must
include:

- Feature ID and release ID
- Source master-record section
- Requirement or acceptance criterion
- Impacted repos/services
- Test expectation
- Doc delta required: yes/no/unknown
- Dependencies and open questions

Do not call tickets ready if they cannot be implemented and verified without
guessing at scope.

## When Starting Dev Work From a Feature

Read the Feature Master Record, ticket, SDD, doc impact map, clarification
queue, and target release. Produce:
- Implementation summary
- Impacted repos/files
- Step-by-step implementation plan
- Test plan
- Doc delta expectation
- QA evidence needed
- Risks, assumptions, and blockers
- PR checklist

If `doc_delta_required` or test evidence is unknown, flag it before coding.
After producing the plan, stop for user review and approval before changing
code unless implementation was already explicitly requested. When behavior is
testable, write or update the matching tests as part of the implementation work,
preferably before or alongside the behavior change. Do not defer all test work
to the end. For browser/user-flow changes, use `/webapp-test` or equivalent
project browser evidence before PR readiness.
Before implementation, confirm the current branch. If work is on `main`,
`master`, or the repository default branch, create or ask to create a focused
feature/fix branch.
During implementation, keep `../../../templates/implementation-plan-template.md`
or the project-specific implementation plan updated with current step, current
task, task status, evidence, checks run, blockers, next step, and resume
instructions so another agent can continue after a crash or context reset.
Use `../../../templates/implementation-plan-template.md` for persistent plans.
