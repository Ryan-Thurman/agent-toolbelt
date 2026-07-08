---
description: Apply behavior-preserving CRAP refactor for a target — reads the refactor brief, edits source/tests, runs verify once, and re-reviews the report. Apply on opt-in only after /do-crap-analysis flagged REFACTOR.
argument-hint: "<target>"
---

# /crap-refactor

Apply CRAP-driven refactoring for a configured target using the `crap-analysis` skill. Requires a
prior `/do-crap-analysis` **REFACTOR** outcome and explicit user confirmation.

**Arguments:** `$ARGUMENTS`

## Rules

- Read `skills/crap-analysis/references/refactor.md` and `references/review.md`.
- Target name is required (must match a key in `.crap-analysis.json`).
- **Behavior-preserving** — existing tests must pass without weakening assertions.
- Run verify **once** through the orchestrator only.

## Flow

1. Load `.crap-analysis.json`; resolve target from `$ARGUMENTS`.
2. **Read** `outputs.refactorBrief` for the target — must exist.
3. **Read** affected source file(s) from the brief.
4. Apply changes per `references/refactor.md` (tests when coverage-driven; extract/simplify when
   complexity-driven).
5. Run verify **once**:
   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh verify --target {target}
   ```
   Wait for exit.
6. **Read** the new `outputs.report`; apply review decision table.
7. Emit PASS or REFACTOR template from `references/review.md`.

## Output

Report what changed, verify exit code, and new CRAP score for the worst function in scope.
