# CRAP analysis config (`.crap-analysis.json`)

Deterministic, versioned config for the crap-analysis pack. The `/crap-config` wizard is the
**only writer** — it hydrates this file from user inputs and writes a stable JSON shape.

## Discovery and trust

The orchestrator loads the config from the base branch, not from the working tree.
This prevents a branch from changing the rules that review it.
The first file found on the base ref wins:

1. `.crap-analysis.json` (repo root)
2. `.agents/crap-analysis.json`
3. `.atb/crap-analysis.json` for existing base commits

`references/cli.md` defines how the orchestrator selects the base ref.
If the base ref has no config, run `/crap-config` and merge the file into the base branch.
To test a new config before the merge, pass `--config .crap-analysis.json` to each op.

If the current diff changes the config, the run still uses the base-branch values.
The result JSON then has `config.changedInDiff: true`, and the review starts with the `CONFIG_CHANGE` line.

## Schema (version 1)

| Field | Required | Description |
|---|---|---|
| `$schema` | yes | Must be `"agent-toolbelt/crap-analysis/v1"` |
| `version` | yes | Must be `1` |
| `defaults.threshold` | yes | Positive number. A function with a CRAP score above it is flagged. The wizard default is `30`. |
| `defaults.outputDir` | yes | Default directory for report artifacts (informational; `outputs.*` paths are authoritative) |
| `targets` | yes | Map of target name → target config (keys sorted alphabetically when written) |

### Per-target fields

| Field | Required | Description |
|---|---|---|
| `src` | yes | Source root for changed-file mapping (longest-prefix match, repo-relative; `.` matches all) |
| `commands.analysis` | yes | Shell command that writes the CRAP report and the refactor brief |
| `commands.coverage` | no | Shell command to refresh test coverage before analysis |
| `commands.verify` | yes | Shell command to re-run after refactor |
| `outputs.report` | yes | Repo-relative path to machine-readable report JSON |
| `outputs.refactorBrief` | yes | Repo-relative path to refactor brief markdown |

## Wizard (`/crap-config [edit]`)

Write only `.crap-analysis.json`. Write another file, such as npm scripts in `package.json`, only
after the user explicitly confirms it. Do not assume a language, framework, or repo layout.
Start from `templates/crap-analysis.json`.

1. **Discover.** Look for `.crap-analysis.json`, `.agents/crap-analysis.json`, or the legacy `.atb/crap-analysis.json`.
   If a file exists and the argument is `edit`, load it and offer to update fields.
2. **Collect globals.** `defaults.threshold` (default `30`) and `defaults.outputDir` (default
   `reports/crap`).
3. **Collect targets.** For each target, ask for the target key and each per-target field above.
   Include `--threshold` in `commands.analysis` and `commands.verify` when the tool supports it.
4. **Validate.** Apply the writing rules below. Target keys must be unique.
5. **Preview.** Show the full JSON.
6. **Confirm.** Write `.crap-analysis.json` only after explicit user approval.
7. **Optional dry-run.** Run `bash skills/crap-analysis/bin/crap-analysis.sh validate-config --config .crap-analysis.json`.
   The new file is not on the base branch yet, so the dry-run needs `--config`.
8. **Report.** Confirm the written path and list the targets. Tell the user to merge
   `.crap-analysis.json` into the base branch, because `/do-crap-analysis` loads it from there.

### Writing rules

- Target keys sorted alphabetically in the written file
- 2-space indent, trailing newline
- Command strings stored verbatim — the orchestrator runs them exactly as written
- When running `analysis` or `verify`, the orchestrator appends `--threshold <defaults.threshold>`
  if the command does not already include `--threshold`
- Output paths must be repo-relative and stable (no timestamps in paths)
- Default output paths when user does not override: `{outputDir}/{target}.json` and
  `{outputDir}/{target}.refactor.md`
- Put the output paths and coverage files in `.gitignore`.
  Otherwise each run adds untracked files to the diff.

## Validation (`validate-config`)

The orchestrator rejects the config with exit `2` when:

- the file is not valid JSON, or a JSON object has a duplicate key,
- `$schema` or `version` has a different value,
- `defaults.threshold` is not a positive number,
- `targets` is empty, or a target does not have a required field,
- `commands.coverage` is present but empty,
- `defaults.outputDir`, `src`, or an `outputs` path is absolute, empty, or contains `..`.

Stderr lists each problem on its own line.
Exit `0` on a valid config.
