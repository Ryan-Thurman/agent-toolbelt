# Feature file review

Read this to review existing feature files. Report findings. Do not change the files.
Give each finding the file, the scenario, the rule that it breaks, and a suggested rewrite.
Write the findings as a table with these columns: `File`, `Scenario`, `Rule broken`, `Risk`, and
`Suggested rewrite`. Rate `Risk` as High, Medium, or Low. A High finding breaks a business rule or
hides a failure path. A Low finding is a wording or layout problem.

| Check | Finding when |
| --- | --- |
| Syntax | A file does not parse. Run the runner's generator or dry run when the repository has one. Otherwise, check each keyword by reading the file. |
| Business language | A step names a screen element, a selector, a URL, a status code, a table, or a function. |
| One behavior | A scenario has more than one `When` action, or more than ten steps. |
| Failure paths | A rule has a success scenario but no failure scenario, and a failure path exists. |
| Negative families | A family in `shared/contracts/references/negative-testing.md` applies, but no scenario or unit test covers it. |
| Observable results | A `Then` step checks internal state that a user or a client cannot observe. |
| Independence | A scenario depends on data or state from another scenario. |
| Time or order | A scenario depends on the current time, a fixed date, or the order of the scenarios. |
| Outline data | A `Scenario Outline` row needs different `Given` setup from the other rows. Split the outline. |
| Duplication | Several scenarios differ only by values and can be one `Scenario Outline`. |
| Background | The `Background` has more than three steps, or some scenarios do not need it. |
| Traceability | A scenario has no `@AC-` or `@FS-` tag, or a criterion has no scenario or named unit test. |
| Level | A scenario runs at a higher level than `shared/contracts/references/test-levels.md` requires, for example an edge case as `@e2e`. |
| Stale work | A scenario of a completed phase still has `@wip`, or a step definition has no scenario. |

For each family in `shared/contracts/references/negative-testing.md`, record `Covered`, `Not applicable`
(with a reason), or `Gap`, as the "Negative coverage" table of `templates/bdd-scenarios.md` does.

When the reviewer holds feature files only, the Traceability check cannot run. Mark it `Not verified`,
and list the `@AC-` and `@FS-` tags that the files contain.

Sort the findings by risk. A missing failure path for a business rule comes before a wording problem.
