# Resilience patterns

Read this to propose controls in step 4 of the design mode. Propose a pattern only for a failure mode
in the register. Each pattern adds complexity, so name the risk that it reduces.

| Pattern | Use | Check |
| --- | --- | --- |
| Timeout and deadline | Every remote call. | The timeout is shorter than the caller's deadline. The deadline passes downstream. Expired work is dropped. |
| Retry | Transient failures of an operation that can run twice. | Retry at one layer only. Cap the attempts. Use backoff with jitter. Keep a retry budget so that retries cannot multiply load during an outage. |
| Idempotency | Writes and message handlers that can repeat. | An idempotency key or a natural key makes a repeat harmless. The test sends the same request twice. |
| Circuit breaker | A dependency that fails often or slowly. | The caller gets a defined result while the breaker is open. The breaker state is observable. |
| Bulkhead | Dependencies of different importance. | Separate pools, queues, or instances, so that a slow non-critical dependency cannot use up the resources of a critical one. |
| Load shedding | Load above capacity. | Reject the lowest-priority requests early, with a clear response. Do not queue without a bound. |
| Graceful degradation | A soft dependency is down. | The degraded result is defined, shown to the user, and tested. |
| Health checks | Orchestrated instances. | Liveness checks only the process. Readiness can check required dependencies. A dependency outage must not restart healthy instances. |
| Bounded queues and caches | Any queue, cache, or result set on a request path. | Each has a size limit and a defined behavior when full. |
| Dead-letter queue | Asynchronous consumers. | A poison message moves aside after a capped number of attempts. An owner reads the dead-letter queue, and an alert fires on growth. |
| Expand-contract migration | Schema or data format changes. | Old and new code run against the schema during the rollout. The contract step runs after the old code is gone. |
| Scheduled job safety | Cron and batch jobs. | The job is safe to run twice and to resume. A missed run is detected. Only one instance runs when that is required. |
