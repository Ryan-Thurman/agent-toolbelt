# Dual-judge verification (deep tier)

The deep-tier replacement for the standard tier's single self-reflect critic. Two **blind,
independent** judges adversarially test each finding; a tiebreaker settles disagreement. The goal is
to kill plausible-but-wrong findings while never deleting real ones — and to re-anchor line numbers.

## Inputs

The deduped findings, and **read access to the current files** (each judge re-reads cited code — see
the critic rule in `fan-out.md`: never falsify from reasoning alone).

## Procedure

1. **Spawn two judges in parallel**, blind to each other. Each judge, for every finding:
   - opens the finding's `file:line` and confirms the **current** code matches the claim. If it
     doesn't (stale / wrong location), verdict = `refute (stale)`.
   - applies `review-rubric.md` → severity floors, then decides: `confirm` (real, correctly bucketed), `downgrade` (real but weaker — give new
     bucket/severity or convert to a question), or `refute` (false / unreachable / no real
     consequence). Each judge gives a one-line reason.
   - Bias: **falsify, don't verify** — try to break the finding; but default to `confirm` when you
     can't, i.e. fail open on genuine uncertainty.
2. **Reconcile** per finding:
   - both `confirm` → keep.
   - both `refute` → drop.
   - both `downgrade` → keep at the lower of the two.
   - **disagreement** (any mix) → spawn **one tiebreaker judge** for just those findings; its call
     decides. A tie that the tiebreaker leaves uncertain → keep as a **question**, not a blocker.
3. **Re-location repair**: for surviving findings whose `lineStart/lineEnd` no longer match (code
   moved), the judge that re-read the file supplies the corrected line numbers. Never drop a real
   finding solely for line drift — repair it.

## Output

The verified finding set (with repaired line numbers and any re-bucketing), ready for verdict
derivation. With `--benchmark`, record judge token usage for the footer (`benchmarking.md`).
Dual-judge roughly doubles verification tokens compared with the single critic.
