# Test-driven development

Use test-driven development (TDD) for new or changed executable behavior during authorized implementation.
TDD checks each behavior with a failing test before the implementation, then a passing test afterward.
Follow the source requirements, repository test policy, and the user's explicit choices.

Use existing validation for prose, generated output, or simple configuration when a new test only repeats the change.
Preserve existing code and user edits when adding tests to work already in progress.
Report tests added afterward as test-after coverage. Keep the working code instead of deleting it to recreate a test-first sequence.
Implementation authorization includes relevant test edits within scope. Add those tests without separate approval.
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
| Check red | Inspect the failure before implementing the behavior. | The failure matches the intended case. Setup, syntax, and infrastructure failures are excluded. |
| Green | Add only the implementation needed for that behavior, then rerun the test. | The assertion passes without weakening the requirement or hiding the failure. |
| Check related behavior | Run the affected tests after the behavior change. | Relevant tests pass, or failures are investigated and reported. |
| Refactor if useful | Make a small behavior-preserving cleanup within the approved scope after green. | The affected tests still pass. No new behavior or unrelated cleanup enters the change. |

Complete each cycle before you write the next test.
If a new test already passes, record existing coverage and select an unmet requirement.
If a test expectation is mistaken, correct it from source evidence and repeat the red check.
For a bug fix, the first case must capture the confirmed symptom before repair.
For existing passing behavior, use characterization tests and identify them separately from test-first evidence.

## Acceptance loop with BDD scenarios

Use this loop when the phase has Given/When/Then scenarios in feature files, for example from `bdd-scenarios`.
The scenario is the outer loop. The unit TDD cycle above is the inner loop.

| Step | Do | Done when |
| --- | --- | --- |
| Outer red | Put the phase's scenarios from the plan in the feature files, remove their `@wip` tag, and write the missing step definitions. Then run the scenarios before the implementation. | The runner selected each scenario of the phase. Each new scenario fails because the behavior is absent, not because a step is missing. |
| Inner cycles | Implement the behavior with the red, green, and refactor cycle above, one unit behavior at a time. | Each unit behavior has red and green evidence. |
| Outer green | Run the phase's scenarios again. | Every scenario of the phase passes, and scenarios of earlier phases still pass. |

A scenario that passes before the implementation proves existing behavior. Record it as existing coverage.
Remove `@wip` only from the scenarios of the current phase.
During the inner cycles, the phase's scenarios stay red. This is expected until outer green.
Record outer red and outer green evidence with the unit evidence.

## Unit tests that detect defects

Name the observable behavior and the realistic defect each test detects.
Assert through callable interfaces, including a module's public functions. Avoid assertions about private structure.
Keep private methods private. Keep test-only hooks out of production code.
Derive expected results from source requirements, worked examples, or independently checked fixtures.
Keep each expected result independent of the implementation and its algorithm.

Keep project logic real inside the unit under test.
Replace external I/O, clocks, or randomness at their boundaries when needed for deterministic tests.
Replace live network services with substitutes in unit tests.
Keep fixtures isolated and clean up temporary state.
Assert results and contractual effects. A successful mock invocation alone does not prove the behavior works.
Use integration evidence when a substitute hides a required interaction.

## Coverage and completion

Use the repository's coverage command when available and inspect uncovered branches in the changed behavior.
Coverage measures execution, not assertions. Add cases for missing decisions, boundaries, and failure outcomes, not to raise the number.
Use the repository's coverage targets. Do not lower thresholds or add exclusions to pass.
If coverage tooling is unavailable, report coverage as unmeasured and identify the behavior the tests establish.

Before handoff, run the relevant suite and repository-required checks against the final change.
Keep concise evidence in the existing execution record: behavior, expected red failure, commands, results, and tested revision.
Include the coverage command, measurement scope, uncovered changed behavior, and any manual or integration gaps.
Distinguish passing checks, pre-existing failures, and checks that did not run.
Report readiness only when required checks pass and required behavior is verified.
