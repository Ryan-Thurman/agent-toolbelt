# Right-sizing

Use this check to find parts of a design or a plan that no current need supports.
A moving part is a service, process, state store, queue, scheduled job, secret, abstraction,
rollout phase, or operating procedure. List them at the level of detail that the task needs.

## Grounds

Link each moving part to one ground:

- A current requirement or acceptance criterion.
- A failure that was observed, with its record.
- A security, correctness, durability, compatibility, or operating constraint.

A possible future need is not a ground. A part without a ground is a finding.

## Reduce

For each part without a ground, remove it, merge it into a part that has a ground, or defer it.
Prefer the design with fewer ownership boundaries, state transitions, failure modes, and coordination paths.
Do not measure size by file count or line count. Measure behavior and the work to operate the system.

Keep each of these safeguards when they apply, even when a part goes away:

- Trust, permission, and tenant boundaries.
- Correctness and data durability guarantees.
- Protection against destructive actions, and the recovery paths.
- The acceptance criteria.
- Compatibility and operating constraints.

Keep redundancy that protects a named failure domain or a recovery requirement.

## Defer with a trigger

Record each deferred part with a measurable trigger to add it.
Examples are a measured failure rate that a daily reconciliation cannot absorb,
an audit requirement for longer history than the source keeps, or an availability target that needs total-outage detection.
In a design, use the "Change it when" column of the decision table.
In a plan, list deferred parts and their triggers in the Deferred parts table of the plan template and in the plan's exclusions.
When the source gives no number for a trigger, write the trigger as `Decision needed` with its owner, or `Unassigned`.
Do not invent a threshold. A run that needs a value labels it as the run's choice and shows the effect of two or three values.

## Example

A plan for a nightly CSV export adds a scheduler service, a job status table, a retry queue, and a dead-letter queue.
The requirement is one export each night, and a failed export can run again the next morning.

| Part | Ground | Result |
| --- | --- | --- |
| Scheduler service | None. The existing worker has a cron trigger. | Removed. The worker runs the export. |
| Job status table | Operators must see the last run. | Merged into one row that the export updates. |
| Retry queue and dead-letter queue | None. A rerun is acceptable. | Deferred. Add them when failed exports exceed one rerun for each night. |
| Write to a temporary file, then rename | Durability: readers must never see a partial file. | Kept. |

## Report

Give the revised design or plan first.
Then list the parts that you removed or merged, the safeguards that you kept, and each deferred part with its trigger.
Keep this list shorter than the revised artifact.
If the design is already the right size, state the ground of each part.
