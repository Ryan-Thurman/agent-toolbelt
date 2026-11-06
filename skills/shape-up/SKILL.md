---
name: shape-up
description: Compare a product ask with current system behavior, or shape a vague request into an approved brief. Use for requirement gaps and fuzzy ideas. Route defects to bug-to-fix; preserve delivery rules owned by the target project.
---

# shape-up

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Choose the mode from the user's request:

- **Current-state gap review:** The user asks what the system does today, how an ask differs,
  or what questions are missing. Produce an evidence-backed, report-only comparison using
  `references/current-state-gap.md`. Do not require a shaping interview or brief approval.
- **Interactive shaping:** The user wants an ambiguous idea turned into an agreed brief.
  Resolve repository facts first, then use `references/interrogation.md` to surface assumptions,
  contradictions, and missing decisions. The approved brief can go straight to Phased Delivery.

If the user asks for both, report the current-state gaps first and use them to focus the
interactive questions. Neither mode authorizes implementation on its own.

## Shared principles

- **Resolve from the repo before asking the human.** If a question can be answered by reading the
  code or docs, do that instead. Only escalate to the user what the code genuinely can't answer.
- **Separate facts from proposals.** Cite current behavior and distinguish a demonstrated gap
  from an inference or an area you could not inspect. Surface contradictions explicitly.
- **Stay in discovery.** Do not edit code or invoke implementation from Shape Up.

## Current-state gap review

Follow `references/current-state-gap.md`. Compare each requested outcome with observed
behavior, classify it as covered, partial, missing, or unknown, and report evidence,
impact, and decision questions. Answer known questions from the repository. Do not invent
requirements to close a gap or turn the review into a delivery plan. If the user later
chooses to shape the ask, carry the evidence and open decisions into the brief.

## Interactive shaping flow

1. **Scope-gate first.** If the request is really several independent subsystems, say so and
   propose decomposing it. Don't spend questions refining the details of something that needs
   splitting first.
2. **Resolve from the repo.** Read the relevant code/docs and answer what you can yourself.
3. **Grill** (see `references/interrogation.md`): one question per message, each with a recommended
   answer, focused on purpose, constraints, success criteria, and in/out of scope. Use the
   contradiction-hunting techniques to force precision on overloaded terms and edge cases.
4. **Self-audit the draft brief**: internal consistency (do any parts contradict?), ambiguity (could
   a requirement be read two ways? pick one), placeholder scan (no `TBD`/`TODO` left). Done means
   there are no unresolved overloaded terms, no unanswered scope boundary, and no `TBD`.
5. **Emit the brief** (`../../templates/shape-up-brief.md`) and **stop for approval** (the hard
   gate). Iterate until approved.
6. **Hand off** (only after approval): pass the approved brief directly to
   `$phased-delivery` (or `/dev-plan` on hosts using commands), which maps it to
   phases and PRs. Use `/to-issues` first only when tickets are wanted; those
   tickets become the delivery scope. If this is broken behavior, route to
   `/bug-intake` instead.

## Stop conditions

- In gap-review mode, the evidence-backed comparison and prioritized decision
  questions are delivered; approval is not required to finish the report.
- In shaping mode, a **shared understanding** is reached and the brief is approved.
- Escalate to the user only what the repo can't resolve; otherwise keep resolving from the code.
- A decision is worth pinning as an ADR only if all three hold: hard to reverse, surprising without
  context, and the result of a real trade-off. Otherwise just decide and record it in the brief.

## Command Entry

`/shape-up` is the command entry point for either mode. The skill can also run when
its description matches a gap review or fuzzy request. The approval gate applies
only to interactive shaping before planning; a report-only review ends with its
findings and does not auto-start delivery.

## References

- `references/interrogation.md` — the question techniques, the contradiction/overloaded-term
  challenges, edge-case stress tests, and the brief self-audit.
- `references/current-state-gap.md` — evidence and output rules for report-only
  requirement-versus-system reviews.
