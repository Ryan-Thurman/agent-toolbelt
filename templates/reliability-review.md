# Reliability review: <system or change>

Design source and revision:
Owner:
Result: <Ready for planning | Needs decision | Needs revision | Not verified. In readiness mode, the requirement statuses.>
Evidence limits:

## Journeys and targets

| Journey | SLI and source | SLO and window | Target source or owner | Error budget policy owner |
| --- | --- | --- | --- | --- |
|  |  | `Decision needed` with an owner if not given |  |  |

## Dependency inventory

| Dependency | Direction | Hard or soft | Sync or async | Timeout | Retries | Fallback | Owner | Dependency SLO |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

## Question answers

| Area | Question | Status | Evidence or owner |
| --- | --- | --- | --- |
|  |  | Answered, Answered with a gap, Decision needed, or Not applicable |  |

## Failure-mode register

| ID | Component | Category | Trigger | Journey impact | Detection signal | Current control | Proposed control | Testable | Verification level | Owner | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REL-001 |  |  |  |  |  |  |  | Yes, No (reason), or Conditional |  |  |  |

## Capacity and load

Demand inputs, the first resource to run out, headroom with the largest failure domain lost, and the load-test plan if one is needed.

## Data recovery

| Dataset | RPO | RTO | Backup domain | Last restore test |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Observability and operations

| Journey | Spans, metrics, and log fields | Alert | Runbook | On-call owner |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Reliability requirements

| Requirement | Linked risks | Verification level | Status | Evidence |
| --- | --- | --- | --- | --- |
| REL-REQ-1 | REL-001 |  | Proposed, Verified, Failed, or Not verified | Command, source, or record that shows the status |

## Open decisions and handoff

| Decision | Owner | Blocks |
| --- | --- | --- |
|  |  |  |

Requirements go to `phased-delivery`. Testable risks go to `failure-scenario-design`. Rollback triggers and the watch list go to `ship-it`.
