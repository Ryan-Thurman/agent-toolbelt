# Review feature files that a developer wrote

Use this page to review feature files that a developer wrote. You get a list of findings, ranked by risk, and each finding has a suggested rewrite. Gherkin is the Given/When/Then text format that behavior-driven development (BDD) tools read. This page is not for you if the feature files do not exist yet (use the write mode of `bdd-scenarios`) or if the criteria are vague (use [Refine a vague story](qa-refine-a-vague-story.md) first). You must say if the files are good enough to build against.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer. The developer who wrote the files answers the findings. | [`bdd-scenarios`](../../skills/bdd-scenarios/SKILL.md) (`/bdd-scenarios --review`) | No levels. The skill has one review checklist. | The feature files, and the acceptance criteria that they cover |

## Quick path

1. Start Claude Code in the repository that holds the feature files, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Review the files: `/agent-toolbelt:bdd-scenarios <feature-folder-or-file> --review`. In the sample, the value is `features`.
3. Read the findings from the top. A finding about a scenario names the file, the scenario, the broken rule, and a rewrite. A finding about an unfinished check gives a question. Send the findings at the top (the run labeled them High) to the developer first.
4. Finish the checks that the review cannot do alone. Add the criteria to the prompt from step 2: `/agent-toolbelt:bdd-scenarios <feature-folder-or-file> --review`, with the criteria in `<criteria-file>`. This is practice. The skill names no input for criteria, and this run did not test it. If the repository has a runner, run its Gherkin dry run.
5. After the developer changes the files, run step 2 again.

Stop when each top finding has an answer and the criteria check is done. If the criteria are vague, use [Refine a vague story](qa-refine-a-vague-story.md) first.

You get a ranked list of findings with suggested rewrites. The skill changes no file.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

A developer opened a pull request that adds two feature files for the story CON-12 "Bookmark articles". The files hold 20 scenarios. You must decide if the scenarios describe the right behavior, cover the failure paths, and trace to the criteria. The code does not exist yet, so you cannot run the scenarios.

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The two files are `article-bookmarks.feature` and `bookmark-list.feature`. The page [Refine a vague story](qa-refine-a-vague-story.md) shows how the Toolbelt wrote them. In this run the same agent that wrote the files also reviewed them, and no developer took part. The sample repository has no BDD runner and no step definitions (the code that a runner calls for each step).

A scenario can have a tag, such as `@AC-1`. In the sample, `@AC-<n>` names the acceptance criterion that the scenario proves. The tag `@api` marks a scenario at the HTTP boundary. The tag `@negative` marks a scenario for a failure path. A Rule is a group of scenarios for one business rule. A Scenario Outline is a scenario that runs once for each row of an Examples table.

The run used the Toolbelt at commit 695056c, which includes the skill fixes of pull request 58. That pull request did not change how `--review` works. It added only a flag column to the mode table.

## Why this path

The obvious alternative is to read the files in the pull request diff, or to run `/review-diff` or `/pr-review` on the pull request. These commands review code. The `pr-review` references contain no Gherkin checks. A search for "gherkin", "bdd", and "feature file" in its skill and references finds none. The cost here is that a missing failure scenario or a step with no setup passes as ordinary text.

A second alternative is [`story-refinement`](../../skills/story-refinement/SKILL.md) with `--check`. It tests the criteria, not the scenarios. Use it first when the criteria are vague. The cost is a round of owner questions before any scenario review. The page [Refine a vague story](qa-refine-a-vague-story.md) shows that path.

The review mode of `bdd-scenarios` uses a fixed checklist of 11 checks (`references/review-checklist.md`). It also uses the negative-testing families and the test-level rules that the skill writes with. A negative family is a kind of failure, such as bad input, no sign-in, limits, or concurrency. The review reads files and reports. It does not run a scenario, and it does not edit a file. You can run it before any code exists.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all bdd-scenarios /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:bdd-scenarios` (plugin) or `/bdd-scenarios` (installed copy). |
| 2 | Check out the pull request branch. Find the feature folder, for example `git ls-files '*.feature'`. In the sample, the two files are in `features/`. | The review needs the files as the developer wrote them. | You have a list of the feature files in the pull request. |
| 3 | Run `/agent-toolbelt:bdd-scenarios <feature-folder-or-file> --review`. In the sample, run `/agent-toolbelt:bdd-scenarios features --review`. | The `--review` flag selects the review checklist and a findings report. The skill asks for no runner choice in this mode. | The report lists findings. A finding about a scenario has a file, the scenario, the broken rule, and a suggested rewrite. A finding about an unfinished check or an owner answer has a question. `git status` shows no change to the feature files. |
| 4 | Read the findings from the top. Start with a missing failure path. | The skill ranks a missing failure path for a business rule before a wording problem. | Each top finding has a named owner and a decision: change, reject with a reason, or question. |
| 5 | Read the negative families. The list of ten families is in `shared/contracts/references/negative-testing.md`. The checklist reports a family that applies but has no scenario. If the report gives a state for each family, as this run did, check each `Not applicable` reason against the story. | The negative-testing rules name three states: `Covered`, `Not applicable` with a reason, and `Gap`. A wrong reason hides a gap. | You agree with each reason, and each `Gap` has an owner. |
| 6 | Finish the checks that the review cannot do alone. Name the file with the acceptance criteria in the same prompt. If the repository has a runner, run its dry run to find syntax errors. This is practice. The skill names no input for the criteria, and this run did not do it. | Traceability means that each criterion maps to a scenario. The check needs the criteria. The checklist has no syntax check. | Every criterion has a scenario or a named unit test, and the runner (if any) loads each file. |
| 7 | Send the findings to the developer, with each rewrite. Send the questions for the owner to the owner. | The skill only reports. The decision to change a scenario belongs to the developer and the owner. | Each finding has an answer: change, reject with a reason, or open question. |
| 8 | After the developer changes the files, run step 3 again. | A rewrite can add a new finding, for example a new outline row with no setup. | The top findings are closed, and no new top finding appears. |

## Decision points

- If the files have no `@AC-` tags and no criteria list exists, stop and ask the developer for the criteria. The traceability check has nothing to compare.
- If the criteria are vague, choose [`story-refinement`](../../skills/story-refinement/SKILL.md) first. The page [Refine a vague story](qa-refine-a-vague-story.md) shows how.
- If the feature files do not exist yet, choose the write mode (`/bdd-scenarios` with no flag). The same page shows the write mode.
- If the repository has no runner, continue the review. Feature files do not depend on the runner, and the review reads only text. To plan a runner, use `--setup`. The page [Set up a BDD runner](qa-set-up-a-bdd-runner.md) shows that path.
- If a finding depends on an unanswered question, mark it as an open question. Do not accept the scenario as correct, and do not ask the developer to delete it.
- If a scenario has exactly ten steps, decide with the team. The checklist flags "about ten or more steps". The writing guide accepts "about ten steps or fewer".
- Stop when each top finding has an answer, and the criteria check is complete.
- Choose [`/review-diff` or `/pr-review`](../../skills/pr-review/SKILL.md) for the step definitions and the application code in the same pull request.
- Choose [`test-case-design`](../../skills/test-case-design/SKILL.md) when the question is what to test, not whether the scenarios are good. The page [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md) shows it.

## What you get

The run was headless, so no person answered a question. This mode asks none. The skill names no output location. Findings normally appear in the reply. This run saved them in a file. The run did not pass the criteria, so the criteria check stayed half done.

The report has nine findings. A finding ID such as F-1 is this run's numbering. The skill sets no ID scheme. The risk labels High, Medium, and Low are also the run's choice, because the skill says only "sort the findings by risk". Two findings ranked High: F-1 and F-2.

F-1 is a missing failure path. Rule 1 rejects a bookmark on an unknown article (AC-3). Rule 2, which removes a bookmark, has no such case. AC-3 and AC-6 are criteria from the earlier refinement run.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with Toolbelt 695056c and `--review`. Lines are wrapped, and `...` marks skipped text.

```markdown
### F-1 Failure paths. Risk: High
File: `article-bookmarks.feature`. Rule: "A reader can remove a bookmark".
Check broken: a rule has a success scenario but no failure scenario, and a
failure path exists.
...
@AC-<n> @api @negative
Scenario: Remove a bookmark from an article that does not exist
  Given a signed-in reader
  When the reader removes the bookmark from an article that does not exist
  Then the request is rejected because the article is not found
  And the reader's bookmarks do not change
```

The review does not invent the criterion ID. The rewrite keeps `AC-<n>`, because the owner must add the criterion. The review also notes that AC-6 expects success when the bookmark does not exist. The two "does not exist" cases can give different results, and the owner must say which result is right.

F-2 is a step with no setup in a Scenario Outline. The run found it by reading the Independence check with the writing guide rule "Put only the data that matters to the rule in the scenario". The checklist names no setup check for outline rows, so do not expect the skill to prescribe this check.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped. The text is verbatim.

```markdown
### F-2 One behavior and setup. Risk: High
File: `article-bookmarks.feature`. Scenario Outline: "A bookmarked article
shows as bookmarked" (AC-12).
...
The `Given` has no favorite. The row "removes their favorite from the
article" has nothing to remove, so the `When` has no valid start. The
`Given` also says the reader follows the author. Only the row "reads
their feed" needs that fact.
```

Last, the family table shows what the files do not cover. The table is this run's addition. The checklist asks only for a finding when a family applies and has no scenario.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the rows that were `Covered` or `Not applicable` are left out. The text of the rows that remain is verbatim.

| Family | State | Reason |
| --- | --- | --- |
| Authentication | `Gap` (partial) | An expired sign-in appears only for "list bookmarks" (AC-4). It is absent for "bookmark an article" and "remove a bookmark". Add the rows, or write why one row proves all three. |
| Limits and quotas | `Gap` | No maximum number of bookmarks is stated. Ask the owner. |
| Concurrency | `Gap` (partial) | Two bookmark requests at once are covered (AC-2). Two remove requests, or a bookmark and a remove at once, are not. |

What you must check in the output:

- A finding about a scenario names the file, the scenario, the rule, and a rewrite. A finding without a rewrite is incomplete. A finding about a check that the review did not finish, or one that needs an owner answer, gives a question instead. In this run, F-5 (criteria check) and F-9 (time ordering) are of that kind.
- The report says which check is unfinished. This run had no criteria. The traceability check confirmed only that the tags `@AC-1` to `@AC-18` have no number missing (finding F-5).
- The run did not execute any scenario. It did not parse the files, because the sample has no Gherkin parser.
- This run's report also lists the checks with no finding. No scenario had more than one `When` action or more than four steps. The skill does not require that list.

## Common mistakes

- You expect the review to fix the files. It reports only, so the developer must change them. Check `git status` after the run: the files must stay unchanged.
- You read "no finding" as "the scenarios pass". The review reads text. No scenario ran, and no code exists for them to run against.
- You accept the criteria check without the criteria. Without a list, the check can compare only tags. A missing criterion stays invisible.
- You accept a `Not applicable` reason without reading it. A wrong reason turns a gap into a pass.
- You skip a review because the author is careful. In this run the same agent wrote and reviewed the files. The review still found two findings that it ranked High.
- You treat the risk labels as a standard. The skill sets none. Ask the team how it ranks findings before you compare two reports.

## Next

- [Set up a BDD runner](qa-set-up-a-bdd-runner.md): when the review is clean and the files need a runner that executes them.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when the findings point to cases that only a unit test can prove.
- [Find coverage gaps before release](qa-find-coverage-gaps-before-release.md): when the code exists and you want to know which paths lack tests.
- [Refine a vague story](qa-refine-a-vague-story.md): when the findings show that the criteria are the problem.
- [Use-case index](README.md): the full list of use-case pages.
