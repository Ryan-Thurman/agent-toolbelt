---
description: Map CDP/SRS/SAD/SDD document impacts for a feature
argument-hint: "<path-to-master-record-or-sdd>"
---

# /doc-impact

Use the `ai-feature-delivery` skill to produce a document impact map.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the master record and any provided SDD.
2. Use `templates/doc-impact-template.md`.
3. For CDP, SRS, SAD, SDD, and any repo-specific docs, list impacted sections,
   reason, required update, owner, status, and release eligibility.
4. Flag future-release, wrong-prefix, missing-metadata, or unowned document
   changes.
5. End with open document questions and release-packaging risks.
