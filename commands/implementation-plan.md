---
description: Create a concise implementation plan for a task or feature ticket
argument-hint: "<ticket-or-task-context>"
---

# /implementation-plan

Create a concise implementation plan for the selected ticket or task.

**Arguments:** `$ARGUMENTS`

Required output:
1. Summary of the change
2. Files/repos likely impacted
3. Step-by-step implementation plan
4. Test-first plan: what failing or missing test should prove the behavior
5. Verification commands to run before PR
6. Branch plan: current branch, whether a feature/fix branch is needed, and the
   expected PR target branch
7. Current state: status, current task, last completed step, next step, and
   resume instructions
8. Activity log entry for plan creation or update
9. Risks
10. Questions/blockers

Feature delivery awareness:
- If feature metadata exists, include feature ID, target release, related SDD
  section, doc delta required yes/no/unknown, QA evidence needed, and PR
  traceability notes.
- If doc delta is unknown, flag it before implementation.
- If behavior changes but no test can be written, document the reason and the
  manual or browser verification that will replace it.
- Stop after producing the plan. Do not start implementation, file edits, or
  branch pushes until the user approves the plan or explicitly asks to continue.
- Do not plan direct pushes to `main`, `master`, or the repository default
  branch unless the user explicitly asks for that exact behavior.
- Keep the plan document current throughout execution. Every later dev command
  should update current state, task status, evidence, checks, blockers, branch
  or PR state, next step, and resume instructions.
