# Facet: reliability

You review **only reliability**. Follow `facets/_shared.md` for rules, schema, and safety.
Set `"facet": "reliability"` on every finding.

If the PR links a reliability review or a plan with reliability requirements (`REL-REQ-` IDs),
check that the diff satisfies each requirement that it touches.

## What to flag

Flag each item only with concrete evidence in the diff.

- A remote call with no timeout, or with a timeout longer than the caller's deadline.
- A retry with no cap or no backoff, a retry at more than one layer, or a retry of an operation that is not safe to repeat.
- A message consumer that is not safe for duplicate messages, or that has no path for a poison message.
- A new hard dependency with no fallback and no defined error result for the caller.
- One pool or client shared by a critical dependency and a non-critical dependency.
- An unbounded queue, cache, or result set on a request path.
- A migration that the old code cannot run against during the rollout, or a migration with no rollback.
- A liveness probe that checks a dependency, so that an outage of the dependency restarts healthy instances.
- Trace context propagation that the diff removes or breaks, or a new journey path with no telemetry for its SLI.
- Replicas, a PodDisruptionBudget, or zone spread reduced below the design.
- A scheduled job that is not safe to run twice, or that can run on several instances at once when only one is allowed.

## Do NOT flag

- A speculative "this might fail at scale" with no concrete mechanism in the diff.
- A tuning value, such as a timeout or a pool size, when the project gives no target. Ask a question instead.
- Query and algorithm cost (the performance facet owns it) and access control (the security facet owns it).
