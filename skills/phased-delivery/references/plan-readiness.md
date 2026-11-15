# Plan readiness

Start from the source outcome and acceptance criteria.
Assess whether planned work covers them without adding product scope.

| Check | Required evidence |
| --- | --- |
| Coverage | Each requirement maps to implementation work and an observable verification method. |
| Decisions | The plan preserves agreed choices and exclusions. Delegated technical choices remain explicit. |
| Dependencies | Prerequisites are available or unresolved. Dependency order has no cycles or hidden cross-ticket work. |
| Integration | Components connect through specified interfaces. Tests cover the complete behavior where feasible. |
| Unit tests | Source criteria map to observable interfaces, important branches, boundaries, and error cases. Test commands and material gaps are identified. |
| Acceptance scenarios | When the source has Given/When/Then criteria, each criterion maps to a phase scenario or a named unit test. |
| Test levels | Each boundary that the work crosses has a planned test at that boundary, or `Not covered` with a reason. See `shared/contracts/references/test-levels.md`. |
| Negative cases | Each family in `shared/contracts/references/negative-testing.md` that applies has a planned case, or `Not applicable` with a reason. |
| Reliability | Work that adds a trigger in `shared/contracts/references/reliability-checklist.md` answers its story tier. Failure scenarios map to tests. |
| Execution | Steps identify important files, owners, interfaces, source constraints, and checkable results. |
| Scope | Each supplied ticket retains its approved phase and PR boundary. |
| Right size | Each service, store, queue, job, abstraction, or rollout phase that the plan adds has a ground from `shared/contracts/references/right-sizing.md`. Deferred parts have a trigger. |

Return `Ready`, `Needs revision`, or `Not verified` with evidence and material gaps.
Do not report Ready when required scope or evidence remains unresolved.
Report gaps in the Acceptance scenarios, Test levels, Negative cases, Reliability, and Right size rows as warnings.
They do not change the result unless the project instructions make them a gate.
This assessment does not grant plan approval or authorize implementation.

During authorized planning, correct technical gaps within existing scope and recheck the affected requirements.
Run at most 2 revision passes. Then report the open findings and stop.
Use a fresh reviewer when scope, risk, and authorized delegation justify it. Otherwise perform a focused self-review.
