---
name: handoff
description: Write a resumable handoff so a fresh agent or person can continue the work without context loss. Use proactively before a context reset or compaction, when pausing a long task, or when transferring work between sessions, agents, or people — in any workflow.
---

# handoff

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Write a handoff so a fresh agent or a teammate can continue exactly where this session stopped.
A good handoff stops the next session from repeating known work and dead ends.

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
- **Save it in the right place.** When `phase-context-workflow` owns the handoff,
  save it to that skill's phase handoff path. Otherwise, write a unique file in
  the OS temporary directory (`$TMPDIR`, else `/tmp` on Unix; `%TEMP%` on
  Windows). Use the host's temporary-file API when available. Report the exact
  saved path so the next session can find it.

## Steps

For a managed assignment, read `shared/contracts/references/execution.md` before recording its result or next action.
After a consequential failure or a request to preserve lessons, read `shared/contracts/references/execution-lessons.md`.
Include relevant lesson candidates in the handoff or authorized project knowledge.

1. **Locate the live state.** If the lane keeps a durable state file, it's the primary source —
   reference and summarize it rather than restating everything:
   - Bug-to-Fix → the bug-investigation file (`status`, Current Focus, Eliminated, `next_action`).
   - Phased Delivery or a project-owned delivery workflow → the implementation plan (Current state,
     status, last completed step, next action).
   - Retrofit → the retrofit plan (the site table + status).
   - No durable file → synthesize the state from the session.
2. **Summarize current state**: what the task is, what's done, what's in flight, the branch and
   working-tree state, and the single concrete **next action**.
3. **Capture what's been tried and ruled out**, the suspected direction, and the relevant
   files/logs/metrics to check — by reference.
4. **Record verification**: the commands run, their outcomes, and checks still needed. If the
   underlying code changes after a check, mark that result stale.
5. **List suggested next skills/commands** the next session should invoke, and any blockers.
6. **Save the handoff** by the Rules and report its path.

## Resume protocol (for whoever picks it up)

Read the durable state file first (its `status` / Current State), then the handoff's next action and
what's been ruled out. Reconcile the recorded state as `shared/contracts/references/execution.md`
says before you rely on it. Continue from the next action without re-litigating eliminated paths.

The work is complete when the saved handoff contains each Steps item and you have reported its path.
