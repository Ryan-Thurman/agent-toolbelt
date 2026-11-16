# Run a retrospective with papercuts after a feature

This page is for a tech lead or engineering manager who wants to collect the friction that a feature caused. You get a ranked list of codebase fixes, with one file named for each fix. You also get a delivery retrospective. Its improvements each have an owner, a done condition, and a review trigger. Use another page when you want customer results or an incident review (see Decision points).

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead, engineering manager | [`papercuts`](../../skills/papercuts/SKILL.md) (`/papercuts --feature`), then the playbook [delivery retrospective](../../workflows/delivery-retrospective-workflow.md) | No levels. Neither the skill nor the workflow has a depth setting. | A feature branch, a pull request, or a ticket. The records of the work: plan, phase files, handoffs, review notes. A checkout of the repository. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Collect the friction: `/agent-toolbelt:papercuts --feature <branch | pr-number | ticket-id>`. Do not add `--post` here. Step 6 of Steps explains that flag.
3. Open the saved report in `.atb-work/papercuts/`. For each row, run the narrowest command that shows the stated cause: `<test command> <path>`. Note the environment it needs, such as a database or a variable. If the command cannot run, mark the row `not verified`. Also check that the fix names one file.
4. Tell the agent: `Follow <toolbelt-folder>/workflows/delivery-retrospective-workflow.md for <branch>. Use the papercut report <report-path>. Write a local report only.` With the plugin, `<toolbelt-folder>` is the plugin folder. With an installed copy, it is `.agents`, the folder that holds `workflows/` in the project. The workflow names the output path, `.atb-work/delivery-retrospective/<scope-slug>.md`.

You get a ranked papercut report and a local retrospective report. Nothing is posted, committed, or sent to a tracker.
The sections below explain each step, when to stop, and what the output looks like. If you already have a saved papercut report, start at step 7 of Steps and pass its path.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The team built a bookmark feature, ticket CON-12, in two phases. Phase 1 is done on the branch `feat/con-12-bookmarks-1`. It has three commits: `f8a0b0d`, `9f8b530`, and `6a33a58`. Phase 2 has not started, so the feature is not finished. The base is commit `30b68e1`.

Two earlier runs left the records. The refinement of the story is on the page [Refine a vague story](qa-refine-a-vague-story.md). The phase plan, the phase review, and the notes of the delivery are on the page [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md). The branch has no pull request, no review thread, and no CI run. The sample has no CI file.

You must decide what to fix in the repository before phase 2, and what to change in the way the team delivers. The IDs in the excerpts have these meanings. `AC-n` is an acceptance criterion of CON-12. `F-n` is a finding in the phase review. `LR-n` is a lesson and `I-n` is an improvement in the retrospective.

A papercut is friction that the codebase, its docs, or its tooling caused. The difficulty of the task is not a papercut. A Self-review is a review that the author runs alone, because no independent reviewer was available. In this run, every review was a Self-review.

## Why this path

The obvious alternative is `/papercuts` with no flag. It reports on the session that you are in, and nothing else. In this case most of the friction sits in two earlier runs and in the phase files. Session scope reads none of it. The `--feature` scope reads the plan, the phase files, the handoffs, the review threads, the CI runs, and the commits of one branch.

The second alternative is the retrospective workflow alone. Its first step reads the papercut reports as one of its inputs. Without a report, you collect repository friction by hand and mix it with process lessons. The two outputs answer different questions. The papercut report lists fixes for the repository. The retrospective lists lessons and changes to the delivery process.

The third alternative is [`product-outcome-review`](../../skills/product-outcome-review/SKILL.md). The workflow points to it for customer results. Use it when you ask if the feature helped customers. The page [Review product outcomes after a release](product-review-outcomes-after-release.md) shows that path. It does not list friction.

The procedure has this order because the workflow reads the papercut report as an input (its step 1). The skill only reports in its default mode. It changes no repository file and posts nothing unless you pass `--post`. It writes the report under `.atb-work/`. The workflow can produce a local report without notifying anyone.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install both packs into the project: `./install.sh --harness all papercuts ship-it /path/to/project`. | The `ship-it` pack carries the retrospective workflow file. The `papercuts` pack alone does not. | You type `/` and see `/agent-toolbelt:papercuts` (plugin) or `/papercuts` (installed copy). |
| 2 | Start in the repository folder. Check the branch and its commits: `git log --format='%h %s' <base>..<branch>`. In the sample: `git log --format='%h %s' 30b68e1..feat/con-12-bookmarks-1`. | The skill needs the branch. For a pull request or a ticket, it finds the branch first. | You can name the branch, the base, and the records that exist. |
| 3 | Run `/agent-toolbelt:papercuts --feature <branch \| pr-number \| ticket-id>`. In the sample: `/agent-toolbelt:papercuts --feature feat/con-12-bookmarks-1`. | The skill reads only the records that exist. For a pull request it uses the host CLI that the Toolbelt selects (`gh` or `az`). Without the host CLI it uses the local branch and states the limit. | The reply gives the path of a report in `.atb-work/papercuts/<date>-<scope-slug>.md`. |
| 4 | For each row, run one command that shows the cause. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/auth.service.test.ts`. Then swap two lines and run it again. Restore the file with `git checkout <file>`. | A record can state a wrong cause. The skill asks for a codebase cause. It now also requires that you read the source or the command output that shows the cause. A cause from a record alone is a candidate, not a row. | Each row has a cause that a command shows, or you mark the row `not verified`. |
| 5 | Read the report. Check the rank, the `Fix` column, the `Key` column, and the line that lists the sources. | The skill requires a named file and a change for each fix. It ranks the cause that every future person will hit first. | Each row is not yet fixed, has a key, and names the file that its fix changes. |
| 6 | Only when you have a team log: run the whole command from step 3 again with `--post <team-log.md>`. The skill makes the report again. For a Markdown file, it reads the target, marks repeated keys, and shows the exact text. A flag from a script counts as confirmed, so run it by hand. | The preview shows the text that the write adds, before anything changes. The skill appends to the end of the file and does not commit or push. | You saw the text and the path. After you confirm, the last lines of the file hold the marker. If you decline, the file is unchanged. |
| 7 | Start the retrospective. Use the prompt in the Quick path, with your branch and the report path. | The workflow reads the plan, the changes, the review findings, the checks, and the papercut reports. | The report holds the inputs, expected and observed results, lessons, and improvements. |
| 8 | Read each improvement. Give each one a person who accepts it, or discard it. | The workflow selects improvements with owners and review triggers. It does not invent approvals. | Each kept improvement has a named person. Policy changes go to the project that owns them. |

## Decision points

- If nothing slowed the work, stop. The skill writes one sentence and makes no table.
- If you work on one session only, use `/papercuts` with no flag. The session scope is the default.
- If the target log already holds the marker of this entry, the skill does not post again. It reports the earlier entry.
- If you have no team log, skip `--post`. The saved report is the entry, and you can paste it where you want.
- If the target is a GitHub issue, the skill adds one comment. For an Azure Boards work item, it adds one discussion comment. For Jira or another tracker, it shows the entry and you paste it. Read `report-format.md` in the skill before you use one of these targets.
- If a row has no checked cause, do not fix it. In this run, such a row is marked `not verified` and stays in the report. The skill does not define this mark. It requires the cause check and treats an unchecked cause as a candidate.
- If the feature is not finished, run the retrospective as a checkpoint and say so. The workflow says "after completed work". Name what the next phase can still change.
- If a candidate is a defect, track it as a bug. A failed test from a real bug is not a papercut. The sample has one, which the run read in the code and did not execute: favoriting an unknown slug returns status 500.
- Stop the papercut run when the report file exists, and each row is not yet fixed, has a key, and names a fix file. This is what the skill requires, with a checked cause for each row. This page adds the mark `not verified` for a row whose check cannot run.
- Stop the retrospective when each improvement has an owner, a done condition, and a review trigger.
- If you want only the repository fixes, skip the retrospective. If you already have a papercut report, start at step 7 of Steps and pass its path.
- Choose [Review product outcomes after a release](product-review-outcomes-after-release.md) when you want customer results. Choose [Follow up an incident](sre-follow-up-an-incident.md) when the friction is an incident. Choose [Choose technical debt to pay](lead-choose-tech-debt-to-pay.md) when the report shows more rows than the team can pay.

## What you get

The run was headless, so no person was present. The skill asks one question: confirm before the write. The run stopped at the preview and wrote nothing. The skill now gives the report state in the reply: `saved`, `preview`, or `posted`. This run ended in `preview`. All reviews in the records are Self-reviews. A real run on a project with pull requests also reads review threads and CI runs. This run had neither, and the report says so in its sources line.

First, row 1 of the papercut report. It corrects the cause that three records gave.

Excerpt from a run on the Conduit sample API at commit `6a33a58`. This is row 1 of 8, with its cells unchanged.

| # | Papercut | Cost | Fix | Key |
| --- | --- | --- | --- | --- |
| 1 | `src/tests/services/auth.service.test.ts` imports the service before `../prisma-mock`. The `jest.mock` call in `prisma-mock.ts` therefore comes too late, and 7 of 12 tests use the real Prisma client. | 7 tests fail on every run and look like "no database". Every phase record carried them as a known baseline. A real auth regression hides among them. | Swap lines 2 and 3, so `prismaMock` loads first. With that swap, 12 of 12 tests pass with no database. | `tooling:src/tests/services/auth.service.test.ts` |

The run executed the check. Before the swap, the file showed 7 failed and 5 passed. After the swap, it showed 12 passed. Nothing in the file needed a database. The key has the form `<category>:<path-or-command>`. A team uses it to match the same papercut in later reports. The report has seven more rows. They cover the mock type error, the repeated article response code, and the Prettier configuration. They also cover `src/main.ts`, the README, the lint baseline, and a stale e2e test.

The report also lists what the run removed. One example is the line "`prisma format` realigned 15 lines". On `master`, `prisma format` changes nothing, so the new relation fields caused it and the formatter is correct.

Next, the preview for the team log.

Excerpt from a run on the Conduit sample API at commit `6a33a58`. This is the head of `post-preview.md`. Lines are wrapped, and `...` marks skipped text: the end of the Status line, which names a private run lesson, and the report text after the marker. That report is the one from the first excerpt. The `repo/` in the Target line is the run's own folder, which you do not have.

```text
Command: `/papercuts --feature feat/con-12-bookmarks-1
  --post docs/papercuts.md`
Target: `docs/papercuts.md` in the Conduit copy (`repo/`).
  The file does not exist, so no earlier entry has a
  repeated key and the marker is new.
Action: append the text below at the end of the file.
  No commit, no push.
Status: preview only. Nothing was written. ...
--- preview of the exact text ---
<!-- papercuts:con-12-bookmarks:2026-11-15:6a33a58 -->
```

The command and the target are the run's examples. Check three things in your own preview. The target is the file that you meant. The marker is new, or the skill names the earlier entry. The text has no names of people and no secrets.

Last, two rows of the retrospective report.

The `checks/` files in the Source cell are the run's saved command output and are not in the repository.

Condensed from the run report: the "Expected and observed" row for the baseline and the improvement `I-1`. The other rows are cut. The cells are unchanged.

| Topic | Expected (plan) | Observed | Source |
| --- | --- | --- | --- |
| Baseline | 7 tests in `auth.service.test.ts` fail because no database runs. | The cause is the import order in that test file. After a two-line swap, 12 of 12 pass with no database. | `checks/01-` and `checks/02-` |

| ID | Improvement | Proposed owner | Done when | Review trigger |
| --- | --- | --- | --- | --- |
| I-1 | Swap lines 2 and 3 of `src/tests/services/auth.service.test.ts`. Remove "7 known failures" from the plan baseline. | The developer who opens the phase 1 pull request | `npx jest src/tests/services/auth.service.test.ts` reports 12 passed. The plan baseline line reads "no known failures". | A new service test file shows a failure that comes from the real client |

The report has five improvements and three lessons. Check each improvement for an owner, a done condition that a command can show, and a review trigger. In this run the owners are roles, and the section heading marks the items as proposed, because no person accepted anything. The run predates PR #60. The workflow now lists such an item as `Proposed` with the owner `Unassigned`. The "Limits" paragraph of the report states the limits on duration and on owner decisions. The records have no timestamps and no recorded opinions.

What the run did not execute: any test that needs a database, `nx lint`, `nx test`, and the e2e project. The e2e finding comes from reading `e2e/src/server/server.spec.ts` and `src/main.ts`. The run applied no fix. It tried the import swap and restored the file. It wrote nothing to `docs/papercuts.md`.

The run used the skill files and the workflow as they were at the commit of this run. The two input runs used `story-refinement` and `phased-delivery` before this page. After a skill update, check the claims of this page again.

## Common mistakes

- You copy a cause from a record. Three records said "no database", and the real cause was an import order. A reader who trusts the records starts a database for nothing. Run one command per row before you rank it.
- You report formatter noise as friction. On the base commit, `prisma format` changes nothing. Run the formatter on the base before you write the row.
- You write "improve the docs" as a fix. The skill requires the exact file and the change. A row without a fix file does not belong in the report.
- You pass `--post` before you read the target. The skill shows a preview and asks for confirmation. The posting contract says that a flag from a script or a CI job counts as confirmed when the pack names it as its posting flag. Pass `--post` only when you want the write.
- You put a name in a row. The skill allows files, commands, and records only. The person who posts the entry can add their own name.
- You call an improvement accepted. The workflow does not invent approvals. An item is accepted only when a person says so.
- You use this retrospective as a source of team opinions. It reads records only. Ask the team, then add their answers.

## Next

- [Prepare a release and decide go or no-go](lead-prepare-a-release.md): before the release, when the feature is finished.
- [Choose technical debt to pay](lead-choose-tech-debt-to-pay.md): when the report holds more rows than the team can pay.
- [Set up quality rails](lead-set-up-quality-rails.md): when the lint, format, and test rows point to a missing gate.
- [Clean up after a feature](dev-clean-up-after-a-feature.md): when a row is a leftover from the feature and a developer can fix it now.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): the same import-order finding, found while a test case was turned into a test.
- [Review product outcomes after a release](product-review-outcomes-after-release.md): for the customer result.
