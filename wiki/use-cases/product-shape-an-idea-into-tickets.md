# Shape an idea into a brief and tickets

This page is for a product owner who has a rough idea. The idea needs a brief that the team approves and tickets that the team can build.
You finish with an approved brief, ticket files in build order, and a preview of the issues that your tracker receives after you confirm.
A tracker is a system, such as GitHub Issues, Jira, or Azure Boards, that holds tickets.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Product owner. In practice, a developer helps with questions that the code cannot answer. | [`shape-up`](../../skills/shape-up/SKILL.md) (`/shape-up`, then `/to-issues`), then [`ticket-sync`](../../skills/ticket-sync/SKILL.md) (`/ticket-sync`) | No levels. Neither skill has depth levels. | The idea in one sentence. Read access to the repository where the feature will live. A tracker CLI (the command-line tool of your tracker, such as `gh` for GitHub) that is signed in, or none (see step 9). |

## Quick path

1. Start Claude Code in the repository where the feature will live, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Shape the brief: `/agent-toolbelt:shape-up Shape this idea into an approved brief: <idea>. Save the approved brief to <work-folder>/brief.md.` Answer each numbered round, then approve the brief. If you get a gap report and no questions, ask again for shaping.
3. Slice it: `/agent-toolbelt:to-issues <work-folder>/brief.md. Write one file for each ticket to <work-folder>/tickets/. Also write the slicing quiz and requirement map to <work-folder>/slicing-review.md.`
4. Check that no ticket body points to a local file. Rename those references to ticket titles first. Then preview the tracker issues: `/agent-toolbelt:ticket-sync <work-folder>/tickets/`. Read the preview. Do not confirm until the provider and the project are correct.

Example for the sample idea: `/agent-toolbelt:shape-up Shape this idea into an approved brief: readers want a reading list. Save the approved brief to docs/tickets/reading-list/brief.md.` The work folder is `docs/tickets/reading-list`.

You get an approved brief, ticket files in build order with real blockers, and a preview that creates nothing.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The idea is one sentence.

```text
Idea: readers want a reading list.
```

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). Prisma is the database library of the sample. A base branch is the branch that your work branches from. The origin remote is the hosted copy of the repository that git pushes to.
It has no screens. It lets a reader favorite an article, and it has no reading list.
You must decide what a reading list is before anyone builds it, and you must hand the team tickets that do not need guesses.

The run was headless (no person at the keyboard), so no person answered. The skills ask questions, and the run used the recommended answer for each.
This page shows each question with that default.
In a real session, you answer the questions on privacy, scope, storage, and the owner of the front end yourself (see step 5). Each one changes scope, risk, or the user experience. That grouping is the run's reading of the skill, not a rule of it.
The run used the Toolbelt after the skill fixes of the first run batch.

Three ID schemes appear in the excerpts. `A-` is an assumption that the skill shows before it asks. `Q-` is a question. `D-` is a decision in the brief.
The tickets use file numbers 01, 02, and 03.

## Why this path

The obvious alternative is to ask an agent to "write tickets for a reading list". That skips the questions, and the code answers some of them in a way that you did not choose.
In this run, the existing favorites are public by user name, and they store no time. A ticket set that reuses favorites makes the list public and cannot order it by the time of adding.
This reasoning is practice, not a statement of the skill. The skill states the mechanism: it reads the repository first and asks only what the repository cannot answer.

The nearest sibling is [`story-refinement`](../../skills/story-refinement/SKILL.md) (`/story-refinement`). It turns a work item that is almost ready into a spec.
The `story-refinement` description says to use `shape-up` for a vague idea. The cost of the wrong choice is practice, not a statement of the skill: a spec for one ticket with no brief and no split into several tickets.
Use it after you have the tickets, as in [Refine a vague story](qa-refine-a-vague-story.md).

The other mode of the same skill is the gap review: `/shape-up` compares an ask with what the system does today and writes a report. It makes no brief and no tickets.
The page [Compare an ask with the product](product-compare-an-ask-with-the-product.md) covers it.

The order has a reason. Slicing starts from an approved brief, and the skill runs shaping first when no approved brief exists.
Publishing comes last because `ticket-sync` previews by default and changes the tracker only after explicit confirmation.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the two skills into the project: `./install.sh --harness all shape-up ticket-sync /path/to/project`. Start the agent in the repository where the feature will live. | The skill reads that repository for facts. | You type `/` and see `/agent-toolbelt:shape-up`, `/agent-toolbelt:to-issues`, and `/agent-toolbelt:ticket-sync`. With an installed copy, the names have no `agent-toolbelt:` prefix. |
| 2 | Choose a work folder that your team keeps for the brief and the tickets, for example `docs/tickets/<feature>`. Name it in your prompts. | Neither skill sets a location. `ticket-sync` writes tracker keys back into the ticket files, so a later run can update an issue only when the same files still exist. A folder under `.atb-work/` is local and disposable, so copy the files to a kept place before the sync. | You can name the folder. |
| 3 | Run `/agent-toolbelt:shape-up <idea>. Save the approved brief to <work-folder>/brief.md.` In the sample: `/agent-toolbelt:shape-up readers want a reading list`. | The skill first routes the request. Broken behavior goes to `bug-to-fix`. An almost ready ticket goes to `story-refinement`. It then checks for several independent subsystems and proposes a split before it asks details. | The skill shows its assumptions and the first numbered round. |
| 4 | Read the assumptions table. Correct only the wrong rows. | The skill gives each assumption its evidence, the consequence if it is wrong, and a confidence. A wrong row that stays shapes the tickets. | Each row is right, or has your correction. |
| 5 | Answer round 1. Each question has a recommended answer, worded so that "yes" accepts it. Give your own answer to each question that changes scope, risk, security, money, or the user experience. | The skill lets one "yes" accept a group of low-cost defaults. It does not let one "yes" settle a decision that changes one of those five things. | Each question in the round has an answer. |
| 6 | Answer the next rounds. Each round holds at most five questions. Check each contradiction that the skill raises. | A question that depends on an open answer waits for a later round. The skill treats a contradiction between your words and the code as the highest-value finding. | The skill has no open decision left. |
| 7 | Read the brief and its self-audit. Approve it, or send it back. | The approval gate is mandatory before any planning or implementation step. The self-audit checks decision state, internal consistency, ambiguity, and placeholders. | The brief has no `TBD`, no overloaded term, and no open scope boundary. Each open question has an owner and a recommended default. You said "approved". |
| 8 | Run `/agent-toolbelt:to-issues <work-folder>/brief.md. Write one file for each ticket to <work-folder>/tickets/.` | The result is tickets that a team can build and demo one at a time. Each ticket is a vertical slice: a narrow path through every layer, such as schema, API, and tests. A slice that delivers one layer cannot be demoed alone. | Each ticket has all template sections. Each `Blocked by` names an earlier ticket file. Read the quiz and the requirement map in `slicing-review.md`: each requirement maps to a ticket and a way to verify it, or the skill reports the gap. |
| 9 | Run `/agent-toolbelt:ticket-sync <work-folder>/tickets/`. This is a dry run (a preview that makes no change). If no `.tickets.md` file exists, the skill infers the provider from the git remote and asks for the project key. | The skill previews by default. It shows the provider, the project, the mapped fields, the body, and the dependency links before it changes anything. Without a signed-in tracker CLI, it writes a manifest (a publish-ready plan) and posts nothing. | You can name the provider, the project, and the action for each ticket. |
| 10 | Stop, or confirm. Confirm only when the provider and the project are the ones that you intend. | The skill creates or updates remote issues only after explicit confirmation. A confirmed run writes each new issue key into its ticket file. | You have either a preview that you did not apply, or a list of created issues with keys. This run stopped at the preview. |

## Decision points

- If the request describes broken behavior, use [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md). The skill routes it for you.
- If you already have a ticket that is almost ready, skip shaping and use `story-refinement`. The page [Refine a vague story](qa-refine-a-vague-story.md) shows that path.
- If the request spans several independent subsystems, accept the skill's proposal to split it first. Shape each part as its own brief.
- If you want only the brief, stop after step 7. Skip steps 8 to 10.
- If you do not use a tracker, skip step 9. Give the ordered tickets to the developer who runs `phased-delivery` (`/dev-plan`). That skill maps each ticket to one phase and one pull request.
- Do not skip the approval in step 7. The skill does not start planning without it.
- If the preview shows a project that you do not own, stop. In this run the sample copy kept the upstream GitHub remote, so the inferred project was the public upstream repository.
- If the preview shows a changed tracker config (`.tickets.md`), ask the owner to confirm the new target. The skill loads that file from the base branch, so an edit in a work branch does not retarget publishing silently.
- If no tracker CLI is signed in, the skill writes a manifest. A manifest never touches the tracker and never records a key.
- Stop when the brief is approved, each ticket has a real blocker or `None`, and you have read the preview. Do not confirm an apply on the first read.
- Choose [Decide whether to build](product-decide-whether-to-build.md) when the question is still whether the team must build the idea.
- Choose [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) when the tickets are approved and the team starts to build.

## What you get

The run was headless. No person answered the questions or approved the brief. The run labeled the brief "Draft for approval" and sliced it so that this page can show the step.
A real session stops at step 7 and waits for you. The run used no subagents, because these two skills use none.

First, the questions. The code settled facts, and only decisions went to the owner. Three of the five round-1 questions are shown. A person must not skip these rows.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the "Why it needs its own answer" column is left out, and rows Q-3 and Q-5 are left out. The text of the other columns is verbatim.

| ID | Question | Recommended answer | Status in this run |
| --- | --- | --- | --- |
| Q-1 | Is a reader's list private to that reader? Favorites are public by user name (A-4). | Yes. Only the signed-in reader can read their list. | Default used. Not a person's answer. |
| Q-2 | Is the reading list a separate list from favorites? You said "reading list". The code has "favorites", a public like with a count. | Yes. Keep favorites as they are. Add a new list. | Default used. Not a person's answer. |
| Q-4 | Does the list show the most recently added article first? A-5 says this needs a new stored time. | Yes. Add a table that stores the time. | Default used. Not a person's answer. |

Two assumptions caused those questions. The skill found them by reading the code before it asked.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are two rows of the assumptions table.

| ID | Assumption | Evidence | If wrong | Confidence |
| --- | --- | --- | --- | --- |
| A-4 | Favorites are public. `GET /api/articles?favorited=<username>` uses `auth.optional`, so anyone can read any user's favorites. | `article.controller.ts` (`GET /articles`, `@auth optional`) and `article.service.ts` lines 54 to 63. Demonstrated. | A list that reuses favorites exposes what readers saved. | High |
| A-5 | Favorites store no time. The join table `_UserFavorites` has two columns, `A` and `B`. The list order of favorited articles is the article's `createdAt`, not the time of the favorite. | First migration, lines 56 to 60. `article.service.ts` `getArticles` uses `orderBy createdAt desc`. Demonstrated. | "Newest added first" is not possible without a new column. | High |

"Demonstrated" is the skill's word for a fact that the run read in the code. A join table is a table that links two other tables, here a user and an article.
One assumption was not read in the code path that runs. A-7 says that favoriting an unknown slug returns status 500 (a server error). The run inferred it and did not send the request, because no database was available.

Next, the brief. The run produced one file with the template sections and a self-audit.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
## Solution

A signed-in reader can put an article on a personal reading list, take it
off, and list the articles on it, with the most recently added article
first. Only that reader can see the list. The reading list is separate
from favorites. Favorites keep their present behavior.
...
## Out of scope

- Read and unread state.
- Sharing a list, or a public list.
- Several named lists or folders.
- Changes to favorites.
- Any front end. The owner of the front end is Unknown.
- A cap on the list size.
```

The brief marks each decision as agreed or delegated. The skill also separates deferred ideas and unresolved questions. In this run, D-1 to D-12 are agreed with the default used, and the run chose D-13 to D-16 as delegated technical choices.
The brief states each non-functional need with a measure. When no source gives one, it writes `Unknown` and names the owner, as for the list size.

Then the slicing. The skill cut three tickets and quizzed the breakdown.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is the order table of the slicing review. The text is verbatim, except that backticks around file names are removed.

```markdown
| Position | Ticket | Blocked by | Points to an earlier ticket |
| --- | --- | --- | --- |
| 1 | 01-save-an-article-and-list-it.md | None | Not applicable |
| 2 | 02-remove-an-article-from-the-list.md | 01 | Yes |
| 3 | 03-show-whether-an-article-is-on-my-list.md | 01 | Yes |
```

The requirement map found a gap: no criterion covered the decision that a reader can add their own articles.
The run added one criterion to ticket 01. Tickets 02 and 03 both wait for 01, and they do not wait for each other.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text. This is the start of ticket 01.

```markdown
# Save an article and see my reading list

## What to build

A signed-in reader adds an article to a private reading list and reads
the list back, newest addition first.
...
## Acceptance criteria

- [ ] A signed-in reader adds an article. The response has status 200
  and the article body, and the next `GET /api/user/reading-list`
  includes it.
- [ ] The list shows the article added last first. Failure path: two
  articles added in order A then B return B then A.
- [ ] A reader adds an article that the reader wrote. The response has
  status 200, and the article is on the list.
...
- [ ] A request with no token to either route returns status 401.
  Failure path: the list is never readable without a token.
...
```

Status 401 means that the request has no valid sign-in. Six of the ten criteria in ticket 01 give a failure path. Most criteria have a verification row. Ticket 01 has 10 criteria and 9 rows: the criterion that the requirement map added (a reader adds their own article) has no row. This is a run defect.
Many criteria need a database or a running API, and the tickets say so.

Last, the preview. No ticket has a `Tracker:` line, so each action is create. The GitHub CLI was signed in, so the preview shows the `gh` commands. Without a signed-in CLI, the skill writes a manifest instead. The run stopped here.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
# ticket-sync preview (provider: github | project:
gothinkster/node-express-realworld-example-app | NOT POSTED | dry run)
...
## Ticket 2: 02-remove-an-article-from-the-list.md  [action: create]
- title: Remove an article from my reading list
- labels: none (no config, no field mapping)
- issue type: not applicable on GitHub
...
- dependency links: `Blocked by` -> issue created for
  01-save-an-article-and-list-it.md (key known only after that create)
...
- would run (not run):
  gh issue create --repo gothinkster/node-express-realworld-example-app
  --title "Remove an article from my reading list"
  --body-file <body of ticket 2>
```

What you must check in the output:

- The brief says who sees the list, how it relates to favorites, and what is out of scope. Each decision that changes privacy or scope has your answer, not the default.
- Each ticket has all template sections, `Blocked by` set to an earlier ticket or `None`, and no ticket delivers one layer only.
- The requirement map has no requirement without a ticket and a way to verify it. Each criterion has a verification row, including a criterion that the map added.
- The preview names the provider and the project, and you agree with both. This run inferred both from the git remote, and no person confirmed them.
- No ticket file has a `Tracker:` line. The run compared the ticket files before and after the preview, and nothing changed.

What was not executed. The run had no database, so it called no route and wrote no code. The tickets describe work that does not exist yet.
The baseline check ran: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/article.service.test.ts` passed 5 of 5 tests with the Prisma mock.
That result shows only that the existing article service tests pass today. It proves nothing about a reading list.
The run did not apply the sync. It created no issue, wrote no key, and did not test an update on a second run.

## Common mistakes

- You accept the privacy default without reading it. A favorite is public, so a list that reuses favorites exposes what readers save. Read Q-1 and Q-2 yourself.
- You approve a brief that still has a question that blocks the start. The self-audit exists to catch this. Settle the question with its owner first.
- You confirm the sync from a clone whose remote is not your team's repository. The run's copy pointed at the public upstream. Read the project line in the preview.
- You keep the tickets in a folder that you delete. `ticket-sync` records each issue key in the ticket file. Without the file, a second run creates duplicates.
- You leave local file names in the ticket text. The tickets in this run name `02-brief-reading-list.md` in their Source and Parent sections. The tracker reader cannot open that path. Rename the references to titles before you confirm. The skills have no rule for this.
- You copy the favorite routes for the error case. The favorite code has no check for a missing article, and the run inferred that it returns 500. The brief asks for 404 with the shape that `getArticle` uses.
- You expect the skills to build the feature. They write the brief and the tickets, and they edit no code.

## Next

- [Refine a vague story](qa-refine-a-vague-story.md): when a ticket still has open questions before the sprint starts.
- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): when the tickets are approved and the team starts to build.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): when a pull request for one ticket is ready for test planning.
- [Decide whether to build](product-decide-whether-to-build.md): when the evidence for the idea is thin.
- [Compare an ask with the product](product-compare-an-ask-with-the-product.md): when you have a written ask and want a gap report without a brief.
- [Design a new capability](arch-design-a-new-capability.md): when the idea needs a design before slicing.
