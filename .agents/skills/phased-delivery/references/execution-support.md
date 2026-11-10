# Execution Support

Load this reference only when a Phased Delivery run needs temporary scratch artifacts,
a recovery ledger, or delegated subagent execution.

## Scratch and Ledger Convention

For temporary task briefs, implementer reports, review packages, and progress
ledgers, use one repo-local scratch workspace per Implementation Plan instead of
`.git/` or one shared delivery directory:

```sh
mkdir -p .atb-work/phased-delivery/<plan-slug>
printf '*\n' > .atb-work/phased-delivery/.gitignore
```

Derive a stable `<plan-slug>` from the plan path.
Never reuse or clean a sibling plan's workspace.

Use `.atb-work/phased-delivery/<plan-slug>/progress.md` as an optional recovery ledger
for delegated execution. Start it with the plan path, then record one compact
line per completed task with the task name, commit range or changed files,
checks run, and review result.

The source plan or small execution record remains the durable source of truth; the ledger
is only a local recovery aid after context loss.

Before committing, run `git status --short`. If `.atb-work/` appears, stop and
fix the scratch location or ignore before continuing.

When the plan is finished and its PR handoffs are complete, remove only that
plan's scratch directory.

## Optional Subagent Dispatch

Phased Delivery must work without multi-agent tooling. Run tasks sequentially in the
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

Select a model explicitly only when the tool supports it and the task needs it.
Use the strongest available model for architecture, security, and final review.

If no subagent tool is available, record the intended split as guidance and continue sequentially.
