---
name: phase-context-workflow
description: Manage durable phase context for long coding-agent work. Use when planning, implementation, testing, review, and PR prep should be split into resumable phases with repo-tracked phase files, handoffs, context packets, and safe /clear or /compact boundaries.
---

# phase-context-workflow

Use this skill when a coding-agent task will span multiple phases or sessions
and the user wants important context preserved in files instead of chat history.

This skill is file-first. It does not require a daemon, TUI, or full agent
orchestration system; the workflow must be useful with normal file edits and
git commands.

## Core Principle

Agent chat history is disposable. Durable project context lives in files.

The agent should not depend on a massive prior conversation. It should resume
from project files, the current git diff, acceptance criteria, phase files,
handoffs, and context packets.

## Durable Files

Default location:

```text
.acc/phases/<room-slug>/
  phase-01.md
  phase-01-handoff.md
  phase-02.md
  phase-02-handoff.md
  context-packet.md
```

Use `docs/agent-command-center/phases/` only when the user explicitly wants
project-visible planning docs instead of local command-center metadata.

## Commands

The portable command prompts live in `../../commands/`:

- `/handoff` supplies the handoff-writing discipline used by phase close.
- `/phase-create` creates or updates a phase file.
- `/phase-start` creates or updates a context packet.
- `/phase-close` writes a phase handoff.
- `/phase-status` summarizes phase state for a room.

In Codex, invoke this skill directly instead:

```text
$phase-context-workflow
Create a context packet for room fix-auth-bug phase 2.
```

Use templates in `../../templates/`:

- `phase-file.md`
- `phase-handoff.md`
- `context-packet.md`

## Always Preserve

- Room or project slug
- Phase number and title
- Goal and scope
- Acceptance criteria
- Relevant files
- Current branch and worktree
- Current git status
- Changed files summary
- Tests and checks run
- Decisions made
- Open issues, risks, and blockers
- Previous phase handoff
- Concrete next action
- Whether it is safe to clear context

## Phase Lifecycle

Read `references/lifecycle.md` before starting or closing a phase, clearing or
compacting context, or delegating phase work to subagents. The top-level rule is
simple: do not start from memory when phase files are available, and do not clear
context until the next session has durable state.

## Relationship To Other Skills

- Use `handoff` for the handoff-writing rules: reference durable artifacts, lead
  with the next action, capture ruled-out paths, redact secrets, and keep the
  summary compact. This skill adds the repeated phase lifecycle and repo-tracked
  `.acc/phases/<room>/phase-NN-handoff.md` destination.
- Use `dev-lite-workflow` for feature/app delivery. This skill can wrap
  dev-lite phases when context reset safety matters.
- Use `phase-gate` after opening a phase PR when the phase needs a fresh
  review subagent and PR comments.

## References

- `references/lifecycle.md` — phase start, phase close, `/clear` vs `/compact`,
  and subagent guidance.
