---
description: Refine a ticket or story into a ready-to-build spec with Given/When/Then criteria, owner questions, and a readiness verdict
argument-hint: "<ticket-key-story-text-or-brief> [--scan | --live | --check] [--light | --standard | --deep]"
---

# /story-refinement

**Arguments:** `$ARGUMENTS`: a tracker key, story text, or approved brief. `--scan` prepares the item with no questions. `--live` resolves questions now. `--check` gives only the readiness verdict.

Use this before refinement meetings and before planning. For a vague idea, use `/shape-up`.

The agent chooses the depth from the risk of the change and states it. A flag overrides it.

Follow the `story-refinement` skill.
