# System design

<!-- BEGIN catalog stages: security-sensitive-change -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `system-design` | Create the design record and linked threat review before implementation. | `threat-model` |
| 2 | `threat-model` | Identify assets, trust boundaries, abuse cases, and mitigations before coding. | `test-case-design`, `security-audit` |
| 3 | `phased-delivery` | Plan accepted requirements and preserve threat-to-verification links. | `test-case-design`, `cover`, `security-audit` |
| 4 | `test-case-design` | Turn threats and requirements into negative, boundary, and regression cases. | `cover` |
| 5 | `cover` | Make critical protections executable and regression-resistant. | `security-audit` |
| 6 | `security-audit` | Inspect the resulting implementation and configuration for exploitable gaps. | `code-quality-gate` |
| 7 | `code-quality-gate` | Check evidence, maintainability, and release readiness across the risk boundary. | `pr-review` |
| 8 | `pr-review` | Provide independent final review of correctness and residual risk. | `ship-it` |
<!-- END catalog stages -->

`system-design` can also answer a design question, record a decision, or map the current system.
Stop after that stage when the decision needs nothing more.
`threat-model` reviews the same design revision that `system-design` produced.

Use only the stages that the current decision needs.
The project owns controlled records, internal risk registers, required reviews, and release authority.
