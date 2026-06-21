# AI Feature Delivery Lifecycle

A portable process for regulated, cross-functional feature delivery where release
traceability and document control matter as much as implementation.

The source of truth is a **Feature Master Record**. Every AI-assisted command or
skill should update or derive from that record instead of producing standalone
documents with no traceability.

The system has four layers:
- AI Delivery Process: stable phases, gates, roles, required docs, and naming
  rules.
- Feature Master Record: one live record per feature with status, owners,
  release target, open questions, docs, tickets, risks, and gate history.
- Agent Workflows: skills/commands that inspect, generate, review, remind, and
  validate.
- System Integrations: Jira/Azure DevOps, GitHub/Azure Repos, Teams/Slack,
  SharePoint/Confluence, release folders, and CI checks added later.

Dev work is a connected but separate layer:
- Process commands answer whether the team is building the right thing for the
  right release with the right docs and approvals.
- Dev commands answer whether the implementation is correct, tested, safe, and
  reviewable.
- Bridge commands answer whether the dev work still matches the feature,
  ticket, docs, tests, PR, QA evidence, and release target.

## Core Artifacts

- Feature Master Record: feature scope, owners, release target, requirements,
  risks, impacted systems, related documents, tickets, tests, and gate history.
- SDD: release-scoped software design draft sourced from the master record.
- Doc Impact Map: CDP, SRS, SAD, SDD, and other controlled-document deltas.
- Refinement Tickets: ticket-ready work breakdown with acceptance criteria and
  doc/test expectations.
- QA Handoff: traceable test package for QA execution.
- Release Manifest: release-level allowlist for documents eligible to ship.
- Clarification Queue: owned questions that block or inform gates.
- Pending Actions: dated follow-ups owned by a role/person.

## Lifecycle

### 1. Feature Define / Flesh-Out

Goal: turn a raw feature idea into a structured feature package.

Outputs:
- Feature Master Record
- Stakeholder review map
- Draft SDD outline
- SRS/SAD/CDP impact notes
- Cyber, medical affairs, QA, SRE, and observability questions
- Release target and document status

Gate 1: ready for refinement only if the package identifies the target release,
owner, impacted systems/repos, document changes, open risks, unresolved
assumptions, and required stakeholder reviews.

### 2. Refinement

Goal: convert the approved feature package into implementation-ready tickets
without losing traceability.

Outputs:
- Repo and service impact maps
- API/data contract changes
- Ticket breakdown
- Acceptance criteria
- Test strategy
- Doc update checklist
- Traceability matrix

Gate 2: tickets are ready for development only if each ticket points back to the
feature ID, release ID, master-record section, SDD section, requirement,
acceptance criteria, test expectation, and doc delta status.

### 3. Dev Execution

Goal: implement one scoped ticket at a time, update docs as part of the same
change, and verify before handoff.

Rules:
- Do not code from a vague ticket.
- Do not modify unrelated repos.
- Do not update release docs unless the feature release matches.
- Do not mark complete without tests or evidence.
- Do not claim docs are updated unless the delta was actually written.

Gate 3: ready for PR/code review only with implementation summary, files
changed, tests added/updated, test results, SDD delta, SRS/SAD/CDP delta if
applicable, known risks, and reviewer checklist.

### 4. PR Traceability Review

Goal: verify that code, tests, tickets, docs, and release metadata still agree.

Outputs:
- Scope match against ticket and master record
- Test evidence review
- Doc delta review
- SDD accuracy check
- Security, QA, and SRE implications
- Release mismatch risk

Gate 4: ready for QA only if the PR/build maps to acceptance criteria, tests are
present or explicitly waived, required doc deltas are done, known risks are
recorded, and the master record is updated.

Recommended dev ticket flow:
1. Start dev from feature/ticket context.
2. Create an implementation plan.
3. Implement the change.
4. Write or update tests.
5. Run doc-delta checks.
6. Review the diff.
7. Run PR readiness and traceability checks.
8. Create the PR with summary, tests, risks, and doc updates.

### 5. QA Handoff

Goal: give QA a clean traceable package generated from the master record and
tickets.

Outputs:
- Feature summary
- Acceptance criteria mapping
- Test cases
- Regression areas
- Known limitations
- Environment/config notes
- Observability/logging notes
- Doc update summary

Gate 5: ready for QA execution only when acceptance criteria, tests, regression
areas, environments, risks, and related docs are linked.

### 6. Release Documentation Gate

Goal: prevent future-release or unapproved documents from leaking into the wrong
release package.

Create a release-level artifact:

```text
releases/
  REL-YYYY.MM/
    release-manifest.md
    approved-docs.md
    withheld-docs.md
    feature-index.md
```

Gate 6: release documentation is approved only when the release manifest lists
included features, approved documents, withheld/future documents, and exclusions
with reasons. Only `APPROVED_FOR_RELEASE` documents are eligible.

## Status Model

- `DRAFT`
- `IN_REVIEW`
- `APPROVED_FOR_DEV`
- `APPROVED_FOR_QA`
- `APPROVED_FOR_RELEASE`
- `WITHHELD_FUTURE_RELEASE`
- `SUPERSEDED`

## Release Eligibility Model

Track release eligibility separately from work status:

- `NOT_ELIGIBLE`
- `ELIGIBLE_FOR_DEV`
- `ELIGIBLE_FOR_QA`
- `ELIGIBLE_FOR_RELEASE_REVIEW`
- `APPROVED_FOR_RELEASE`
- `WITHHELD_FUTURE_RELEASE`

A feature can be dev-complete and still not release-eligible if document,
approval, QA, or release-manifest evidence is missing.

## Stewardship and Follow-Up

Run stewardship reviews on active features daily or before feature meetings.
The review should identify current phase, gate status, stale questions, pending
actions, missing owners, document gaps, release risk, and next actions.

Notification drafting should be human-approved in v1. Commands may draft pings
from the clarification queue and pending actions, but should not claim messages
were sent unless an integration actually sent them.

Review classifications:
- `CLARIFICATION_NEEDED`
- `CONTRADICTION_FOUND`
- `MISSING_OWNER`
- `MISSING_REQUIREMENT`
- `MISSING_TEST_COVERAGE`
- `MISSING_DOC_DELTA`
- `RELEASE_MISMATCH`
- `OUTDATED_ASSUMPTION`
- `READY_FOR_GATE_REVIEW`

## Naming Convention

Use release and feature IDs in every controlled artifact:

```text
REL-YYYY.MM_FEAT-####_<DOC-TYPE>_<short-name>_<status>.md
```

Examples:
- `REL-2026.09_FEAT-1234_MASTER_patient-alert-routing_DRAFT.md`
- `REL-2026.09_FEAT-1234_SDD_patient-alert-routing_IN_REVIEW.md`
- `REL-2026.09_FEAT-1234_DOC-IMPACT_patient-alert-routing_DRAFT.md`
- `REL-2026.12_FEAT-2199_SDD_new-device-onboarding_WITHHELD_FUTURE_RELEASE.md`

## Practical Pilot

Start with this path before automating development:

1. Feature Define
2. Feature Master Record
3. SDD Draft
4. Doc Impact Map
5. Refinement Tickets
6. Gate Check
7. Steward Review
8. Draft Pings

The north-star questions are:
- What are we building?
- Why are we building it?
- What release does it belong to?
- What docs/tickets/tests prove it is ready?
- What should not be released yet?
