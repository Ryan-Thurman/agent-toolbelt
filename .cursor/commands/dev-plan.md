---
description: Plan a requirement or ticket set as one reviewable PR per phase
argument-hint: "<requirement-plan-or-ticket-set>"
---

# /dev-plan

Use `$phased-delivery` to plan `$ARGUMENTS`. Reuse any approved plan and its
acceptance criteria. For project-owned delivery, map each selected approved ticket
to exactly one phase, branch, and PR; add technical implementation context but
do not rewrite ticket scope. For other input, choose the smallest coherent
phase/PR boundaries, including one phase for a small change.

Record each phase's source, acceptance evidence, dependencies, branch and PR
target, checks, risks, and human review point. Plan stacked PRs against the
parent ticket branch, and flag missing or cyclic dependencies for a human
decision. Use `templates/phased-delivery-plan.md` only if no suitable existing
plan can hold this state. Show the specific phase/PR map and stack bases for
approval before coding; a generic request to start is not approval of an
unreviewed stack topology.
