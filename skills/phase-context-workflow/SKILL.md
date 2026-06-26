---
name: phase-context-workflow
description: Manage durable phase context for long coding-agent work. Use when planning, implementation, testing, review, and PR prep should be split into resumable phases with repo-tracked phase files, handoffs, context packets, and safe /clear or /compact boundaries.
---

# phase-context-workflow

Use this skill when a coding-agent task will span multiple phases or sessions
and the user wants important context preserved in files instead of chat history.

This skill is file-first. It does not require a daemon, TUI, or full agent
orchestration system. A future `acc phase ...` CLI can automate the same
operations, but the workflow must be useful today with normal file edits and git
commands.

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

```text
Plan
-> /phase-create
-> /phase-start
-> implement and validate
-> /phase-close
-> /clear or /compact
-> next /phase-start
```

## Phase Start Rules

Before implementation in a fresh or reset session:

1. Read the durable plan or brief if one exists.
2. Read `.acc/phases/<room>/phase-NN.md`.
3. Read `.acc/phases/<room>/phase-(NN-1)-handoff.md` when present.
4. Capture `git status --short --branch`.
5. Capture changed files or `git diff --stat` when useful.
6. Write `.acc/phases/<room>/context-packet.md`.
7. Treat the context packet as the session source of truth.

Do not start implementation from memory when the phase files are available.

## Phase Close Rules

Before ending a phase or clearing context:

1. Write `.acc/phases/<room>/phase-NN-handoff.md`.
2. Include completed work, decisions, files changed, validation, known issues,
   risks, and next-session context.
3. Mark `Safe To Clear` as `Yes` only when all important context is durable.
4. Mark `Safe To Clear` as `No` when important details still need to be written
   down, and list exactly what is missing.

## `/clear` vs `/compact`

Use `/clear` only after a handoff or context packet captures what the next
session needs.

Use `/compact` when the phase is still ongoing and the agent needs summarized
continuity.

If a reset is needed mid-phase, first write a short recovery note in the current
phase file or context packet.

## Subagent Guidance

Main agent owns the phase. Subagents are useful for bounded, noisy work:

- diff review
- test failure summarization
- module inspection
- security or performance checks
- log analysis
- acceptance-criteria comparison

Avoid subagents for tightly coupled edits, every small implementation task, or
coordination-heavy work.

## Relationship To Other Skills

- Use `handoff` for compact cross-lane handoffs. This skill uses a structured,
  repo-tracked handoff for repeated phase boundaries.
- Use `dev-lite-workflow` for feature/app delivery. This skill can wrap
  dev-lite phases when context reset safety matters.
- Use `phase-gate` after opening a phase PR when the phase needs a fresh
  review subagent and PR comments.
