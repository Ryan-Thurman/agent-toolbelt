# Retrying external operations

Use this contract when an authorized workflow creates, updates, publishes, merges, or deploys external state.
The caller or provider adapter owns the durable operation record.
The contract does not supply a provider client or persistent operation store.

## Operation identity

Before sending a request, record a stable operation ID, target, action, source revision, and payload digest.
Record the applicable authorization and the expected remote state.
Keep credentials and sensitive payload contents out of the operation record.
Use a provider idempotency key when available.
Otherwise, use an existing remote identity or stable marker that the provider can query reliably.
Reuse the operation ID only for the same target, action, and payload.
A changed payload needs a new reviewed operation and any authorization required by that change.

## Response handling

| Observation | Required response |
| --- | --- |
| The provider confirms success. | Record its identity, revision, and receipt before advancing the workflow. |
| The provider confirms rejection. | Record the failure and its cause before a bounded retry. |
| A timeout or disconnect leaves the outcome unknown. | Inspect remote state using the operation identity before sending another mutation. |
| Remote state matches the intended operation. | Reuse that result and repair the missing local receipt. |
| Remote state conflicts with the intended payload or revision. | Stop that operation and report the conflict. |
| The provider cannot establish whether the operation occurred. | Record an unknown outcome and require reconciliation before another mutation. |

Persist attempts and outcomes so a restarted process cannot repeat an unresolved operation blindly.
Treat duplicate or out-of-order events as observations to reconcile, not commands to execute again.
Check the current remote revision before applying a transition derived from an event.
An old CI result or review approval cannot authorize publication of a newer head.

## Existing owners

Preserve the posting rules in [posting.md](posting.md) and each pack's authorization requirements.
Reuse the pack's existing remote identity as the operation identity, such as a tracker key or finding fingerprint.
