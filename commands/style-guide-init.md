---
description: Derive contribution guidance from repository evidence, or check and refresh it against changes.
argument-hint: "[--print|--write|--check|--refresh] [--scope PATH]"
---

# /style-guide-init

**Arguments:** `$ARGUMENTS`

- `--print` explains or drafts guidance and writes nothing; default for inspection.
- `--write` creates or updates the requested guide and evidence checkpoint.
- `--check` reports input drift and affected claims without writing files.
- `--refresh` re-evaluates drift; apply updates when the request authorizes them,
  otherwise return a proposed patch.
- `--scope PATH` limits discovery to a package/subtree; repeat for multiple areas.

Use this to create, explain, check, or refresh a repository's contribution or style guide.

Follow the `style-guide-init` skill.
