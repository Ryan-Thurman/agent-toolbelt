# Dev Ticket to PR Workflow

Use this when a developer or agent picks up an implementation ticket and needs
to carry it through a reviewable PR while preserving feature traceability.

## Steps

1. Run `/start-dev-from-feature`.
2. Run `/implementation-plan`.
3. Stop for plan review. Do not implement until the user approves the plan,
   asks to continue, or names the first task.
4. Confirm the current branch. If work is on `main`, `master`, or the
   repository default branch, create or ask to create a focused feature/fix
   branch.
5. Implement the change in small steps.
6. Update the implementation plan after each meaningful step with current
   state, task status, evidence, checks, blockers, next step, and resume
   instructions.
7. Write or update matching tests as part of each behavior-changing step.
8. Re-run targeted tests after each meaningful change.
9. Run `/webapp-test` for browser/user-flow changes.
10. Run `/dev-doc-delta-check`.
11. Update SDD/SRS/SAD/CDP or QA handoff material if required.
12. Run `/review-diff`.
13. Run `/pr-ready-check`.
14. Run `/pr-traceability-review`.
15. Create the PR with summary, tests, risks, and doc updates.

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
- Implementation plan current state, task status, evidence, checks, blockers,
  next step, and resume instructions are up to date.
- Work is on a feature/fix branch, not `main`, `master`, or the repository
  default branch, unless direct default-branch work was explicitly approved.
- PR readiness and traceability checks pass before the PR is opened or marked
  ready.
