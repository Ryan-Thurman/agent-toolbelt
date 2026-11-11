# Deterministic CRAP review contract

The `review` op makes the decision.
The agent copies values from the review JSON into the fixed templates below.
Do not change an outcome, and do not add a summary format.

## Procedure

This procedure is the `/do-crap-analysis [--coverage] [--target NAME] [--report-only]` flow.
`/crap-refactor` replaces steps 1 and 2 with `verify` (`references/refactor.md`).
Do not edit source files in this flow.

1. Run `bash skills/crap-analysis/bin/crap-analysis.sh validate-config`.
   If it reports that the config is missing, suggest `/crap-config` and stop.
2. Unless `--report-only`, run `execute --changed` once, and wait for it to exit.
   Add `--coverage` and `--target NAME` only when the user passed them.
   `--target NAME` limits the run to that target. The review scope stays the changed files.
3. Run `review`. With `--report-only`, run `review --report-only --changed`, plus `--target NAME`
   when given. This reviews the reports on disk without running commands.
4. Read the review JSON from stdout. `references/cli.md` defines its fields.
5. If a target outcome is `REFACTOR`, read its `refactorBrief` file in full.
6. Write the prefix lines that apply, then one template block for each target in name order.

## Decision table (applied by `review`)

The `review` op checks the conditions for each target in this order:

| Order | Condition | Outcome |
|---|---|---|
| 1 | Coverage exited non-zero, or analysis or verify exited `2` or more | **ERROR** |
| 2 | The report is missing, is not valid JSON, or does not have a required field from `report-schema.md` | **ERROR** |
| 3 | `passed` does not agree with the `exceeds` flags (`passed` must be `true` only when no function exceeds) | **ERROR** |
| 4 | A function in scope has `exceeds: true` | **REFACTOR** |
| 5 | A function outside the scope has `exceeds: true` (`--changed` scope only) | **WARN** |
| 6 | No function has `exceeds: true` | **PASS** |

The scope is all functions of the target, unless the run used `--changed`.
With `--changed`, a function is in scope when its `filePath` is a changed path.
A `filePath` relative to the target `src` also matches.
`worstInScope` and `worstInTarget` use the sort order in `report-schema.md`.
When no target contains a changed path, the top-level outcome is **NO_TARGETS**.

The analysis exit code `1` does not decide the outcome. The report `exceeds` flags decide it.
Thus `execute` can exit `1` while `review` gives `WARN` and exits `0`.

## Prefix lines

Write each prefix line that applies, before the target blocks, in this order.

When `config.changedInDiff` is `true`:

```
CONFIG_CHANGE: {config.path} changed in this diff. This run used the {config.ref} version.
```

When `config.source` is `override`:

```
CONFIG_OVERRIDE: This run used {config.path} from the working tree, not the base branch.
```

When `reportOnly` is `true`:

```
REPORT_ONLY: This review used reports on disk. They can be stale.
```

## Target templates

`{worst}` is `{qualifiedName} @ {filePath}:{startLine} — CRAP {crap}`, or `none` when the value is `null`.
`{scope}` is the top-level `scope` value.

When `changedFilesWithoutFunctions` is not empty, add this line at the end of a PASS, WARN, or REFACTOR block:

```
Changed files with no report entries: {paths}. Make sure that the analysis command includes them.
```

### PASS

Do **not** read the refactor brief.

```
CRAP analysis: PASS
Target: {name}
Threshold: {threshold}
Worst in scope ({scope}): {worstInScope}
No function in scope exceeds the threshold.
```

### REFACTOR (mandatory brief inclusion)

1. **Read** `{refactorBrief}`. The full file must be in agent context before you respond.
2. Emit:

```
CRAP analysis: REFACTOR REQUIRED
Target: {name}
Threshold: {threshold}
Worst in scope ({scope}): {worstInScope}
Functions over the threshold in scope: {exceedingInScope}

The refactor brief has been loaded. Summary:
- Function: {from brief}
- Location: {from brief}
- CRAP: {from brief}

Recommended actions (from brief):
{numbered list from ## Recommended actions section}

→ Run `/crap-refactor {name}` to apply behavior-preserving fixes, or confirm here to proceed.
```

Do not paraphrase the brief from memory — cite from loaded content only.

### WARN (failure outside the diff)

```
CRAP analysis: WARN
Target: {name}
Threshold: {threshold}
No function in the changed files exceeds the threshold. Other functions in the target exceed it.
Worst in target: {worstInTarget}
Review the full report at {report}.
```

### ERROR

```
CRAP analysis: ERROR
Target: {name}
Command: {error.command}
Exit code: {error.exitCode}
Reason: {error.reason}
{error.outputTail}

Fix the tooling and run `/do-crap-analysis` again.
```

### NO_TARGETS

```
CRAP analysis: NO_TARGETS
No configured target `src` contains a changed file.
```
