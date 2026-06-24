# Gates, PR traceability, QA, and release

Load this for gate checks, PR traceability / doc-delta review, QA handoff, and
release documentation control. Paths are relative to this file (three levels up
to the repo root).

## Gate Checks

Use `../../../templates/gate-check-template.md` and the lifecycle in
`../../../workflows/ai-feature-delivery-lifecycle.md`.

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
default-branch work without explicit approval, or unresolved security/QA/SRE
implications. Use
`../../../templates/pr-traceability-review-template.md` for persistent reports.

## QA and Release

For QA handoff, use `../../../templates/qa-handoff-template.md` and generate from
the master record plus tickets.

For release documentation control, use
`../../../templates/release-manifest-template.md`. Classify each document as:
- allowed in release package
- needs review
- withhold from release
- wrong release prefix
- missing release metadata

Only documents with `doc_status: APPROVED_FOR_RELEASE` and a matching release
manifest entry are allowed in release packaging.
