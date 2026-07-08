# CRAP refactor mode

Apply-on-opt-in refactoring guided by the refactor brief produced by the repo's analysis tooling.

## When to run

Only after `/do-crap-analysis` returns **REFACTOR** and the user confirms (via `/crap-refactor` or
explicit opt-in in chat).

## Flow

1. **Read** `outputs.refactorBrief` from config for the target — must exist on disk
2. **Read** the affected source file(s) cited in the brief
3. Apply **behavior-preserving** changes:
   - When coverage is the primary driver (`coveragePercent` low): add targeted tests for uncovered
     paths listed in the brief
   - When complexity dominates: extract helpers, reduce branching at lines listed under
     **Complexity drivers**
4. Do not weaken existing tests or change observable behavior
5. Run verify **once** via orchestrator:
   ```bash
   bash skills/crap-analysis/bin/crap-analysis.sh verify --target {target}
   ```
6. **Read** the new report JSON; apply the review decision table from `references/review.md`
7. Report PASS or remaining REFACTOR gap

## Principles

- Follow numbered actions from the brief's **Recommended actions** section in order
- Prefer the smallest change that reduces CRAP below threshold
- If verify still fails, report the new score and stop — do not loop verify automatically
- Honor `simplify-ignore` markers and existing abstraction boundaries where present

## Verify command

The verify command comes from config `commands.verify` — run only through the orchestrator, never
ad-hoc.
