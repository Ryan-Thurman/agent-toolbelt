# Copy a pattern to a new area

This page is for a developer whose ticket says "do it like the existing feature". You get a brief that maps the existing feature (the precedent) onto the new area, lists the gaps, and names the open questions. The agent edits no code in its main work. The optional check in step 5 writes a throwaway test file, which the skill does not rule on.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`ticket-discovery`](../../skills/ticket-discovery/SKILL.md) (`/ticket-discover`) | No levels. The skill has no depth setting. | The ticket text and the repository that holds the precedent. The target area can be in the same repository or in another one. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run discovery: `/agent-toolbelt:ticket-discover "<ticket text>. Save the brief to .atb-work/ticket-discovery/<ticket-slug>.md."`
3. If the brief says the precedent was not found, stop. Read the Decision points below and use `/tech-assess` or a spike.
4. Send this follow-up: `Run the precedent's own tests and read each assertion. Print what the precedent returns. Add every defect that a copy must not repeat. Delete any throwaway test file when you finish.`
   The test command depends on your project. For the sample it is `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest <test-path>`. Tests with a mocked data layer need no database. If the tests do not run, record "not executed" in the brief and go on. Run `git status` after, to check that the agent left no extra file.
5. Read "Gap analysis" and "Risks / unknowns". Answer each open question, then run `/implementation-plan <brief path>`.

You get a brief with exact paths for the precedent, a gap table for the target, open questions, and the next command.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The excerpts on this page come from commit 30b68e1. Replace them with your own ticket.

The ticket reads: "Add bookmarks to articles the same way favorites work." You must plan the work before you build it. The ticket gives no success signal and no detail about privacy, ordering, or tests.

A rename-and-copy of the favorites code looks small. The sections below show what the copy carries along.

## Why this path

The obvious alternative is to open the favorites code, copy it, and rename it. That costs you three things here. The copy repeats the defects of the precedent (see "What you get"). It also hides the questions that the ticket does not answer, such as whether bookmarks are private. You find those questions after you build.

The sibling skill is [`tech-backlog-assessment`](../../skills/tech-backlog-assessment/SKILL.md) (`/tech-assess`). Its command file says to use it to decide whether and how to do a technical item. The skill description says to use `ticket-discovery` when the item names a precedent. Here the work is already valid, so a do-or-defer decision adds a step and gives no file-level gap table.

The skill says to find the precedent first and not to invent the pattern. It then reads the target and compares the two. A comparison that starts from a guessed pattern has no evidence. This reason is practice, not a skill statement.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code from the repository folder: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all ticket-discovery /path/to/project`. | The command must exist in your session. | You type `/` and see `/agent-toolbelt:ticket-discover` (plugin) or `/ticket-discover` (installed copy). |
| 2 | Paste the ticket text into the command: `/agent-toolbelt:ticket-discover "<ticket text>. Save the brief to .atb-work/ticket-discovery/<ticket-slug>.md."` In the sample, the text is `Add bookmarks to articles the same way favorites work.` | The skill parses the ticket into target, precedent, requested change, and success signal. The skill has no tracker step. The run gave the ticket text. An ID alone works only if the agent can read your tracker. The skill names no output folder. The folder in the prompt is practice, not a skill rule. Make sure that `.atb-work/` has a `.gitignore` that contains `*`. Create it with `echo '*' > .atb-work/.gitignore`. | The brief has a "Parsed request" section with four lines: target, precedent, requested change, success signal. |
| 3 | Check the "Parsed request" lines against your ticket. | A wrong precedent gives a wrong brief. The ticket can leave out the success signal. | Each line matches your ticket. A success signal that the ticket does not state is marked as an assumption. |
| 4 | Read "Existing precedent". Open two of the named files at the named lines. | The skill requires an exact path, a command, or an explicit "not found" for each precedent claim. | Each row has an exact path, a command, or "not found". The run also gave line numbers, which the skill does not require. |
| 5 | Send the follow-up from the quick path. The skill does not ask for this check, so this is practice. The agent writes a throwaway test file and removes it. The skill does not rule on this, so run `git status` after. If the precedent has no tests, there is nothing to run: record "none found" and go on. | The skill compares structure. It does not read what the precedent returns or what its tests prove. | The brief lists each defect with evidence and says if it was executed or read from code. |
| 6 | Read "Gap analysis". | The table shows, for each area, what the precedent has, what the target has, and the action. | Each row has an action and a reason. The run used reuse, adapt, or create. The template has only an Action column, so these labels are the run's choice. |
| 7 | Read "Risks / unknowns". Answer each question or write the default on your list. | The skill lists unresolved questions. It does not answer them. | Each question has an answer from the owner or an accepted default. |
| 8 | Read the handoff. Run the command that it names, for example `/implementation-plan <brief path>`. | The skill names the next skill: `phased-delivery`, `cover`, or `retrofit`. | The next command has the brief as input. |

## Decision points

- If the agent reports that it cannot find the precedent, stop. The skill reports that result and recommends `tech-backlog-assessment` or a spike. It does not invent the pattern.
- If the precedent has no tests, step 5 has nothing to run. Record "none found" and go on.
- If the ticket asks whether to build the item at all, use [`tech-backlog-assessment`](../../skills/tech-backlog-assessment/SKILL.md) (`/tech-assess`). Read [Decide one backlog item](lead-decide-one-backlog-item.md).
- If the ticket names one defined change for many sites, such as a library swap, use [`retrofit`](../../skills/retrofit/SKILL.md). Read [Swap a library everywhere](dev-swap-a-library-everywhere.md). `retrofit` excludes database migrations, and the bookmark change needs one, so it is a sibling and not the path here.
- If the ticket reports a bug, use the bug-to-fix path. Read [Fix a reported bug](dev-fix-a-reported-bug.md).
- If the ticket lists the files and the acceptance criteria, you can skip discovery and go to `/implementation-plan`. The skill targets tickets that are under-specified. This skip is practice.
- Do not let the agent edit files before you read the brief. The skill reports only and edits after you review the brief and ask it to continue.
- Stop when each precedent claim has a path, a command, or "not found". Each open question must have an answer or sit on your list.

## What you get

The run was headless, so no person answered. The skill asks no question of a person. It lists questions in the brief. The run used a default for five of the six (Q-2 had none) and recorded each default in the brief. In an interactive session the agent can put these questions to you in chat. The run had no person to ask.

The brief uses IDs. Slices are the brief's implementation steps. P-1 to P-4 are defects of the precedent. Q-1 to Q-6 are open questions. The follow-up from step 5 produced the P rows. The template has no section for them, so the run added a table.

First, what the precedent returns. The run mocked the database client and called `favoriteArticle`. The mocked row held a user who favorited the article.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are the two output lines of the probe, without the log prefix.

```text
KEYS ["id","slug","title","description","body","createdAt","updatedAt","authorId","tagList","favoritedBy","author","favorited","favoritesCount"]
FAVORITEDBY [{"id":7,"email":"a@example.test","username":"u7","password":"HASH","bio":null,"image":null,"demo":false}]
```

The response of the favorite route carries the full user rows of everyone who favorited the article. A copy for bookmarks repeats this. The probe used a mocked result. It did not call a database. The brief marks P-1 as "Mock only".

Next, the gap table. Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: only the first three rows and the first three columns are shown. Cell text is verbatim.

| Area | Precedent Has | Target Has |
|---|---|---|
| Data model | Implicit relation `UserFavorites` (2 schema lines) | Nothing |
| Migration | Initial migration creates `_UserFavorites` | Nothing |
| Routes | `POST` and `DELETE /articles/:slug/favorite`, `auth.required` | Nothing |

An implicit relation is a join table that Prisma creates from two schema lines. The run also drafted the schema change in a separate file and asked Prisma for the migration SQL. This step needs no database.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The command was `npx prisma migrate diff` with the current and the draft schema file. Only the first statement is shown. The file also holds two indexes and two foreign keys. The banner that follows the SQL is left out.

```sql
-- CreateTable
CREATE TABLE "_UserBookmarks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);
```

Last, the open questions. Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: Q-4 to Q-6 are left out. Q-6 asks whether tests stay at unit level, with the default "unit only".

```markdown
- Q-1: Are bookmarks private to the user, or public like favorites? Favorites show a public count. Default used: private, no count.
- Q-2: How does the user read bookmarks: a new route such as `GET /articles/bookmarks`, or a filter on `GET /articles`? Default used: undecided, slice 5 waits.
- Q-3: Does the list need "most recent bookmark first"? The implicit table has no timestamp, so it needs an explicit join model. Default used: order by article creation time, as other lists do.
```

What you must check in the output:

- The test file ran: 5 of 5 passed with the Prisma mock and no database. Four are favorite tests and one is a `deleteComment` test. The probe covered `favoriteArticle` only. Its "no user is found" test passes because a `TypeError` is thrown, and no code checks for a user. Its "return the favorited article" test passes with an undefined `favoritesCount` (P-4). The unfavorite tests were not probed. Do not copy those tests as proof.
- P-2 and P-3 are read from code. The run did not execute them. P-3 says an unknown slug gives status 500.
- Each Q row says what the default was. A default is not an answer from the owner.
- Nothing ran against Postgres. The migration was not applied, no route was called, and no integration test ran.
- The brief lists front-end repositories as not searched. If another repository calls these routes, search it before you plan.

## Common mistakes

- You copy the response shape of the precedent. The favorite routes return user rows with `password`. Check what the precedent returns before you list it as a pattern to reuse.
- You trust the precedent tests. A test with a mocked data layer can pass when the code is wrong. Run the tests and read each assertion.
- You copy a public feature as a private one. Favorites show a count and a filter by user name. A bookmark list is usually personal, so ask the owner (Q-1).
- You promise "most recent first" on a list that has no timestamp. The implicit join table has none. Ask before you plan an order (Q-3).
- You treat the missing CI and end-to-end precedent as part of "the same way". The sample repository has none for favorites. An integration test is new setup, so name it as new work.
- You let the agent start the change after the brief. The skill reports only. Review the brief first.

## Next

- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): when the brief is ready and you want one reviewable PR for each slice.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when the brief's "Coverage To Add" list is ready and you want the tests first.
- [Decide one backlog item](lead-decide-one-backlog-item.md): when the open questions show that the work itself is in doubt.
- [Fix a reported bug](dev-fix-a-reported-bug.md): when the response leak in P-1 needs its own fix.
- [Swap a library everywhere](dev-swap-a-library-everywhere.md): when the change is one defined edit across many sites.
- [Shape an idea into tickets](product-shape-an-idea-into-tickets.md): when the ticket itself is still an idea.
