# Technical health and modernization

<!-- BEGIN catalog stages: codebase-improvement -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `tech-debt-discovery` | Find demonstrated maintenance costs and report scoped evidence. | `tech-backlog-assessment` |
| 2 | `tech-backlog-assessment` | Decide whether a selected item warrants implementation or further evidence. | `simplify`, `retrofit`, `phased-delivery` |
| 3 | `crap-analysis` | Use complexity and coverage signals to choose high-value targets. | `simplify`, `retrofit` |
| 4 | `simplify` | Remove unnecessary complexity within a narrow behavior boundary. | `retrofit`, `cover` |
| 5 | `retrofit` | Handle migrations and compatibility changes incrementally. | `cover`, `code-quality-gate` |
| 6 | `cover` | Protect behavior while structural changes land. | `code-quality-gate` |
| 7 | `code-quality-gate` | Confirm the improvement reduced risk without introducing regressions. | `pr-review` |
<!-- END catalog stages -->

`tech-backlog-assessment` decides `Do`, `Defer`, `Reject`, or `Spike` for each selected item.
Start implementation only when it is authorized.
Verify the selected result against its recorded baseline and update the debt register.

Use existing style, complexity, dependency, test, and operational evidence as inputs.
Report unavailable tools and unread areas.
Keep discovery separate from repairs.
