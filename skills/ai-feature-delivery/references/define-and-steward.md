# Define and steward a feature

Load this for feature definition, fleshing out, ongoing stewardship, and
stakeholder pings. Paths are relative to this file (three levels up to the repo
root).

## When Starting a Feature

1. Collect or infer the feature name, feature ID, target release, owner, feature
   lead, PO, UX, cyber/security, medical affairs, QA, SRE, and dev teams.
2. Create a Feature Master Record from
   `../../../templates/feature-master-record.md`.
3. Fill known sections and add explicit `TBD` values where discovery is needed.
4. Generate a stakeholder question map from the missing or risky areas.
5. Record Gate 1 status as `BLOCKED`, `READY_WITH_RISKS`, or `READY`.

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

Use `../../../templates/steward-review-template.md` when creating a persistent
status report.

## When Drafting Pings

Use `../../../templates/clarification-queue-template.md` and pending actions in
the master record. Group messages by owner. Each message should include feature
ID, target release, why the input is needed, the exact question/action, due date
if known, and whether it blocks a gate. Keep messages factual and
human-reviewable.
