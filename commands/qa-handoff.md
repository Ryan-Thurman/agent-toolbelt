---
description: Build a traceable QA handoff package from feature records and tickets
argument-hint: "<path-to-master-record-or-feature-folder>"
---

# /qa-handoff

Use the `ai-feature-delivery` skill to generate a QA handoff.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the master record, tickets, SDD, and doc impact map.
2. Use `templates/qa-handoff-template.md`.
3. Map acceptance criteria to tests, regression areas, known risks,
   environment/config notes, observability notes, and related docs.
4. Do not mark ready for QA if acceptance criteria, test cases, or environment
   needs are missing.
