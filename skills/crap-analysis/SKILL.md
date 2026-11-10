---
name: crap-analysis
description: Run CRAP analysis via repo-configured commands — wizard setup, single-run orchestration, deterministic report review, and opt-in refactor. Use for /do-crap-analysis, /crap-config, or /crap-refactor.
---

# crap-analysis

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

CRAP (Change Risk Anti-Patterns) combines complexity and test coverage into one risk score.
This skill does not calculate CRAP.
Each repository configures its own coverage, analysis, and verify commands in `.crap-analysis.json`.
The orchestrator runs those commands once, then reviews the report that they write.

## Mutation Policy

| Mode | Edits code | Writes config |
|---|---|---|
| `config` (`/crap-config`) | no | `.crap-analysis.json` only, after confirmation |
| `analyze` (`/do-crap-analysis`) | no | no |
| `refactor` (`/crap-refactor`) | yes, after user confirms | no |

The orchestrator writes generated files only under `.atb-work/crap-analysis/` and the configured `outputs` paths.

## Mode routing

- **`/crap-config [edit]`** — follow `references/config-schema.md` → "Wizard".
- **`/do-crap-analysis [--coverage] [--target NAME] [--report-only]`** — follow
  `references/review.md` → "Procedure".
- **`/crap-refactor <target>`** — follow `references/refactor.md` → "Flow".

## Invariants (always)

- Run configured commands only through `bin/crap-analysis.sh`.
  Do not run them as ad-hoc shell commands.
- Wait for each orchestrator op to exit before you read its output files.
- Let the orchestrator load the config from the base branch.
  Use `--config PATH` only when the user asks for a working-tree config.
- Get each outcome from the `review` op.
  Do not calculate an outcome from the report yourself.
- On a **REFACTOR** outcome, read `outputs.refactorBrief` before you respond.
- Use only the fixed templates in `references/review.md` for review output.

## Reference map

| Doc | Load when |
|---|---|
| `references/config-schema.md` | `/crap-config`, config discovery, or a config error |
| `references/cli.md` | running orchestrator ops or reading their JSON and exit codes |
| `references/report-schema.md` | writing or debugging the repository's analysis command |
| `references/review.md` | `/do-crap-analysis`, and after `verify` |
| `references/refactor.md` | `/crap-refactor` |
| `references/scoring.md` | explaining scores and thresholds to the user |

## CLI

```bash
bash skills/crap-analysis/bin/crap-analysis.sh <op> [args]
```

Primary ops: `validate-config`, `execute --changed`, `review`, `verify --target NAME`.
