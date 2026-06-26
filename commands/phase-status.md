---
description: Show phase files and handoff state for a room or project
argument-hint: "<room-slug>"
---

# /phase-status

Summarize phase state for a room or project.

**Arguments:** `$ARGUMENTS`

## Rules

- Default to `.acc/phases/<room-slug>/`.
- Report phase files, handoff files, and the latest context packet.
- Prefer filesystem evidence over chat memory.
- Include the current git branch and status.
- Do not infer completion unless a handoff or explicit status says so.

## Steps

1. List phase files under `.acc/phases/<room>/`.
2. Match each `phase-NN.md` with `phase-NN-handoff.md` when present.
3. Read phase titles and status fields when available.
4. Capture `git status --short --branch`.
5. Print the next recommended action.

## Output

```text
ROOM: <room>

PHASE   TITLE                         STATUS
1       <title>                       handoff written
2       <title>                       current
3       <title>                       not started

Latest context packet:
  .acc/phases/<room>/context-packet.md

Recommended next action:
  /phase-start <room> --phase <n>
```

