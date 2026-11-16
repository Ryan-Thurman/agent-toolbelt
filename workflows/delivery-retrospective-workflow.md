# Delivery retrospective

Use this workflow to review the delivery process after completed work.
Use `product-outcome-review` to assess customer results.

Start: when no papercut report exists for the work, run `papercuts` first, with `--feature <branch>` for a feature.

1. Read the original plan, actual changes, review findings, checks, incidents, previous improvement actions, and papercut reports from `papercuts`.
   Read the previous improvement actions from the action store that the report names.
2. Compare expected and observed delivery behavior with source evidence and time or scope limits.
3. Identify recurring causes, useful practices, counterexamples, and unresolved questions.
4. Record each lesson with the fields in `shared/contracts/references/execution-lessons.md`.
5. Select bounded process improvements with owners, completion conditions, and a review trigger.
   When no named person accepts an improvement, list it as `Proposed` with the owner `Unassigned`.
   Do not assign an owner or mark an action accepted from the run alone.
6. Keep accepted policy changes in the project that owns them.
7. Write the report to `.atb-work/delivery-retrospective/<scope-slug>.md`, unless the user names a path.
   Follow `shared/contracts/references/execution.md#Durable report location`.
   The report has these sections in order: scope and sources, expected and observed behavior, lessons, improvement actions, open questions, and coverage.

The action store is the project's existing tracker, or a process document that the team names.
Record each accepted action there with its ID, owner, status, completion condition, and review trigger.
The next retrospective reads that store first.
When the project has no store, the report is the only record. The report says so.

Do not invent team sentiment, meeting outcomes, or process approvals.
A retrospective can produce a local report without notifying others or updating external trackers.
