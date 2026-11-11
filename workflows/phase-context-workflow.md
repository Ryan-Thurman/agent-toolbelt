# Phase Context Workflow

Use the `phase-context-workflow` skill for this workflow.
The skill owns the file layout, the phase operations, and the rules for `/clear` and `/compact`.

```text
Plan the work
→ /phase-create
→ /phase-start
→ implement the phase
→ /phase-close
→ /clear or /compact
→ /phase-start for the next phase
→ repeat
→ PR readiness or phase-gate review
```

In Codex, invoke `$phase-context-workflow` and name the operation.
