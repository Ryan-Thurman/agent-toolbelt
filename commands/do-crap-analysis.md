---
description: Run CRAP analysis on uncommitted changes — orchestrator executes configured coverage and analysis commands once, waits for output, reads the report, and deterministically prompts refactor when threshold is exceeded. Detect-only; never edits source.
argument-hint: "[--coverage] [--target NAME] [--report-only]"
---

# /do-crap-analysis

Run CRAP analysis on uncommitted changes using the `crap-analysis` skill. Commands run **only**
through the orchestrator, **once per invocation**, then the agent reads and reviews the output.

> **When to use vs related:** `/do-crap-analysis` runs tooling and reports. Use `/crap-refactor` to
> apply fixes after you confirm. Run `/crap-config` first if `.crap-analysis.json` is missing.

**Arguments:** `$ARGUMENTS`

## Rules

- Read `skills/crap-analysis/SKILL.md`, `references/review.md`, `references/report-schema.md`,
  `references/cli.md`.
- **Detect-only — do not edit source files.**
- **Never run configured commands ad-hoc** — use only `bin/crap-analysis.sh` ops.
- Load config from **base branch** when on a feature branch (see `references/config-schema.md`).

## Fixed flow (follow in order)

1. Load `.crap-analysis.json` from base branch; if missing → suggest `/crap-config` and **stop**.
2. If config is modified in the current diff → note **CONFIG_CHANGE**; use base-branch values.
3. Run:
   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh validate-config
   ```
4. Unless `--report-only`, run **once**:
   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh execute --changed [--coverage] [--target NAME]
   ```
   Wait for exit. Capture stdout JSON.
5. For each target in the result, **Read** `outputs.report`.
6. Apply the decision table in `references/review.md` (PASS / REFACTOR / ERROR / WARN).
7. On **REFACTOR**: **Read** `outputs.refactorBrief` into context, then emit the fixed REFACTOR
   template from `references/review.md`.

## Flags

- `--coverage` — pass to orchestrator `execute`
- `--target NAME` — single target instead of diff-scoped
- `--report-only` — skip `execute`; review existing artifacts on disk

## Output

Use the fixed templates from `references/review.md` only. Do not improvise summary format.
