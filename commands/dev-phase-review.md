---
description: Review one completed phase or ticket before its PR handoff
argument-hint: "<phase-or-ticket>"
---

# /dev-phase-review

Use `$phased-delivery` and its `references/review-rules.md` to review
`$ARGUMENTS` against the source acceptance criteria, this phase's diff, tests,
and planned PR base. For a stack, compare against the parent branch so earlier
tickets are excluded. Classify findings as Blocking, Should Fix, or Nice to
Have; do not call the phase ready with blockers. Record evidence and findings
in the existing plan. Use `templates/dev-phase-review.md` if a report is needed.
