---
description: Run CRAP analysis on branch changes — orchestrator loads the base-branch config, runs configured coverage and analysis commands once, and reviews the report deterministically. Detect-only; never edits source.
argument-hint: "[--coverage] [--target NAME] [--report-only]"
---

# /do-crap-analysis

Run CRAP analysis on the current branch changes using the `crap-analysis` skill.
The changes are the commits since the base branch, plus staged, unstaged, and untracked files.

> **When to use vs related:** `/do-crap-analysis` runs tooling and reports. Use `/crap-refactor` to
> apply fixes after you confirm. Run `/crap-config` first if `.crap-analysis.json` is missing.

**Arguments:** `$ARGUMENTS`

## Rules

- Read `skills/crap-analysis/SKILL.md`, `references/cli.md`, and `references/review.md`.
- **Detect-only — do not edit source files.**
- Run only `bin/crap-analysis.sh` ops. Do not run the configured commands yourself.

## Fixed flow (follow in order)

1. Run:
   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh validate-config
   ```
   If it reports that the config is missing, suggest `/crap-config` and **stop**.
2. Unless `--report-only`, run **once**, and wait for exit:
   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh execute --changed [--coverage] [--target NAME]
   ```
3. Run `review`. With `--report-only`, run `review --report-only --changed [--target NAME]`.
4. Emit the prefix lines and templates from `references/review.md` for the review JSON.
   On **REFACTOR**, **read** the target `refactorBrief` before you emit its template.

## Flags

- `--coverage` — pass to orchestrator `execute`
- `--target NAME` — analyze only `NAME`; the review scope stays the changed files
- `--report-only` — skip `execute`; review existing artifacts on disk

## Output

Use the fixed templates from `references/review.md` only. Do not improvise summary format.
