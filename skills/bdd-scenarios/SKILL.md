---
name: bdd-scenarios
description: Write or review Gherkin feature files from refined acceptance criteria, map steps to existing step definitions, and plan a BDD runner (playwright-bdd, pytest-bdd, or Cucumber-JVM). Use before test-first implementation or to review feature files.
---

# bdd-scenarios

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Behavior-driven development (BDD) describes behavior as Given/When/Then scenarios that the team can read
and that a runner executes as tests. This skill turns acceptance criteria into feature files.
The feature files are the outer test loop of `phased-delivery`. Unit test-driven development is the inner loop.

Choose the mode from the request:

| Request | Procedure | Result |
| --- | --- | --- |
| Write scenarios for a story or a phase. | The procedure below. | Feature files, a step map, and a traceability table. |
| Review existing feature files. | Read `references/review-checklist.md`. | Findings. No file changes. |
| Add a BDD runner to a repository. | Read `references/runners.md`. | A runner plan. Install it only when the user agrees. |

Write feature files to the repository only when the user asks, or inside an authorized `phased-delivery` phase.
Otherwise, report the feature text.

## Procedure

1. Read the acceptance criteria and their IDs. Prefer the output of `story-refinement`.
   If a criterion has no Given/When/Then form or no failure path, rewrite it and mark the rewrite as your draft.
   If many criteria are vague, send the item to `story-refinement` first.
2. Find the runner, the feature folder, and the existing step definitions.
   If the repository has no runner, read `references/runners.md` and stop for the user's choice.
3. Choose the level of each criterion with `shared/contracts/references/test-levels.md`.
   A criterion that only a unit test can prove well stays a unit test. Name the criterion ID in that test.
   Write Gherkin scenarios for the other criteria.
4. Write the feature files with `references/writing-features.md`.
   Add the negative scenarios from `shared/contracts/references/negative-testing.md` that apply.
5. Map each step to an existing step definition, or mark it as new. Reuse the wording of existing steps.
6. Build the traceability table: each criterion ID maps to a scenario or a named unit test.
   Report each criterion with no test as a gap.

## Completion

Deliver the feature files, the step map, and the traceability table in `templates/bdd-scenarios.md`.
State which scenarios are expected to fail before implementation.
Hand the scenarios to `phased-delivery`. Each phase lists the scenarios that it must turn from red to green.
