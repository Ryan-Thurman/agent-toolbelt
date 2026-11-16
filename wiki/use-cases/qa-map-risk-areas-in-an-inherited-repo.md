# Map risk areas in an inherited repository

This page is for a QA lead whose team inherited a repository and must decide where testing effort goes first. You get a reviewed risk map of the repository and a prioritized set of test cases for the riskiest area.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA lead, with one developer or product owner to answer questions | [`risk-area-mapping`](../../skills/risk-area-mapping/SKILL.md) (`/risk-areas`), then [`test-case-design`](../../skills/test-case-design/SKILL.md) (`/test-case-design`) | Neither skill has depth levels. `test-case-design` asks for a calibration pass when a set has more than ten cases. | A local clone of the repository and an agent with the Toolbelt installed |

## Quick path

1. Start Claude Code in the repository root with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Draft the risk map: `/agent-toolbelt:risk-areas`. The skill writes `risk-areas-review.md`.
3. Review each entry with a developer or the product owner, and set the status to `Approved`.
4. Write the approved entries: `/agent-toolbelt:risk-areas --apply risk-areas-review.md`.
5. Design cases for the riskiest entry: `/agent-toolbelt:test-case-design Design test cases for the <entry name> risk area. Code: <its Paths>.`

You get a reviewed list of high-impact paths in `.pr-review.md`, and a prioritized case set for the first area.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The team inherited the RealWorld "Conduit" API: a TypeScript service with Express, Prisma, and Jest. The repository has 26 unit tests, and none of them uses a real database. No test covers the token check or the error handler. Nobody wrote down which paths have a high impact when they break.

The QA lead must decide this week where the first test effort goes. The lead needs a list of risky paths that a developer can check, and then test cases for the top path.

## Why this path

The obvious alternative is to ask an agent to "find the risky parts" and to write tests from that answer. This has two costs. The answer lives in one chat, so the next person or the next review cannot read it. And the agent states the impact of a defect as a fact, but impact is a business judgment that only a person can make.

The other alternative is the `cover` gap scan (`/cover-gaps`). It ranks untested code with no business impact input, so it cannot tell you which gap matters most to users. Choose it when you want untested behavior ranked from the code alone.

`risk-area-mapping` drafts the list from evidence into one review file and edits no target file. A person then keeps, edits, or deletes each entry. Only approved entries go into the repository, as a `## Risk areas` section that `test-case-design` and `pr-review` both read. One list therefore drives test priority and review depth. See the [risk areas contract](../../shared/contracts/references/risk-areas.md) for the format.

The order is fixed. The map comes first because `test-case-design` sets priority from impact and likelihood. A declared risk area makes impact high for every case in it. Without a list, the skill judges impact case by case. In this run nobody approved the draft, so the run treated the draft impact line as high impact and recorded that as an assumption.

## Steps

The table writes the command as `/agent-toolbelt:risk-areas`, the Claude Code form. Cursor uses `/risk-areas`.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | In the root of the inherited repository, run `claude --plugin-dir /path/to/agent-toolbelt`. Other hosts use the commands in [Installation](../Installation.md). Then run `git status --short`. If the tree is not clean, note the changes so that you can see the new file. | The skills and commands must exist in the session. The skill writes `risk-areas-review.md` into the root. | `/agent-toolbelt:risk-areas` appears in the command list. You know the state of the tree. |
| 2 | Run `/agent-toolbelt:risk-areas`. Do not add `--sweep` or `--atlas`. | One repository needs no fan-out and has no workspace map. The skill drafts entries and edits no target file. | `risk-areas-review.md` exists in the root and the agent names its path. |
| 3 | Read the review file from the top: the summary, the coverage line, the "Not inspected in depth" line, and each `Evidence:` line. | The coverage share tells you whether the list separates risk from normal code. An entry with `Evidence: inferred` has an impact line that nobody has checked. | You know which entries rest on inference and which folders the agent did not inspect. |
| 4 | With the developer or product owner, edit `risk-areas-review.md`. Keep, edit, or delete each entry. Under the repository heading, change `Status: Draft` to `Status: Approved`, or to `Skip`. | The impact of a defect is a business judgment. The skill drafts it, and a person owns it. | Each impact line has an owner who can defend it. The status is `Approved` or `Skip`. |
| 5 | Run `/agent-toolbelt:risk-areas --apply risk-areas-review.md`. Then delete the review file or move it outside the repository. | The skill writes the entry lines and `Paths:` lines of approved repositories into `.pr-review.md`. It does not commit. The review file is a draft and must not reach the repository. | `.pr-review.md` has a `## Risk areas` section. Open a normal pull request for it. |
| 6 | Choose the entry to design first. Run `/agent-toolbelt:test-case-design` with this prompt: `Design test cases for the <entry name> risk area. Code: <the Paths of that entry>.` The skill saves the cases to `.atb-work/test-case-design/<scope-slug>.md` unless you name a path. If the skill shows five to ten cases and asks questions, answer them and tell it to write the rest. | The skill turns the entry into cases with a level and a priority. It reports the cases and writes no tests. | The full set exists with your calibration answers applied. If nobody answers, the skill lists the calibration points as assumptions. |
| 7 | Find each case whose expected result has no requirement source. Send these cases to the person who owns the behavior. | The code is the only evidence for those expected results. A defect in the code must not become the specification. | Each such case has an answer or a decision to drop it. |
| 8 | Take the cases from the "Handoff" section to `/cover` when you are ready to write tests. | `test-case-design` stops before it writes tests. | The first automated case runs. |

Choose the entry in step 6 with this rule. Pick the entry with the highest impact line and the least existing test coverage. This is a judgment for the QA lead and the developer. In the Conduit run the entry was Authentication and account credentials. The prompt was `Design test cases for the Authentication and account credentials risk area. Code: src/app/routes/auth.` The 26 unit tests do not reach the token check in that area.

The run behind this page stopped after step 2 and did step 6 without steps 3 to 5, because no person was available to approve entries. No person answered calibration questions either. A real team does steps 3 to 5 before step 6.

### Decisions in the run and the defaults used

The run had no person to answer. The defaults below are not decisions of a person. The first two rows are questions that the skills ask. The last three rows are choices that the run made.

| Kind | Skill or step | Decision | Default used in the run |
| --- | --- | --- | --- |
| Skill question | `risk-area-mapping` | Which entries to confirm, edit, or delete, and the status of each repository. | None approved. The status stayed `Draft`, and `--apply` did not run. |
| Skill question | `test-case-design` | Calibration of priority, level, case size, and domain terms for a set of more than ten cases. | The skill wrote all 21 cases and listed the open points as assumption A3. |
| Run decision | `test-case-design` | The expected result where no requirement exists, for example the status for a wrong password. The skill says only not to invent expected behavior. | `Confirm with the owner`, with the code behavior noted. |
| Run decision | `test-case-design` | How to treat a draft entry that nobody approved. | The run treated the draft impact line as high impact and recorded the assumption. The skill now allows a draft entry only when the user says so, and only as an assumption. |
| Run decision | `risk-area-mapping` | The target file. The skill asks only when an earlier file in the discovery order already has a list. | `.pr-review.md`, the skill default. |

## Decision points

- If an entry has `Evidence: inferred`, ask the product owner to check the impact line before you approve it. All three entries in this run were inferred.
- If you cannot name normal code that the list leaves out, the list is too broad. Merge or remove entries. The skill sets no threshold. Decide with the developer. In this run 12 of 52 files (23%) was kept as is.
- The skill now lists its coverage exclusions: tests, documentation, binary assets, lockfiles, editor configuration, and vendored or built output. It writes them in the review file. This run left out `README.md`, `e2e/src`, and `src/tests`, so your count can differ by a few files.
- If the repository already has a `## Risk areas` section, the draft records the file and the entry count under "Existing list". Apply then shows a diff and writes only after you agree.
- If an earlier file in the discovery order already has a `## Risk areas` section, readers ignore the new list. Apply warns you and asks which file to write.
- Choose `--sweep <dir>` for a folder of repositories, `--atlas <path>` when a workspace map exists, and `--target agents` to write into `AGENTS.md`.
- If the set has more than ten cases and a person can answer, `test-case-design` shows the top five to ten cases and stops. Answer its questions before it writes the rest.
- Run the map again after an incident, when a module with personal data, access rules, or exports is added, or when the workspace map changes. See the [risk-based testing workflow](../../workflows/risk-based-testing-workflow.md).
- Stop when apply has written the list and the pull request is open. The skill does not commit.
- Choose [`cover`](../../skills/cover/SKILL.md) to write the tests. Choose `/cover-gaps` when you want untested behavior ranked from the code with no impact judgment. Choose [`threat-model`](../../skills/threat-model/SKILL.md) or [`security-audit`](../../skills/security-audit/SKILL.md) for abuse cases that cross a trust boundary. Choose [`failure-scenario-design`](../../skills/failure-scenario-design/SKILL.md) for a platform fault such as zone loss.
- Choose [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md) when you have a pull request and not a whole repository.

## What you get

The first excerpt is the top entry of the review file.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Nobody approved this draft, and nobody calibrated the cases.

```markdown
Coverage: 12 of 52 source files (23%)

...

- **Authentication and account credentials**: A defect can let a caller act
  as another user, or can expose or overwrite the email, username, and
  password of an account.
  - Paths: `src/app/routes/auth/auth.ts`,
    `src/app/routes/auth/token.utils.ts`,
    `src/app/routes/auth/auth.service.ts`,
    `src/app/routes/auth/auth.controller.ts`
  - Evidence: inferred. Files matched: 4. From: `auth.ts` builds the
    `required` and `optional` JWT guards (HS256, secret from `JWT_SECRET`
    with the fallback `superSecret`). ... History: 2d9df7c fixed the token
    header check in the earlier JavaScript layout, and 30b68e1 fixed a
    missing user id in `getCurrentUser`.
```

The excerpt wraps long lines and shows an ellipsis where it leaves text out. The file has the full lines.

Make sure that you check three things. The impact line names users and data, not only a word such as "critical". The paths match each file that the evidence names. The evidence line gives a mechanism that you can open in the code, such as a function or a key.

The review file also listed two more entries (article and comment ownership, and the database schema with its cascading deletes). It dropped five candidates with a reason each. It listed the fallback secret and the error handler under "Other findings", because they apply to the whole deployment and not to one path.

The second excerpt is three of the 21 cases for the top entry. The columns "Preconditions", "Level", and "Automation candidate" are left out. The cases come from the uncalibrated path of step 6, where nobody answered the calibration questions.

Excerpt from a run on the Conduit sample API at commit 30b68e1.

| ID | Requirement / risk | Steps | Expected result | Priority |
|---|---|---|---|---|
| TC-005 | Unique rule holds under concurrency | Send two register requests with the same email at the same time | One 201 and one 422. No 500. Exactly one row. Code today: the check and the insert are separate, so the loser can get a 500 from the database constraint | High |
| TC-014 | Missing secret setting | Sign a token with the text `superSecret`, call `GET /api/user` | Confirm with the owner (expect a startup failure). Code today: the app starts and accepts the forged token | High |
| TC-018 | Password change and whitespace | Change the password to `new pass`, then to `newpass ` (trailing space). Login with each | The old password fails and the new one works. Code today: register and login trim the password, update does not, so the second password cannot log in | High |

Check each case for four things. The expected result is specific, or it says `Confirm with the owner`. The case names a test level. The case says what already exists, for example the "Coverage notes" section lists the unit tests that make a new case unnecessary. The priority has a reason.

The skill uses `High` (impact and likelihood both high), `Medium` (one is high), and `Low` (neither is high).

The 26 existing unit tests cover blank fields on register and a wrong password at the service level. They never reach the token check or the database constraint (see "Coverage notes" of the run). The new cases target those two places.

## After a person approves the list

`pr-review` is the Toolbelt code review skill. It chooses how deep to review (the tier: light, standard, or deep) and runs focused reviewers (facets), such as security or tests. See [Code review](../Code-Review.md) for the full skill. The approved `## Risk areas` section changes how `test-case-design` and `pr-review` work.

The agent in this run did not test these effects, because it did not apply the list. The statements below come from the skill files. You can skip the `pr-review` rows if you do not run reviews.

| Skill | What changes | Source |
| --- | --- | --- |
| `test-case-design` | A case in a declared risk area has high impact. For a pull request, the skill reads the list from the base branch (the branch that the pull request merges into). It matches each changed and affected path, and names each match with its impact line in "Change scope". The high-impact and high-likelihood cases come first. | [Step 6 of the skill](../../skills/test-case-design/SKILL.md), [steps 4 and 7 of change risk planning](../../skills/test-case-design/references/change-risk-planning.md) |
| `pr-review` tier | A diff that touches a risk-area path raises the automatic tier (the tier that the skill picks when you give none) to at least standard, also for a test or configuration change. A risk area never selects the deep tier by itself. The report notes it, for example `tier: standard (auto - touches risk area Data export)`. | [Risk-area floor in auto-tier](../../skills/pr-review/references/auto-tier.md) |
| `pr-review` facets | Each facet receives the matched area, its impact line, and the matched paths. It lowers its reporting threshold by one notch for findings on those paths. | [Fan-out](../../skills/pr-review/references/fan-out.md) |
| `pr-review` safety | The review reads the list from the base branch. A pull request that changes the section is reported as a `standards` finding (a finding about project rules). | [Repo config](../../skills/pr-review/references/repo-config.md) |

In the Conduit API, a one-line comment change in `src/app/routes/article/article.controller.ts` is a tiny non-logic edit. Without a list, auto-tier gives it the light tier. With the article entry approved, it gets at least standard. A match adds effort and never removes it. Cases and findings outside the list stay in scope, as the [contract](../../shared/contracts/references/risk-areas.md) says.

## Common mistakes

- Treating the draft as an approved list. The impact lines are drafts, and all three in this run are inferred. Make sure that a person checks each one before apply.
- Committing `risk-areas-review.md`. The file header says not to. Delete it or keep it outside the repository after apply.
- Taking the expected result from the code. The cases for the Conduit API show behavior that looks like a defect, such as a 500 status for a duplicate email on update. Ask the owner before you write the assertion.
- Reading a short list as a complete inventory of risk. The skill states that the draft is not a complete inventory. The coverage and "Not inspected in depth" lines show what the agent did not check.
- Putting the list in the same pull request as the change that it must review. Reviews read the list from the base branch, so a change cannot lower its own review. Merge the list first.
- Running the design before the list is approved. The area then has no declared impact. State the draft impact line as an assumption on the case set, as this run did.

## Next

- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): use it when a change arrives and you want cases for that change, with the approved list applied.
- [Refine a vague story](qa-refine-a-vague-story.md): use it when the next piece of work is a story and not a repository.
- [`cover`](../../skills/cover/SKILL.md): use it to turn the selected cases into tests.
- [Use cases index](README.md): the list of use-case pages.
