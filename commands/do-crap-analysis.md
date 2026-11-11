---
description: Run CRAP analysis on branch changes — orchestrator loads the base-branch config, runs configured coverage and analysis commands once, and reviews the report deterministically. Detect-only; never edits source.
argument-hint: "[--coverage] [--target NAME] [--report-only]"
---

# /do-crap-analysis

Use `/do-crap-analysis` to run CRAP analysis on the current branch changes and report the result.
Use `/crap-refactor` to apply fixes. Use `/crap-config` first if `.crap-analysis.json` is missing.

**Arguments:** `$ARGUMENTS`

Follow the `crap-analysis` skill (`skills/crap-analysis/SKILL.md`) for `/do-crap-analysis`.
