---
name: system-design
description: Produce or review a system design document with alternatives, interfaces, failure behavior, and a linked threat review. Use for architecture decisions; use phased-delivery for implementation planning.
---

# System design

Before writing for the user, read `shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` when establishing design evidence.

Create or review a system design without implementing it.
Use the project's existing design record and format when suitable.
Keep controlled records, internal control registers, and formal approvals project-owned.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root. Compatibility installers rewrite them under the target’s `.atb/`.

## Procedure

1. Record the requirements, source revisions, goals, exclusions, constraints, and current system evidence.
   Separate agreed decisions, delegated technical choices, deferred ideas, and unresolved questions.
2. Read `references/design-method.md`.
   Describe components, interfaces, data ownership, deployment, failure behavior, and important alternatives.
   Show data flows and trust boundaries in a diagram.
3. Produce a design draft using the existing project record or `templates/system-design.md`.
   Label current behavior, proposed behavior, assumptions, and unsupported estimates.
4. Run the installed `threat-model` skill against that draft and its revision.
   Keep a linked threat report with attack paths, control evidence, security requirements, verification methods, and remaining risks.
   If the skill or required evidence is unavailable, report the threat review as `Not verified` and identify the missing input.
5. Resolve design findings and record their disposition.
   Check whether another implementer could proceed without a consequential guess.
   Resolve repository facts and delegated choices directly; surface only decisions that require the source owner.
6. Hand the design and security requirements to the requested planning or test-design workflow.
   Design completion does not authorize implementation or grant project approval.

## Completion

Deliver the design document and a linked threat review for the same design revision.
Every important threat needs a disposition, owner or unassigned status, and a verification method.
Record unresolved decisions and review limits instead of claiming readiness.
When an architecture, identity, data, trust boundary, or deployment changes, reassess the affected design and threats.
