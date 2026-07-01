---
name: ticket-discovery
description: Investigate a narrow implementation ticket that references an existing precedent, compare source and target areas, produce a gap analysis, test plan, and implementation handoff without editing code.
---

# ticket-discovery

Use this skill when a ticket is probably valid but under-specified, especially
when it says another area already has the pattern to follow.

## Mutation Policy

Default: report-only.
Edit files only when the user explicitly asks to continue after reviewing the
brief.
Do not change code or tests during discovery.

Example:

```text
Add e2e tests to HCP API. PWD already has them.
```

## Workflow

```text
Ticket
↓
Find the precedent
↓
Compare target vs precedent
↓
Decide adaptation strategy
↓
Define test coverage and verification
↓
Hand off to implementation planning
```

## Rules

- Find the precedent first. If the named source cannot be found, stop and report
  that uncertainty instead of inventing the pattern.
- Compare source and target directly: setup, fixtures, auth, environment,
  commands, CI hooks, test data, naming, and failure modes.
- Keep the output concrete enough for a developer or agent to turn into an
  implementation plan.
- Prefer exact file paths, commands, and scenarios from the repo.
- If the ticket turns into a broader "should we do this?" decision, hand off to
  `tech-backlog-assessment`.

## Output

Use `templates/ticket-discovery-brief.md` when creating a durable artifact.
Always include:

- Ticket summary.
- Referenced precedent and the files/commands that prove it.
- Target current state.
- Source-vs-target gap analysis.
- Recommended adaptation approach.
- Specific test coverage to add or strengthen.
- Verification commands.
- Risks, unknowns, and next workflow.
