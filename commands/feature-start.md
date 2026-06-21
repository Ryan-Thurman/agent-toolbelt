---
description: Start a release-traceable feature package with a Feature Master Record
argument-hint: "<feature idea or FEAT-ID> [REL-YYYY.MM|REL-FUTURE]"
---

# /feature-start

Use the `ai-feature-delivery` skill to start a feature package.

**Arguments:** `$ARGUMENTS`

Steps:
1. Parse feature idea, feature ID if present, and target release if present.
2. If feature ID, release, owner, impacted systems, or required reviewers are
   missing, mark them `TBD` and create open questions.
3. Create or update a Feature Master Record using
   `templates/feature-master-record.md`.
4. Add stakeholder questions for PO, UX, cyber/security, medical affairs, QA,
   SRE, feature lead, and dev teams.
5. End with Gate 1 status: `READY`, `READY_WITH_RISKS`, or `BLOCKED`.
