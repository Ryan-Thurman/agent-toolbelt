# Test-driven development

Use test-driven development (TDD) for new or changed executable behavior during authorized implementation.
TDD checks each behavior with a failing test before the implementation, then a passing test afterward.
Follow the source requirements, repository test policy, and the user's explicit choices.

Use existing validation for prose, generated output, or simple configuration when a new test would only repeat the change.
Preserve existing code and user edits when adding tests to work already in progress.
Report tests added afterward as test-after coverage; do not delete working code to recreate a test-first sequence.
Implementation authorization includes relevant test edits within scope; do not request approval for each test.
Standalone test-only workflows retain their own editing rules.

## Prepare the tests

Read repository scripts, CI, coverage configuration, and nearby tests to identify the runner and conventions.
Reuse the existing test framework.
If none exists, report the gap and propose the smallest suitable setup within the task's authority.
Run the relevant existing tests before changing behavior and record baseline failures or unavailable dependencies.

Map source acceptance criteria to observable interfaces and expected results.
Identify important decisions, input boundaries, and error paths before coding.
Prefer fast unit tests for business rules, validation, calculations, and state transitions.
Use integration tests for component connections or persistence contracts that isolated tests cannot establish.
Unit tests alone do not establish browser behavior or external service compatibility.

## Implement one behavior at a time

| Step | Do | Done when |
| --- | --- | --- |
| Red | Write one focused test for an unmet source requirement, then run it. | The test fails because the required behavior is absent or wrong. |
| Check red | Inspect the failure before implementing the behavior. | The failure matches the intended case; setup, syntax, and infrastructure failures are excluded. |
| Green | Add only the implementation needed for that behavior, then rerun the test. | The assertion passes without weakening the requirement or hiding the failure. |
| Check related behavior | Run the affected tests after the behavior change. | Relevant tests pass, or failures are investigated and reported. |
| Refactor if useful | Make a small behavior-preserving cleanup within the approved scope after green. | The affected tests still pass; no new behavior or unrelated cleanup enters the change. |

Repeat this cycle for the next selected behavior.
Do not write all tests before all implementation.
If a new test already passes, record existing coverage and select an unmet requirement.
Do not invent a requirement or force an unrelated failure to obtain red.
If a test expectation is mistaken, correct it from source evidence and repeat the red check.
For a bug fix, the first case must capture the confirmed symptom before repair.
For existing passing behavior, use characterization tests and identify them separately from test-first evidence.

## Unit tests that detect defects

Name the observable behavior and the realistic defect each test detects.
Assert through callable interfaces, including a module's public functions; avoid assertions about private structure.
Do not expose private methods or add production hooks solely for tests.
Derive expected results from source requirements, worked examples, or independently checked fixtures.
Do not compute the expected result with the implementation or repeat its algorithm in the test.

Keep project logic real inside the unit under test.
Replace external I/O, clocks, or randomness at their boundaries when needed for deterministic tests.
Do not use live network services in unit tests.
Keep fixtures isolated and clean up temporary state.
Assert results and contractual effects; a successful mock invocation alone does not prove the behavior works.
Use integration evidence when a substitute hides a required interaction.

## Coverage and completion

Use the repository's coverage command when available and inspect uncovered branches in the changed behavior.
Coverage percentages measure execution; review the assertions and observable outcomes separately.
Add cases for meaningful missing decisions, boundaries, and failure outcomes.
Follow existing coverage thresholds without reducing them or adding exclusions to pass.
Do not invent a percentage target or add trivial tests to raise the number.
If coverage tooling is unavailable, report coverage as unmeasured and identify the behavior the tests establish.

Before handoff, run the relevant suite and repository-required checks against the final change.
Keep concise evidence in the existing execution record: behavior, expected red failure, commands, results, and tested revision.
Include the coverage command, measurement scope, uncovered changed behavior, and any manual or integration gaps.
Distinguish passing checks, pre-existing failures, and checks that did not run.
Do not report readiness while required checks fail or required behavior remains unverified.

## Sources

These instructions adapt ideas without requiring either upstream package:

- [Matt Pocock TDD](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd): incremental behavior slices, observable interfaces, and independent expectations.
- [Superpowers TDD](https://github.com/obra/superpowers/tree/main/skills/test-driven-development): observed red and green runs, minimal implementation, and cleanup after green.
