# Phase context workflow

Use the `phase-context-workflow` skill for this workflow.
The skill owns the file layout, the phase operations, and the rules for `/clear` and `/compact`.

```text
Plan the work
→ create phase
→ start phase
→ implement the phase
→ close phase
→ /clear or /compact
→ start phase for the next phase
→ repeat
→ PR readiness or phase-gate review
```

Each step names an operation of the skill. The forms that you type depend on how the Toolbelt is loaded.

| Operation | Plugin mode: name the operation to the skill | Installed commands |
| --- | --- | --- |
| Create a phase | `/agent-toolbelt:phase-context-workflow create phase <n> for room <room-slug>` | `/phase-create <room-slug> --phase <n> --title <title>` |
| Start a phase | `/agent-toolbelt:phase-context-workflow start phase <n> of room <room-slug>` | `/phase-start <room-slug> --phase <n>` |
| Close a phase | `/agent-toolbelt:phase-context-workflow close phase <n> of room <room-slug>` | `/phase-close <room-slug> --phase <n> [--tests <command-or-summary>]` |
| Show status | `/agent-toolbelt:phase-context-workflow show status of room <room-slug>` | `/phase-status <room-slug>` |

The plugin build has no slash commands for these operations.
The installed commands exist only after `./install.sh --harness <host> phase-context-workflow <project>`.

Phase files stay in `.acc/phases/<room-slug>/`, which is local session state. A project that tracks them uses `docs/agent-command-center/phases/` instead.

In Codex, invoke `$phase-context-workflow` and name the operation.
