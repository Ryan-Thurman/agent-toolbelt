# Role review

Review the supplied artifact through one requested role's concerns.
Supported roles are product, engineering, design, QA, security, and release.
Ask for the role or target only when it cannot be identified from the request.

Use the supplied requirements, repository policy, and observed evidence.
For changed code, apply `references/review-rubric.md` and `references/finding-schema.md`.
When the matching skill is installed, also use it for that role:

| Role | Skill |
| --- | --- |
| QA | `skills/test-case-design/SKILL.md` |
| Security | `skills/security-audit/SKILL.md` |
| Release | `skills/ship-it/SKILL.md` |
| Product | `skills/product-outcome-review/SKILL.md` |

Return a table with **Finding / Evidence / Consequence / Action**.
State `Ready for human review`, `Needs Work`, or `Insufficient Evidence` for this perspective.
Record the review's scope and limits.
The project and its named reviewers own formal approvals.
