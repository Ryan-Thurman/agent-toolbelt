---
name: phase-context-workflow
description: Keep phase files, context packets, and phase handoffs so long coding-agent work survives /clear or /compact. Use when the user asks for phase files or a context packet, or when `.acc/phases/` already exists.
---

# phase-context-workflow

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Use this skill to keep the context of a multi-session task in files, not in chat history.
Resume from phase files, the git diff, and acceptance criteria, not from memory.
The workflow needs only normal file edits and git commands.

## Files

```text
.acc/phases/<room-slug>/
  phase-NN.md           from ../../templates/phase-file.md
  phase-NN-handoff.md   from ../../templates/phase-handoff.md
  context-packet.md     from ../../templates/context-packet.md
```

`.acc/` holds local session state by default.
Recommend that the project adds `.acc/` to `.gitignore`.
When the project wants to track phase files, use `docs/agent-command-center/phases/` and commit them.

## Operations

| Operation | Do | Done when |
| --- | --- | --- |
| Create a phase | Create or update `phase-NN.md`. Keep useful existing content. Fill missing goal, scope, acceptance criteria, relevant files, status, and notes. Link the source plan, ticket, or PRD by path or URL. | The phase file exists and names its source. |
| Start a phase | Read the durable plan, `phase-NN.md`, and `phase-(NN-1)-handoff.md` when present. Capture `git status --short --branch` and a changed-file summary. Write `context-packet.md`. | The packet exists and is compact enough to paste into a fresh session. |
| Close a phase | Write `phase-NN-handoff.md` with the `handoff` skill rules. Include completed work, decisions, changed files, checks and known failures, open issues, and risks. Set `Safe To Clear`. | The handoff exists. `Safe To Clear` is `Yes`, or `No` with the missing items listed. |
| Show status | List phase files, handoffs, and the latest packet. Match each phase to its handoff. Report the current branch and git status. | Each phase shows `handoff written`, `current`, or `not started`, and the next action is named. |

After each operation, report the written path and the next command.
Report a phase as complete only when a handoff or an explicit status field says so.

When you start a phase, reconcile the packet with current source revisions, worktree content, and caller state before you reuse evidence.
Keep attempt counts, unresolved operation outcomes, and the owner of each next action.
A reset does not grant new authority or renew an exhausted repair limit.

## Clear or compact

- Use `/clear` only after a handoff or context packet holds what the next session needs.
- Use `/compact` while the phase continues and a summary of the session is still useful.
- Before a reset in the middle of a phase, write a short recovery note in the phase file or packet.
- Set `Safe To Clear` to `Yes` only when all important context is in files.

## Subagents

The main agent owns the phase.
Use subagents only for bounded, noisy work, such as diff review, test-failure summaries, module inspection, or log analysis.
Keep tightly coupled edits in the main agent.

## Related contracts and skills

- For a caller-managed assignment, keep the `shared/contracts/references/execution.md` fields in the context packet.
- When a session resumes after failed attempts, read `shared/contracts/references/failure-recovery.md` before another attempt.
- When this skill wraps `phased-delivery`, keep the delivery plan as the source of truth. The context packet links to the plan and holds only session state.
- Use `phase-gate` after a phase PR opens when the phase needs a fresh review subagent and PR comments.
