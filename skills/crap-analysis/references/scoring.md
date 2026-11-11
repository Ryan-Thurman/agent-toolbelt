# CRAP scoring reference

## What CRAP measures

**CRAP** (Change Risk Anti-Patterns) combines cyclomatic complexity with test coverage to estimate
how risky a function is to change. High complexity plus low coverage yields a high CRAP score.

The repo's analysis tooling computes scores; agent-toolbelt does not calculate CRAP — it reads the
report JSON the tooling produces.

The usual formula is `complexity² × (1 − coverage)³ + complexity`, with coverage as a fraction.
A function with no coverage data gets the maximum score for its complexity.
Thus a new file that no test loads is the highest-risk case.
Some coverage formats, for example lcov, list only the files that tests load.
Make sure that the analysis command also scores source files that are not in the coverage file.
The `review` op lists changed files with no report entries in `changedFilesWithoutFunctions`.

## Default threshold

Config default: **30**. Functions scoring above the threshold are flagged for refactor.

| Score range | Typical risk level |
|---|---|
| 1–5 | Low |
| 6–15 | Acceptable |
| 16–30 | Moderate |
| 31+ | High |

The default threshold flags only High scores.
The bundled fixtures use `16` to show a stricter repository that also flags Moderate scores.
Exact risk labels come from the report's `riskLevel` field when present.

## Relationship to maintainability taxonomy

CRAP is the **numeric gate** for complexity + coverage risk. When refactoring, use tactics from
`shared/contracts/references/maintainability-taxonomy.md`:

- **Complexity** smells → extract helpers, reduce nesting, simplify conditionals
- **Coverage gaps** → add behavior-pinning tests (see `cover` skill for test authoring discipline)

`references/cli.md` defines the exit codes for the orchestrator and the configured commands.
