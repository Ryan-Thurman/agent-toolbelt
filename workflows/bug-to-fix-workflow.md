# Bug-to-fix workflow

The diagnostic lane: take a bug report and drive it to a verified fix. Use it instead of the
feature-implementation workflow when the entry point is **broken behavior**, not a new capability.
The `bug-to-fix` skill (`skills/bug-to-fix/SKILL.md`) owns the gates, escalation, and completion criteria.

## Steps

1. **`/bug-intake <report>`**: triage the report and seed the durable investigation file.
2. **`/reproduce`**: establish a manual or automated reproduction.
3. **`/rca`**: confirm the root cause. Use `--diagnose` for a read-only analysis.
4. **`/fix-plan`**: write the fix brief and the verification plan.
5. **`/dev-implement-task`** (when installed): implement the fix test-first.
6. **`/pr-review`** (or **`/dev-pr-review`**, when installed): review the change before the PR is ready.
7. **QA hand-off**: when the re-test is manual, give QA the manual re-test steps from the fix brief. Keep the
   investigation `status` at `awaiting_human_verify` until QA confirms the fix. Keep the automated
   regression test as an open follow-up when no harness exists.
8. **Close out**: set the investigation `status` to `resolved`, or to `resolved-unverified` when an end-to-end
   check cannot run here. Append the knowledge-base entry.

Run `/handoff` at any point to write a resumable summary.
