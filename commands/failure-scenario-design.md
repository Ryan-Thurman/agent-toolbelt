---
description: Plan failure scenarios and staging chaos experiments as cards with Given/When/Then forms and test-first cases
argument-hint: "<reliability-review-report-risk-ids-or-dependency> [--light | --standard | --deep]"
---

# /failure-scenario-design

**Arguments:** `$ARGUMENTS`: a reliability review report, risk IDs, or a journey and a dependency.

Use this after `/reliability-review` and before test-first implementation. It writes plans only and never runs fault injection.

The agent chooses the depth from the risk of the change and states it. A flag overrides it.

Follow the `failure-scenario-design` skill.
