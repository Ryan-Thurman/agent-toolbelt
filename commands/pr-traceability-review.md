---
description: Review a PR against feature record, ticket scope, docs, tests, and release metadata
argument-hint: "<pr-or-diff-target> <path-to-master-record-or-ticket>"
---

# /pr-traceability-review

Use the `ai-feature-delivery` skill to check PR traceability, not just code
quality.

> **When to use vs related:** `/pr-traceability-review` checks a PR against its
> feature record, ticket scope, docs, tests, and release metadata — not code
> quality. Use `/pr-review` for code quality and `/pr-ready-check` for readiness.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the PR/diff, ticket, Feature Master Record, SDD, doc impact map, and test
   evidence if available.
2. Use `templates/pr-traceability-review-template.md` for persistent output when
   creating a report.
3. Compare PR changes to ticket acceptance criteria and master-record
   requirements.
4. Identify behavior changes, missing tests, missing doc deltas, SDD drift,
   release metadata mismatches, default-branch work without explicit approval,
   and unresolved security/QA/SRE implications.
5. Verify the implementation plan or handoff record is current enough for
   another agent to resume: current state, task status, evidence, checks,
   blockers, branch/PR state, next step, and resume instructions.
6. Return recommendation: `Approve`, `Needs Work`, or `Block`, with required
   fixes. Do not recommend `Approve` if the work bypasses the PR branch flow
   without explicit user approval.
