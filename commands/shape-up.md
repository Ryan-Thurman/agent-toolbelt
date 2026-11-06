---
description: Compare a product ask with current system behavior and expose gaps, or interrogate a vague request into an approved brief before delivery.
argument-hint: "<product-ask-or-request>"
---

# /shape-up

Use the `shape-up` skill to either review a product ask against current system
behavior (report-only) or shape a fuzzy request into an approved brief.

> **When to use vs related:** `/shape-up` compares an ask with the existing system
> or *interrogates* a fuzzy idea. `/dev-intake` is an optional clarification
> step for an unclear raw requirement entering Phased Delivery without an approved brief.
> `/feature-fleshout` is the heavy, regulated stakeholder version. For broken
> behavior use `/bug-intake`. An approved Shape Up brief goes straight to
> `$phased-delivery` or `/dev-plan`.

**Arguments:** `$ARGUMENTS`

## Rules

- Choose the mode from the request. For a current-state/gap review, read
  `references/current-state-gap.md` and report evidence and questions without
  editing code, creating a plan, or requiring brief approval.
- For interactive shaping, read `references/interrogation.md`. Ask **one
  question at a time**, each with a recommended answer. Never batch questions.
- **Resolve from the repo first** — only ask the user what the code/docs can't answer.
- **Shaping gate:** do not call `/dev-plan` or any implementation step until
  the brief is presented and approved.

## Steps

For a report-only review, follow `references/current-state-gap.md`: map each
requested outcome to observed behavior and evidence, classify the gaps, and
prioritize unanswered questions. Stop after the report unless the user asks to
continue.

For interactive shaping:

1. **Scope-gate.** If the request is several independent subsystems, propose decomposing it before
   grilling details.
2. **Resolve from the repo** what you can; gather context.
3. **Grill** one question at a time (purpose, constraints, success criteria, scope), each with a
   recommended answer. Use the contradiction-hunting techniques to sharpen overloaded terms and
   stress-test edge cases.
4. **Self-audit** the draft brief for consistency, ambiguity, and leftover placeholders.
5. **Emit the brief** following `templates/shape-up-brief.md` and **stop for approval**. Iterate
   until approved.
6. **Hand off** on approval: `$phased-delivery` or `/dev-plan` directly, or
   `/to-issues` first if ticket slicing is wanted (or `/bug-intake` for a defect).

## Output

Gap review: a report comparing the ask with current behavior, evidence, gaps,
and prioritized questions. No approval is required to complete that report.

Interactive shaping: a brief following `templates/shape-up-brief.md` — problem,
solution, tight user stories, implementation decisions (no stale file paths),
out of scope, test seams, open questions — presented for approval. No planning
or code happens until the user approves.
