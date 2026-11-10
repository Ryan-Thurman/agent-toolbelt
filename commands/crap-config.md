---
description: Set up CRAP analysis for this repo — wizard that hydrates .crap-analysis.json with analysis, coverage, verify commands, output paths, and threshold. Use before the first /do-crap-analysis run.
argument-hint: "[edit]"
---

# /crap-config

Configure CRAP analysis for this repo using the `crap-analysis` skill. The wizard collects inputs
and writes a deterministic `.crap-analysis.json` — the only config format the pack accepts.

**Arguments:** `$ARGUMENTS`

## Rules

- Read `skills/crap-analysis/references/config-schema.md` and `templates/crap-analysis.json`.
- **Write only `.crap-analysis.json`** — no other files unless the user explicitly confirms
  (e.g. adding npm scripts to `package.json`).
- Do not assume any language, framework, or repo layout.

## Flow

1. **Discover** — check for existing `.crap-analysis.json` or `.atb/crap-analysis.json`. If present
   and argument is `edit`, load and offer to update fields.
2. **Collect globals** — `defaults.threshold` (default 30), `defaults.outputDir` (default
   `reports/crap`).
3. **Collect targets** — for each target ask:
   - Target key (e.g. `api`, `shared`)
   - `src` — source root for changed-file mapping
   - `commands.analysis` — produces report JSON and refactor brief; include `--threshold`
     when the tool supports it (or rely on orchestrator injection from `defaults.threshold`)
   - `commands.coverage` — optional; refreshes coverage before analysis
   - `commands.verify` — re-run after refactor; include `--threshold` when supported
   - `outputs.report` — default `{outputDir}/{target}.json` unless overridden
   - `outputs.refactorBrief` — default `{outputDir}/{target}.refactor.md` unless overridden
4. **Validate** — all required fields present; paths repo-relative; target keys unique.
   Recommend `.gitignore` entries for the output paths and coverage files.
5. **Preview** — show the full JSON (sorted target keys, 2-space indent).
6. **Confirm** — write `.crap-analysis.json` only after explicit user approval.
7. **Optional dry-run** — if the user wants it, run
   `bash skills/crap-analysis/bin/crap-analysis.sh validate-config --config .crap-analysis.json`.
   The new file is not on the base branch yet, so the dry-run needs `--config`.

## Output

Confirm the written path and summarize configured targets.
Tell the user to merge `.crap-analysis.json` into the base branch.
`/do-crap-analysis` loads the config from the base branch only.
