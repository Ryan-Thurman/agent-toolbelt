---
description: Turn a confirmed root cause into the smallest safe fix and verify it — write the fix brief, bound the blast radius, define the verification, then hand to dev and review. Use after RCA confirms the cause.
argument-hint: "<bug-investigation-file-or-rca-context>"
---

# /fix-plan

Turn a **confirmed root cause** into a minimal, verified fix using the `bug-to-fix` skill. Produces
the fix contract and the verification plan, then hands off to the shared dev + review back half.

> **When to use vs related:** run `/fix-plan` after `/rca` has confirmed the cause. It defines and
> bounds the fix; `/dev-implement-task` (or `/implementation-plan`) implements it, and
> `/pr-review` / `/dev-pr-review` reviews it. This command does not do a broad code review.

**Arguments:** `$ARGUMENTS`

## Preconditions

- The durable investigation file's **reasoning checkpoint** must be complete (5 concrete fields).
  If the root cause is not confirmed, stop and run `/rca`.
- Read `references/durable-state.md`; use `templates/bug-agent-brief.md` for the fix contract.

## Rules — minimal change

- **Touch only what the fix requires.** A bug-fix diff contains only the bug fix. No refactors, no
  unrelated cleanup, no "while I'm here" improvements (those get their own PR).
- **No defensive code for impossible cases.** Validate only at real boundaries (user input,
  external APIs); trust internal invariants.
- **Rule of three before abstracting.** Don't extract a helper until the fourth occurrence.
- **The diff must justify itself line by line.** Ask, don't assume the bigger interpretation.
- **Surface, don't smuggle.** Note worthwhile out-of-scope changes as follow-ups, not sneak edits.

## Steps

1. **Write the fix brief** from `templates/bug-agent-brief.md`: current vs. desired behavior, the
   root-cause-addressing approach, key interfaces, acceptance criteria, and an explicit **out of
   scope** fence. Keep it durable (names, not line numbers) and behavioral.
2. **Bound the blast radius**: complete the **Scope self-check** (files touched + why, lines you
   won't add, cases you won't defend, abstractions rejected, diff size, could-it-be-smaller,
   follow-ups not done). For a live incident, separate any mitigation already applied from the real
   fix.
3. **Define verification** (adapted to the current QA reality):
   - **If an automated test seam exists** — write a regression test first and prove it by
     `revert fix → test fails → restore → test passes`.
   - **If reproduction was manual only** — write the manual re-test steps for QA, and record
     **"add an automated regression test" as a Should-Fix follow-up**. Do not silently skip the
     test; the gap must be visible.
   - Either way: original issue gone, you understand *why* the fix works, related behavior intact,
     stable. Assume the fix is wrong until proven otherwise.
4. **Update the durable file**: set `status: fixing` (then `verifying` / `awaiting_human_verify` as
   appropriate), and write the fix + verification into **Resolution**.
5. **Hand off**: implement via `/dev-implement-task` (or `/implementation-plan` for a larger fix),
   then review via `/pr-review` or `/dev-pr-review`. Don't push to a default branch unless the user
   explicitly asks.

## Escalation

If this is the **3rd+ fix attempt** for the same bug, stop — three failures in different places
signal an architecture problem, not another quick fix. Raise it for discussion.

## Output

A fix brief (`templates/bug-agent-brief.md`) with the scope self-check and verification plan
completed, the durable file updated (status + Resolution), and the recommended next command
(`/dev-implement-task` → `/pr-review`). For a manual-only reproduction, the output explicitly lists
the automated-regression-test follow-up as Should-Fix.
