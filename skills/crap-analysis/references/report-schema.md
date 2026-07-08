# CRAP report JSON schema (v1)

The repo's analysis command writes a machine-readable report. The agent reads this file after
`execute` completes. Required fields for deterministic review:

## Top-level fields

| Field | Type | Required | Use |
|---|---|---|---|
| `target` | string | yes | Target name (should match config key) |
| `threshold` | number | yes | Threshold used for this run |
| `passed` | boolean | yes | `true` when no function exceeds threshold |
| `summary.maxCrap.value` | number | yes | Headline worst score |
| `functions` | array | yes | Per-function verdicts (see below) |

Optional but useful: `summary.totalFunctions`, `summary.exceedingThreshold`, `coverageFile`.

## Function entry fields

| Field | Type | Required | Use |
|---|---|---|---|
| `qualifiedName` | string | yes | Function or method name |
| `filePath` | string | yes | Repo-relative source path |
| `startLine` | number | yes | Start line in source file |
| `crap` | number | yes | CRAP score (1 decimal) |
| `cyclomaticComplexity` | number | no | Complexity count |
| `coveragePercent` | number | no | Line/branch coverage percentage |
| `exceeds` | boolean | yes | Whether score exceeds threshold |
| `riskLevel` | string | no | e.g. Low, Acceptable, Moderate, High |

## Worst-function selection

When re-sorting is needed, use this order (deterministic):

1. `crap` descending
2. `qualifiedName` ascending
3. `filePath` ascending
4. `startLine` ascending

Prefer `functions[0]` when the report is already sorted by the repo tool.

## Example fixture

See `skills/crap-analysis/fixtures/api.report.json` in the installed pack (bundled with
agent-toolbelt).

```json
{
  "target": "api",
  "threshold": 16,
  "passed": false,
  "summary": {
    "totalFunctions": 2,
    "exceedingThreshold": 1,
    "maxCrap": { "value": 42.5, "riskLevel": "High" }
  },
  "functions": [
    {
      "qualifiedName": "processOrder",
      "filePath": "packages/api/src/orders.ts",
      "startLine": 88,
      "cyclomaticComplexity": 14,
      "coveragePercent": 25.0,
      "crap": 42.5,
      "riskLevel": "High",
      "threshold": 16,
      "exceeds": true
    },
    {
      "qualifiedName": "validateInput",
      "filePath": "packages/api/src/orders.ts",
      "startLine": 12,
      "cyclomaticComplexity": 3,
      "coveragePercent": 95.0,
      "crap": 3.0,
      "riskLevel": "Low",
      "threshold": 16,
      "exceeds": false
    }
  ]
}
```

If required fields are missing after analysis completes, the review outcome is **ERROR**.
