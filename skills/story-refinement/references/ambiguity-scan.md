# Ambiguity scan

Read this in step 2 of `story-refinement`. The scan is a tool for you.
Do not send it to a person as a list of questions.
Raise an item only when it applies to this work item and the repository cannot answer it.
A failed search is not proof that a behavior is absent. Record what you searched.

## Axis A: requirement-level ambiguity

Scan each requirement and the whole item.

| Type | Scan question | Signal in the text |
| --- | --- | --- |
| Outcome | Which observable result shows that the work is done? | No measure, or a vague adjective such as "fast" or "easy". |
| Scope boundary | What is out of scope? Which nearby behavior must not change? | No exclusions, "etc.", "and so on", or "support X". |
| Terms | Does each noun map to one domain concept? | Overloaded words, such as "account", "user", or "order". |
| Actors and permissions | Who can do this? Who cannot, and what do they see? | Passive voice, "users can", or no role named. |
| Data rules | What are the validation, defaults, uniqueness, ownership, and retention rules? What happens to existing data? | A field named without rules, or "store the data". |
| States and lifecycle | Which states exist? Which transitions are legal? What happens to items in progress? | Status words, such as "cancel", "archive", or "expire". |
| Errors and failures | What does the user see, and what does the system do, for each failure? | Only the success path is described. |
| Non-functional | Which performance, availability, security, privacy, accessibility, localization, or cost needs apply? | None stated, or stated without a unit and a condition. |
| Integration | Which systems, contract, and direction? What happens when the other side fails? | An external system named without a contract. |
| Rollout and migration | Is there a feature flag, a staged release, a backfill, a compatibility need, or a rollback? | A change to stored data or a public API. |
| Measurement | Which events or metrics show the outcome? | An outcome claim with no measure. |
| UI states | What are the loading, empty, error, overflow, and small-screen states? | A user-facing flow with no states. |

## Axis B: edges for each requirement

Classify the data or behavior of each requirement. Raise only the edges that fit it:
boundary, adjacency, empty, encoding, ordering, precision, idempotency, and concurrency.
Use the families in `shared/contracts/references/negative-testing.md` for authorization, limits,
dependency failure, and abuse.

## Resolution states

Give every raised item one state. Silence is not a state.

| State | Meaning |
| --- | --- |
| Resolved | A criterion or a stated rule in the spec covers it. |
| Dismissed | It does not apply. Write the reason. |
| Defaulted | You chose an answer. The spec states it as your call, and a person can reverse it. |
| Open | It needs a person. It has an owner, a blocking flag, and the condition that settles it. |

## Classes for open items

Classify each item before you ask anyone.

| Class | Rule | Who resolves it |
| --- | --- | --- |
| Fact | The repository, docs, tracker, or history can answer it. | You. Cite the source. |
| Mechanical | Project conventions give one correct answer. | You. Log it. |
| Default | Reasonable people can differ. A wrong answer costs little and is easy to reverse. | You propose it. A person confirms it in a batch. |
| Decision | It changes scope, risk, security, money, or the user experience. | A named owner, one answer for each item. |
| Challenge | Evidence shows that the stated direction is wrong. | A person, once, with the cost if the direction stays. |

When code contradicts a requirement, record a `Source conflict:` line.
The item is not ready until a dated `Decision:` line settles the conflict.
