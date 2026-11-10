# crap-analysis CLI contract

The shipped `bin/crap-analysis.sh` runs the commands in `.crap-analysis.json`.
It does not calculate CRAP and it does not read coverage files.
The configured commands own the language, the coverage format, and the scores.

```bash
bash skills/crap-analysis/bin/crap-analysis.sh <op> [args]
```

Requires: `bash` 3.2 or later, `git`, and `python3`.
Status lines go to stderr.
`execute`, `verify`, and `review` write machine JSON to stdout.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Pass. For `review`, this includes `WARN` and `NO_TARGETS`. |
| `1` | A function exceeds the threshold (`execute`, `verify`) or the outcome is `REFACTOR` (`review`). |
| `2` | Config error, usage error, missing base, tooling failure, or `ERROR` outcome. |

The configured analysis and verify commands must use the same codes.
Use `0` when no function exceeds the threshold.
Use `1` when one or more functions exceed it.
Use `2` for a tooling error.
The orchestrator records any other code as a tooling error.

## Base and config resolution

All ops accept `--base REF` and `--config PATH`.
The environment variables `CRAP_BASE` and `CRAP_CONFIG` have the same effect.

| Item | Rule |
|---|---|
| Repo root | `git rev-parse --show-toplevel`. Ops run from the repo root. |
| Base ref | `--base REF`. Else the first ref that exists: `origin/HEAD`, `origin/main`, `origin/master`, `main`, `master`. The branch's own `@{upstream}` is never used. |
| Merge base | `git merge-base HEAD <base ref>`. |
| Config | `--config PATH` loads that working-tree file (repo-relative or absolute). Else the orchestrator copies `<base ref>:.crap-analysis.json`, or else `<base ref>:.atb/crap-analysis.json`, to `.atb-work/crap-analysis/base-config.json`. |
| Config change | With a base config, `changedInDiff` is `true` when the diff from the merge base changes that config path. |
| Commands | Run verbatim with `eval` from the repo root, in a subshell, with stdin closed. |

The orchestrator exits `2` when no base ref exists.
It also exits `2` when the base ref has no config.
The error message names the fix: commit the config to the base branch, or pass `--config PATH`.

## Ops

### `validate-config`

Validate the resolved config against schema v1 (see `config-schema.md`).
Stderr names the config source.
Stderr also prints a `CONFIG_CHANGE` line when the diff changes the config.

### `changed`

Print the changed paths, one for each line, sorted and unique:

- commits since the merge base,
- staged and unstaged changes,
- untracked files that `.gitignore` does not exclude.

Deleted paths are not included.

### `targets-for-changes`

Map each changed path to the target whose `src` is the longest matching prefix.
A `src` of `.` matches all paths.

### `report-path <target>`

Print the configured `outputs.report` path for a target.

### `execute [--changed] [--target NAME] [--coverage]`

| Flags | Targets | Function scope for `review` |
|---|---|---|
| none | all targets | all functions |
| `--target NAME` | `NAME` | all functions |
| `--changed` | targets that contain a changed path | functions in changed files |
| `--changed --target NAME` | `NAME` | functions in changed files |

For each target, in name order:

1. With `--coverage`, run `commands.coverage` once, if it is configured.
2. Run `commands.analysis` once.
   The orchestrator adds `--threshold <defaults.threshold>` if the command does not contain `--threshold`.

If coverage exits non-zero, the orchestrator stops and exits `2`.
If analysis exits `2` or more, the orchestrator stops and exits `2`.
If analysis exits `0` or `1`, the orchestrator continues.
The final exit is `1` if any analysis exited `1`.

Stdout is the result JSON.
The orchestrator also writes it to `.atb-work/crap-analysis/last-result.json`:

```json
{
  "op": "execute",
  "runId": "abc1234",
  "scope": "changed",
  "reportOnly": false,
  "base": { "ref": "origin/main", "mergeBase": "<sha>" },
  "config": { "source": "base", "path": ".crap-analysis.json", "ref": "origin/main", "changedInDiff": false },
  "changed": ["packages/api/src/orders.ts"],
  "targets": [
    {
      "name": "api",
      "coverage": { "ran": true, "exitCode": 0 },
      "analysis": { "ran": true, "exitCode": 1 },
      "outputs": {
        "report": "reports/crap/api.json",
        "refactorBrief": "reports/crap/api.refactor.md"
      }
    }
  ]
}
```

- `config.source` is `base` or `override`.
  With `override`, `config.ref` and `config.changedInDiff` are `null`.
- `base` is `null` when an override run does not need a base.
- `changed` is present only when `scope` is `changed`.
- A failed command adds `"failed": "coverage"` or `"failed": "analysis"` to its target.
  The failed command object gets `outputTail`, the last 2000 characters of its stdout and stderr.

### `verify --target NAME [--changed]`

Run `commands.verify` once for one target.
The orchestrator adds `--threshold` as for `analysis`.
`--changed` sets the review scope to functions in changed files, as for `execute`.
Stdout uses the `execute` result shape with `"op": "verify"` and a `verify` object in place of `analysis`.
The orchestrator also writes it to `last-result.json`.
The exit code is the verify command code, or `2` for any code above `1`.

### `review [--result FILE]`

Apply the decision table in `review.md` to the reports from a result.
The default result is `.atb-work/crap-analysis/last-result.json`.
The scope, the config, and the base come from that result.
`--config` and `--base` replace the config and the base.
Stdout is the review JSON:

```json
{
  "op": "review",
  "outcome": "REFACTOR",
  "scope": "changed",
  "reportOnly": false,
  "base": { "ref": "origin/main", "mergeBase": "<sha>" },
  "config": { "source": "base", "path": ".crap-analysis.json", "ref": "origin/main", "changedInDiff": false },
  "targets": [
    {
      "name": "api",
      "outcome": "REFACTOR",
      "threshold": 16,
      "report": "reports/crap/api.json",
      "refactorBrief": "reports/crap/api.refactor.md",
      "worstInScope": { "qualifiedName": "processOrder", "filePath": "packages/api/src/orders.ts", "startLine": 88, "crap": 42.5 },
      "worstInTarget": { "qualifiedName": "processOrder", "filePath": "packages/api/src/orders.ts", "startLine": 88, "crap": 42.5 },
      "exceedingInScope": 1,
      "changedFilesWithoutFunctions": [],
      "error": null
    }
  ]
}
```

- `outcome` is `PASS`, `WARN`, `REFACTOR`, `ERROR`, or `NO_TARGETS`.
  The top-level outcome is the worst target outcome, in the order `ERROR`, `REFACTOR`, `WARN`, `PASS`.
- `worstInScope` and `worstInTarget` include `riskLevel`, `cyclomaticComplexity`, and `coveragePercent` when the report has them.
- `changedFilesWithoutFunctions` lists changed paths under the target `src` that have no function in the report.
- For `ERROR`, `error` has `command`, `exitCode`, `reason`, and `outputTail`.
  `command` is `coverage`, `analysis`, `verify`, `report`, or `config`.

### `review --report-only [--changed] [--target NAME]`

Review the reports that are on disk now, without a result file.
This op does not run any command.
`--changed` and `--target` select targets and scope as for `execute`.
The output has `"reportOnly": true`.

## Agent usage

`/do-crap-analysis`:

```bash
bash skills/crap-analysis/bin/crap-analysis.sh validate-config
bash skills/crap-analysis/bin/crap-analysis.sh execute --changed --coverage
bash skills/crap-analysis/bin/crap-analysis.sh review
```

`/crap-refactor`:

```bash
bash skills/crap-analysis/bin/crap-analysis.sh verify --target api --changed
bash skills/crap-analysis/bin/crap-analysis.sh review
```
