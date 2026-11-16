# Delivery retrospective

Use this workflow to review the delivery process after completed work.
Use `product-outcome-review` to assess customer results.

Start: when no papercut report exists for the work, run `papercuts` first, with `--feature <branch>` for a feature.
To start this workflow, give the agent this prompt, with the scope in place of the angle brackets:
`Follow workflows/delivery-retrospective-workflow.md for <scope>. Write the report and post nothing.`
No slash command starts it. `/papercuts` starts the friction report only.

1. Read the original plan, actual changes, review findings, checks, incidents, previous improvement actions, and papercut reports from `papercuts`.
   Find the action store in the project docs, or ask the user to name it. Read the previous improvement actions from it.
   When no store or earlier retrospective exists, this is the first retrospective. Skip the previous actions and say so under scope and sources.
2. Compare expected and observed delivery behavior with source evidence and time or scope limits.
3. Identify recurring causes, useful practices, counterexamples, and unresolved questions.
4. Record each lesson with the fields in `shared/contracts/references/execution-lessons.md`.
5. Select bounded process improvements with owners, completion conditions, and a review trigger.
   When no named person accepts an improvement, list it as `Proposed` with the owner `Unassigned`.
   Do not assign an owner or mark an action accepted from the run alone.
6. Keep accepted policy changes in the project that owns them.
7. Write the report to `.atb-work/delivery-retrospective/<scope-slug>.md`, unless the user names a path.
   Follow `shared/contracts/references/execution.md#Durable report location`.
   The report has these sections in order: scope and sources, expected and observed behavior, recurring causes, useful practices and counterexamples, lessons, improvement actions, open questions, and coverage.
   Scope and sources names the action store, or states that the project has none.

The action store is the project's existing tracker, or a process document that the team names.
Record each accepted action there with its ID, owner, status, completion condition, and review trigger.
The next retrospective reads that store first.
When the project has no store, the report is the only record. Scope and sources says so.

Do not invent team sentiment, meeting outcomes, or process approvals.
A retrospective can produce a local report without notifying others or updating external trackers.
