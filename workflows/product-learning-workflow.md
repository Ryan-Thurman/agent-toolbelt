# Product decisions and learning

Use only the stages needed for the current decision.
The source evidence and project requirements remain authoritative.

<!-- BEGIN catalog stages: product-learning -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `user-research-synthesis` | Understand source evidence, counterexamples, and sample limits. | `product-discovery` |
| 2 | `product-discovery` | Choose an opportunity or experiment with measurement and decision conditions. | `shape-up`, `product-outcome-review` |
| 3 | `shape-up` | Clarify selected implementation scope when a brief is needed. | `phased-delivery` |
| 4 | `phased-delivery` | Deliver approved scope with acceptance evidence. | `ship-it`, `product-outcome-review` |
| 5 | `ship-it` | Assess immediate release readiness and health when a release is involved. | `product-outcome-review` |
| 6 | `product-outcome-review` | Determine whether the original customer problem improved. | `product-discovery` |
<!-- END catalog stages -->

An experiment can proceed to outcome review without creating a feature or ticket.
Send release failures to `bug-to-fix`.
The project chooses records, sources, review timing, and required approvals.
