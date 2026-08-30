---
description: Mine repository evidence into a concise style guide or a proposed update to an existing style owner.
argument-hint: "[--print|--refresh]"
---

# /style-guide-init

Use the `style-guide-init` skill to establish evidence-derived coding standards.

**Arguments:** `$ARGUMENTS`

- `--print` presents a draft and writes nothing.
- `--refresh` compares new evidence to the existing canonical style owner.

Read existing instructions, configuration, representative code/tests, vocabulary,
helpers, boundaries, errors, and test idioms. Update the existing style owner when
one exists. If none exists, present the proposed `STYLE_GUIDE.md` and wait for
explicit approval before creating it. Use `templates/repository-style-guide.md` and
cite evidence paths; do not treat one file as policy or duplicate rules in AGENTS.md.
