# Distributed workflows

Read this at the Standard level or higher when a flow crosses services, queues, or scheduled jobs.

## Start simple

Prefer one deployable unit with clear modules. A distributed design adds network failures, partial failure,
and harder testing. Split a service out only for a stated need: a separate team, a separate scaling need, or a separate release cycle.
Several services that must deploy together are a distributed monolith. Merge them, or fix the boundary.

## Synchronous or asynchronous

Decide for each link between two services:

| Choose | When |
| --- | --- |
| Synchronous call | The caller needs the answer to continue, and the dependency's availability is acceptable for the caller. |
| Queue | One consumer must do the work later, and the caller does not need the result now. |
| Publish and subscribe | Several consumers react to one fact. |
| Stream | Consumers need ordered history or replay. |
| Workflow engine | A long process has many steps, waits, and timeouts that must survive restarts. |

## Delivery

Most queues deliver a message at least once. Design every consumer so that a second delivery has no extra effect.
Each message carries an ID, a type, a schema version, the time it was created, and a correlation ID.
Do not depend on order unless the queue guarantees it for the partition that you use.

## Outbox

Do not write to the database and publish to a queue as two separate steps. If the second step fails, the two disagree.
Write the change and an outbox record in one database transaction. A separate process reads the outbox and publishes the message.

## Sagas

A saga is a business process across services, where each service commits its own step.
Use a saga in place of a distributed transaction.

- Each step is safe to repeat.
- Each step has an undo step (a compensation). Undo steps run in reverse order when a later step fails.
- Each step has its own timeout.
- The saga state is stored, so that the process can resume after a restart.

## Failure handling

A message that always fails moves to a dead-letter queue after a capped number of attempts.
Consumers apply backpressure when they fall behind, for example by limiting how many messages they take at once.
Detailed failure checks are in `reliability-review`.
