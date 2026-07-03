# crap-analysis CLI contract

The shipped `bin/crap-analysis.sh` orchestrates user-provided commands from `.crap-analysis.json`.
Invoke at its installed path:

```bash
bash skills/crap-analysis/bin/crap-analysis.sh <op> [args]
```

Requires: `bash`, `git`, `python3`. No analyzer is embedded.

Human-readable status goes to **stderr**; machine JSON goes to **stdout** for `execute` and `verify`.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Pass — no threshold violations (analysis/verify) or config valid |
| `1` | Threshold exceeded — analysis or verify reported failures |
| `2` | Config error, tooling crash, or missing config |

## Ops

### `validate-config [--config PATH]`

Validate `.crap-analysis.json` against schema v1. Default config path: `.crap-analysis.json`.

### `changed`

Print repo-relative paths from unstaged + staged git diff (one per line, sorted unique).

### `targets-for-changes [--config PATH]`

Map changed paths to configured target names via longest-prefix match on each target's `src`.

### `report-path <target> [--config PATH]`

Print configured `outputs.report` path for a target.

### `execute [--config PATH] [--coverage] [--target NAME] [--changed]`

Run configured commands **once per invocation**:

| Step | Runs | Condition |
|---|---|---|
| Resolve targets | once | `--changed` → diff-mapped targets; `--target` → single target; else all |
| `commands.coverage` | **at most once per target** | only when `--coverage` and command defined |
| `commands.analysis` | **exactly once per target** | always |

On coverage failure (exit ≠ 0): stop, emit partial result JSON, exit `2`.
On analysis exit `2+` (tooling error): stop, emit result JSON, exit `2`.
On analysis exit `0` or `1`: continue remaining targets; final exit is `1` if any target had exit `1`.

**Stdout** — result JSON:

```json
{
  "runId": "abc1234",
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

### `verify --target NAME [--config PATH]`

Run `commands.verify` **exactly once** for the named target. Emit verify result JSON on stdout.
Exit `0`/`1`/`2` same as analysis.

## Resolution rules

- **Repo root**: `git rev-parse --show-toplevel`
- **Config**: `--config` flag, else `.crap-analysis.json`, else `.atb/crap-analysis.json`
- **Commands**: run verbatim from config via `eval` in repo root — never modified by orchestrator

## Agent usage

During `/do-crap-analysis`, the agent must call **only** orchestrator ops — never ad-hoc shell for
configured commands. Typical sequence:

```bash
bash skills/crap-analysis/bin/crap-analysis.sh validate-config
bash skills/crap-analysis/bin/crap-analysis.sh execute --changed --coverage
```

During `/crap-refactor`:

```bash
bash skills/crap-analysis/bin/crap-analysis.sh verify --target api
```
