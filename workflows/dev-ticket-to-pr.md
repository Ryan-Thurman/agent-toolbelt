# Ticket to PR

Use the shared delivery workflow to implement approved requirements or tickets.
The target project owns its source records and required approvals.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Read the approved ticket and repository instructions. | Establish the task's scope. | Acceptance criteria, constraints, and missing decisions are clear. |
| 2 | Use `phased-delivery` or `/dev-plan`. | Define reviewable PR boundaries. | Each selected ticket has one phase, branch, PR base, and evidence plan. |
| 3 | Complete the approved phase. | Deliver the required behavior. | Relevant tests and repository checks pass, or unresolved gaps are explicit. |
| 4 | Review the phase's own diff. | Find regressions and scope changes. | Blocking findings are resolved and required evidence is current. |
| 5 | Open the phase PR when authorized. | Enable the project's review process. | The PR names its source, checks, risks, and next action. |

Keep the plan current after meaningful changes.
Preserve project-owned requirement, ticket, document, and release references when supplied.
Use `webapp-testing` for browser evidence when it applies.
A human owns merge decisions unless the user explicitly authorizes another policy.
