# Data design

## Start from the queries

1. List the reads and writes that the design needs, with their expected frequency and the result size.
2. Design the keys and indexes from that list. Each important query names the index that serves it.
3. Choose the store type from the access patterns and the consistency needs, not from habit.
   A relational database is the default when the queries and the team allow it.

## Ownership and consistency

- Each piece of data has one service that writes it. Other services read it through that service or from a copy.
- Name the source of truth. A cache, a search index, a read model, or a replica is a derived copy.
  Each copy states how it is rebuilt and how stale it can be.
- For each important read, state the consistency that it needs: the latest write, or a value that can be some seconds old.
- Two services that write the same table are a design defect. Change the ownership or merge the services.

## Scale in order of cost

Use the next step only when a measurement shows that the current step is not enough:
better queries and indexes, then a cache, then read replicas, then partitioning (sharding).
For partitioning, choose a key that spreads the load. A key that sends most traffic to one partition creates a hot shard.
Replicas lag behind the primary. A read that needs the latest write must go to the primary.

## Schema and data changes

Change a schema in three steps, so that old and new code can run during the rollout:

1. **Add**: add the new column, table, or field. Old code ignores it.
2. **Migrate**: write to both forms, then backfill the old data in batches that can stop and resume.
3. **Remove**: remove the old form after no code reads it.

Before a migration runs on a large table, find the locks that each statement takes and how long they last.
Record the rollback of each step. Reliability questions about migrations are in `reliability-review`.

## Lifecycle

State the retention period, the deletion rule, and how a person's data is found and removed when a law requires it.
