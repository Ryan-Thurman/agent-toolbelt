# Work through a design question

Use this procedure when a team member explores architecture, challenges a design, or compares approaches.
Begin with the question they need to answer and the consequence of a wrong choice.
Give the best supported answer available, with the conditions that could change it.

## Establish the decision

Read supplied requirements, previous decisions, diagrams, and relevant implementation before asking for repository facts.
Reuse agreed scope and constraints.
Identify whether the question concerns current behavior, a proposed change, or a general explanation.
For current behavior, trace relevant source paths before describing how the system works.
For proposals, keep source requirements separate from the agent's recommendations.

Record the decision, affected users or operators, scope, constraints, and evidence limits.
Explain unfamiliar terms using the team's domain language.
Resolve routine technical choices within delegated authority.
Ask when an answer changes product behavior, a material constraint, ownership, or an approval requirement.

## Investigate in focused rounds

| Step | Do | Done when |
| --- | --- | --- |
| Ground the question | Inspect the relevant records and connected code or infrastructure. | Current facts, prior decisions, and unavailable evidence are identified. |
| Check coverage | Apply the relevant rows in `design-method.md`. | Important unknowns are visible; irrelevant areas have a reason for exclusion. |
| Resolve uncertainty | Ask the highest-impact unanswered question that requires the team member. | The answer is recorded, or the decision remains explicitly open. |
| Compare approaches | Describe viable options and the conditions that favor each. | The recommendation names its benefits, costs, failure behavior, and uncertainty. |
| Test the reasoning | Walk through a representative success case and important failure cases. | Each case has a credible flow, owner, observable outcome, and verification approach. |
| Close or continue | Answer the scoped question or record the next unresolved decision. | The team can see what is settled, what remains unknown, and who acts next. |

Ask one focused question at a time when conversation is needed.
Explain which design choice the answer changes.
Offer concrete options and a recommendation when available evidence supports them.
Continue independent source inspection while awaiting an answer.
Do not repeat questions already answered by the project or the team member.

## Compare credible options

Include the current approach or no change when it is viable.
Compare alternatives against the same requirements and constraints.
Exclude infeasible options with a specific reason instead of creating artificial choices.
Identify irreversible commitments, migration effort, operator workload, and circumstances that would reverse the recommendation.
Keep estimated capacity, cost, and reliability separate from measured values and agreed targets.
Verify version-dependent product capabilities and limits with current primary sources.
When a consequential assumption can be tested cheaply, propose a bounded experiment with a success criterion.
An experiment proposal does not authorize implementation or external changes.

## Retain decisions and limits

Keep a compact record of the answer, rationale, source references, open questions, and next action.
Use the existing project record when a durable design handoff is needed.
State the owner or `Unassigned` for unresolved consequential decisions.
Distinguish an agent recommendation from an accepted project decision.
For a concrete architecture proposal, continue through the skill's design procedure and linked threat review.
A conceptual explanation or current-state question does not require a new design or threat report.

Method adapted from [Superpowers brainstorming](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md).
