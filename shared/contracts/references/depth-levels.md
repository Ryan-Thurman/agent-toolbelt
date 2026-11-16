# Depth levels

Use these levels to match the depth of planning and design work to the risk of the change.
Most features need the Light level. Deep work runs only when a person asks for it or a risk signal requires it.

| Level | Use for | Effort |
| --- | --- | --- |
| Light | A change inside existing boundaries: no new service, data store, public API, queue, or trust boundary. | The rows and questions that can change the answer. No optional references, reviews, or subagents. Required checks still run. |
| Standard | A change that adds or changes a component, a data store, an API, a queue, a dependency, or a trust boundary. | The full procedure of the skill. A reference loads only when its trigger applies. |
| Deep | A request for depth, a project rule, or a high-risk signal: money, personal data, a new platform, a change across several teams, or an irreversible migration. | Standard, plus the steps that the skill marks as Deep. |

## Select the level

1. Use the level that the person names, for example `--light`, `--standard`, or `--deep`.
2. If the project instructions set a minimum level for this kind of work, do not go below it.
3. Otherwise, choose the lowest level that fits the risk signals in the table.
4. State the level and the reason in the first sentence of the output, so that the person can correct it.
5. Move up one level when the work finds a signal of a higher level. State the change and the reason.

A lower level does not skip a required check. A skill that must run `threat-model` for a trust boundary still runs it at the Light level.

## Named level below a signal

Rule 1 wins over rule 5 when the named level is below a signal. Keep the named level for the depth of the work.
State the signal and the higher level that it implies in the first sentence, so that the person can ask for that level.
Run the checks that the signal requires. The named level does not remove them.

## Answers that recommend a new table

An answer that recommends a new table changes a data store, so its level is at least Standard.
Choose the level from the recommendation, not from the wording of the question.
An answer at the Light level cannot recommend a new table.
