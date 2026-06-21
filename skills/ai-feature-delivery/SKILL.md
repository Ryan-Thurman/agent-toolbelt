---
name: ai-feature-delivery
description: Create and validate release-traceable feature delivery artifacts for regulated or cross-functional software work. Use when defining a feature, stewarding feature status, drafting SDD/doc-impact artifacts, slicing refinement tickets, checking gates, drafting stakeholder pings, planning dev work from feature context, reviewing PR traceability/doc deltas, preparing QA handoff, or controlling release documentation.
---

# ai-feature-delivery

Use this skill to turn a raw feature idea into traceable delivery artifacts. The
central object is the **Feature Master Record**: every SDD, ticket, test plan,
document delta, QA handoff, and release manifest should derive from it or link
back to it.

## Operating Rules

- Ask for missing release, feature ID, owner, impacted systems, and required
  reviewers before declaring any gate ready.
- Keep assumptions explicit. Do not invent regulatory, medical, security, or
  release claims.
- Keep all controlled artifacts release-scoped with `REL-YYYY.MM` or
  `REL-FUTURE`.
- Treat release packaging as allowlist-based: only documents in the release
  manifest and marked `APPROVED_FOR_RELEASE` are eligible.
- Preserve traceability from feature -> requirement -> ticket -> test ->
  document section -> gate evidence.
- Prefer updating the existing master record over creating disconnected docs.
- Track release eligibility separately from work status.
- Draft stakeholder pings from explicit clarification or pending-action items;
  do not imply that a message was sent unless an integration actually sent it.
- Keep pure dev work lightweight, but when feature metadata exists preserve
  feature ID, target release, doc-delta expectations, test evidence, and PR
  traceability.
- Prefer the smallest useful command for the current state. Use
  `/workflow-router` when the next step is unclear.

## When Starting a Feature

1. Collect or infer the feature name, feature ID, target release, owner, feature
   lead, PO, UX, cyber/security, medical affairs, QA, SRE, and dev teams.
2. Create a Feature Master Record from
   `../../templates/feature-master-record.md`.
3. Fill known sections and add explicit `TBD` values where discovery is needed.
4. Generate a stakeholder question map from the missing or risky areas.
5. Record Gate 1 status as `BLOCKED`, `READY_WITH_RISKS`, or `READY`.

## When Stewarding a Feature

Read the master record, clarification queue, pending actions, related docs, and
tickets. Return:
- Current phase and gate status
- Blockers and stale pending actions
- Missing owners, missing decisions, and unresolved assumptions
- Docs needing updates
- Tickets missing traceability or doc/test expectations
- Release eligibility and release risk
- Recommended next actions and draft pings

Use `../../templates/steward-review-template.md` when creating a persistent
status report.

## When Drafting Design Docs

Use the master record as source material. For SDD work, start from
`../../templates/sdd-template.md`. For document impact, start from
`../../templates/doc-impact-template.md`.

Required checks:
- Filename and frontmatter include release, feature ID, doc type, status, owner,
  and source master record.
- Each requirement or design decision cites a master-record section.
- Open assumptions are marked as assumptions, not facts.
- Future-release work is marked `WITHHELD_FUTURE_RELEASE` or excluded from the
  current release manifest.

## When Refining to Tickets

Use `../../templates/refinement-ticket-template.md`. Every ticket must include:

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
When behavior is testable, prefer writing/updating the failing test before
implementation. For browser/user-flow changes, use `/webapp-test` or equivalent
project browser evidence before PR readiness.
Use `../../templates/implementation-plan-template.md` for persistent plans.

## When Fleshing Out A Feature

Interrogate the request before polishing it. Identify:
- The user/business problem
- Success outcome
- Scope and non-goals
- Unsupported claims or requirements
- Blocking decisions by product, engineering, design, QA, security, release, or
  medical/regulatory stakeholders

Convert the answers into master-record updates, clarification queue items,
risks, pending actions, and Gate 1 readiness. If a focused gate is needed, use
`/role-review`.

## When Drafting Pings

Use `../../templates/clarification-queue-template.md` and pending actions in the
master record. Group messages by owner. Each message should include feature ID,
target release, why the input is needed, the exact question/action, due date if
known, and whether it blocks a gate. Keep messages factual and human-reviewable.

## Gate Checks

Use `../../templates/gate-check-template.md` and the lifecycle in
`../../workflows/ai-feature-delivery-lifecycle.md`.

For every gate, return:
- Verdict: `READY`, `READY_WITH_RISKS`, or `BLOCKED`
- Required evidence found
- Missing evidence
- Blocking issues
- Non-blocking risks
- Next actions

## PR Traceability and Doc Delta Review

When reviewing a PR or completed implementation, compare:
- PR/code changes
- Ticket acceptance criteria
- Feature Master Record
- SDD/doc impact map
- Test evidence
- Release target and document statuses

Flag behavior changes with missing tests, missing doc deltas, release mismatch,
or unresolved security/QA/SRE implications. Use
`../../templates/pr-traceability-review-template.md` for persistent reports.

## QA and Release

For QA handoff, use `../../templates/qa-handoff-template.md` and generate from
the master record plus tickets.

For release documentation control, use
`../../templates/release-manifest-template.md`. Classify each document as:
- allowed in release package
- needs review
- withhold from release
- wrong release prefix
- missing release metadata

Only documents with `doc_status: APPROVED_FOR_RELEASE` and a matching release
manifest entry are allowed in release packaging.
