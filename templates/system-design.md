# System design: <system>

Reuse the project's document format when one exists.
Scale this template to the scoped design and retain reasons for material exclusions.
Keep unknown targets and unresolved decisions explicit.

## Document identity and sources

- Design status, owner, and revision:
- Source requirements, existing decisions, and inspected revisions:
- Evidence limitations and relevant local changes:
- Project review and approval evidence, if any:

## Question, outcomes, and scope

- Decision or problem the design must address:
- Users, operators, affected owners, and intended outcomes:
- Scope, exclusions, constraints, and current behavior:
- Proposed behavior and key changes:

## Requirements and quality scenarios

| Requirement or scenario | Source | Design response | Verification method | Gap or open decision |
| --- | --- | --- | --- | --- |

State operating conditions, expected outcomes, units, and measurement methods for material quality requirements.
Distinguish agreed targets, measured values, and estimates.

## Architecture views

Include the context and software-unit views needed to explain the design.
Add sequence, deployment, component, data, or state views when they resolve an important question.
Label current and proposed relationships, important flows, and trust boundaries.
Record each view's source or design revision and rendering limits.

## Responsibilities, interfaces, and data

| Component or boundary | Responsibility and owner | Interface contract | Data ownership and consistency | Evidence or decision |
| --- | --- | --- | --- | --- |

Describe relevant validation, authorization, errors, compatibility, transactions, retention, deletion, and migration behavior.

## Connected behavior and failure cases

| Scenario | Request, event, or state flow | Success or failure outcome | Recovery and owner | Verification |
| --- | --- | --- | --- | --- |

Include representative success cases and the highest-impact failure cases.
Address partial success, retries, duplicates, concurrency, and dependency loss where they affect the design.

## Alternatives and decision records

| Option | Fit with requirements | Benefits and disadvantages | Effort and reversibility | Selection or rejection reason |
| --- | --- | --- | --- | --- |

- Recommendation and its conditions:
- Accepted decisions and approval evidence:
- Delegated technical choices:
- Linked architecture decision records and their status:
- Conditions that would change the recommendation:

## Operation, rollout, capacity, and cost

- Runtime placement and operating owners:
- Monitoring signals, failure detection, and support:
- Rollout, compatibility, migration, rollback, and recovery:
- Demand and resource estimates, inputs, uncertainty, and bottlenecks:
- Infrastructure cost and operator workload assumptions:

## Threat review and security requirements

Link the threat report and reviewed design revision.
Distinguish proposed controls, observed implementation, and verified behavior.

| Threat ID | Requirement and control status | Owner | Verification method and evidence | Remaining risk or decision |
| --- | --- | --- | --- | --- |

## Open questions and evidence gaps

| ID | Question or missing evidence | Consequence | Owner or Unassigned | Resolution method |
| --- | --- | --- | --- | --- |

## Readiness, review, and handoff

- Result: Ready for planning / Needs decision / Needs revision / Not verified
- Source coverage and connected-flow review:
- Findings, corrections, and disposition:
- Remaining limits and required project decisions:
- Requested planning or test-design handoff and acceptance links:

## Maintenance

- Source changes that require revalidation:
- Design sections, diagrams, and decision records affected:
- Owner and last verified revision:

Design readiness does not grant project approval or implementation authority.
