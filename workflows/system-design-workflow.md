# System design, security, and reliability

<!-- BEGIN catalog stages: security-sensitive-change -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `system-design` | Create the design record and linked threat review before implementation. | `threat-model`, `reliability-review` |
| 2 | `threat-model` | Identify assets, trust boundaries, abuse cases, and mitigations before coding. | `test-case-design`, `security-audit` |
| 3 | `reliability-review` | Find failure modes, SLO and observability gaps, and recovery needs, and write testable reliability requirements. | `failure-scenario-design`, `phased-delivery` |
| 4 | `failure-scenario-design` | Turn testable reliability risks into scenario cards, Given/When/Then forms, and staging experiment plans. | `phased-delivery`, `test-case-design`, `cover` |
| 5 | `phased-delivery` | Plan accepted requirements and preserve threat-to-verification links. | `test-case-design`, `cover`, `security-audit` |
| 6 | `test-case-design` | Turn threats and requirements into negative, boundary, and regression cases. | `cover` |
| 7 | `cover` | Make critical protections executable and regression-resistant. | `security-audit` |
| 8 | `security-audit` | Inspect the resulting implementation and configuration for exploitable gaps. | `code-quality-gate` |
| 9 | `code-quality-gate` | Check evidence, maintainability, and release readiness across the risk boundary. | `pr-review` |
| 10 | `pr-review` | Provide independent final review of correctness and residual risk. | `ship-it` |
<!-- END catalog stages -->

`system-design` can also answer a design question, record a decision, or map the current system.
Stop after that stage when the decision needs nothing more.
`threat-model` and `reliability-review` review the same design revision that `system-design` produced.
Run `reliability-review` when the trigger in step 4 of `system-design` applies.
`failure-scenario-design` writes plans only. Chaos experiments run in staging, and production needs written approval.
The `pr-review` reliability facet checks the implementation against the reliability requirements.

Use only the stages that the current decision needs.
The project owns controlled records, internal risk registers, required reviews, and release authority.
