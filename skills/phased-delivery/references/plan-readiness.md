# Plan readiness

Read this before implementation or when a user asks to review an existing plan.
Start from the source outcome and acceptance criteria.
Assess whether planned work covers them without adding product scope.

| Check | Required evidence |
| --- | --- |
| Coverage | Each requirement maps to implementation work and an observable verification method. |
| Decisions | The plan preserves agreed choices and exclusions. Delegated technical choices remain explicit. |
| Dependencies | Prerequisites are available or unresolved. Dependency order has no cycles or hidden cross-ticket work. |
| Integration | Components connect through specified interfaces. Tests cover the complete behavior where feasible. |
| Execution | Steps identify important files, owners, interfaces, source constraints, and checkable results. |
| Scope | Each supplied ticket retains its approved phase and PR boundary. |

Return `Ready`, `Needs revision`, or `Not verified` with evidence and material gaps.
Do not report Ready when required scope or evidence remains unresolved.
This assessment does not grant plan approval or authorize implementation.

For review-only requests, report findings without changing the plan or starting execution.
During authorized planning, correct technical gaps within existing scope and recheck the affected requirements.
Bound revision loops and preserve unresolved findings if the bound is reached.
Use a fresh reviewer when scope, risk, and authorized delegation justify it; otherwise perform a focused self-review.
Do not require another approval when the user already approved the specific scope and PR boundaries.
