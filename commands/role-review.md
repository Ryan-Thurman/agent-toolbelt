---
description: Review a supplied artifact from a selected product, engineering, design, QA, security, or release perspective
argument-hint: "<role> <artifact-or-diff>"
---

# /role-review

Review the supplied artifact through one requested role's concerns.
Supported roles are product, engineering, design, QA, security, and release.
Ask for the role or target only when it cannot be identified from the request.

**Arguments:** `$ARGUMENTS`

Use the supplied requirements, repository policy, and observed evidence.
For changed code, reuse `pr-review` evidence and finding rules.
For tests or release readiness, use the matching shared skill when installed.

Return a table with **Finding / Evidence / Consequence / Action**.
State `Ready for human review`, `Needs Work`, or `Insufficient Evidence` for this perspective.
Record the review's scope and limits.
The project and its named reviewers own formal approvals.
