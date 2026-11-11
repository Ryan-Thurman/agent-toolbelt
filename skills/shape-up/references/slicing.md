# Slice an approved brief into tickets

Use this procedure when the user wants tickets from an approved brief.
If no approved brief exists, run interactive shaping first.

Each ticket is a vertical slice.
A vertical slice is a narrow but complete path through every layer, such as schema, API, UI, and tests.
Each slice must be demoable or verifiable by itself.

| Step | Do | Done when |
| --- | --- | --- |
| 1 | Read the approved brief and its source requirements. | The scope, exclusions, and decisions are known. |
| 2 | Cut the work into vertical slices. Put any necessary prefactoring in the first slice. | No slice delivers only one layer. |
| 3 | Write each slice with `templates/shape-up-issues.md`. Describe end-to-end behavior, checkbox acceptance criteria, and `Blocked by`. | Each slice has all template sections. |
| 4 | Put setup, tests, and documentation in the slice that needs them. | No separate test-only or docs-only slice remains. |
| 5 | Quiz the breakdown. Check granularity, dependencies, and slices to merge or split. | Each slice is the right size, and each dependency is real. |
| 6 | Map each source requirement to a ticket and a verification method. | Missing coverage, contradictory decisions, and dependency cycles are reported. |
| 7 | Order the tickets by dependency, with blockers first. | Each `Blocked by` reference points to an earlier ticket. |

Keep supplied project requirements and ticket fields.
Keep approved ticket boundaries. Get the owner's decision before you change them.

Give the ordered tickets to `$phased-delivery` (or `/dev-plan`).
It maps each selected ticket to one phase and one PR.
To publish the tickets to a tracker, use `ticket-sync` when it is available.
