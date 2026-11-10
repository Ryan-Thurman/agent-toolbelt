---
name: tech-debt-discovery
description: Find and prioritize technical debt across a repository using code, history, tests, dependencies, and operational evidence. Use for maintenance discovery; use tech-backlog-assessment to decide one supplied item.
---

# Technical debt discovery

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.
Read `shared/contracts/references/evidence-quality.md` when assessing candidate evidence.

Produce a bounded debt register.
Default to report-only; write a requested register without editing code, installing tools, or creating external tickets.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root.

## Procedure

1. Record repository revision, inspected paths, history period, existing debt records, and available operational evidence.
   State excluded or inaccessible areas.
2. Inspect code structure, tests, dependencies, build and deployment, operations, and documentation.
   Read `references/discovery-method.md` for candidate validation and prioritization.
   Use existing configured tools only within the task's authority and record whether they actually ran.
3. Validate candidates against callers, configuration, intended architecture, and existing tests.
   Record exact evidence, concrete consequence, confidence, and alternatives.
   Reject safe patterns and duplicate reports with a reason.
4. Rank urgency and expected benefit against cost, dependencies, confidence, and change risk.
   Keep unknown estimates explicit.
5. Update an existing suitable register or use `templates/tech-debt-register.md` when a durable output is requested.
   Preserve IDs and earlier decisions; mark resolved or stale evidence explicitly.
   Name `tech-backlog-assessment` as the next owner for selected items when available.
   Perform that separate assessment only when the user requests it.

## Completion

Each retained item has an ID, evidence, consequence, confidence, priority rationale, owner or unassigned status, and measurable completion condition.
Report rejected look-alikes, deferred decisions, scope limits, and reassessment triggers.
No confirmed debt within the inspected scope is a valid result.
Discovery does not authorize repairs or dependency replacements.
