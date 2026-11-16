---
name: shape-up
description: Compare a product ask with current system behavior, shape a vague request into an approved brief, or slice an approved brief into tickets before planning. Use product-discovery to decide whether to build. Route defects to bug-to-fix.
---

# shape-up

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Choose the mode from the user's request:

| Request | Procedure | Result |
| --- | --- | --- |
| What the system does today, how an ask differs, or which questions are missing. | Read `references/current-state-gap.md`. | A report-only comparison with evidence and prioritized decision questions. |
| Turn an ambiguous idea into an agreed brief. | Follow the interactive shaping flow below. | A brief that the user approves. |
| Turn an approved brief into tickets. | Read `references/slicing.md`. | Dependency-ordered vertical-slice tickets. |

If the request describes broken behavior, route it to `bug-to-fix`.
Send a ticket or story that is almost ready to `story-refinement`.
If the user asks for a gap review and shaping, report the gaps first.
Then use the gaps to focus the shaping questions.
Send architecture-structure questions to `system-design` when it is available.

## Shared principles

- **Resolve from the repo before you ask the human.** Read the code and docs first.
  Ask the user only what the repository cannot answer.
- **Separate facts from proposals.** Cite current behavior.
  Label each inference as `inferred`, and name each area that was not inspected. Show contradictions.
- **Stay in discovery.** Edit no code, and start no implementation from Shape Up.
- **Use rct when present.** If `scope_feature` or `build_context_pack` is in the tool list,
  read `references/rct-acceleration.md`.

## Interactive shaping flow

1. **Scope-gate.** If the request contains several independent subsystems, propose a split
   before you refine details.
2. **Grill.** Read `references/interrogation.md`. Ask the open decisions in numbered rounds.
3. **Review readiness.** Find each point where another implementer must make a consequential guess.
   Do the brief self-audit in `references/interrogation.md`.
   Done means no unresolved overloaded terms, no open scope boundary, and no `TBD`.
4. **Emit the brief.** Use `templates/shape-up-brief.md`.
   Stop for approval, and iterate until the user approves.
   This approval gate is mandatory before any planning or implementation step.
   When no user can answer in this run, save the brief with the status `Draft for approval`,
   list each open question with its recommended default, and stop. A draft is not an approved brief.
   Do not hand a draft to `$phased-delivery`.
5. **Hand off after approval.** Give the approved brief to `$phased-delivery`
   (or `/dev-plan` on hosts with commands).
   If the user wants tickets, slice the brief first with `references/slicing.md`.

Record a decision in the brief.
For an architecture decision record, use the threshold in
`skills/system-design/references/decision-records.md` when that skill is available.

## Output locations

When the user names no path, write each output to the location below, and print each path.
Read `shared/contracts/references/execution.md#Durable report location`.

- Gap review: `.atb-work/shape-up/<scope-slug>.md`.
- Brief: `.atb-work/shape-up/<scope-slug>/brief.md`.
- Requirement map and tickets: `.atb-work/shape-up/<scope-slug>/requirement-map.md` and `.atb-work/shape-up/<scope-slug>/tickets/`.

## Completion

- Gap review: the comparison and prioritized questions are delivered. Approval is not necessary.
- Shaping: the user approves the brief, or the result is `Draft for approval`. No delivery step starts automatically.
- Slicing: every ticket follows `templates/shape-up-issues.md` and has real `Blocked by` links.
