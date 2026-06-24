# Bug-to-Fix Workflow

The diagnostic lane: take a bug report and drive it to a verified fix. Backed by the `bug-to-fix`
skill (`skills/bug-to-fix/SKILL.md`). Use this instead of the AI Feature Delivery or Dev Lite lanes
when the entry point is **broken behavior**, not a new capability.

Each step keeps a durable investigation file (`templates/bug-investigation.md`) updated **before**
each action, so the work survives a context reset and hands off cleanly.

## Steps

1. **`/bug-intake <report>`** — triage: classify severity (SEV1–SEV4), capture the intake schema,
   dedup against prior bugs, and seed the durable investigation file with the (immutable) Symptoms.
2. **`/reproduce`** — establish reproduction. Default path: confirm a **manual** reproduction
   (QA/reporter) — answer "did you/QA reproduce this before dev?". Optional automated path (failing
   test) for when a harness exists. Gate: confirmed manual **or** automated-red repro.
3. **`/rca`** — root cause: investigate → analyze patterns → test falsifiable hypotheses → confirm
   adversarially → fill the 5-field reasoning checkpoint. Use `--diagnose` for a read-only analysis
   that stops at the cause. Emits an RCA report (`templates/rca-report.md`).
4. **`/fix-plan`** — write the fix brief (`templates/bug-agent-brief.md`), bound the blast radius
   (minimal-change + scope self-check), and define verification (automated revert→must-fail, or
   documented manual QA verification + a Should-Fix automated-test follow-up).
5. **`/dev-implement-task`** (or **`/implementation-plan`** for a larger fix) — implement the fix.
6. **`/pr-review`** (or **`/dev-pr-review`**) — review before opening/marking the PR ready. Don't
   push to a default branch unless the user explicitly asks.

`/handoff` can be run at any point to write a resumable summary.

## Gates

- No `/rca` until reproduced (manual or automated).
- No fix until the reasoning checkpoint is complete (confirmed root cause).
- No "fixed" claim without verification (automated proof, or documented manual re-test + tracked
  test-automation follow-up).

## Escalation

Three failed fixes in different places = an architecture problem, not a fourth attempt. Stop and
raise it.

## Completion criteria

- Confirmed root cause recorded (not just the symptom).
- Smallest safe fix applied; diff justifies itself line by line.
- Verified (automated or documented-manual); any automated-test gap captured as a follow-up.
- Durable file `status: resolved`; knowledge base updated for repeat-bug detection.
