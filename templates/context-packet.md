# Context Packet - <Room> Phase <N>

## Instructions

You are starting fresh or after a context clear.

Use this document as the source of truth. Do not rely on previous chat history.

## Room

- Room: `<room-slug>`
- Task: `<task-name>`
- Repo: `<repo-root>`
- Branch:
- Worktree:
- tmux session:

## Current Phase

Source:

```text
.acc/phases/<room>/phase-NN.md
```

Summary:

- Goal:
- Scope:
- Acceptance criteria:

## Previous Handoff

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

## Current Git State

```text
<git status --short --branch>
```

## Changed Files Summary

```text
<git diff --stat or equivalent>
```

## Relevant Files

- `path/to/file` - why it matters

## Relevant Commands

```bash
<test or validation command>
```

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Known Risks / Open Questions

- Risk or question 1

## Next Action

The first concrete action for the next session.
