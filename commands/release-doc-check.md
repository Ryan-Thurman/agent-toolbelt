---
description: Validate release documentation eligibility against a release manifest
argument-hint: "<release-id-or-manifest-path> [docs-folder]"
---

# /release-doc-check

Use the `ai-feature-delivery` skill to validate release documentation control.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the release manifest or create one from
   `templates/release-manifest-template.md` if requested.
2. Compare document filenames, frontmatter release IDs, feature IDs, statuses,
   and manifest entries.
3. Classify each document as allowed in release package, needs review, withhold
   from release, wrong release prefix, or missing release metadata.
4. Only documents with matching release metadata, manifest inclusion, and
   `doc_status: APPROVED_FOR_RELEASE` are allowed.
