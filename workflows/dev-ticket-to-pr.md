# Dev Ticket to PR Workflow

Use this when a developer or agent picks up an implementation ticket and needs
to carry it through a reviewable PR while preserving feature traceability.

## Steps

1. Run `/start-dev-from-feature`.
2. Run `/implementation-plan`.
3. Run `/write-tests` before implementation when the behavior is testable.
4. Implement the change in small steps.
5. Re-run targeted tests after each meaningful change.
6. Run `/webapp-test` for browser/user-flow changes.
7. Run `/dev-doc-delta-check`.
8. Update SDD/SRS/SAD/CDP or QA handoff material if required.
9. Run `/review-diff`.
10. Run `/pr-ready-check`.
11. Run `/pr-traceability-review`.
12. Create the PR with summary, tests, risks, and doc updates.

## Completion Criteria

- Ticket scope maps to the Feature Master Record.
- Acceptance criteria are covered or explicitly deferred.
- Tests are added/updated or a waiver is documented.
- Browser/user-flow evidence is captured for user-facing changes or explicitly
  marked not applicable.
- Required doc deltas are complete or blocking.
- Release target and feature ID are preserved.
- Known risks and QA notes are recorded.
- Commands run and verification gaps are recorded.
