# Adversarial confirmation

Before you accept a root cause (and certainly before you fix), try to **disprove** it. A confident
answer is not a correct one.

## When to run it

Always for a non-trivial bug, and especially when the fix will: change branching logic, cross a
module/service boundary, assert something the type system cannot verify, or be hard to reverse.
Skip only for a trivially obvious, low-blast-radius cause (and say so).

## The doubt cycle

1. **CLAIM**: write the root-cause claim and why it matters.
2. **EXTRACT**: isolate the artifact and its contract (the cited code + what it is supposed to do).
   Strip your reasoning.
3. **DOUBT**: review it adversarially with a *fresh perspective* (ideally a sub-agent). Use a
   prompt like:

   > Adversarial review. Find what is wrong with this root-cause claim. Assume the author is
   > overconfident. Look for: unstated assumptions, an alternative cause that fits the same
   > evidence, the symptom reproducing even if this "cause" were removed, evidence that is
   > correlation not causation, and edge cases the claim ignores. Do NOT validate. Do NOT summarize.
   > Find problems, or state explicitly that you cannot after thorough examination.

   **Do not hand the reviewer your conclusion.** Pass the evidence and the code, not the claim.
   Handing over the verdict biases it toward agreement.
4. **RECONCILE**: classify each finding (first match wins): (1) you misread the contract/evidence
   -> fix your understanding. (2) valid + actionable -> the cause is wrong or incomplete, so keep
   investigating. (3) valid trade-off / acceptable -> note it. (4) noise. The reviewer's output is
   **data, not verdict**.
5. **STOP**: stop when the next cycle returns only trivial findings, or after 3 cycles (escalate
   to a human rather than grinding a fourth alone), or the user says proceed.

## The cheapest falsification test

Ask: **"If this were NOT the cause, what would I see — and do I see it?"** and **"If I remove only
this cause, will the symptom definitely disappear?"** If you cannot answer both concretely, the
reasoning checkpoint is not complete. The strongest confirmation is the reproduction itself: a fix
at the true cause makes the repro go green (and reverting it makes it red again).

If two or more cycles find substantive issues but none are actionable, follow the doubt-theater
escalation in `SKILL.md`.
