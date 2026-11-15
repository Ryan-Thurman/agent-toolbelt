# SLOs and error budgets

Read this in step 1 of the design mode. Do not supply default targets.
A target comes from the project, a contract, or a named owner. Otherwise it is `Decision needed` with an owner.

## Indicators

A service level indicator (SLI) is a measured ratio of good events to valid events for a user journey.

| Type | Good event |
| --- | --- |
| Availability | A request that succeeds. |
| Latency | A request that completes under a stated threshold. |
| Freshness | Data that is newer than a stated age when it is read. |
| Correctness | A result that matches the expected result, for example from a probe or a reconciliation job. |

Measure the SLI as close to the user as the project can, for example at the load balancer or the client.
Record the source of each SLI: an OpenTelemetry metric, a span query, or a log query.

## Objectives

A service level objective (SLO) is a target for an SLI over a window, such as a rolling 28 days.
Check each SLO for these mistakes:

1. It measures a cause, such as CPU, and not user impact.
2. It is higher than the SLO of a hard dependency, with no plan to close the gap.
3. It has no owner and no error budget policy, so a breach changes nothing.
4. It averages journeys that have different needs, so one journey can fail inside a good total.

## Error budget

The error budget is the amount of failure that the SLO allows in its window.
The error budget policy says what the team does when the budget is spent, for example a release freeze.
Record the owner of the policy. Do not write the policy for the team.

## Alerts

Alert on the burn rate (how fast the budget is spent), not on a single bad minute.
A common design uses two windows: a fast burn over a short window pages, and a slow burn over a long window opens a ticket.
Take the burn-rate thresholds from the project's SLO policy, or record them as a decision.
Each paging alert needs a runbook that names the first actions.
