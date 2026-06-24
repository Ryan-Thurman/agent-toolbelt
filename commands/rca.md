---
description: Root-cause a reproduced bug — investigate, trace to the origin, confirm adversarially. Use after a bug is reproduced, or with --diagnose for a read-only root-cause analysis that never edits files.
argument-hint: "<bug-investigation-file-or-context> [--diagnose]"
---

# /rca

Find the **true root cause** of a reproduced bug using the `bug-to-fix` skill. This is the
centerpiece of the diagnostic workflow. It does not fix anything — it confirms *why* the bug
happens so the fix can be minimal and correct.

> **When to use vs related:** run `/rca` after `/reproduce` has established a reproduction. It
> stops at a confirmed cause; `/fix-plan` turns that into the change. For pure code review use
> `/pr-review`. Pass `--diagnose` for a read-only analysis (no file edits at all).

**Arguments:** `$ARGUMENTS`

## Preconditions

- The bug must be reproduced first — a confirmed manual reproduction (QA/reporter) or an automated
  red-capable repro. If it is not yet reproduced, stop and run `/reproduce`.
- A durable investigation file should exist (`templates/bug-investigation.md`, seeded by
  `/bug-intake`). If none exists, create one from the template before investigating.
- Read the skill's `references/durable-state.md`, `references/rca-strategies.md`, and
  `references/adversarial-confirmation.md`.

## Rules

- **No fix here.** Output a confirmed cause and fix *direction* only. With `--diagnose`, make **no
  file edits whatsoever** (read-only investigation; instrumentation only if the user approves it).
- **Update the durable file before each action**, not after. Keep `Current Focus.next_action`
  concrete.
- **One falsifiable hypothesis at a time.** Append disproven ones to **Eliminated**; never retry them.
- **Trace to the origin**, not the surface. Fix direction points at the original trigger.

## Steps

1. **Re-read Symptoms** from the durable file and the reproduction. Confirm the repro fails the way
   the *reporter* described (not a different failure).
2. **Investigate** (loop phase 1): read errors thoroughly, check recent changes, trace the data
   flow backward toward the original trigger. Record findings in **Evidence** (append-only).
3. **Analyze patterns** (phase 2): find a working example; list every difference. Consult the
   common-bug-pattern taxonomy and symptom index in `references/rca-strategies.md`; pick a strategy
   from the decision tree.
4. **Hypothesize and test** (phase 3): write 3–5 ranked, falsifiable hypotheses; show the ranked
   list to the user when domain knowledge would help. Test one variable at a time. Disproven →
   **Eliminated**; promising → gather confirming evidence.
5. **Confirm adversarially** (`references/adversarial-confirmation.md`): try to disprove the leading
   cause. Answer "if this were NOT the cause, what would I see — and do I?".
6. **Fill the reasoning checkpoint** (5 fields) in the durable file. If you cannot fill all five
   concretely, you do not have a root cause — return to step 2.
7. **Emit the result**: write `root cause / evidence / fix direction / prevention` into the durable
   file's **Resolution**, and produce an RCA report from `templates/rca-report.md` if a shareable
   write-up is wanted. With `--diagnose`, stop here and hand off; otherwise recommend `/fix-plan`.

## Escalation

- After **3 failed fix attempts** (or three eliminated hypotheses in different places pointing at
  structural mismatch), stop and raise it as an architecture problem — do not grind a fourth.
- If adversarial confirmation keeps surfacing substantive-but-unactioned findings, escalate
  (doubt theater) rather than rubber-stamping.

## Output

Update the durable investigation file (Evidence, Eliminated, Reasoning checkpoint, Resolution) and,
when a shareable report is wanted, produce one following `templates/rca-report.md`. End by stating
the confirmed root cause, the fix direction, and the next command (`/fix-plan`, or stop for
`--diagnose`).
