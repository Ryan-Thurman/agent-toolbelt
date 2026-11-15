# Context packet - <room> phase <N>

## Instructions

You are starting fresh or after a context clear.

Start from this packet. The linked plan and phase file stay the source of truth. Do not rely on previous chat history.

## Room

- Room: `<room-slug>`
- Task: `<task-name>`
- Repo: `<repo-root>`
- Branch:
- Worktree:

## Current phase

Source:

```text
.acc/phases/<room>/phase-NN.md
```

Summary:

- Goal:
- Scope:
- Acceptance criteria:

## Previous handoff

Source:

```text
.acc/phases/<room>/phase-(NN-1)-handoff.md
```

Summary:

- Completed:
- Decisions:
- Open issues:
- Risks:

If this is phase 1, say there is no previous handoff.

## Current git state

```text
<git status --short --branch>
```

## Changed files summary

```text
<git diff --stat or equivalent>
```

## Relevant files

- `path/to/file` - why it matters

## Relevant commands

```bash
<test or validation command>
```

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Known risks / open questions

- Risk or question 1

## Next action

The first concrete action for the next session.

For managed work, record the task and run IDs, source revisions, allowed scope, and caller-owned actions.
Keep required checks, attempt history, unresolved operation outcomes, and the next action's owner with the live state.
Use the optional execution record only when the caller supports it.
