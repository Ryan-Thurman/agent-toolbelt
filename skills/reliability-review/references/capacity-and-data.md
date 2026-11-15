# Capacity and data recovery

Read this when the change alters expected load, a capacity limit, a data store, or recovery targets.

## Capacity

1. Record the demand inputs and their sources: expected requests, data volume, growth, and peak shape.
   Mark an estimate as an estimate.
2. Find the first resource to run out: CPU, memory, connections, threads, a quota, a partition, or a third-party rate limit.
3. Check the headroom with the largest failure domain lost. For example, two zones carry the load of three.
4. Record the autoscaling limits, the scale-up time, and the cold-start time. Autoscaling does not help during the scale-up time.
5. Decide whether a load test is needed. A load test plan states:
   - The type: load (expected peak), stress (find the limit), spike (sudden increase), or soak (long duration).
   - The workload model: open (arrival rate, as from real users) or closed (fixed users that wait for replies).
   - The pass criteria, taken from the SLO.
   - The environment and its difference from production.
   Tools such as k6, Gatling, and Locust can run the plan. This skill only writes the plan.

## Data recovery

| Question | Record |
| --- | --- |
| How can the data be lost? | Deletion by a person or a bug, slow corruption, a region outage, a ransomware or credential compromise, or a bad migration. |
| Which layers defend it? | Soft delete, point-in-time recovery, backups, replicas, and a copy in a separate administrative domain. A replica copies corruption and deletion. It is not a backup. |
| What are the RPO and RTO? | For each dataset, from the project or `Unknown` with an owner. |
| Which recovery strategy applies? | Backup and restore, pilot light, warm standby, or active-active. Check that it meets the RTO and RPO. |
| When was a restore last tested? | The date and the result. A restore drill restores to an isolated target and checks the data. It never restores over the live resource. |
