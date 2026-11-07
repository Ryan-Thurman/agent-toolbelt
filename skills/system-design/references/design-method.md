# Design method

Scale the document to the system and reuse existing records.
Keep requirements authoritative and link to them rather than creating a competing scope record.

| Area | Required coverage |
| --- | --- |
| Context | Identify actors, external systems, goals, constraints, and current versus proposed behavior. |
| Structure | Describe component responsibilities, deployment, interfaces, data movement, and trust boundaries. |
| Data and behavior | Define ownership, consistency, authorization, tenant isolation, retries, duplicate handling, and concurrency where applicable. |
| Operation | Explain failure detection, recovery, monitoring, rollout, capacity, and cost assumptions. |
| Decisions | Compare plausible alternatives, including the current system. Explain tradeoffs and conditions for reconsideration. |
| Security | Link the threat report, control evidence, security requirements, remaining risks, and verification plan. |

Use a separate architectural decision record when an important tradeoff needs its own durable explanation.
Record routine choices in the design.
Do not invent capacity targets or service guarantees without source requirements or measurements.

For readiness review, identify questions whose wrong answer would materially change the design or plan.
Check connected flows as well as individual components.
For example, define how an event reaches its worker and how failure becomes observable.
Keep implementation details that a competent builder can choose within the delegated scope.
Use a fresh reviewer when scope, risk, and authorized delegation justify the cost; otherwise perform a focused self-review.
Keep this readiness review distinct from security threat analysis.
