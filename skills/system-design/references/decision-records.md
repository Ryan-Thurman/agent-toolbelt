# Architecture decision records

Use an architecture decision record (ADR) for a significant choice with lasting consequences or costly reversal.
Record routine choices in the existing design document.
For a requested decision record, document the known choice and its evidence without expanding into unrelated design work.

## Match the project's records

Inspect existing decision records, project instructions, naming conventions, and document ownership.
Reuse their format, location, identifiers, status vocabulary, and approval process.
Continue the existing sequence instead of creating a second scheme.
When no convention exists, use `templates/architecture-decision-record.md` in the project's chosen document location.
Keep internal project decisions outside the public Toolbelt repository.

## Record the decision

Capture the problem, requirements, constraints, and evidence that motivate the choice.
Compare viable alternatives against the same criteria.
State the selected approach and its benefits, disadvantages, operational consequences, and reversibility.
Link the relevant design revision, affected components, verification approach, and reconsideration conditions.
Record an owner or `Unassigned` and the actual decision status.
Separate historical facts, current evidence, inferred rationale, and new recommendations.
Existing implementation alone does not prove who approved a choice or why they chose it.

## Preserve its lifecycle

| State | Meaning |
| --- | --- |
| Proposed | The choice awaits the project's required decision. |
| Accepted | The authorized project decision is recorded with its evidence. |
| Superseded | A linked decision replaces the earlier choice. |
| Deprecated | The choice is retired; record its reason and any remaining dependencies. |

Use the project's own states when they differ.
Keep an agent recommendation proposed unless an authorized acceptance decision already exists.
Do not invent an approval, approver, date, or accepted status.
When a decision materially changes, write a new record and link it to the previous record.
Mark the previous record superseded while preserving its original rationale.
Keep both records and update affected design references.
Minor factual corrections may update the existing record with a traceable explanation.

## Completion

Check that referenced requirements, alternatives, consequences, and approval evidence support the recorded state.
Keep unresolved decisions and unavailable evidence visible.
Writing a record does not authorize implementing its recommendation.
For a concrete new architecture proposal, use the design procedure and linked threat review before claiming design readiness.

Method adapted from [Addy Osmani's documentation and ADR guidance](https://github.com/addyosmani/agent-skills/blob/main/skills/documentation-and-adrs/SKILL.md).
