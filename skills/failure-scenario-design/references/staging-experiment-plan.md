# Staging experiment plan

Read this for each card at the staging experiment or game day level.
The plan is for the team that runs the chaos tooling. This skill does not run it.

## Required fields

| Field | Content |
| --- | --- |
| Environment | Staging. A production run needs a written approval reference. |
| Target and scope | The components and the share of traffic or instances that the fault affects. |
| Blast radius | The journeys that can degrade, and the error budget that the run can use. |
| Duration | A timebox. The run stops at the end of the timebox. |
| Abort conditions | The signal and the threshold that stop the run, from the SLO or a named owner. If the steady-state signal stops reporting, the run stops. |
| Rollback | How the fault is removed and how recovery is confirmed. State whether the rollback was tested. |
| Owner | The person who is present for the whole run and can stop it. |
| Observers | On-call, the dependency owners, and anyone who must know that the run happens. |

## No-go conditions

Do not start the run when one of these is true:

1. The error budget for the affected journey is spent.
2. An incident is active, or a change freeze is in place.
3. The abort path or the rollback is not tested.
4. The steady-state signal does not report.
5. The owner is not present, or on-call does not know about the run.
6. The run has no timebox.

## Result

Read the actual signals after the run. Do not trust a tool status of "completed".
Record the hypothesis result as `Supported`, `Contradicted`, or `Inconclusive`, with the evidence.
A contradicted hypothesis is a finding. Add a reliability requirement or a defect for it.

## Game day

A game day is a planned exercise with roles: a facilitator, the people who respond, and an observer who records.
Write the scenarios, the expected responses, and the runbooks under test before the day.
After the day, record the gaps that the team found in the runbooks, the alerts, and the tools.
