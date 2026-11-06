---
name: handoff
description: Write a resumable handoff so a fresh agent or person can continue the work without context loss. Use proactively before a context reset or compaction, when pausing a long task, or when transferring work between sessions, agents, or people — in any workflow.
---

# handoff

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Write a handoff document so a fresh agent — or a teammate — can pick up exactly where this session
left off. **Context loss is the most common cause of multi-session and multi-agent failure**: the
next session re-derives what's already known, re-tries dead ends, or loses the thread entirely. A
good handoff prevents that.

This is **cross-cutting** — useful in any lane (Bug-to-Fix, Phased Delivery, Retrofit,
or ad-hoc work). Reach for it *proactively* when a long task is about to lose its context, not only
when asked.

## Rules

- **Reference, don't duplicate.** Point to existing artifacts (a durable state/plan file, PRDs,
  ADRs, issues, commits, diffs) by path or URL instead of copying their content.
- **Lead with the next action.** The single most important line is a *concrete* next step —
  "add logging at line 47 of auth.js before `jwt.verify()`", not "continue investigating."
- **Capture what's been ruled out**, so the next session doesn't repeat it.
- **Record the working state.** Name the branch and whether relevant changes are
  committed or still in the working tree. Include exact verification commands
  and outcomes so the next session can tell what evidence is still current.
- **Redact secrets.** No API keys, passwords, tokens, or PII.
- **Tailor to the next focus.** If told what the next session will do, shape the handoff toward it.
- **Keep it compact** — a few screens, not a transcript. For a long task, a ≤2K-token summary plus
  references is the target.
- **Save outside the workspace** unless the project tracks handoffs. In
  `phase-context-workflow`, use the phase handoff file; otherwise write to a
  unique file in the OS temporary directory (`$TMPDIR`, else `/tmp` on Unix;
  `%TEMP%` on Windows). Use the host's temporary-file API when available and
  report the exact saved path so the next session can find it.

## Steps

1. **Locate the live state.** If the lane keeps a durable state file, it's the primary source —
   reference and summarize it rather than restating everything:
   - Bug-to-Fix → the bug-investigation file (`status`, Current Focus, Eliminated, `next_action`).
   - Phased Delivery or a project-owned delivery workflow → the implementation plan (Current State, task status, next step,
     resume instructions).
   - Retrofit → the retrofit plan (the site table + status).
   - No durable file → synthesize the state from the session.
2. **Summarize current state**: what the task is, what's done, what's in flight, the branch and
   working-tree state, and the single concrete **next action**.
3. **Capture what's been tried and ruled out**, the suspected direction, and the relevant
   files/logs/metrics to check — by reference.
4. **Record verification**: the commands run, their outcomes, and checks still needed. If the
   underlying code changes after a check, mark that result stale.
5. **List suggested next skills/commands** the next session should invoke.
6. **Keep it compact** and save it: use the phase handoff path when
   `phase-context-workflow` owns the handoff, otherwise save outside the
   workspace.

## Resume protocol (for whoever picks it up)

Read the durable state file first (its `status` / Current State), then the handoff's next action and
what's been ruled out. Compare the recorded branch and working-tree state with `git status`; rerun
checks whose recorded result is missing or stale before relying on them. Continue from the next
action without re-litigating eliminated paths.

## Output

A handoff document containing: current state + a concrete next action, branch and working-tree
state, exact verification commands and outcomes, what's been tried/ruled out, references (not copies)
to the durable state file and related artifacts, suggested next commands, and any blockers — secrets
redacted, saved to the tracked phase handoff when
that workflow owns it, otherwise outside the workspace.
