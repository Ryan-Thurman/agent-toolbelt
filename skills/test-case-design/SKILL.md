---
name: test-case-design
description: Turn requirements, risks, or a code change into prioritized, executable QA test cases without writing tests. Use before test implementation, QA handoff, case planning, or to plan focused tests for a pull request. Use cover to write tests or find coverage gaps in code.
---

# test-case-design

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Design an evidence-based test case set from requirements, risks, or a code change. This skill reports cases.
It does not edit tests or production code. To rank untested behavior in code as it is, with no requirement source, use the `cover` skill gap scan (`/cover-gaps`).

## Steps

1. Identify requirements, observable risks, interfaces, existing test conventions,
   and missing information. Do not invent customer behavior or system constraints.
   When the input is a pull request, a branch, a commit range, or a diff, use change mode:
   follow `references/change-risk-planning.md` and fill "Change scope" in the template.
2. Choose the least complex technique that exposes each risk:
   - Equivalence partitions and boundaries for input rules.
   - Decision tables for interacting conditions.
   - State transitions for lifecycle behavior.
3. Add positive and negative cases. Read `shared/contracts/references/negative-testing.md`.
   Record each family as covered, `Not applicable` with a reason, or a gap.
   When the scope has a remote call, a queue, a scheduled job, a cache, a data store, or a migration, read
   `references/system-failure-cases.md`. Use the R2 to R5 answers of
   `shared/contracts/references/reliability-checklist.md` as input when they exist.
   Accept failure-scenario cards (`FS-` IDs) from `failure-scenario-design` as input.
4. For a user-facing flow, add loading, empty, error, overflow, responsive, accessibility,
   console, and network states only when the interface makes them relevant.
   State the relevant UI state in the case.
5. Choose the test level of each case with `shared/contracts/references/test-levels.md`.
   Write each case in `templates/test-case-design.md`. Give each case an ID, requirement or risk,
   preconditions and data, steps, expected result, test level, automation candidate, and priority.
6. Set priority from impact and likelihood, not from an arbitrary numeric score.
   Use `High` when impact and likelihood are both high, `Medium` when one is high, and `Low` when neither is.
   A case in a declared risk area has high impact. Read `shared/contracts/references/risk-areas.md`.
   A draft from `risk-area-mapping` is not declared. Use a draft entry only when the user says so,
   and record it as an assumption.
   Record assumptions and uncovered risks. Do not invent expected behavior.
   Write the expected result as observable behavior. Give exact text only when the text is the contract,
   such as a protocol message, generated file, command output, or user-visible copy.
7. When the set will have more than ten cases and a person can answer, calibrate first.
   Show the five to ten cases with the highest priority and stop. Ask about domain terms, test level,
   priority, and case size. Apply the answers to all remaining cases. When no person can answer,
   write the full set and record each calibration point as an assumption.
8. Hand selected cases to `cover` (`/cover`) for code-level tests or `webapp-testing` (`/webapp-test`) for browser checks.

## Completion

Deliver a traceable case set with explicit omissions and uncertainties. Stop before
writing tests unless the user separately invokes an authoring workflow.
Save the report in the folder that the user names. Otherwise use `.atb-work/test-case-design/<scope-slug>.md`,
and make sure that `.atb-work/` has a `.gitignore` that contains `*`.
