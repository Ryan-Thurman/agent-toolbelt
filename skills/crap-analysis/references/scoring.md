# CRAP scoring reference

## What CRAP measures

**CRAP** (Change Risk Anti-Patterns) combines cyclomatic complexity with test coverage to estimate
how risky a function is to change. High complexity plus low coverage yields a high CRAP score.

The repo's analysis tooling computes scores; agent-toolbelt does not calculate CRAP — it reads the
report JSON the tooling produces.

## Default threshold

Config default: **30**. Functions scoring above the threshold are flagged for refactor.

| Score range | Typical risk level |
|---|---|
| 1–5 | Low |
| 6–10 | Acceptable |
| 11–20 | Moderate |
| 21+ | High |

Exact risk labels come from the report's `riskLevel` field when present.

## Relationship to maintainability taxonomy

CRAP is the **numeric gate** for complexity + coverage risk. When refactoring, use tactics from
`shared/contracts/references/maintainability-taxonomy.md`:

- **Complexity** smells → extract helpers, reduce nesting, simplify conditionals
- **Coverage gaps** → add behavior-pinning tests (see `cover` skill for test authoring discipline)

## Exit code convention

Repo tooling should follow:

| Exit code | Meaning |
|---|---|
| `0` | All functions at or below threshold |
| `1` | One or more functions exceed threshold (expected refactor signal) |
| `2` | Tooling/config error |

The orchestrator treats exit `0` and `1` as successful analysis runs; exit `2+` as **ERROR**.
