# Feature refinement

Use only the stages that the work item needs.
Start at `story-refinement` when the ticket already has a clear goal.
Start at `shape-up` when the request is still a vague idea.

<!-- BEGIN catalog stages: feature-refinement -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `shape-up` | Shape a vague idea into an approved brief and slices before story refinement. | `story-refinement` |
| 2 | `story-refinement` | Scan for ambiguity, batch owner questions with defaults, and write Given/When/Then criteria with failure paths. | `bdd-scenarios`, `test-case-design`, `ticket-sync`, `phased-delivery` |
| 3 | `test-case-design` | Turn the criteria, negative families, and reliability answers into prioritized cases at the right test level. | `bdd-scenarios`, `phased-delivery` |
| 4 | `bdd-scenarios` | Write the acceptance criteria as feature files that each phase turns from red to green. | `phased-delivery` |
| 5 | `ticket-sync` | Publish the approved story changes to the tracker. | `phased-delivery` |
| 6 | `phased-delivery` | Plan the ready story as test-first phases. | `code-quality-gate` |
<!-- END catalog stages -->

Run `story-refinement --scan` before the refinement meeting.
In the meeting, the team answers only the owner questions and confirms the defaults.
Run `story-refinement --check` after the meeting for the readiness verdict.

The readiness verdict, the negative-testing families, and the reliability checklist give warnings.
They do not block a handoff unless the project instructions make them a gate.
The project owns its Definition of Ready, its tracker fields, and its approvals.
