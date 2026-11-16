# Choose which technical debt to pay in the next sprint

This page is for a tech lead who must choose which technical debt goes into the next sprint. You get a ranked debt register with evidence for each item. You also get a Do, Defer, Reject, or Spike decision for the top item, with a test plan.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`tech-debt-discovery`](../../skills/tech-debt-discovery/SKILL.md) (`/tech-debt-discovery`), then [`tech-backlog-assessment`](../../skills/tech-backlog-assessment/SKILL.md) (`/tech-assess`) | No levels. Neither skill has a depth setting. | A repository checkout with its dependencies installed. Incident or error data, if you have it. A person who can answer ownership questions. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Install the dependencies, so that tests, lint, and the dependency audit can run. The skill installs nothing. The command depends on the stack. In the sample it is `npm ci --ignore-scripts`.
3. Find and rank debt: `/agent-toolbelt:tech-debt-discovery <repository-or-area>. Write the register to <register-file>.`
4. Read "Scope and evidence", the top three candidates, and the rejected list. Pick one ID.
5. Decide that item: `/agent-toolbelt:tech-assess <ID> from <register-file>`.

In the sample, the two prompts were:

```text
/agent-toolbelt:tech-debt-discovery . Write the register to tech-debt-register.md.
/agent-toolbelt:tech-assess D-01 from tech-debt-register.md
```

You get a register with stable IDs and a decision report for the item that you picked.
Stop after step 3 if discovery finds no confirmed debt. If the item that you pick is a confirmed defect, use the fix page named in "Decision points" and skip the rest of this path.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run used commit 30b68e1, "fix: missing user id".

You lead the team that owns this API. Sprint planning is near, and the team can take one or two debt items. The repository has no debt list, no `CODEOWNERS` file, no continuous integration (CI) file, and no incident data.

A debt register is a list of maintenance work with evidence, a consequence, and an order. Each item has a stable ID such as D-01, so a later run can update it. In this run, `D-` IDs name register items. `A`, `B`, and `C` name the options inside one assessment.

Two terms appear later. The Prisma mock is a test double that replaces the database client, so unit tests run without a database. A scratch test is a throwaway test that the run wrote to check one claim. It is not part of the sample repository.

## Why this path

The obvious alternative is to run the dependency audit and the linter and sort by count. On this sample that gives a poor order. `npm audit` reports 14 vulnerable packages, and seven of them have high or critical severity. Five of the seven do not apply to this code. The advisory text or the imports show why. Neither tool finds the largest problem, which is a response that returns other users' password hashes. Lint reports 33 errors, and none of them points to it.

The other alternative is to skip discovery and run `/tech-assess` on an item that you already have in mind. The skill description for `tech-debt-discovery` points to `tech-backlog-assessment` for one supplied item. That path saves the scan, but it costs you the choice itself. Without a scan you pick the visible items, such as the Prisma version or the lint errors. In this run, the two items that ranked first are on no list that the repository holds.

The scan comes first because of practice, not because a skill rule requires it. The assessment needs one item as input.

The procedure has this order because discovery ends with a hand-off. The skill names `tech-backlog-assessment` as the next owner and runs it only when you ask. Discovery changes no code and creates no ticket. Assessment is also report only. It edits files only after you accept the recommendation and ask for the change.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skills into the project: `./install.sh --harness all tech-debt-discovery tech-backlog-assessment /path/to/project`. | Both skills must be in your session. | You type `/` and see `/agent-toolbelt:tech-debt-discovery` and `/agent-toolbelt:tech-assess` (plugin), or `/tech-debt-discovery` and `/tech-assess` (installed copy). |
| 2 | Check out the revision that you plan from. Install the dependencies. In the sample: `npm ci --ignore-scripts`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`. | The skill uses tools that the repository configures and records whether each one ran. A tool that cannot run gives no evidence. | `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest` starts. In the sample, 7 of 27 tests fail at this point. The cause is not a missing database. See "Common mistakes". |
| 3 | Run `/tech-debt-discovery <repository-or-area>. Write the register to <register-file>.` The sample value for the first part is the whole repository. Name any incident logs, error data, or tracker exports in the same prompt. | The skill writes a file only when you ask. It names no default path. Operational data is the evidence that shows measured cost. | The file has the sections "Scope and evidence", "Candidates", "Decisions and rejected candidates", and "Selected assessments". |
| 4 | Read "Scope and evidence". Look at the history period, the tools that ran, the tools that did not run, and the excluded areas. | A consequence that no tool or person measured is a reading of the code. You must know which items are readings. | You can name each tool that did not run and each area that was not read. |
| 5 | Read the candidates from the top. Open the file and line that each of the top three cites. Make sure that each consequence matches the code. | The skill requires exact evidence and a concrete consequence for each retained item. You check the rank before you spend sprint capacity on it. | For each of the top three, you can say the consequence in one sentence and you found the cited line. |
| 6 | Read "Decisions and rejected candidates". Read each rejected look-alike and its reason. | The skill rejects safe patterns with a reason. An advisory that does not apply costs a sprint if it stays on the list. | You accept the reason for each rejected item, or you ask for a recheck. |
| 7 | Pick one ID. If it is a confirmed defect, go to the fix page instead (see "Decision points"). Otherwise run `/tech-assess <ID> from <register-file>`. The sample value is `D-01`. | Assessment decides one item with options, risks, and a test strategy. Discovery does not. | The report has a verdict, a confidence, an options table, a test strategy, and a next command. |
| 8 | Read the options table, the test strategy, and "Open questions". Get an answer to each question from the owner. | The skill writes a recommended default for each question. A default is not an answer. | Each open question has an answer and a name next to it. |
| 9 | Create the sprint ticket by hand. Use the completion condition from the register as the acceptance criterion. | Neither skill creates a ticket or authorizes a change. | The ticket names the ID, the verdict, and the check that shows the fix. |

## Decision points

- If you already hold one item, skip steps 3 to 6 and start at step 7. Use [Decide one technical backlog item](lead-decide-one-backlog-item.md).
- If discovery returns no confirmed debt in the inspected scope, stop. The skill treats that as a valid result.
- If no operational data exists, treat every consequence as a reading of the code. Ask the owner for incident or error data before you commit capacity to an item whose cost is not obvious.
- If the top item is a confirmed defect, skip step 7 and use [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md). The workflow file `tech-backlog-assessment-workflow.md` lists a confirmed bug under "Do Not Use For" and sends it to that lane. D-01 is one in this run. The run assessed it anyway, to show the output, and the report then named `/dev-plan` as the next command. Run the assessment on a defect only if you need its options table, and then go to the fix page.
- If a finding comes from a dependency audit, read the advisory before you rank it. Check whether the code reaches the vulnerable function or setting.
- If the verdict is `Spike`, plan a bounded investigation with a named evidence target. If it is `Defer` or `Reject`, record the reason in the register, so that the item does not return unexplained.
- If the item is an upgrade, the assessment reads the version-delta reference, which compares the current and target versions. After a `Do` verdict on a library switch, use [Swap a library at every call site](dev-swap-a-library-everywhere.md). No page covers a same-library version upgrade, such as Prisma 4 to 7 here. Plan it from the assessment report with `/dev-plan`.
- If your question is only about security, use [Audit the auth area of existing code](sec-audit-existing-code.md). It does not rank maintenance cost.
- Stop when the top item has a verdict, each open question has an answer, and the sprint ticket exists. If the top item is a confirmed defect, stop at the register and move to the fix page.

## What you get

The run was headless. No person answered. Neither skill asks a question in its procedure, so nothing stopped. The assessment template has an "Open questions" section with a recommended default for each question. The run left those questions open. Nobody on the team has answered them.

The register holds ten items: seven candidates and three deferred items. A command that ran supports five of them: D-01, D-02, D-04, D-05, and D-08. The run read D-03, D-06, D-07, D-09, and D-10 from the code or the files only. The end-to-end tests, any check against a database, and any exploit of an advisory did not run.

First, the scope section. It tells you what the register rests on.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```text
- `jest --coverage` with the Prisma mock: ran. 5 suites, 27 tests, 19
  passed, 1 todo, 7 failed (`jest-unit-with-coverage.txt`).
...
- `eslint src --ext .ts`: ran, 33 errors (`eslint-src.txt`).
- `npm audit --omit=dev`: ran against the registry on 2026-11-15, 14
  findings (`npm-audit.json`). ...
- Not run: the end-to-end suite (`e2e/`, needs a running API and a
  database), any check against a database, and any exploit of an
  advisory.
```

Next, the ranked list. The rows are in rank order, top to bottom.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: only the first column of each row is quoted. The other four columns are left out.

| ID and owner |
| --- |
| D-01, unassigned. Favorite and unfavorite responses return full user rows |
| D-02, unassigned. `body-parser` and `express` have reachable advisories, and `axios` ships without use |
| D-03, unassigned. Token secret falls back to a public string |
| D-04, unassigned. Checks do not run anywhere, and the unit suite misleads |
| D-05, unassigned. The article service repeats one query block 7 times and uses `any` 21 times |
| D-06, unassigned. Error paths return 500 with raw messages |
| D-07, unassigned. List endpoints have no page size cap |

The skill sets no rule for the order beyond its method: security and data problems first, then recurring failures, then demonstrated cost. It forbids invented numeric scores. The run chose the order by that method. The size classes (S, M, L) and the confidence words (High, Medium) in the full register are the run's labels. The register template and the discovery method do not define them. The `unassigned` owner is the skill's own word for an item with no owner.

The top item holds a credential leak. The cause is a response that spreads a database row. The run called the favorite function with a mocked database that returns two user rows, and it printed the keys.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The rows come from a scratch test with the Prisma mock, not from a database. The values are test data from the scratch test. The test file is not published. Lines are wrapped, and `...` marks skipped text.

```text
favoriteArticle response keys: author, authorId, body, createdAt,
description, favorited, favoritedBy, favoritesCount, id, slug, tagList,
title, updatedAt

favoriteArticle favoritedBy[1]: {"id":124,"email":"reader-b@example.test",
"username":"reader-b","password":"$2a$10$hashhash...","image":null,
"bio":null,"demo":false}
```

The register explains why the existing tests did not catch it. They mock `favoritedBy: []`. Make sure that your own top item has a test that can fail on the defect.

Then the rejected list. Two rows show what the audit count hides.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: two rows of the rejected table. The text of each row is verbatim.

| Item | Reason |
| --- | --- |
| `jws` advisory `GHSA-869p-cjfg-cm3x` (high) | The advisory says that users of `jsonwebtoken` are not affected, because they call `jws.verify()`. The code uses `express-jwt` and `jsonwebtoken` only. |
| `proxy-addr` advisory (critical) | It needs a trust-subnet setting. `grep "trust proxy" src` finds none. Recheck when a proxy is placed in front of the API. |

Last, the decision for the top item. The assessment template prescribes the four verdict words and the confidence scale of High, Medium, or Low. The register template sets no confidence words or size classes, so the run chose High, Medium, and S, M, L there.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the Benefit and Cost columns are left out. The text of the columns that remain is verbatim.

```text
Verdict: Do

Confidence: High
```

| Option | Decision and reason |
| --- | --- |
| Status quo | Rejected. |
| A: return `articleMapper(article, id)` (the function that builds the public article shape) from both functions | Chosen. |
| B: narrow the query to `favoritedBy: { select: { id: true } }` and keep the spread | Use as an addition inside D-05, where one shared include constant changes all seven queries. Not enough alone. |
| C: remove `password` keys from every JSON response | Rejected for this item. |

What you must check in the output:

- Each top item cites a file and line, and a consequence that you can verify by reading that line.
- The report says which findings were executed and which were read. Confidence is High for D-01 only for the code path. The real response over HTTP was not captured, because no database was available.
- The rejected list names a reason for each audit finding that does not apply.
- "Open questions" has an entry about possible earlier exposure. The report does not decide whether it happened. In this run the report has three questions:
  - Is the API deployed with real accounts?
  - Did the deployed version serve this response to real users? The default is that the owner checks access logs for `POST` and `DELETE` on the favorite path and decides on a password reset.
  - Does any client read `id` or `authorId` from the favorite response? This one blocks the fix.
- The next command is a command that you can run. In this run the report names `/dev-plan` and adds that the bug-to-fix lane fits a confirmed defect.

## Common mistakes

- You rank by the audit count. In this run, 5 of 7 high or critical packages do not apply to the code. The largest problem is not in the audit. Read the advisory text and the code before you rank.
- You read a failing test suite as proof that the test environment needs a database. In this run, 7 tests failed because the service was imported before the file that sets up the mock. With two import lines swapped, all 12 tests in that file pass. Find the cause before you write the item.
- You trust a passing test. The favorite tests pass, and they cannot see the leak because they mock `favoritedBy: []`. One of them passes only because an unmocked call returns `undefined`.
- You treat discovery as approval. The register authorizes no repair and no dependency change. The first change starts only after the assessment and your decision.
- You skip the exposure question. If a defect in the register has already reached users, the register cannot say so. Ask the owner to check access logs and decide on a password reset.
- You rerun discovery on a new register file. The skill preserves IDs and earlier decisions only when you give it the existing register. Pass the path of the old file.
- You copy a dependency audit result into a page or ticket without its date. The result changes each day. This run ran on 2026-11-15.

## Next

- [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md): when the top item is a confirmed defect. D-01 is one here.
- [Decide one technical backlog item](lead-decide-one-backlog-item.md): when you already hold one item and need only the decision.
- [Refactor the riskiest function in a codebase](dev-refactor-a-risky-function.md): when the chosen item is a function with high complexity and low coverage.
- [Set up one quality command for local use, CI, and release](lead-set-up-quality-rails.md): when the chosen item is a missing pipeline or lint baseline. D-04 is one here.
- [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md): when tests are the weak point and you need a ranked list of gaps.
- [`tech-debt-workflow.md`](../../workflows/tech-debt-workflow.md): the stages after assessment, from `simplify` to `code-quality-gate`.
- [Use-case index](README.md): the full list of use-case pages.
