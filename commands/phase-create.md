---
description: Create or update a durable phase file for a room or project
argument-hint: "<room-slug> --phase <n> --title <title>"
---

# /phase-create

Create or update a phase file for a bounded unit of implementation work.

**Arguments:** `$ARGUMENTS`

## Rules

- Default to `.acc/phases/<room-slug>/phase-NN.md`.
- Use `docs/agent-command-center/phases/` only when the user asks for public
  project docs instead of command-center metadata.
- Preserve existing phase content when updating. Fill missing sections rather
  than replacing useful details.
- Include goal, scope, acceptance criteria, relevant files, status, and notes.
- If the phase is derived from a feature brief, implementation plan, issue, or
  PRD, reference that artifact by path or URL.

## Steps

1. Parse the room slug, phase number, and title from the request.
2. Create the phase directory if needed.
3. Create or update `phase-NN.md` using `templates/phase-file.md`.
4. Capture any known acceptance criteria and risks.
5. Report the path written and the next recommended command.

## Output

```text
Phase file written:
  .acc/phases/<room>/phase-NN.md

Recommended next step:
  /phase-start <room> --phase <n>
```
