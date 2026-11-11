# Interrogation techniques

How to grill a request into clarity. Load this for interactive shaping, not for
a report-only current-state gap review.

## The cardinal rule

**One question per message.** Wait for the answer before the next question. Asking several at once
is bewildering and produces shallow answers. Walk the design tree depth-first: resolve a decision,
then follow its dependencies, rather than firing a flat checklist.

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

- **Decision state** — separate agreed decisions, delegated technical choices, deferred ideas, and
  unresolved questions. Resolve repository facts and delegated choices yourself.
- **Internal consistency** — do any sections contradict each other?
- **Ambiguity** — could any requirement be read two ways? If so, pick one and make it explicit.
- **Placeholder scan** — no `TBD`/`TODO`/half-finished sections left; resolve or note them as open
  questions with a recommended default.
