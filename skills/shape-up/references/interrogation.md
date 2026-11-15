# Interrogation techniques

How to grill a request into clarity. Load this for interactive shaping, not for
a report-only current-state gap review.

## Ask in rounds

Map the request as a tree of decisions. A round holds every open decision whose prerequisites are settled.
Number the questions in a round, and put the question that blocks the most work first.
Use three to five questions in each round. Hold a question that depends on another open question for a later round.
Settle facts from the repository before you ask, and do not stop a round to wait for a fact search.

Ask one question at a time only for an early idea, when open answers help more than choices.
For a ticket or story that is almost ready, use `story-refinement`.

## Before the first round

For an existing codebase, show your assumptions before you ask.
Give each assumption its evidence, the consequence if it is wrong, and a confidence.
The user corrects only the wrong rows.

## Asking well (don't lead)

- Give your **recommended answer** with each question, and word the question so that "yes" accepts it.
  Offer choices when the options are known.
- One "yes" can accept a group of low-cost defaults. A decision that changes scope, risk, security,
  money, or the user experience needs its own answer.
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
