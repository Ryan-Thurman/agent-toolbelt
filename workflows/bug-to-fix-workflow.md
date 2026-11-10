# Bug-to-Fix Workflow

The diagnostic lane: take a bug report and drive it to a verified fix. Use it instead of the
feature-implementation workflow when the entry point is **broken behavior**, not a new capability.
The `bug-to-fix` skill (`skills/bug-to-fix/SKILL.md`) owns the gates, escalation, and completion criteria.

## Steps

1. **`/bug-intake <report>`** — triage the report and seed the durable investigation file.
2. **`/reproduce`** — establish a manual or automated reproduction.
3. **`/rca`** — confirm the root cause. Use `--diagnose` for a read-only analysis.
4. **`/fix-plan`** — write the fix brief and the verification plan.
5. **`/dev-implement-task`** — implement the fix test-first. `/implementation-plan` plans a larger fix first.
6. **`/pr-review`** (or **`/dev-pr-review`**) — review the change before the PR is ready.
7. **Close out** — set the investigation `status` to `resolved` and append the knowledge-base entry.

Run `/handoff` at any point to write a resumable summary.
