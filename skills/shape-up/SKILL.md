---
name: shape-up
description: Shape a vague feature request into a tight, agreed brief before building. Use for fuzzy ideas or tickets before /dev-intake or /dev-plan. For broken behavior use bug-to-fix; for regulated features use ai-feature-delivery.
---

# shape-up

Turn a fuzzy request into a clear, agreed brief **before** anyone plans or writes code. It is the
adversarial interrogation step that sits in front of the build lanes: it surfaces the assumptions,
contradictions, and missing decisions that would otherwise be silently committed.

## Principles (always)

- **One question at a time.** Never batch questions — asking several at once is bewildering. Walk
  the design tree depth-first, resolving dependencies one by one.
- **Resolve from the repo before asking the human.** If a question can be answered by reading the
  code or docs, do that instead. Only escalate to the user what the code genuinely can't answer.
- **Don't lead — recommend.** Each question carries your recommended answer (and multiple choice
  when it fits), so the user confirms or redirects rather than being led blind.
- **Hunt contradictions.** Cross-check what the user says against the code and against itself;
  surface mismatches immediately rather than smoothing them over.
- **Hard gate.** Do not invoke any planning/implementation skill or write code until you have
  presented the brief and the user has approved it — for every request, however simple it seems.

## Flow

1. **Scope-gate first.** If the request is really several independent subsystems, say so and
   propose decomposing it. Don't spend questions refining the details of something that needs
   splitting first.
2. **Resolve from the repo.** Read the relevant code/docs and answer what you can yourself.
3. **Grill** (see `references/interrogation.md`): one question per message, each with a recommended
   answer, focused on purpose, constraints, success criteria, and in/out of scope. Use the
   contradiction-hunting techniques to force precision on overloaded terms and edge cases.
4. **Self-audit the draft brief**: internal consistency (do any parts contradict?), ambiguity (could
   a requirement be read two ways? pick one), placeholder scan (no `TBD`/`TODO` left).
5. **Emit the brief** (`../../templates/shape-up-brief.md`) and **stop for approval** (the hard
   gate). Iterate until approved.
6. **Hand off** (only after approval): `/dev-intake` to formalize the brief, then `/dev-plan`; or
   `/to-issues` to slice it into vertical-slice tickets. If the request turns out to be broken
   behavior, route to `/bug-intake` instead.

## Stop conditions

- A **shared understanding** is reached and the brief is approved.
- Escalate to the user only what the repo can't resolve; otherwise keep resolving from the code.
- A decision is worth pinning as an ADR only if all three hold: hard to reverse, surprising without
  context, and the result of a real trade-off. Otherwise just decide and record it in the brief.

## Command Entry

`/shape-up` is the human-started command entry point for shaping a request. The skill can still run
when its model-facing description matches a fuzzy feature request, but it never auto-fires planning
or implementation. The hard gate is mandatory.

## References

- `references/interrogation.md` — the question techniques, the contradiction/overloaded-term
  challenges, edge-case stress tests, and the brief self-audit.
