# CRAP report JSON schema (v1)

The repo's analysis command writes a machine-readable report.
The `review` op reads it after `execute` or `verify` completes.
It needs these fields for a deterministic review:

## Top-level fields

| Field | Type | Required | Use |
|---|---|---|---|
| `target` | string | yes | Target name (must match config key) |
| `threshold` | number | yes | Threshold used for this run |
| `passed` | boolean | yes | `true` only when no function has `exceeds: true` |
| `summary.maxCrap.value` | number | yes | Headline worst score |
| `functions` | array | yes | Per-function verdicts (see below) |

Optional but useful: `summary.totalFunctions`, `summary.exceedingThreshold`, `coverageFile`.

## Function entry fields

| Field | Type | Required | Use |
|---|---|---|---|
| `qualifiedName` | string | yes | Function or method name |
| `filePath` | string | yes | Repo-relative source path |
| `startLine` | integer | yes | Start line in source file |
| `crap` | number | yes | CRAP score (1 decimal) |
| `cyclomaticComplexity` | number | no | Complexity count |
| `coveragePercent` | number | no | Line/branch coverage percentage |
| `exceeds` | boolean | yes | `true` when `crap` is above the threshold |
| `riskLevel` | string | no | e.g. Low, Acceptable, Moderate, High |

Write `filePath` relative to the repo root.
The `review` op also accepts a path relative to the target `src`, or an absolute path in the repo.

## Worst-function selection

The `review` op sorts functions in this order to select the worst function:

1. `crap` descending
2. `qualifiedName` ascending
3. `filePath` ascending
4. `startLine` ascending

The report does not need to be sorted.

## Example fixture

See `skills/crap-analysis/fixtures/api.report.json` in the installed pack (bundled with
agent-toolbelt).

If a required field is missing or has the wrong type, the review outcome is **ERROR**.

## Refactor brief

The brief is a Markdown file for one target. It must have these parts:

- The bullets `Function`, `Location`, and `CRAP`.
- A `## Recommended actions` section with numbered actions.
- A `## Complexity drivers` section with the lines that raise complexity.

See `skills/crap-analysis/fixtures/api.refactor.md` for an example.
