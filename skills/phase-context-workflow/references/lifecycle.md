# Phase Lifecycle

Use this reference when starting, closing, resetting, or delegating work inside
a phase-context workflow.

## Lifecycle

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

`/phase-close` composes the `handoff` skill. Use the same handoff discipline,
but save the result inside the tracked phase directory because this project
explicitly tracks phase handoffs.

Before ending a phase or clearing context:

1. Write `.acc/phases/<room>/phase-NN-handoff.md`.
2. Include completed work, decisions, files changed, validation, known issues,
   risks, and next-session context.
3. Lead with the next concrete action and capture what has been ruled out.
4. Reference durable artifacts instead of duplicating whole documents.
5. Redact secrets, tokens, credentials, and sensitive personal data.
6. Mark `Safe To Clear` as `Yes` only when all important context is durable.
7. Mark `Safe To Clear` as `No` when important details still need to be written
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
