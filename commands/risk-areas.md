---
description: Draft risk areas, the paths where a defect has high impact, for one repo or a folder of repos, then apply the approved entries
argument-hint: "[--sweep <dir> | --apply <file>] [--atlas <path>] [--target agents]"
---

# /risk-areas

**Arguments:** `$ARGUMENTS`

- No folder: draft the list for the current repository.
- **`--sweep <dir>`**: draft the list for each repository under `<dir>` into one review file. Edit no repository.
- **`--apply <file>`**: write the approved entries from a review file into each repository. Do not commit.
- **`--atlas <path>`**: use a workspace map (repo cards, blast radius, integration edges) as evidence.
- **`--target agents`**: write the list into `AGENTS.md` instead of `.pr-review.md`.

This command is the first stage of `workflows/risk-based-testing-workflow.md`.
Follow the `risk-area-mapping` skill.
