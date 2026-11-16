---
name: tech-debt-discovery
description: Find and prioritize technical debt across a repository using code, history, tests, dependencies, and operational evidence. Use for maintenance discovery; use tech-backlog-assessment to decide one supplied item.
---

# Technical debt discovery

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` when assessing candidate evidence.

Produce a bounded debt register.
Default to report-only. Write a requested register without editing code, installing tools, or creating external tickets.

## Procedure

1. Record repository revision, inspected paths, history period, existing debt records, and available operational evidence.
   State excluded or inaccessible areas.
2. Inspect code structure, tests, dependencies, build and deployment, operations, and documentation.
   Read `references/discovery-method.md` for candidate validation and prioritization.
   Use existing configured tools only within the task's authority and record whether they actually ran.
   A configured tool that no pipeline runs must either run within the task's authority, or it is recorded as `Not run`
   with its reason. Never report that scope as clean.
3. Validate candidates against callers, configuration, intended architecture, and existing tests.
   Record exact evidence, concrete consequence, confidence, and alternatives.
   Reject safe patterns and duplicate reports with a reason.
4. Rank urgency and expected benefit against cost, dependencies, confidence, and change risk.
   Keep unknown estimates explicit.
5. Update an existing suitable register or use `templates/tech-debt-register.md` when a durable output is requested.
   Preserve IDs and earlier decisions. Mark resolved or stale evidence explicitly.
   When the user names no path, write the register to `.atb-work/tech-debt-discovery/<scope-slug>.md` and print the path.
   Read `shared/contracts/references/execution.md#Durable report location`.
   Name `tech-backlog-assessment` as the next owner for selected items when available.
   Perform that separate assessment only when the user requests it.
   Hand a confirmed defect to `bug-to-fix`, and a confirmed vulnerability to `security-audit`, and record each hand-off in the register.

## Completion

Each retained item has an ID, evidence, consequence, confidence, priority rationale, owner or unassigned status, and measurable completion condition.
Report rejected look-alikes, deferred decisions, scope limits, and reassessment triggers.
No confirmed debt within the inspected scope is a valid result.
Discovery does not authorize repairs or dependency replacements.
