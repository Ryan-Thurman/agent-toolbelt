---
name: system-design
description: Work through system design questions, compare options, and create or review architecture documents, diagrams, and decision records. Also map implemented architecture; use phased-delivery for implementation planning.
---

# System design

Before writing for the user, read `shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` when establishing design evidence.

Choose the mode from the requested outcome.

| Request | Procedure | Result |
| --- | --- | --- |
| Explore a system design question or compare approaches. | Read `references/design-conversation.md`. | Give a reasoned answer, relevant evidence, alternatives, and unresolved decisions. |
| Create or review a concrete architecture proposal. | Follow the design procedure below. | Deliver a design document, appropriate diagrams, and linked threat review. |
| Record or revisit a significant architecture decision. | Read `references/decision-records.md`. | Produce or update a decision record with evidence and its actual approval state. |
| Map or maintain implemented architecture. | Read `references/repository-map.md`. | Deliver source-backed structure, dependencies, flows, and coverage limits. |

Start with the team member's question and existing project evidence.
Use `references/design-method.md` to check relevant design coverage and identify material gaps.
Scale the investigation to the decision's consequences.
A focused question can end with an answer and explicit limits.
Create documents when requested or needed for the agreed design handoff.
These modes do not authorize implementation.
Use the project's existing design record and format when suitable.
Keep controlled records, internal control registers, and formal approvals project-owned.
Keep generated internal documents in the project's designated location or an external private directory.
Reusable Toolbelt templates do not authorize publishing the documents generated from them.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root. Compatibility installers rewrite them under the target’s `.atb/`.

## Design procedure

1. Record the requirements, source revisions, goals, exclusions, constraints, and current system evidence.
   Separate agreed decisions, delegated technical choices, deferred ideas, and unresolved questions.
   If a consequential decision is unclear, use `references/design-conversation.md` to resolve it.
2. Read `references/design-method.md`.
   Describe components, interfaces, data ownership, deployment, failure behavior, and important alternatives.
   Include views that explain the scoped structure, connected behavior, and trust boundaries.
   Use `references/architecture-diagrams.md` to select and check those views.
3. Produce a design draft using the existing project record or `templates/system-design.md`.
   Label current behavior, proposed behavior, assumptions, and unsupported estimates.
   Use `references/decision-records.md` for significant decisions that need a durable explanation.
4. Run the installed `threat-model` skill against that draft and its revision.
   Keep a linked threat report with attack paths, control evidence, security requirements, verification methods, and remaining risks.
   If the skill or required evidence is unavailable, report the threat review as `Not verified` and identify the missing input.
5. Resolve design findings and record their disposition.
   Apply the readiness checks in `references/design-method.md`.
   Resolve repository facts and delegated choices directly; surface only decisions that require the source owner.
6. Hand the design and security requirements to the requested planning or test-design workflow.
   Design completion does not authorize implementation or grant project approval.

## Completion and maintenance

For a design proposal, deliver the design document and linked threat review for the same design revision.
Every important threat needs a disposition, owner or unassigned status, and a verification method.
For discussion, decision-record, or mapping work, deliver the scoped result from the mode table.
Record unresolved decisions and review limits instead of claiming readiness.
Preserve decision history and recheck affected document sections after source changes.
When an architecture, identity, data, trust boundary, or deployment changes, reassess the affected design and threats.
