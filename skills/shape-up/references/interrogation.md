# Interrogation techniques

How to grill a request into clarity. Load this during a `/shape-up` session.

## The cardinal rule

**One question per message.** Wait for the answer before the next question. Asking several at once
is bewildering and produces shallow answers. Walk the design tree depth-first: resolve a decision,
then follow its dependencies, rather than firing a flat checklist.

## Before you ask the human

- **Scope-gate.** If the request spans multiple independent subsystems, stop and propose
  decomposing it first. Don't refine the details of something that should be split.
- **Resolve from the repo.** Grep the code and docs. Anything the codebase can answer, answer
  yourself — only escalate genuine unknowns to the user.

## Asking well (don't lead)

- Give your **recommended answer** with each question, and prefer **multiple choice** when the
  options are enumerable — so the user confirms or redirects rather than being led blind.
- Keep each question focused on one of: **purpose** (what user/business problem is actually being
  solved?), **constraints**, **success criteria** (what outcome makes this successful?), and
  **scope** (what is explicitly in and out?).

## Hunting contradictions (highest-value)

- **Challenge a term against the code/glossary.** "Your code cancels entire Orders, but you just
  said partial cancellation is possible — which is right?"
- **Sharpen overloaded language to a canonical term.** "You said *account* — do you mean the
  Customer or the User? Those are different things."
- **Stress-test with invented edge cases.** Pose specific scenarios that force the user to be
  precise about boundaries between concepts ("what happens if the order is already shipped when
  they cancel?").
- Surface every mismatch immediately; do not smooth it over to keep things moving.

## Brief self-audit (before emitting)

- **Internal consistency** — do any sections contradict each other?
- **Ambiguity** — could any requirement be read two ways? If so, pick one and make it explicit.
- **Placeholder scan** — no `TBD`/`TODO`/half-finished sections left; resolve or note them as open
  questions with a recommended default.

## When to pin an ADR

Only offer to record an Architecture Decision when **all three** hold: the decision is hard to
reverse, surprising without context, and the result of a real trade-off. Otherwise just decide and
capture it in the brief's Implementation Decisions.

## Done

Stop when a shared understanding is reached and the brief is approved. The hard gate stands until
then: no planning or implementation step fires before approval.
