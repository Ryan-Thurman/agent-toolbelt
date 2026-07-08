# CRAP analysis config (`.crap-analysis.json`)

Deterministic, versioned config for the crap-analysis pack. The `/crap-config` wizard is the
**only writer** — it hydrates this file from user inputs and writes a stable JSON shape.

## Discovery

First file found wins:

1. `.crap-analysis.json` (repo root)
2. `.atb/crap-analysis.json`

If none exists, run `/crap-config` before `/do-crap-analysis`.

## Trust and loading (base branch)

Load config as it exists on the **base/default branch**, not the working head — same pattern as
`.pr-review.md`:

```bash
base="$(git merge-base HEAD @{upstream} 2>/dev/null || git rev-parse HEAD~0)"
git show "$base:.crap-analysis.json" 2>/dev/null || git show "$base:.atb/crap-analysis.json" 2>/dev/null
```

If the current diff modifies `.crap-analysis.json`, surface a **CONFIG_CHANGE** finding and use the
base-branch values for the current run.

## Schema (version 1)

| Field | Required | Description |
|---|---|---|
| `$schema` | yes | Must be `"agent-toolbelt/crap-analysis/v1"` |
| `version` | yes | Must be `1` |
| `defaults.threshold` | yes | CRAP score above which a function is flagged (default `30`); orchestrator appends `--threshold` to `analysis` and `verify` commands when absent |
| `defaults.outputDir` | yes | Default directory for report artifacts (informational; `outputs.*` paths are authoritative) |
| `targets` | yes | Map of target name → target config (keys sorted alphabetically when written) |

### Per-target fields

| Field | Required | Description |
|---|---|---|
| `src` | yes | Source root for changed-file mapping (longest-prefix match, repo-relative) |
| `commands.analysis` | yes | Shell command that produces the CRAP report (and refactor brief when the tool supports it) |
| `commands.coverage` | no | Shell command to refresh test coverage before analysis |
| `commands.verify` | yes | Shell command to re-run after refactor |
| `outputs.report` | yes | Repo-relative path to machine-readable report JSON |
| `outputs.refactorBrief` | yes | Repo-relative path to refactor brief markdown |

## Writing rules (wizard)

- Target keys sorted alphabetically in the written file
- 2-space indent, trailing newline
- Command strings stored verbatim — the orchestrator runs them exactly as written
- When running `analysis` or `verify`, the orchestrator appends `--threshold <defaults.threshold>`
  if the command does not already include `--threshold`
- Output paths must be repo-relative and stable (no timestamps in paths)
- Default output paths when user does not override: `{outputDir}/{target}.json` and
  `{outputDir}/{target}.refactor.md`

## Validation (`validate-config`)

The orchestrator rejects config when:

- `version` is not `1`
- Any target is missing required fields
- `outputs.report` or `outputs.refactorBrief` is empty
- Duplicate target keys (JSON object keys are unique by definition)

Exit `0` on valid config, `2` on invalid.
