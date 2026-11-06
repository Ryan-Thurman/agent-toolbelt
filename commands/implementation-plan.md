---
description: Plan a task or approved tickets with actions, reasons, and completion evidence
argument-hint: "<task-ticket-or-approved-plan>"
---

# /implementation-plan

Use `skills/phased-delivery/SKILL.md` to prepare the plan.
This command is a planning entry point for the shared delivery workflow.

**Arguments:** `$ARGUMENTS`

Reuse the supplied requirements, tickets, or approved plan.
For supplied tickets, preserve one ticket per phase and PR.
A small task can use one phase.

Show scope, affected owners and interfaces, dependencies, PR bases, and required checks.
Present each step as **Do / Why / Done when**.
Use `templates/phased-delivery-plan.md` only when no suitable plan exists.
Preserve the target project's supplied evidence and review requirements.

Complete the plan before implementation unless the user already approved its boundaries.
Follow the shared skill's existing approval and implementation rules.
