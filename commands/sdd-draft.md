---
description: Draft or update a release-scoped SDD from a Feature Master Record
argument-hint: "<path-to-master-record>"
---

# /sdd-draft

Use the `ai-feature-delivery` skill to create or update an SDD.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the Feature Master Record.
2. Use `templates/sdd-template.md`.
3. Preserve release, feature ID, owner, document status, and source master
   record metadata.
4. Cite source master-record sections for requirements and design decisions.
5. Mark assumptions and unresolved questions explicitly.
6. Do not mark `release_eligible: true` unless the document status is
   `APPROVED_FOR_RELEASE` and the release manifest includes it.
