---
description: Turn a vague implementation ticket with an existing precedent into a concrete discovery brief, gap analysis, test plan, and next workflow.
argument-hint: "<ticket-text-or-id>"
---

# /ticket-discover

Investigate a single implementation ticket using the `ticket-discovery` skill.

Use this for tickets like:

```text
Add e2e tests to HCP API. PWD already has them.
```

> **When to use vs related:** `/ticket-discover` assumes the ticket is probably
> worth doing and needs concrete discovery. Use `/tech-assess` when the real
> question is whether the work should happen at all, whether to add/switch a
> dependency, or which technical direction to choose.

**Arguments:** `$ARGUMENTS`

## Rules

- Start from the referenced precedent. If the ticket says one service, package,
  module, or product already has the pattern, find it before drafting a plan.
- Compare source and target directly. Do not hand-wave "copy the pattern" when
  auth, fixtures, config, CI, environment, or test runner differences matter.
- Keep the output as a discovery brief and implementation handoff. Do not edit
  code or write tests unless the user asks to continue.
- Prefer exact commands, files, and test seams from the repo over generic
  verification language.
- If the precedent cannot be found, say so and recommend `/tech-assess` or a
  spike rather than fabricating a plan.

## Steps

1. Parse the ticket into target, precedent, requested change, and success signal.
2. Find the precedent and read enough files to understand setup, fixtures,
   commands, CI hooks, and scenarios.
3. Inspect the target area and record what already exists.
4. Produce a source-vs-target gap table.
5. Recommend the smallest adaptation strategy.
6. List the specific test coverage or implementation slices to add.
7. Provide verification commands and unresolved questions.
8. Hand off to `/implementation-plan`, `/dev-plan`, `/cover`, `/cover-gaps`, or
   `/retrofit` as appropriate.

## Output

Create or present a brief following `templates/ticket-discovery-brief.md`.
Replace placeholders before presenting it. End with the recommended next command
and whether the ticket is ready for implementation planning.
