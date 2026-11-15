# System failure cases

Read this when the scope has a remote call, a queue, a scheduled job, a cache, a data store, or a migration.
These cases test how the change behaves when another part of the system fails.
Raise a family only when the change has the part that it names.

| Family | Cases |
| --- | --- |
| Dependency down | Connection refused, DNS failure, or an error status for every call. The caller gets the defined fallback or error. |
| Dependency slow | The answer arrives after the timeout. The caller stops waiting at its deadline and frees its resources. |
| Dependency wrong | A response body that does not parse, a missing field, or an unexpected value. |
| Partial success | The first of two writes succeeds and the second fails. The system compensates or can resume. |
| Timeout order | The caller's timeout is shorter than the dependency's processing time, so the dependency finishes work that nobody receives. |
| Retry storm | Many clients retry at once after an outage. Backoff, jitter, and caps limit the load. |
| Duplicate delivery | The same request or message arrives twice. The result is the same as one delivery. |
| Out-of-order delivery | Messages arrive in a different order than they were sent. |
| Poison message | A message that always fails moves to the dead-letter queue after a capped number of attempts. |
| Clock skew | Hosts disagree on time. Token expiry, scheduling, and ordering still behave correctly. |
| Resource exhaustion | The connection pool, the thread pool, memory, or disk is full. |
| Quota or rate limit | A third party or the platform rejects calls above its limit. |
| Cold start | The first requests after a deploy or a scale-up are slow. |
| Bad configuration | A missing or wrong setting fails at startup with a clear error, not at the first request. |
| Failover | The primary instance, node, or zone goes away. The secondary takes over within the recovery target. |

Choose the test level with `shared/contracts/references/test-levels.md`.
A case that needs a real platform fault, such as zone loss, goes to `failure-scenario-design`.
