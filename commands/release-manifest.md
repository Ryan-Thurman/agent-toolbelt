---
description: Create or update a release manifest for controlled documentation packaging
argument-hint: "<release-id> [feature-folder-or-docs-folder]"
---

# /release-manifest

Use the `ai-feature-delivery` skill to create or update a release manifest.

**Arguments:** `$ARGUMENTS`

Steps:
1. Identify the release ID and relevant feature/document folders.
2. Use `templates/release-manifest-template.md` if no manifest exists.
3. Add included features, approved documents, withheld/future-release documents,
   and exclusions/corrections needed.
4. Preserve the allowlist rule: only documents listed in the manifest and marked
   `doc_status: APPROVED_FOR_RELEASE` are eligible for release packaging.
5. End with unresolved release-documentation risks and next actions.
