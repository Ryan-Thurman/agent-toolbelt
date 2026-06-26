---
description: Create a context packet for starting or resuming a phase from durable files
argument-hint: "<room-slug> --phase <n>"
---

# /phase-start

Create or update a context packet for a fresh agent session at the start of a
phase.

**Arguments:** `$ARGUMENTS`

## Rules

- Treat durable files and current repo state as the source of truth.
- Do not rely on previous chat history.
- Load the current phase file and previous handoff when available.
- Capture current git state with `git status --short --branch`.
- Include branch/worktree details and changed-file summary when available.
- Write `.acc/phases/<room>/context-packet.md`.
- Keep the packet compact enough to paste into a fresh session.

## Steps

1. Locate `.acc/phases/<room>/phase-NN.md`.
2. Locate `.acc/phases/<room>/phase-(NN-1)-handoff.md` if `NN > 1`.
3. Capture git branch/status and useful diff summary.
4. Include relevant plan, brief, or issue references if known.
5. Write `context-packet.md` from `templates/context-packet.md`.
6. Print reset guidance.

## Output

```text
Context packet written:
  .acc/phases/<room>/context-packet.md

Recommended next step:
  Open a fresh agent session or use /clear, then provide this context packet.
```
