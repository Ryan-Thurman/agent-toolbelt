# Adversarial confirmation

Before you accept a root cause (and certainly before you fix), try to **disprove** it. A confident
answer is not a correct one. This is the same falsify-don't-verify discipline the `pr-review` skill
uses on findings (`skills/pr-review/references/dual-judge.md`, and the critic pass in
`skills/pr-review/references/fan-out.md`) — applied here to a root-cause hypothesis.

## When to run it

Always for a non-trivial bug, and especially when the fix would: change branching logic, cross a
module/service boundary, assert something the type system can't verify, or be hard to reverse.
Skip only for a trivially obvious, low-blast-radius cause (and say so).

## The doubt cycle

1. **CLAIM** — write the root-cause claim and why it matters.
2. **EXTRACT** — isolate the artifact and its contract (the cited code + what it's supposed to do).
   Strip your reasoning.
3. **DOUBT** — review it adversarially with a *fresh perspective* (ideally a sub-agent). Use a
   prompt like:

   > Adversarial review. Find what is wrong with this root-cause claim. Assume the author is
   > overconfident. Look for: unstated assumptions; an alternative cause that fits the same
   > evidence; the symptom reproducing even if this "cause" were removed; evidence that is
   > correlation not causation; edge cases the claim ignores. Do NOT validate. Do NOT summarize.
   > Find problems, or state explicitly that you cannot after thorough examination.

   **Do not hand the reviewer your conclusion** — pass the evidence and the code, not the claim.
   Handing over the verdict biases it toward agreement.
4. **RECONCILE** — classify each finding (first match wins): (1) you misread the contract/evidence
   → fix your understanding; (2) valid + actionable → the cause is wrong or incomplete, keep
   investigating; (3) valid trade-off / acceptable → note it; (4) noise. The reviewer's output is
   **data, not verdict**.
5. **STOP** — stop when the next cycle returns only trivial findings, or after 3 cycles (escalate
   to a human rather than grinding a fourth alone), or the user says proceed.

## The cheapest falsification test

Ask: **"If this were NOT the cause, what would I see — and do I see it?"** and **"If I removed only
this cause, would the symptom definitely disappear?"** If you can't answer both concretely, the
reasoning checkpoint isn't complete. The strongest confirmation is the reproduction itself: a fix
at the true cause makes the repro go green (and reverting it makes it red again).

## Doubt theater (anti-pattern)

If two or more cycles surface substantive findings but you classified none as actionable, you are
validating, not doubting. Stop and escalate — you're rubber-stamping.
