# Feature file review

Read this to review existing feature files. Report findings. Do not change the files.
Give each finding the file, the scenario, the rule that it breaks, and a suggested rewrite.

| Check | Finding when |
| --- | --- |
| Business language | A step names a screen element, a selector, a URL, a status code, a table, or a function. |
| One behavior | A scenario has more than one `When` action, or about ten or more steps. |
| Failure paths | A rule has a success scenario but no failure scenario, and a failure path exists. |
| Negative families | A family in `shared/contracts/references/negative-testing.md` applies, but no scenario or unit test covers it. |
| Observable results | A `Then` step checks internal state that a user or a client cannot observe. |
| Independence | A scenario depends on data or state from another scenario. |
| Duplication | Several scenarios differ only by values and can be one `Scenario Outline`. |
| Background | The `Background` has more than three steps, or some scenarios do not need it. |
| Traceability | A scenario has no criterion tag, or a criterion has no scenario or named unit test. |
| Level | A scenario runs at a higher level than `shared/contracts/references/test-levels.md` requires, for example an edge case as `@e2e`. |
| Stale work | A scenario of a completed phase still has `@wip`, or a step definition has no scenario. |

Sort the findings by risk. A missing failure path for a business rule comes before a wording problem.
