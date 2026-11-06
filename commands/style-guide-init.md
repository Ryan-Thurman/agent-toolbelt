---
description: Derive contribution guidance from repository evidence, or check and refresh it against changes.
argument-hint: "[--print|--write|--check|--refresh] [--scope PATH]"
---

# /style-guide-init

Use the `style-guide-init` skill to extract and maintain repository contribution
guidance. The same skill remains available through its existing name.

**Arguments:** `$ARGUMENTS`

- `--print` explains or drafts guidance and writes nothing; default for inspection.
- `--write` creates or updates the requested guide and evidence checkpoint.
- `--check` reports input drift and affected claims without writing files.
- `--refresh` re-evaluates drift; apply updates when the request authorizes them,
  otherwise return a proposed patch.
- `--scope PATH` limits discovery to a package/subtree; repeat for multiple areas.
  Include relevant governing instructions and configuration in the evidence.

Follow `skills/style-guide-init/SKILL.md` for evidence classification, document
ownership, maintenance and completion. Existing contribution/style owners win;
default a new general guide to `CONTRIBUTING.md`. Use
`templates/repository-contribution-guide.md` or the style-only
`templates/repository-style-guide.md`. Do not duplicate the guide in agent files.
