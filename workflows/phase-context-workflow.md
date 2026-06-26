# Phase Context Workflow

Use this workflow when a coding-agent task is expected to span multiple
planning, implementation, test, review, or PR-prep sessions and you want each
phase to be resumable after `/clear` or `/compact`.

This workflow is intentionally lighter than multi-agent orchestration. It starts
with repo-tracked files and prompt commands. A future `acc phase ...` CLI can
automate the same file operations.

## Core Rule

Agent chat history is disposable. Durable project context lives in files.

Before clearing context, write the context the next session needs into the repo.
The next agent should be able to resume from:

- project instructions, such as `AGENTS.md`
- the durable plan or brief
- `.acc/phases/<room>/phase-NN.md`
- `.acc/phases/<room>/phase-NN-handoff.md`
- `.acc/phases/<room>/context-packet.md`
- current git status and diff
- acceptance criteria and validation notes

## Default File Layout

Use `.acc/` for command-center metadata:

```text
.acc/
  phases/
    <room-slug>/
      phase-01.md
      phase-01-handoff.md
      phase-02.md
      phase-02-handoff.md
      context-packet.md
```

If a project wants public planning docs instead, use:

```text
docs/
  agent-command-center/
    plan.md
    phases/
      phase-01.md
      phase-01-handoff.md
      context-packet.md
```

Prefer `.acc/phases/<room>/` for V0 because these files describe local
command-center state rather than product documentation.

## Workflow Summary

```text
Plan the work
-> /phase-create
-> /phase-start
-> implement the phase
-> /phase-close
-> clear or compact context
-> /phase-start for the next phase
-> repeat
-> PR readiness or phase-gate review
```

## Commands

Use these commands in Cursor or Claude Code when installed, or invoke the
`phase-context-workflow` skill in Codex and ask for the same action.

- `/phase-create` creates or updates a phase file.
- `/phase-start` writes a context packet for a fresh session.
- `/phase-close` writes a durable phase handoff.
- `/phase-status` summarizes phase state for a room.

These commands are prompt-driven. They write files from templates and use normal
repo commands such as `git status`, `git diff --stat`, and `git log` for
evidence.

## Phase Start

At the beginning of a phase:

1. Read the durable plan or brief.
2. Read the current phase file.
3. Read the previous handoff if one exists.
4. Capture git branch, worktree, status, and changed-file summary.
5. Write `context-packet.md`.
6. Start a fresh agent session or run `/clear` only after the packet exists.

## Phase Close

At the end of a phase:

1. Capture what was completed.
2. Record decisions and changed files.
3. Record tests and checks run.
4. List open issues and risks.
5. Write the next-session context.
6. Mark whether it is safe to clear context.

If important knowledge is still only in chat, the handoff must say "Safe To
Clear: No" and identify what still needs to be captured.

## `/clear` vs `/compact`

Use `/clear` when:

- the phase is complete
- the handoff file has been written
- important decisions are captured in files
- the next task can start from durable context
- stale conversation history is more harmful than useful

Use `/compact` when:

- the current phase is still ongoing
- the agent needs continuity
- there is too much chat history
- a summarized form of the current session is still useful

Do not clear randomly mid-phase unless the agent first writes a useful recovery
note.

## Subagents

The main agent owns the phase. Use subagents only for bounded noisy work:

- reviewing a diff
- running tests and summarizing failures
- inspecting a module and returning relevant files
- checking security, performance, or acceptance-criteria risks
- analyzing logs

Do not use subagents for every small implementation task or for tightly coupled
edits that require constant coordination.

## Relationship To Other Toolbelt Lanes

- `handoff` is cross-cutting and compact. This workflow is a structured,
  repo-tracked version for repeated phase boundaries.
- `dev-lite-workflow` owns feature/app implementation. This workflow can wrap
  dev-lite phases when context reset safety matters.
- `phase-gate` owns PR review at phase boundaries. Run it after a phase PR is
  open; it does not replace the phase handoff.
