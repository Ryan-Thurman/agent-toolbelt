# Answer an architecture question

This page is for a developer or architect with one focused architecture question about an existing codebase. You get a direct answer with its evidence and the alternatives that the code rules out. You also get a list of decisions that only the owner can make. To design a whole feature, use [Design a new capability](arch-design-a-new-capability.md) instead.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer, architect | [`system-design`](../../skills/system-design/SKILL.md) (`/system-design`) | Light (a short note, no optional reviews). Pass `--light` to set it. | One question in a sentence. The repository that the question is about. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Ask the question: `/agent-toolbelt:system-design "<your question>" --light`.
3. Find the depth near the top of the output. Then read the four parts that the skill prescribes for a question: the answer, the evidence, the alternatives, and the open decisions. The skill sets no heading names and no status labels. With no path from you, it writes the record to `.atb-work/system-design/<scope-slug>.md`. Ask for the note in a file path of your choice, or read it in the chat. For each evidence row that says the agent only read the code, open the file yourself.
4. Answer each numbered owner question in the chat, or write down that you accept its default.
5. If the answer adds a table, an endpoint, or a service, start a Standard design before you plan the work. This is the page's advice, not a skill rule.

You get an answer, the evidence behind it, the rejected alternatives, and the open decisions.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The commands on this page that name commit 30b68e1 are examples. Light is the short level, with no optional references, reviews, or subagents. Standard is the full procedure of the skill, for a change that adds a component, data store, or API. Replace the commit and the question with your own.

A team plans a bookmark feature. A reader saves an article to read later. The favorites feature already links a user to an article. The team asks: "Where must bookmark logic live in Conduit, and must it share the favorites table?"

A wrong answer is costly in two ways. A bookmark that reuses favorites changes a public count. Bookmark logic placed in `article.service.ts` adds to a file that is already 652 lines long (`wc -l src/app/routes/article/article.service.ts`).

## Why this path

The obvious alternative is to read the favorites code yourself and start building. That costs you the facts that decide the answer. In this run, favorites were public by user name and the join table had no timestamp. The same query block also repeated 7 times: `grep -c 'favoritedBy: true,' src/app/routes/article/article.service.ts` returns 14 lines, which are 7 blocks of 2 lines. In practice, a reader who builds first finds these facts in review.

The sibling in the skill description is `phased-delivery` ([`phased-delivery`](../../skills/phased-delivery/SKILL.md)). It plans implementation phases and needs a settled design. Use it after this page, not in place of it.

The other alternative is the same skill at the Standard level. The skill runs the full procedure there. That is the right level for the design of the bookmark feature. It is more work than the team's question needs. The skill says that a focused question can end with an answer and explicit limits. The page [Design a new capability](arch-design-a-new-capability.md) covers the Standard path.

The procedure has this order because each part limits the next. The skill first fixes the question and the evidence. Then it checks only the design areas that can change the answer. Then it asks the owner for decisions that no source states. Only then does it compare options.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all system-design /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:system-design` (plugin) or `/system-design` (installed copy). |
| 2 | Open your repository at the commit that the question is about. In the sample, run `git log --format='%h %s' -1` and expect `30b68e1 fix: missing user id`. | The answer is valid for one revision. | You can name the commit. |
| 3 | Ask for the note in a file path of your choice, or read it in the chat. With no path, the skill writes to `.atb-work/system-design/<scope-slug>.md`. This run predates that default, and it wrote `outputs/design-note.md`. Run `/agent-toolbelt:system-design "<your question>" --light`. In the sample: `/agent-toolbelt:system-design "Where must bookmark logic live, and must it share the favorites table?" --light`. | `--light` fixes the depth. Without it, the agent picks a depth and states it. | You can find the depth and the reason near the top of the output. The skill says to state them in the first sentence. The run put them in the first bullet under a title, which is its own layout. |
| 4 | Read the answer. In the run, this is the "Answer" section. | It gives the result first. | You can say in one sentence what the note recommends. |
| 5 | Read the evidence. In the run, this is the "Evidence" table, and each row has a status of `Read in code` or `Executed`. The run chose these labels and this heading. The skill prescribes `Verified`, `Failed`, and `Not verified` only for behavior checks. Open the files for the rows that decide the answer. | A row that the agent read from code is not a test result. | You checked each deciding row against the file at your commit. |
| 6 | Read the alternatives. The run used a table. Look for the option that you expected. | The note must say why it rejected each credible option. | Each option has a reason that cites an evidence row. |
| 7 | Answer the owner questions. Each has a recommended default. With a person present, the agent asks the numbered questions in the chat. | The skill asks only for decisions that no source states. | Each question has an answer from you or the owner, or you accept its default, or it stays on your open list with a named owner. |
| 8 | Run the executed checks yourself when you need them. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/article.service.test.ts` (needs `npm ci --ignore-scripts` and `npx prisma generate` first). The Prisma mock runs the article tests without a database. | The run reports the result in its own environment. You confirm it in yours. | The article file passes 5 of 5. The full unit run fails 7 tests in `auth.service.test.ts`, because that file needs a database. If your result differs, record the difference. |
| 9 | Read "Weakest point" and the readiness result. | The skill names the part that fails or limits the design first. | You know the next action: ask the owner, revise, or plan. |

## Decision points

- If you gave no depth, read the depth line. The agent can choose a level above Light when the question shows a higher risk. Ask for `--light` when you only need an answer.
- If the answer recommends a new data store, a public endpoint, or a service, start a Standard design before you plan. This is the page's advice. In this run, the answer recommended a new table and endpoints, and the note stayed at Light for the answer. It named Standard for the follow-up design. When this run ran, the skill did not say whether the level comes from the question or from the answer. The shared depth rule now takes the level from the recommendation, so a Light answer cannot recommend a new table.
- If the readiness result is `Needs decision`, take the owner questions to the owner first. In this run, the result was `Needs decision`.
- If the question is about a record of a past decision or a map of the current system, the skill uses another mode. Ask for that outcome in the prompt.
- Stop when the question has an answer, each deciding claim has a source, and each owner question has an answer or a named owner. A Light run asks the numbered questions in the chat. Accept a default only when the owner of the decision agrees.
- Choose [Design a new capability](arch-design-a-new-capability.md) when you must design the feature itself, with its interfaces, data, and threat review.
- Choose [Decide whether to build](product-decide-whether-to-build.md) when the open question is whether to build bookmarks at all.
- Choose [Right-size a plan](arch-right-size-a-plan.md) when the plan already has more parts than the problem needs.

## What you get

The run was headless, so no person answered the owner questions. The run used the recommended default for each and marked it as a default. A default is not the owner's answer. The skill asks such questions in numbered rounds with a recommended answer, and a person answers them before planning. A headless run now takes the recommended answer as the run's choice and lists the question as open, as `references/design-conversation.md` says. This run predates that rule. The run did not start `threat-model` or `reliability-review`. The skill requires `threat-model` for a design proposal, and `reliability-review` when the design adds a data store or another listed change. This run answered a question. No reviewer subagent ran. The coverage check against the design method is a Self-review.

First, the answer.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
1. Bookmarks must not share the favorites table. Use a new table,
   `Bookmark`, with one row for each user and article and a
   `createdAt` column.
2. Bookmark logic must live in a new route group,
   `src/app/routes/bookmark/`, with its own controller and service.
   Register it in `src/app/routes/routes.ts`. Do not add it to
   `article.service.ts`.
...
```

In this repository no lint rule enforces module boundaries (E-6, not shown), so the location is a convention: one folder for each route group. The note words the location as firm. The facts that force the table choice are in the next excerpt.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the Source column and rows E-1, E-3, E-6, E-7, and E-8 are left out. The text of the cells that remain is verbatim.

| ID | Observation | Status |
| --- | --- | --- |
| E-2 | Favorites are public by user name. `GET /api/articles?favorited=<username>` filters on that name. The code does not compare the name with the caller. | Read in code |
| E-4 | 7 queries in `article.service.ts` repeat the same include block with `favoritedBy: true`. Each query loads every user row that favorited each article. | Read in code |
| E-5 | The visibility rule (an article shows in a list only when its author is a demo user or the caller) sits in `buildFindAllQuery`, which is not exported. `getArticle` and `favoriteArticle` do not apply it. | Read in code |

The run chose an ID scheme. It uses E-n for an evidence row and Q-n for an owner question, in later sections too. Bookmarks stored in the favorites table appear in the `?favorited=` filter (E-2). They also raise the public count that the mapper builds from the same relation. The table has no timestamp column, so it cannot order bookmarks by save time.

The note also tested one claim by execution. It added a `Bookmark` model to a copy of the schema and ran `prisma migrate diff` with no database.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The output has two more statements after this, which add the foreign keys.

```sql
-- CreateTable
CREATE TABLE "Bookmark" (
    "userId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("userId","articleId")
);

-- CreateIndex
CREATE INDEX "Bookmark_userId_createdAt_idx" ON "Bookmark"("userId", "createdAt");
```

The preview adds one table, one index, and two foreign keys. It changes no existing table. It was not applied to a database, because none was available.

Last, the owner questions.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the "What the answer changes" column is left out. The text of the other columns is verbatim.

| ID | Question | Recommended default |
| --- | --- | --- |
| Q-1 | Are bookmarks private to the reader? | Yes. |
| Q-2 | Does the article payload need a `bookmarked` flag? | Add it to the single-article response and to the bookmark list only. Do not add it to article lists. |
| Q-3 | Does the bookmark list order by save time, newest first? | Yes. |
| Q-4 | Does saving a bookmark follow the list visibility rule (E-5)? | Yes. Reject a slug that a list hides. |

The note ends with this result: `Needs decision`. The location and table answers hold under either answer to Q-1. Q-1, Q-2, and Q-4 need the owner before planning. Its weakest point is that the bookmark list needs the include block and the visibility rule, and both are private to `article.service.ts`. An eighth copy of the block is a second way to do one task.

What was executed in this run, and what was not:

- Executed: the existing unit tests with the Prisma mock. The article service tests passed 5 of 5. The full unit run had 19 passed and 7 failed, all 7 in `auth.service.test.ts`. These tests prove the mock, not the database.
- Executed: `prisma validate` and the offline migration preview for the new model.
- Read in code only: every row about favorites, visibility, and module layout.
- Not run: a database, the API, the migration against Postgres, and any bookmark code. No bookmark code exists.

## Common mistakes

- You take the answer as a design. The Light note answers a question. A new table and three new endpoints need the Standard design and the threat review. In practice, start that design before you plan phases.
- You treat a default as the owner's answer. The note marks each default. Whether bookmarks are private (Q-1) changes the read rules, so get that answer first.
- You skip the evidence status. A row marked `Read in code` is a reading, not a test. Open the file at your commit before you rely on it.
- You copy the favorites pattern for the bookmark list. The pattern loads every favoriting user for each article (E-4). The note says to read bookmarks by user ID through the index.
- You ask a question without a revision. The answer holds for one commit. After the code changes, run the skill again on the affected rows.

## Next

- [Design a new capability](arch-design-a-new-capability.md): when the answer adds a table or an endpoint and you need the full design with a threat review.
- [Threat-model a design](sec-threat-model-a-design.md): when bookmarks hold data that a reader must keep private.
- [Right-size a plan](arch-right-size-a-plan.md): when the first design has more parts than the problem needs.
- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): when the design is accepted and you plan the work.
- [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md): when the team builds the module by copying the shape of `tag` or `profile`.
- [Refine a vague story](qa-refine-a-vague-story.md): when the bookmark ticket is too vague to test against.
- [System design workflow](../../workflows/system-design-workflow.md): the stages that follow a design.
