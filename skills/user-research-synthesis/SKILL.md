---
name: user-research-synthesis
description: Synthesize interviews, surveys, usability notes, and customer feedback into evidence-linked themes and counterexamples. Use to understand supplied research before product decisions; use product-discovery to choose an opportunity.
---

# User research synthesis

Before writing for the user, read `shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` when assessing the research evidence.

Analyze supplied research or permitted connected sources.
Default to report-only; write a requested research artifact without changing product code or publishing to external systems.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root.

## Procedure

1. Record the research question, source IDs, collection dates, method, participant sample, and unavailable inputs.
   Distinguish participants from repeated comments by the same participant.
2. Extract observations with exact source locations.
   Keep quotations faithful and permitted for the intended output.
   Distinguish what a participant reported from observed behavior and analyst interpretation.
3. Group observations into themes and preserve counterexamples.
   Give counts only when the denominator is known.
   A convenience sample cannot establish population prevalence or invented customer segments.
4. Explain each theme's consequence, evidence strength, uncertainty, and potential opportunity.
   Compare conflicting accounts rather than removing them to simplify the story.
5. For a durable report, use the project's research record when suitable, or `templates/user-research-synthesis.md`.
   Hand a selected opportunity to `product-discovery` only when that decision is requested.

## Completion

Every material theme links to evidence and includes counterexamples or a recorded search for them.
Report sample limits, unanswered questions, and the next evidence or product decision.
If no defensible theme emerges, report insufficient evidence.
Completion does not require a feature, ticket, or opportunity recommendation.
