---
description: Choose the smallest installed workflow for the current task
argument-hint: "<goal-or-current-state>"
---

# /workflow-router

Read the target repository's instructions and the user's requested outcome.
Choose from workflows that are actually installed.

**Arguments:** `$ARGUMENTS`

| Task | Shared owner |
| --- | --- |
| Synthesize customer research | `user-research-synthesis` |
| Select an opportunity or experiment | `product-discovery` |
| Assess customer outcomes after an experiment or release | `product-outcome-review` |
| Discover maintenance work across a repository | `tech-debt-discovery` |
| Document architecture and review attack paths | `system-design`, then `threat-model` |
| Compare an ask with current behavior, or clarify scope | `shape-up` |
| Review a plan, or deliver approved requirements or tickets | `phased-delivery` |
| Reproduce and repair a defect | `bug-to-fix` |
| Assess a technical investment or dependency | `tech-backlog-assessment` |
| Find an existing precedent for a narrow ticket | `ticket-discovery` |
| Design cases, write tests, or verify a browser flow | `test-case-design`, `cover`, or `webapp-testing` |
| Review a change or address findings | `pr-review`, `pr-improve`, or `pr-review-reply` |
| Prepare a release or a resumable handoff | `ship-it` or `handoff` |

A clear small change can proceed directly with relevant checks.
Use a phase plan when coordinated PR boundaries help the task.
Use project-owned workflows when the project's requirements call for them.
The project owns its forms, approval gates, and release records.
Nearby documents or an installed skill do not select a project lifecycle.

Give the next one to three actions with a reason for each.
Name missing capabilities instead of recommending absent commands.
Resolve repository facts before asking the user for a decision.
