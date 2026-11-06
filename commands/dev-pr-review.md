---
description: Check readiness of the current phase or ticket PR
argument-hint: "<phase-or-ticket-and-diff>"
---

# /dev-pr-review

Use `$phased-delivery` and its `references/review-rules.md` to check this
phase's PR readiness, not a single final PR for the whole requirement. Verify
acceptance evidence, checks, scope, base/head, branch target, parent PR when
stacked, and remaining findings. Apply the project's required evidence checks when supplied with the ticket. Run `code-quality-gate` if required by
repository policy, user request, or risk; it is not a universal prerequisite.

Record the result and PR metadata in the existing plan. Open the phase PR only
when authorized, and leave review/merge to a human. Use
`templates/dev-pr-review.md` if a separate report is useful.
