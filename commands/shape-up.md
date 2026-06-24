---
description: Interrogate a vague request into an agreed brief before building — one question at a time, repo-first, surfacing contradictions and missing decisions, gated on user approval. Use to shape a fuzzy idea or ticket before planning.
argument-hint: "<feature-or-request>"
---

# /shape-up

Shape a fuzzy request into a clear, agreed brief using the `shape-up` skill, **before** anyone plans
or writes code.

> **When to use vs related:** `/shape-up` *interrogates* and surfaces assumptions; `/dev-intake`
> *captures* a brief by making safe assumptions; `/feature-fleshout` is the heavy, regulated,
> stakeholder version. For broken behavior use `/bug-intake`. Typical chain: `/shape-up` ->
> `/dev-intake` -> `/dev-plan`.

**Arguments:** `$ARGUMENTS`

## Rules

- Read the skill's `references/interrogation.md`.
- **One question at a time**, each with a recommended answer. Never batch questions.
- **Resolve from the repo first** — only ask the user what the code/docs can't answer.
- **Hard gate:** do not call `/dev-intake`, `/dev-plan`, or any implementation step, and do not
  write code, until the brief is presented and the user approves it.

## Steps

1. **Scope-gate.** If the request is several independent subsystems, propose decomposing it before
   grilling details.
2. **Resolve from the repo** what you can; gather context.
3. **Grill** one question at a time (purpose, constraints, success criteria, scope), each with a
   recommended answer. Use the contradiction-hunting techniques to sharpen overloaded terms and
   stress-test edge cases.
4. **Self-audit** the draft brief for consistency, ambiguity, and leftover placeholders.
5. **Emit the brief** following `templates/shape-up-brief.md` and **stop for approval**. Iterate
   until approved.
6. **Hand off** on approval: `/dev-intake` then `/dev-plan`, or `/to-issues` to slice into tickets
   (or `/bug-intake` if it turned out to be broken behavior).

## Output

A brief following `templates/shape-up-brief.md` — problem, solution, tight user stories,
implementation decisions (no stale file paths), out of scope, test seams, open questions — presented
for approval. No planning or code happens until the user approves.
