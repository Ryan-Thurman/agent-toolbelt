---
name: crap-analysis
description: Run CRAP analysis via repo-configured commands — wizard setup, single-run orchestration, deterministic report review, and opt-in refactor. Use for /do-crap-analysis, /crap-config, or /crap-refactor.
---

# crap-analysis

Language-agnostic CRAP analysis orchestration. Each repo configures its own analysis, coverage, and
verify commands in `.crap-analysis.json`. This skill runs those commands **once** when instructed,
**waits** for completion, **reads** the produced report and refactor brief, and applies a
**deterministic review** — no embedded analyzer.

## Mutation Policy

| Mode | Edits code | Writes config |
|---|---|---|
| `config` (`/crap-config`) | no | `.crap-analysis.json` only, after confirmation |
| `analyze` (`/do-crap-analysis`) | no | no |
| `refactor` (`/crap-refactor`) | yes, after user confirms | no |

## Mode routing

- **`/crap-config`** — wizard hydrates `.crap-analysis.json` from user inputs. See
  `references/config-schema.md`.
- **`/do-crap-analysis`** — orchestrator `execute` once; deterministic review. See
  `references/review.md`, `references/report-schema.md`, `references/cli.md`.
- **`/crap-refactor`** — apply brief; orchestrator `verify` once. See `references/refactor.md`.

## Invariants (always)

- Commands run **only** through `bin/crap-analysis.sh` — never ad-hoc shell for configured commands
  during analyze/refactor flows
- `commands.coverage` runs **at most once** per target per `execute` invocation
- `commands.analysis` runs **exactly once** per target per `execute` invocation
- Agent **waits** for each command to exit before reading output files
- **REFACTOR** outcome requires **Read** of `outputs.refactorBrief` before responding
- Review output uses **fixed templates** from `references/review.md` only
- Config loaded from **base branch** when applicable; honor base values if config changed in diff

## Reference map

| Doc | Load when |
|---|---|
| `references/config-schema.md` | `/crap-config`, config discovery |
| `references/cli.md` | running orchestrator ops |
| `references/report-schema.md` | parsing report JSON |
| `references/review.md` | after `execute` or `--report-only` |
| `references/refactor.md` | `/crap-refactor` |
| `references/scoring.md` | explaining thresholds to user |

## CLI

```bash
bash skills/crap-analysis/bin/crap-analysis.sh <op> [args]
```

Primary ops: `validate-config`, `execute --changed`, `verify --target NAME`.
