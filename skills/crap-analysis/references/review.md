# Deterministic CRAP review contract

After `execute` completes, the agent applies this fixed procedure — no improvisation.

## Prerequisites

1. Orchestrator `execute` has finished (or `--report-only` mode with existing artifacts)
2. `.crap-analysis.json` loaded from **base branch** (not PR head if config changed in diff)
3. Read `references/report-schema.md` for required JSON fields

## Step 1 — Parse orchestrator result

Read stdout JSON from `execute`. For each target entry, record:

- `name`, `analysis.exitCode`, `coverage.exitCode`
- `outputs.report`, `outputs.refactorBrief`

If any `analysis.exitCode === 2` or tooling error fields present → **ERROR** for that target.

## Step 2 — Read report JSON

For each target, **Read** `outputs.report`. Verify required fields:

- `passed` (boolean)
- `threshold` (number)
- `summary.maxCrap.value` (number)
- `functions` (array, non-empty when `passed === false`)

Missing report after analysis exit `0` or `1` → **ERROR**.

## Step 3 — Scope to changed files (when `--changed`)

1. Run `bash skills/crap-analysis/bin/crap-analysis.sh changed` to get diff paths
2. Filter `functions` to those whose `filePath` matches a changed path (exact or prefix under `src`)
3. Re-select worst function from filtered set using deterministic sort:
   - `crap` descending
   - `qualifiedName` ascending
   - `filePath` ascending
   - `startLine` ascending

If no overlap but `passed === false` → **WARN** (failure outside diff); still proceed to refactor
brief if threshold logic applies.

## Step 4 — Decision table

| Condition | Outcome |
|---|---|
| `analysis.exitCode === 0` AND report `passed === true` | **PASS** |
| `analysis.exitCode === 1` OR report `passed === false` | **REFACTOR** |
| `analysis.exitCode >= 2` or report missing/invalid | **ERROR** |
| Config file modified in current diff | **CONFIG_CHANGE** (use base-branch config; surface finding) |

## Step 5 — Fixed output templates

### PASS

Do **not** read refactor brief.

```
CRAP analysis: PASS
Target: {target}
Threshold: {threshold}
Worst in changed scope: {qualifiedName} @ {filePath}:{startLine} — CRAP {score}
No functions exceed threshold in changed files.
```

### REFACTOR (mandatory MD inclusion)

1. **Read** `{outputs.refactorBrief}` — full file must be in agent context before responding
2. Emit:

```
CRAP analysis: REFACTOR REQUIRED
Target: {target}
Threshold: {threshold}
Worst in changed scope: {qualifiedName} @ {filePath}:{startLine} — CRAP {score}

The refactor brief has been loaded. Summary:
- Function: {from brief}
- Location: {from brief}
- CRAP: {from brief}

Recommended actions (from brief):
{numbered list from ## Recommended actions section}

→ Run `/crap-refactor {target}` to apply behavior-preserving fixes, or confirm here to proceed.
```

Do not paraphrase the brief from memory — cite from loaded content only.

### ERROR

```
CRAP analysis: ERROR
Target: {target}
Command: {analysis|coverage}
Exit code: {code}
{stderr tail}

Fix tooling and re-run `/do-crap-analysis`.
```

### WARN (failure outside diff)

```
CRAP analysis: WARN
Target: {target}
Threshold: {threshold}
No functions in changed files exceed threshold, but the full target report shows failures.
Worst in target: {qualifiedName} @ {filePath}:{startLine} — CRAP {score}
Review the full report at {outputs.report}.
```

## Report-only mode

When invoked with `--report-only`, skip `execute` and run steps 2–5 against existing artifacts.
Useful after a manual command run; agent must note artifacts may be stale.
