# Execution Support

Load this reference only when a Dev Lite run needs temporary scratch artifacts,
a recovery ledger, or delegated subagent execution.

## Scratch and Ledger Convention

For temporary task briefs, implementer reports, review packages, and progress
ledgers, use a repo-local scratch workspace instead of `.git/`:

```sh
mkdir -p .atb-work/dev-lite
printf '*\n' > .atb-work/dev-lite/.gitignore
```

Use `.atb-work/dev-lite/progress.md` as an optional recovery ledger for
subagent-style execution. Record one compact line per completed task with the
task name, commit range or changed files, checks run, and review result.

The Implementation Plan remains the durable tracked source of truth; the ledger
is only a local recovery aid after context loss.

Before committing, run `git status --short`. If `.atb-work/` appears, stop and
fix the scratch location or ignore before continuing.

## Optional Subagent Dispatch

Dev Lite must work without multi-agent tooling. Run tasks sequentially in the
current session by default.

When the current environment supports subagents and the user has explicitly
asked for delegation, parallel agents, or a subagent-driven run, delegate only
bounded work with clear ownership:

- Use one task brief per delegated task.
- Name the files or module boundaries the subagent owns.
- Tell the subagent it is not alone in the codebase and must preserve unrelated
  edits.
- Ask for a short return message: status, changed files or commits, checks run,
  and blockers or concerns. Longer evidence belongs in the report file.
- Do not delegate the immediate critical-path task if the next local step is
  blocked on its result; do that work locally.

Model selection should be explicit only when the tool supports it and there is
a task-specific reason:

- Mechanical single-file or copy-editing tasks: fastest/cheapest capable model.
- Normal implementation or integration tasks: default/current coding model.
- Architecture, security, cross-cutting correctness, or final review: strongest
  appropriate available model.

If no subagent tool or model override is available, record the intended split
only as guidance and continue sequentially.
