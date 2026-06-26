---
description: Close a phase by writing a durable handoff before clearing or compacting context
argument-hint: "<room-slug> --phase <n> [--tests <command-or-summary>]"
---

# /phase-close

Write a durable handoff for a completed or paused phase.

**Arguments:** `$ARGUMENTS`

## Handoff Composition

This command uses the `handoff` skill's discipline:

- Reference durable artifacts instead of copying whole documents.
- Lead with the next concrete action.
- Capture what has been tried and ruled out.
- Redact secrets, tokens, credentials, and sensitive personal data.
- Keep the handoff compact.

Unlike the generic `/handoff` command, this workflow intentionally saves inside
the repo because phase handoffs are tracked project context.

## Rules

- Default to `.acc/phases/<room-slug>/phase-NN-handoff.md`.
- Reference existing durable artifacts instead of copying whole documents.
- Lead with the next concrete action for the next phase or session.
- Capture dead ends or ruled-out approaches so the next session does not repeat
  them.
- Include what changed, why it changed, validation evidence, open issues, risks,
  and next-session context.
- Redact secrets, tokens, credentials, and sensitive personal data.
- Capture `git status --short --branch`.
- Capture changed files with `git diff --stat` or equivalent when useful.
- Mark `Safe To Clear` as `Yes` only when all important context has been written
  to durable files.
- Mark `Safe To Clear` as `No` when more context must be captured.

## Steps

1. Read the current phase file.
2. Capture current git status and changed files.
3. Capture recent commits if relevant.
4. Record tests and checks run, including known failures.
5. Write `phase-NN-handoff.md` from `templates/phase-handoff.md`.
6. Print whether it is safe to clear or compact context.

## Output

```text
Phase handoff written:
  .acc/phases/<room>/phase-NN-handoff.md

Safe to clear:
  Yes / No
```
