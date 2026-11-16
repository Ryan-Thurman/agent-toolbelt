---
name: phase-context-workflow
description: Keep phase files, context packets, and phase handoffs so long coding-agent work survives /clear or /compact. Use when the user asks for phase files or a context packet, or when `.acc/phases/` already exists.
---

# phase-context-workflow

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Use this skill to keep the context of a multi-session task in files, not in chat history.
Resume from phase files, the git diff, and acceptance criteria, not from memory.
The workflow needs only normal file edits and git commands.

## Files

```text
.acc/phases/<room-slug>/
  phase-NN.md           from templates/phase-file.md
  phase-NN-handoff.md   from templates/phase-handoff.md
  context-packet.md     from templates/context-packet.md
```

A room is the folder name of one task, such as `checkout-redesign`.

`.acc/` holds local session state by default.
Recommend that the project adds `.acc/` to `.gitignore`.
When the project wants to track phase files, use `docs/agent-command-center/phases/` and commit them.

The `Status` field in `phase-NN.md` has four values:

| Status | Meaning |
| --- | --- |
| `planned` | The phase file exists. Start has not run. |
| `in progress` | Start ran. The phase is not complete. |
| `paused` | Close ran before the acceptance criteria were met. The handoff lists what remains. |
| `done` | The acceptance criteria are met, and the handoff says so. |

## Operations

| Operation | Do | Done when |
| --- | --- | --- |
| Create a phase | Create or update `phase-NN.md`. Keep useful existing content. Fill missing goal, scope, acceptance criteria, relevant files, status, and notes. Link the source plan, ticket, or PRD by path or URL. | The phase file exists and names its source. |
| Start a phase | Read the durable plan, `phase-NN.md`, `phase-NN-handoff.md` when present (a resume in the middle of the phase), and `phase-(NN-1)-handoff.md` when present. If `Base` in `phase-NN.md` is empty, set it to the current `HEAD` commit. Set `Status` to `in progress`. Capture `git status --short --branch` and a changed-file summary with `git diff --stat <Base>`. Write `context-packet.md`. | The packet exists and is compact enough to paste into a fresh session. `Base` names the commit where the phase started. |
| Close a phase | Write `phase-NN-handoff.md` with the `handoff` skill rules. Include completed work, decisions, changed files from `git diff --stat <Base>` (this covers earlier commits and uncommitted edits), checks and known failures, open issues, and risks. When `--tests <command-or-summary>` is given, record that command or summary in the handoff Validation section. Set `Safe to clear`. Set `Status` to `done` when the acceptance criteria are met, or to `paused` when the phase closes before it is complete. Set `Completed` only for `done`, and set `Handoff`. | The handoff exists. `Safe to clear` is `Yes`, or `No` with the missing items listed. `Status` is `done` or `paused`. |
| Show status | List phase files, handoffs, and the latest packet. Match each phase to its handoff. Report the current branch and git status. | Each phase shows `handoff written`, `current`, or `not started`, and the next action is named. |

After each operation, report the written path and the next command.
Report a phase as complete only when a handoff or an explicit status field says so.

When you start a phase, reconcile the packet as `shared/contracts/references/execution.md` says.
Keep attempt counts, unresolved operation outcomes, and the owner of each next action.

## Clear or compact

- Use `/clear` only after a handoff or context packet holds what the next session needs.
- Use `/compact` while the phase continues and a summary of the session is still useful.
- Before a reset in the middle of a phase, write a short recovery note in the phase file or packet.
- Set `Safe to clear` to `Yes` only when all important context is in files.

## Related contracts and skills

- For a caller-managed assignment, keep the `shared/contracts/references/execution.md` fields in the context packet.
- When a session resumes after failed attempts, read `shared/contracts/references/failure-recovery.md` before another attempt.
- When this skill wraps `phased-delivery`, keep the delivery plan as the source of truth. The context packet links to the plan and holds only session state.
- Use `phase-gate` after a phase PR opens when the phase needs a fresh review subagent and PR comments.
