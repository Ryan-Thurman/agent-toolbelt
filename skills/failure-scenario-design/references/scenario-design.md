# Scenario design

Read this in step 2 of `failure-scenario-design`.

## Hypothesis

Write each hypothesis in this form:
"When <fault> affects <target>, <journey SLI> stays within <tolerance>, and <expected behavior>."
The hypothesis must be possible to contradict. "The system stays up" cannot be contradicted. Name the signal and the tolerance.

## Steady state

The steady state is the normal value of the journey signal, measured before the fault.
Take it from an OpenTelemetry metric or span query, or from an existing alert.
Record the signal, its source, the baseline window, and the tolerance.
If the signal does not exist, the card is `Conditional`. Add the missing telemetry as a requirement.

## One variable

Change one fault in each card. Two faults at once give a result that nobody can explain.
Combine faults only in a game day, after each single-fault card has a result.

## Verification level

Choose the lowest level that exposes the risk. Lower levels are faster, cheaper, and safe to run in CI.

| Level | Use for |
| --- | --- |
| Unit test with a fake | Timeout handling, retry rules, fallback logic, and error mapping in one module. |
| Integration test with a fault proxy | Real client behavior against a dependency that is slow, resets connections, or returns errors. For example Toxiproxy, a container dependency, or an HTTP stub with faults. |
| BDD scenario | A failure behavior that the team must read and agree on, at the API or end-to-end level. |
| Staging experiment | Behavior that only the real platform shows: failover, zone or node loss, autoscaling, and mesh or load balancer settings. |
| Game day | A planned team exercise with several faults, people on call, and runbooks under test. |

## Fault types

| Fault | Tests | Pointers |
| --- | --- | --- |
| Dependency latency | Timeouts, deadlines, circuit breakers | Toxiproxy, Chaos Mesh, LitmusChaos, AWS FIS, Azure Chaos Studio |
| Dependency errors or down | Fallback and error paths | HTTP stub faults, Chaos Mesh, service mesh fault injection |
| Partial failure | Consistency of two writes, compensation | Integration test with a fake that fails the second call |
| Duplicate or out-of-order message | Idempotency and ordering | Integration test that delivers the message again |
| Poison message | Dead-letter path | Integration test with a malformed message |
| Clock skew | Token expiry, scheduling, ordering | libfaketime, Chaos Mesh |
| Resource exhaustion | Pool, memory, and disk limits | Small pool in a test, Chaos Mesh |
| Pod, node, or zone loss | Self-healing, PodDisruptionBudget, failover | Chaos Mesh, LitmusChaos, AWS FIS, Azure Chaos Studio |
| Network partition | Split brain and failover | Chaos Mesh |
| Load above capacity | Shedding and degradation | k6, Gatling, Locust |

Read the official documentation of a tool before you name its settings.
