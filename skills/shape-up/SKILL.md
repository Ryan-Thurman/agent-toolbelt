---
name: shape-up
description: Compare a product ask with current system behavior, shape a vague request into an approved brief, or slice an approved brief into tickets before planning. Route defects to bug-to-fix.
---

# shape-up

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Choose the mode from the user's request:

| Request | Procedure | Result |
| --- | --- | --- |
| What the system does today, how an ask differs, or which questions are missing. | Read `references/current-state-gap.md`. | A report-only comparison with evidence and prioritized decision questions. |
| Turn an ambiguous idea into an agreed brief. | Follow the interactive shaping flow below. | A brief that the user approves. |
| Turn an approved brief into tickets. | Read `references/slicing.md`. | Dependency-ordered vertical-slice tickets. |

If the user asks for a gap review and shaping, report the gaps first.
Then use the gaps to focus the shaping questions.
Send architecture-structure questions to `system-design` when it is available.

## Shared principles

- **Resolve from the repo before you ask the human.** Read the code and docs first.
  Ask the user only what the repository cannot answer.
- **Separate facts from proposals.** Cite current behavior.
  Mark each gap as demonstrated, inferred, or not inspected. Show contradictions.
- **Stay in discovery.** Edit no code, and start no implementation from Shape Up.
- **Use rct when present.** If `scope_feature` or `build_context_pack` is in the tool list,
  read `references/rct-acceleration.md`.

## Interactive shaping flow

1. **Scope-gate.** If the request contains several independent subsystems, propose a split
   before you refine details.
2. **Grill.** Read `references/interrogation.md` and ask one question per message.
   Give a recommended answer with each question.
3. **Review readiness.** Find each point where another implementer must make a consequential guess.
   Do the brief self-audit in `references/interrogation.md`.
   Done means no unresolved overloaded terms, no open scope boundary, and no `TBD`.
4. **Emit the brief.** Use `templates/shape-up-brief.md`.
   Stop for approval, and iterate until the user approves.
   This approval gate is mandatory before any planning or implementation step.
5. **Hand off after approval.** Give the approved brief to `$phased-delivery`
   (or `/dev-plan` on hosts with commands).
   If the user wants tickets, slice the brief first with `references/slicing.md`.
   If the request describes broken behavior, route it to `bug-to-fix`.

Record a decision in the brief.
For an architecture decision record, use the threshold in
`skills/system-design/references/decision-records.md` when that skill is available.

## Completion

- Gap review: the comparison and prioritized questions are delivered. Approval is not necessary.
- Shaping: the user approves the brief. No delivery step starts automatically.
- Slicing: every ticket follows `templates/shape-up-issues.md` and has real `Blocked by` links.
