# Clean up a feature before you open the pull request

This page is for a developer whose feature works but whose diff is messy, for example with copied code blocks. You get a ranked list of smells, one behavior-preserving cleanup that you selected, and a check that the cleanup changed no behavior.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`simplify`](../../skills/simplify/SKILL.md) (`/code-smell`, then `/simplify`) | No levels. The skill has two modes, detect-only and apply on opt-in. | A repository with the feature, a folder or file to clean, and the commands that run your tests and type check. |

## Quick path

1. Start Claude Code in your repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Run `<test-command>` and `<type-check-command>` first, and keep the output as your baseline.
2. Scan the feature folder: `/agent-toolbelt:code-smell <feature-folder>`. This step edits nothing.
3. Plan the cleanup on one file: `/agent-toolbelt:simplify <file-path>`. Take the file with the most findings in the scan. Read the table and the answers to the "what tests cover it" question. The skill requires these answers before an edit. If the reply has none, ask for them for the row that you plan to select.
4. If no test can fail when the change is wrong, add a check first, or write the gap in the pull request. In the sample, the check records the `include` argument of each function before and after the change.
5. Select the `safe` rows that you accept. Use the description of each row, for example: `Apply the extract of the repeated include block only. Run <test-command> after the change.` The skill applies the rows one at a time and runs the tests after each.
6. Run `<test-command>` and `<type-check-command>` again. Commit the cleanup alone, apart from feature work.

The S-numbers (S1 to S13) belong to the scan and the C-numbers (C1 to C7) belong to the plan. They are the labels of the run, not of the skill.

You get a ranked smell list and a candidate table with a risk tier for each row. You also get one applied cleanup with a before and after test result.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma (a database library), Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run used commit 30b68e1 in a copy of the repository.

The feature is the article routes in `src/app/routes/article`. They work. The file `article.service.ts` has 652 lines. The same 21-line `include` block appears in 7 of its functions. The block is the Prisma option that lists the relations to load. You want to remove the copies before review, without a change in behavior. The scan reports each smell (a code pattern that costs maintenance) with a risk tier. The tier `safe` means the behavior is the same by inspection. The tier `confirm` means it is probably the same. The tier `review` means a person must judge it.

The copy had no working diff. The run named the folder and the file in the commands. In your repository, your messy diff takes that place. You can run `/simplify` with no argument to use the working diff, or with `previous` to use the last commit.

## Why this path

The skill that the `simplify` description names as the alternative is [`pr-review`](../../skills/pr-review/SKILL.md). It finds problems and applies nothing, and its standard and deep tiers split the review across sub-agents. It gives you a verdict on the diff. It does not give you the cleanup, so you must make each edit yourself. Its standard and deep tiers start sub-agents, so a verdict costs more time than a scan of one folder. Use it when you need a verdict, and use `simplify` when you already know the diff needs cleaning.

The other alternative is to ask the agent to "remove the duplicate code" with no skill. That costs you the safeguards of the skill. This is practice, not a skill claim. `simplify` gives each finding a risk tier and requires that you select what it edits. It also asks five questions before it removes anything. This list is the Chesterton's fence checklist. The questions are: what the code does, who calls it, which edge cases it handles, which tests cover it, and why it looks this way. The skill states that it never edits files unless you ask it to apply selected cleanup.

The procedure has this order because each step limits the next one. `/code-smell` ranks the whole area and cannot edit. `/simplify` then makes the case for each candidate (root issue, consequence, benefit), and edits only the rows that you select. This is practice, not a skill claim: the order lets you see the larger cleanups before you pick the small one.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness claude simplify /path/to/project`. | The commands must exist in your session. In plugin mode, add the `/agent-toolbelt:` prefix to each command below, so that Claude Code does not pick its own `/simplify`. | You type `/` and see `/agent-toolbelt:code-smell` and `/agent-toolbelt:simplify` (plugin), or `/code-smell` and `/simplify` (installed copy). |
| 2 | Record your baseline. Run `<test-command>` and `<type-check-command>`. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/article.service.test.ts` and `npx tsc --noEmit -p tsconfig.app.json`. | You compare the same commands after the change. A test that already fails is not a cleanup result. | You have a pass or fail result for each command. In the sample, the article tests pass (5 tests) and the type check is clean. If a command fails, see "Decision points". |
| 3 | Run `/code-smell <feature-folder>`. In the sample: `/code-smell src/app/routes/article`. | The scan ranks smells by severity and confidence in the whole folder. It cannot edit, so the cost of the scan is low. | The reply has a table of findings with a risk tier for each row, or an empty list. The skill saves no file, so ask for one if you want it. |
| 4 | Read the rows marked `safe` first. Check each `evidence` cell against the file. | The skill states a rule: a finding with no real consequence must not appear. You check that the evidence is real. | You opened each cited line range and found the code that the evidence cell names, or you dropped the row. |
| 5 | Run `/simplify <file-path>`. In the sample: `/simplify src/app/routes/article/article.service.ts`. | The command makes the case for each candidate and answers the questions about who calls the code and which tests cover it. | The reply has a table with root issue, consequence, benefit, risk, and action for each row. The skill requires the Chesterton's fence answers before an edit. They exist for the rows that you plan to select. The run wrote them in its plan report. If your reply has none, ask for them. |
| 6 | Check the answer to "what tests cover it". If no test can fail when the change is wrong, add a check before you apply. In the sample: record the `include` argument of each function before and after. | The skill requires that tests pass. It does not check that a test can fail. See "What you get". | You have a test or a recorded check that fails when the change is wrong, or you accept the gap and write it in the pull request. |
| 7 | Select the rows by description and apply them: `Apply <selected-rows> only. Run <test-command> after the change.` In the sample: `Apply the extract of the repeated include block only. Run <test-command> after the change.` The S-numbers belong to the scan and the C-numbers belong to the plan. | The skill edits only after you select, and applies one change at a time. | The diff holds only the selected change. No test file changed. |
| 8 | Run the baseline commands from step 2 again, and the check from step 6. | The skill completes when the relevant tests pass. | Each command gives the same result as the baseline, or a better one. |
| 9 | Commit the cleanup apart from feature or fix changes. | The skill requires that cleanup stays separate, so a reviewer can read a pure refactor. | The commit has no feature code. |

## Decision points

- If your target is your own working diff, run `/simplify` with no argument, and skip step 3. The scan covers a whole area, and your diff is already the scope. Without a scan, step 4 reads the `/simplify` table instead, and step 5 needs no file path.
- If the baseline fails, record the failing tests by name and compare the same set after the change. Or fix the cause first, in a separate commit. The sample did the first: 7 tests in `auth.service.test.ts` failed before and after. If the repository has no tests, do step 6 first and expect no test result. If it has no type check, skip that command.
- If a candidate is `confirm` or `review`, apply it only after you select it by name. The skill leaves these rows unselected. Apply each one in its own step, with its own test run.
- If the scan lists a security or defect lead, record it and do not fix it in the cleanup commit. The skill has no step for leads. Practice: write the lead in your pull request notes and run `security-audit` on it. The cleanup preserves behavior, including a faulty behavior. Use [`security-audit`](../../skills/security-audit/SKILL.md) or `pr-review` for the lead. Section "What you get" gives the sample lead.
- If a cleanup touches more than about 500 lines, use a code transform (codemod) instead of hand edits. The skill sets this limit.
- If a test must change to stay green, revert the change. The skill treats this as a change of behavior.
- If the code sits between `simplify-ignore-start` and `simplify-ignore-end` comments, leave it. The skill skips those blocks.
- Stop when the scan returns an empty list. Stop also when each selected row is applied, the baseline commands match, and the cleanup sits in its own commit.
- Choose [Check a branch before you open a pull request](dev-self-review-before-a-pr.md) when you want a verdict on the branch, not a cleanup.
- Choose [Swap a library everywhere](dev-swap-a-library-everywhere.md) when one defined change must reach many files.
- Choose [Refactor a risky function](dev-refactor-a-risky-function.md) when the problem is one function with high complexity and low coverage.

## What you get

The run was headless, with no person to answer questions. Checked against the `simplify` skill files at Toolbelt version 1.3.0. No person selected rows, so the run used the skill's rule that `safe` rows are pre-selected, and the run instruction to apply one change. The skill saves no report file. The run saved both replies as files. The run also added the `ID` and `Route to /simplify` columns. The skill field list has neither column (see "Common mistakes").

The scan found 13 findings: 2 `safe`, 4 `confirm`, and 7 `review`. The first excerpt shows three rows with the risk tiers.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the category, file, evidence, impact, recommendation, and route columns are left out, and so are the rows other than S1, S7, and S9. The text of the columns and rows that remain is verbatim.

| ID | Smell | Severity | Confidence | Action | Risk |
| --- | --- | --- | --- | --- | --- |
| S1 | The same 21-line `include` block appears 7 times. | medium | high | extract | safe |
| S7 | `createArticle` destructures `authorId` and `id: articleId` and never uses them. | low | high | delete | safe |
| S9 | `count` and `findMany` run one after the other. The two calls do not depend on each other. | medium | high | parallelize | confirm |

S1 is the row that the run applied. The plan calls this row C1. S7 is also `safe`, but the run instruction allowed one change, so S7 stayed unselected. S9 is `confirm`, so the skill does not pre-select it.

The scan also set aside a lead that is not a cleanup. The favorite routes spread the loaded `favoritedBy` relation into the response, and the relation holds full user rows. The run read this in the code and did not execute it, because no database is available. No step of the skill reports defects, so the run listed it apart and did not touch it.

Next, the answer that the plan gave to the question about tests.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is one row of the Chesterton's fence table in the run report. Lines are wrapped.

```markdown
| What tests cover it? | `article.service.test.ts` covers `favoriteArticle`,
`unfavoriteArticle`, and `deleteComment` with a mocked Prisma. The mock
returns a fixed row and ignores the `include` argument, so no existing
test can see a wrong include. |
```

This is the key fact of the run. The article tests passed before the change and after it. They also pass with a wrong include.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines `...` mark skipped diff lines. The diff has 7 replacements, and the excerpt shows the first one.

```diff
+import { Prisma } from '@prisma/client';
+
+const articleInclude = {
+  tagList: {
...
+  favoritedBy: true,
+  _count: {
+    select: {
+      favoritedBy: true,
+    },
+  },
+} satisfies Prisma.ArticleInclude;
...
     take: Number(query.limit) || 10,
-    include: {
-      tagList: {
...
-    },
+    include: articleInclude,
   });
```

The diff stat is one file, 30 insertions and 147 deletions. The file went from 652 to 535 lines.

Last, the checks. The run saved this table in its apply log.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the `Executed` column and the Prettier row are left out. Each check was executed in the run, and Prettier warned on both sides.

| Check | Before | After |
| --- | --- | --- |
| `npx tsc --noEmit -p tsconfig.app.json` | no output, exit 0 | no output, exit 0 |
| `npx jest src/tests/services/article.service.test.ts` | 5 passed | 5 passed |
| `npx jest` (all 5 suites) | 7 failed, 1 todo, 19 passed | 7 failed, 1 todo, 19 passed |
| `npx eslint` on the service | 14 problems | 14 problems |
| Recorded `include` argument of the 7 functions | 7 identical | identical to the before file |

The 7 failed tests are in `auth.service.test.ts`. They fail before and after. The apply log states the error is `PrismaClientInitializationError`, because the run had no database. They do not touch the article service. The ESLint findings exist before the change, and the change adds none.

The run also tested its own check. It removed `bio: true` from the new constant. The 5 article tests still passed, and the recorded-argument check failed. The skill does not prescribe the recorded-argument check. It is a choice of the run, written as a throwaway test that is not part of the repository.

What you must check in the output:

- Each row has a risk tier, and only the rows that you selected changed.
- The diff holds no test file.
- The baseline commands give the same result before and after.
- The output states what the run did not execute. In this run, no request ran against a running API or a database. The 7 functions ran only against a mocked Prisma client.

## Common mistakes

- You accept "tests pass" as proof. A mocked data layer ignores the query arguments, so a wrong `include` passes every test in the sample. Record the arguments before and after, or add a test that reads them.
- You select a `confirm` or `review` row in the same pass as a `safe` row. If the tests then fail, you cannot tell which change caused it. Apply one row at a time. The skill does this and runs the tests after each row.
- You fix a defect lead inside the cleanup. A reviewer expects a refactor to keep behavior. Put the fix in its own change. The skill has no step for leads, so write the lead in your pull request notes.
- You expect the scan to save a file, or to pass its findings to `/simplify`. The skill names no output path and no handoff format, and `/simplify` detects again from the start. Save the reply yourself, and select rows by their description.
- You read a missing `risk` column as "safe". The skill field list for `/code-smell` has no `risk` field, but the taxonomy says that every finding has a tier. Ask for the tier if the table has none.
- You treat the lint and format output as a result of the cleanup. In the sample, ESLint reported 14 problems and Prettier warned before the change, with the same results after. Run both on the base commit first.

## Next

- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): when the cleanup is done and you want a verdict on the branch.
- [Answer review comments](dev-answer-review-comments.md): when a reviewer asks for more cleanup after you open the pull request.
- [Swap a library everywhere](dev-swap-a-library-everywhere.md): when one change must reach many files.
- [Refactor a risky function](dev-refactor-a-risky-function.md): when one function has high complexity and low coverage.
- [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md): when the scan lists `review` rows that need a plan, not a single edit.
- [Audit existing code for security](sec-audit-existing-code.md): when the scan lists a security lead, such as the favorite routes in this run.
- [Use-case index](README.md): the full list of use-case pages.
