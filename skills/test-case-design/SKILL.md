---
name: test-case-design
description: Turn requirements and risks into prioritized, executable QA test cases without writing tests. Use before test implementation, QA handoff, or coverage planning.
---

# test-case-design

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Design an evidence-based test case set from requirements and risks. This skill reports cases;
it does not edit tests or production code. To find gaps in existing code, use `/cover-gaps`.

## Steps

1. Identify requirements, observable risks, interfaces, existing test conventions,
   and missing information. Do not invent customer behavior or system constraints.
2. Choose the least complex technique that exposes each risk:
   - Equivalence partitions and boundaries for input rules.
   - Decision tables for interacting conditions.
   - State transitions for lifecycle behavior.
3. Add positive and negative cases. Add retry, concurrency, idempotency, authorization,
   or abuse cases only when a real interface or failure mode supports them.
4. For a user-facing flow, add loading, empty, error, overflow, responsive, accessibility,
   console, and network states only when the interface makes them relevant.
   State the relevant UI state in the case.
5. Write each case in `templates/test-case-design.md`. Give each case an ID, requirement or risk,
   preconditions and data, steps, expected result, test level, automation candidate, and priority.
6. Set priority from impact and likelihood, not from an arbitrary numeric score.
   Record assumptions and uncovered risks. Do not invent expected behavior.
7. Hand selected cases to `/cover` for code-level tests or `/webapp-test` for browser checks.

## Completion

Deliver a traceable case set with explicit omissions and uncertainties. Stop before
writing tests unless the user separately invokes an authoring workflow.
