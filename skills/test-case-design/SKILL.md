---
name: test-case-design
description: Turn requirements and risks into prioritized, executable QA test cases without writing tests. Use before test implementation, QA handoff, or coverage planning.
---

# test-case-design

Design an evidence-based test case set. This skill reports cases; it does not edit
tests or production code.

## Steps

1. Identify requirements, observable risks, interfaces, existing test conventions,
   and missing information. Do not invent customer behavior or system constraints.
2. Read `references/case-design.md`, choose techniques proportionate to the risk,
   and build cases using `templates/test-case-design.md`.
3. Include positive, negative, boundary/equivalence, decision-table or state-
   transition cases when applicable; assess retry, concurrency, idempotency,
   permissions, and abuse cases where relevant.
4. For user-facing flows, assess loading, empty, error, overflow, responsive,
   accessibility, console, and network states when the interface makes them relevant.
5. Prioritize cases by impact and likelihood, name the most suitable test level and
   automation candidate, and hand selected cases to `/cover` or `/webapp-test`.

## Completion

Deliver a traceable case set with explicit omissions and uncertainties. Stop before
writing tests unless the user separately invokes an authoring workflow.
