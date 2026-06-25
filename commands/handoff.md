---
description: Write a resumable handoff so a fresh agent or person can continue the work without context loss. Use before a context reset, when pausing a long task, or when transferring work between sessions, agents, or people.
argument-hint: "[what the next session will focus on]"
---

# /handoff

Write a handoff document so a fresh agent — or a teammate — can pick up exactly where this session
left off, using the `handoff` skill. Context loss is the most common cause of multi-agent and
multi-session failure; this command prevents it. Cross-cutting: useful in any lane (Bug-to-Fix, Dev
Lite, AI Feature Delivery, Retrofit, or ad-hoc work).

**Arguments:** `$ARGUMENTS`

## Rules

- **Reference, don't duplicate.** Point to existing artifacts (a durable state/plan file, PRDs,
  ADRs, issues, commits, diffs) by path or URL instead of copying their content.
- **Lead with the next action** — one concrete next step, not "continue."
- **Redact secrets.** No API keys, passwords, tokens, or PII in the handoff.
- **Tailor to the next focus.** If arguments describe what the next session will do, shape the
  handoff toward that.
- **Save outside the workspace** unless the project tracks handoffs — write to a temp location so it
  isn't accidentally committed.

## Steps

1. **Locate the live state.** If the lane keeps a durable state file, it is the primary source —
   reference and summarize it rather than restating everything: the bug-investigation file
   (Bug-to-Fix), the implementation plan (Dev Lite / AI Feature Delivery), or the retrofit plan
   (Retrofit). If none exists, synthesize the state from the session.
2. **Summarize current state**: what the task is, what's done, what's in flight, and the single
   concrete **next action**.
3. **Capture what's been tried and ruled out** (so the next agent doesn't repeat it), the suspected
   direction, and the relevant files/logs/metrics to check — by reference.
4. **List suggested next skills/commands** the next session should invoke.
5. **Keep it compact** — a few screens, not a transcript. For a long task, a ≤2K-token summary plus
   references is the target.

## Resume protocol (for whoever picks it up)

Read the durable state file first (its `status` / Current State), then the handoff's next-action and
what's-been-ruled-out, then continue from the next action. Don't re-litigate eliminated paths.

## Output

A handoff document (saved outside the workspace unless the project tracks handoffs) containing:
current state + concrete next action, what's been tried/ruled out, references (not copies) to the
investigation file and related artifacts, suggested next commands, and any blockers — with secrets
redacted.
