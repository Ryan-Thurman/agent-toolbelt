---
description: Assess a technical backlog item before implementation — decide do/defer/reject/spike, compare options, dependency choices, risks, and test strategy.
argument-hint: "<ticket-or-backlog-item>"
---

# /tech-assess

Assess a technical backlog item using the `tech-backlog-assessment` skill before
turning it into implementation work.

> **When to use vs related:** `/tech-assess` decides whether and how to do a
> technical backlog item. Use `/ticket-discover` for a narrower ticket that
> already points to a precedent to copy/adapt. Use `/dev-plan`,
> `/implementation-plan`, `/retrofit`, or `/cover` only after the assessment
> recommends moving forward.

**Arguments:** `$ARGUMENTS`

## Rules

- Prefer repo evidence over speculation. Read the current implementation,
  nearby patterns, tests, build scripts, and existing dependencies before
  recommending a direction.
- Evaluate at least two options when the item contains a real decision, such as
  importing a package, switching libraries, keeping current code, or doing a
  spike.
- If package choice, security status, license, version support, or ecosystem
  health matters, verify current metadata from primary sources before making a
  recommendation.
- Keep the output decision-shaped, not implementation-heavy. Do not edit code.
- Do not create a phased implementation plan unless the user asks to continue
  after accepting the recommendation.

## Steps

1. Classify the item: dependency decision, library/framework switch, technical
   debt cleanup, test investment, migration, performance/reliability risk, or
   unclear.
2. Inspect the repo area named by the item. If the area is unclear, search for
   likely symbols, package names, feature names, docs, and test files.
3. Capture current state and constraints: existing patterns, ownership
   boundaries, commands, dependency policy signals, CI/test seams, and obvious
   rollout limits.
4. Compare options. Include status quo when it is plausible.
5. Recommend one verdict: `Do`, `Defer`, `Reject`, or `Spike`.
6. Define the smallest implementation shape and the verification strategy if
   the recommendation is `Do` or `Spike`.
7. Name the next workflow: `/ticket-discover`, `/dev-plan`,
   `/implementation-plan`, `/retrofit`, `/cover-gaps`, `/cover`, or no action.

## Output

Create or present a brief following
`templates/tech-backlog-assessment.md`. Replace placeholders before presenting
it. End with the recommendation, confidence level, and the exact next command or
workflow to run.
