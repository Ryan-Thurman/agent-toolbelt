# Failure modes

Read this in step 4 of the design mode.

## Walk every integration point

An integration point is each place where the change calls another process: a service, a database,
a cache, a queue, a file store, a third party, or the platform itself.
For each integration point, ask what happens when the other side is down, slow, wrong, or overloaded.
A slow dependency usually causes more damage than a dependency that is down, because callers hold threads,
connections, and memory while they wait.

## Categories

| Category | Look for |
| --- | --- |
| Single point of failure | One instance, one zone, one database, one credential, or one person that the journey needs. |
| Latency | A slow dependency that holds resources, timeouts longer than the caller's deadline, and queues that grow. |
| Load | A traffic spike, a retry storm, a cache that empties, a cold start, or a batch job at peak time. |
| Misconfiguration | A wrong value, a missing secret, an expired certificate, a quota, or a configuration change with no staged rollout. |
| Shared fate | Several components that fail together because they share a database, a pool, a zone, a region, or a quota. |
| Data | Lost, duplicated, reordered, partially written, or slowly corrupted data. A migration that old code cannot read. |
| Time | Clock skew, time zone errors, token expiry, a scheduled job that skips or repeats. |
| Other | Describe it. |

## Cascades

Record how one failure can spread. Common paths are retries that multiply load,
callers that wait on a slow dependency until their own pools are full, and a liveness probe
that checks a dependency and restarts healthy instances during an outage.

## Register

Give each row an ID, such as `REL-001`, and fill these fields:
component or dependency, category, trigger, journey impact, detection signal, current control,
proposed control, testable, verification level, owner, and disposition.

## Testable

| Value | Meaning |
| --- | --- |
| `Yes` | A test or a staging experiment can cause the failure and observe the result. |
| `No` with a reason | It cannot be caused safely, for example the loss of a region with no test region. Verify it by review or a configuration check. |
| `Conditional` | It becomes testable after a precondition, such as a missing steady-state signal or a test environment. |

Choose the lowest level that exposes the risk: a unit test with a fake, an integration test with a fault proxy,
a BDD scenario, a load test, a staging experiment, a restore drill, a configuration check, or a review.
A staging experiment is for behavior that lower levels cannot reach, such as real failover, zone loss, or autoscaling.
