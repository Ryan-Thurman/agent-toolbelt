# Reliability question bank

Read this in step 3 of the design mode. Ask only the areas that the change touches.
Each question needs an answer with evidence, or an owner. Do not fill in a number that the project did not give.

| Area | Questions |
| --- | --- |
| Journeys and targets | Which user journeys does the change affect? Which indicator (SLI) shows that each journey works: success ratio, latency under a threshold, freshness, or correctness? What is the objective (SLO) and its window, and who set it? Who owns the error budget policy? |
| Dependencies | What does each new or changed call depend on? Is the dependency hard (the request fails) or soft (the result degrades)? Is the call synchronous or asynchronous? What is the dependency's SLO, and is it lower than ours? Who owns it? |
| Timeouts and deadlines | What is the timeout of each remote call? Is it shorter than the caller's deadline? Does the deadline pass downstream, and is expired work dropped? |
| Retries | Which layer retries? Is there a cap for each request, backoff with jitter, and a retry budget? Can the retried operation run twice without harm (idempotency key)? What load do retries times fan-out create at peak? |
| Overload | What happens above capacity: shed, queue, or degrade? Is there a fallback or a degraded mode, and how is it tested? Which requests are shed first? Do health checks separate a dead instance from a busy one? |
| Isolation | Does a slow dependency share a connection pool, thread pool, or queue with other dependencies (bulkhead)? Is there a circuit breaker, and what does the caller get while it is open? Which shared infrastructure creates shared fate: one database, one zone, one region, or one quota? |
| Data | What are the recovery point objective (RPO) and recovery time objective (RTO) of each new data store? Is the backup in a separate failure and administrative domain? When was a restore last tested? How is slow corruption found? Is the migration expand-contract, so that old and new code can run together? |
| Asynchronous work and jobs | What happens to a message that always fails (poison message)? Where is the dead-letter queue, and who reads it? Are consumers safe for duplicate and out-of-order messages? Can a scheduled job skip a run or run twice when the scheduler fails? |
| Time | Does any logic depend on clock agreement between hosts, on time zones, or on token expiry? |
| Capacity | What are the expected load, the growth estimate, and the first resource to run out? Does capacity hold when the largest failure domain (node, zone, or region) is lost? What are the autoscaling limits and the cold-start time? Which load test confirms the capacity? |
| Topology and recovery | Which zones or regions does it run in? Which disaster recovery strategy applies: backup and restore, pilot light, warm standby, or active-active? Does it meet the RTO and RPO? |
| Observability | Which OpenTelemetry spans, metrics, and log fields show each journey's SLI? Does trace context cross the new boundary? Which alert fires on user impact (burn rate) and not on a cause such as CPU? Does each paging alert have a runbook? |
| Release and rollback | Is the change behind a feature flag or a canary with a control group? What is the rollback trigger, and does it come from the SLO? Is any step irreversible? |
