---
description: Review a PR against feature record, ticket scope, docs, tests, and release metadata
argument-hint: "<pr-or-diff-target> <path-to-master-record-or-ticket>"
---

# /pr-traceability-review

Use the `ai-feature-delivery` skill to check PR traceability, not just code
quality.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the PR/diff, ticket, Feature Master Record, SDD, doc impact map, and test
   evidence if available.
2. Use `templates/pr-traceability-review-template.md` for persistent output when
   creating a report.
3. Compare PR changes to ticket acceptance criteria and master-record
   requirements.
4. Identify behavior changes, missing tests, missing doc deltas, SDD drift,
   release metadata mismatches, and unresolved security/QA/SRE implications.
5. Return recommendation: `Approve`, `Needs Work`, or `Block`, with required
   fixes.
