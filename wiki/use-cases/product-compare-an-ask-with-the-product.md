# Check whether the product already does what was asked

This page is for a product owner who gets a request such as "can users follow tags and see a feed of them?" You must say whether the product can do it today. You get a report with a status for each requested outcome, evidence from the code, and a ranked list of open decisions.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Product owner. A developer reads the evidence and the product owner answers the questions. | [`shape-up`](../../skills/shape-up/SKILL.md) (`/shape-up`), gap review mode | No levels. The skill has no depth setting. | The ask as one sentence, and read access to the repository of the product |

## Quick path

1. Start Claude Code in the repository of the product with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Run the comparison: `/agent-toolbelt:shape-up Compare this ask with what the product does today. Report only. Save the report to <folder>/gap-review.md. Ask: <the ask in one sentence>`. The skill does not save the report by itself, so the save sentence is part of your prompt.
3. Read the gap status table and the evidence rows that sit under it. List each finding that the report marks as not run, and give the list to a developer. Keep each of these findings as inferred until the check runs (step 9 of the table below).
4. Stop here if every outcome is `covered`. If the ask is a bug, or nobody knows whether the feature has value, see "Decision points" before you go on.
5. Send the ranked questions to the people who own the answers. Each question has a recommended default.
6. When the answers arrive and you still want the feature, shape it: `/agent-toolbelt:shape-up Shape this ask. Use the gap review in <folder>/gap-review.md. Answers: <the answers to the questions>. Ask: <the ask>`. If you use an installed copy of the skill, type `/shape-up` in place of `/agent-toolbelt:shape-up`.

You get the status of each outcome, the evidence, the consequence, and the open decisions. The skill edits no code and writes no ticket.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

A stakeholder asks: "Can users follow tags and see a feed of them?" You must tell them whether the product can do it today. You must also say what is missing and what you must decide before anyone plans the work.

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run used commit 30b68e1. The product is a blogging API. Users write articles, attach tags to them, and follow other users. An endpoint `GET /api/articles/feed` returns the articles of the users that the caller follows.

The code marks seeded sample accounts with a `demo` flag (a user field set to true by the seed script). Registration sets it to false. The ask sounds small, because follow and feed both exist. The review shows that the existing follow is between users only. No code stores which tags a user follows.

Your product has its own rules. The `demo` flag is specific to this sample.

## Why this path

The obvious alternative is to ask a developer, or to search the code yourself. That takes developer time (this is practice, not a skill rule), and the answer has no evidence that you can pass on. The review traces the path for you and records the file behind each claim. It also marks a claim as inferred when nobody ran the code. A failed search is not counted as proof, so the report names what was searched.

The sibling skill in the same area is [`product-discovery`](../../skills/product-discovery/SKILL.md) (`/product-discovery`). Its description says to use it when you decide what to build. It frames the opportunity, the evidence from customers, the risks, and the experiments. Its output is an opportunity frame and tests of the idea. It gives no status for each outcome and does not map an ask to current behavior. Use it before this page when nobody knows yet whether the feature is worth building. The page [Decide whether to build](product-decide-whether-to-build.md) shows that path.

The other mode of `shape-up` turns a vague idea into an approved brief. It asks you questions in rounds and stops for your approval. In practice, starting there costs you a round of questions about a feature that the code can already have. When you ask for both, the skill reports the gaps first. It then uses the gaps to focus the shaping questions. The mode follows the wording of your request, so say "compare" and "report only".

The procedure has this order because each step limits the next one. The skill restates the outcomes first. It traces the user path through the code second. It classifies each outcome third. It looks for gaps that the ask leaves out fourth. It separates findings, inferences, and decisions last. The skill states this order. The reasons are practice, not a skill rule: a classification before the trace has no evidence, and a list of questions before the classification has no priority.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all shape-up /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:shape-up` (plugin) or `/shape-up` (installed copy) in the list. |
| 2 | Write the ask as the requester wrote it, in one sentence. Do not add detail. In the sample: "Can users follow tags and see a feed of them?" | The skill restates the outcomes without adding requirements. It treats the wording as the request, not as proof. | You have one sentence that the requester agrees with. |
| 3 | Start the agent in the repository and run: `/agent-toolbelt:shape-up Compare this ask with what the product does today. Report only. Save the report to <folder>/gap-review.md. Ask: <ask>`. With an installed copy, type `/shape-up Compare this ask ...` in place of the plugin form. | The words "compare" and "report only" select the gap review. A vague idea with no comparison wording can select interactive shaping. | The agent restates the outcomes and starts to read code. It asks you no shaping questions and edits no file. |
| 4 | Read section 1 of the report, the requested outcomes. | The skill splits the ask into outcomes, and every later status refers to them. | Each outcome matches what the requester meant. If one does not, correct the sentence and run again. |
| 5 | Read the evidence rows. Each row has a file path, and a kind: demonstrated, inferred, or not inspected. | A claim without a path is the agent's opinion. A path lets a developer check the claim in minutes. | Each status in step 6 has at least one evidence row. |
| 6 | Read the gap status table. | The skill gives each outcome one of four statuses: covered, partial, missing, or unknown. The skill lists these four labels and does not define them. In this run, `unknown` means "not found", never "does not exist", and `partial` means that part of the outcome works. These meanings are the run's reading. | Each outcome has a status and a reason. |
| 7 | Read the consequence and the ranked questions. Send each question to its owner, with the recommended default. | The questions are the product or policy choices that the code cannot settle. They are ranked by their effect on scope, risk, and pull request boundaries. | Each question has an answer or sits on your list of open questions. |
| 8 | Read the last section, the confidence and inspection limits. | It says what the agent ran and what it only read. | You can name each finding that rests on code that nobody ran. Give this list to a developer. |
| 9 | Developer task. Hand-off sentence for the developer: "Run the checks that the gap review marks as not run, and write the results into the report." The developer runs `npm ci`, `npx prisma generate`, `npx prisma migrate deploy` with a real `DATABASE_URL`, `npx prisma db seed`, and `npx nx serve api`. The server needs `DATABASE_URL` and `JWT_SECRET`. Then the developer registers two users (`POST /api/users` with `{"user": {"username", "email", "password"}}`), logs in (`POST /api/users/login`), and sends the header `Authorization: Token <token>` on later calls. The first user adds an article with a tag. The second user requests `GET /api/articles?tag=<tag>`, then follows the first user (`POST /api/profiles/<username>/follow`) and requests `GET /api/articles/feed`. | A reading of the code can be wrong about what a caller sees. A request shows it. | The result matches the report (E5 and E6) when the tag list of the second user does not show the article of the first user, and the feed of the second user shows it after the follow. Any other result contradicts the report. Record the result in the report. |

Step 9 needs a database and a running API, and the product owner does not run it. If nobody runs it, keep each finding that it covers as inferred.

## Decision points

- If the report says `covered` for every outcome, stop. Tell the requester how to use the feature, and add no work.
- If the report says `missing` or `partial`, and the questions are answered, go to shaping. Run `/shape-up` again with the answers, or use [Shape an idea into tickets](product-shape-an-idea-into-tickets.md).
- If you do not yet know whether anyone needs the feature, stop and choose [`product-discovery`](../../skills/product-discovery/SKILL.md). The gap review answers "what does the product do", not "is it worth building".
- If the ask describes broken behavior, such as "the feed shows nothing", choose [`bug-to-fix`](../../skills/bug-to-fix/SKILL.md). The page [Fix a reported bug](dev-fix-a-reported-bug.md) shows that path. The skill routes such requests there.
- If the ask is a ticket or story that is almost ready, choose [`story-refinement`](../../skills/story-refinement/SKILL.md). The page [Refine a vague story](qa-refine-a-vague-story.md) shows that path.
- If the question is how a new part must fit the structure of the system, choose [`system-design`](../../skills/system-design/SKILL.md). The skill sends such questions there when it is available.
- If the approved scope is already clear, skip the gap review. Give the scope to [`phased-delivery`](../../skills/phased-delivery/SKILL.md).
- The skill is done when it delivers the comparison and the ranked questions. It needs no approval. You are done when each outcome has a status and each question has an owner. The owner condition is this page's practice, not a skill rule.
- Rerun the review when the code changes before the work starts. A report is a snapshot of one commit.

## What you get

The run was headless, which means a run with no person to answer questions. No person answered the questions, so the seven questions below carry the skill's recommended defaults. The defaults are the review's recommendations. They are not answers from a person.

The report uses these IDs. O1 to O3 are the requested outcomes. E1 to E11 are the evidence rows. Q1 to Q7 are the questions. The skill asks for the labels in the status column. The IDs and the table layout are the choice of this run. The row "Related: view articles of one tag" is an extra row that this run added. It is not one of O1 to O3, and the run chose `Partial` by its own judgment.

The tables below show only some rows. In words, the rows that are not shown are: E3 (the feed route `GET /api/articles/feed` filters by followed author and has no tag input), E4 (`GET /api/articles?tag=<name>` lists the articles of one tag), E7 (`GET /api/tags` lists the 10 tags with the most articles), and E10 (the README says the app adheres to the RealWorld API spec). A route is a web address that the API answers.

First, the gap status. This is the answer to your stakeholder.

Excerpt from a run on the Conduit sample API at commit 30b68e1.

| Outcome | Status | Reason |
| --- | --- | --- |
| O1 follow and unfollow a tag | Missing | E1: no storage. No route for it (route list in `01-evidence-searches.txt`). A search for "follow" near "tag", "subscribe", and "notify" found no match. |
| O2 list followed tags | Missing | Follows O1. `GET /api/tags` (E7) lists popular tags, not the caller's tags. |
| O3 feed from followed tags | Missing | E3 filters by author only. A feed that merges several tags does not exist. |
| Related: view articles of one tag | Partial | E4 works for one tag. It hides articles of other real users (E5), so it does not behave like a shared tag page. Not run, because no database is available. |

The file `01-evidence-searches.txt` is a run file that the reader of this page does not have. In your run, the agent names the searches in the chat. The status `Partial` rests on two evidence rows. The report marks them as read from code and not run.

Excerpt from a run on the Conduit sample API at commit 30b68e1.

| ID | Behavior | Evidence | Kind |
| --- | --- | --- | --- |
| E5 | The list in E4 shows only articles by demo users (`demo: true`) and by the caller. An article by another real user is hidden. Registration forces `demo: false`. | `article.service.ts` lines 13 to 25 and 35 to 42, `auth.controller.ts` line 16. | Demonstrated by code, not run. |
| E6 | The feed in E3 has no demo filter, so it shows articles by every followed author. The list in E4 and the feed in E3 therefore apply different visibility rules. | `getFeed` has no `demo` condition (`article.service.ts` lines 113 to 160). | Demonstrated by code, not run. |

The kind `Demonstrated by code, not run.` is the run's wording. The skill prescribes only the three kinds. In this run, no request ran because no database was available. The tests that ran were four test suites (follow, tag, article, and utility tests). They used a fake database that the tests supply (the Prisma mock). They passed (14 passed, 1 todo), and none of them calls the feed or the list. A passing result there says nothing about E5 or E6.

The consequence paragraph explains why a small ask is not small.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped for this page. The run saved each paragraph as one line. The third paragraph of this section (the RealWorld spec compatibility) is not shown. Q2 below relies on it.

```markdown
The answer to the ask is "not yet". The product has two parts that a tag
feed can reuse: article listing by tag (E4) and a feed with paging (E3).
It has no way to store which tags a user follows.

The visibility difference between E4 and E3 decides what a tag feed shows.
If the new feed copies E4, a user sees only demo and own articles. In a
deployment with several real users, the tag feed is empty or nearly empty.
If it copies E3, it shows every author's articles. Both choices change
what a reader sees, so the product owner must pick one.
```

Last, the first three questions.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the column "Why it ranks here" is left out, and Q4 to Q7 are not shown. The text of the cells that remain is verbatim.

| # | Question | Recommended default |
| --- | --- | --- |
| Q1 | Which articles must a tag feed show: all authors, or only demo and own articles as in E4? | All authors, the rule of E3. |
| Q2 | Is the tag feed a new route, or an option on `GET /api/articles/feed`? | A new route. The existing route and its response stay unchanged. |
| Q3 | Does the feed merge followed authors and followed tags, or show tags only? | Tags only. |

Q2 depends on E10. The README of the sample says that the app adheres to the RealWorld API spec. The run did not read that spec, so the report lists compatibility as a question and not as a finding.

What you must check in the output:

- Each status has an evidence row with a path, not only a sentence.
- A status that rests on `not run` evidence is not final. Run the check (step 9) or hand it to a developer.
- The last section lists what was not inspected. In this run: the spec, any front end, and any deployment data.
- Each question has a recommended default, and the report says that no person answered it.

## Common mistakes

- You read `Missing` as "nobody built anything related". The report says `Missing` for tag follows, and it lists two parts that exist. Read the evidence rows before you reply to the requester.
- You accept a recommended default as the owner's answer. In this run nobody answered. Q1 changes what readers see, so it needs a decision from you.
- You phrase the request as an idea, such as "Plan tag following". The skill then follows its interactive shaping flow and asks you questions. Start with "Compare this ask with what the product does today. Report only."
- You treat a passing test as proof of a status. The follow tests in the sample use a mocked database, and no test covers the feed or the list. Check what a test asserts before you cite it.
- You forget that the report is a snapshot. The code at commit 30b68e1 is not the code that your team has next week.
- You expect the skill to save the report to a file. The skill names no output file. Add "Save the report to <folder>/gap-review.md" to your prompt.

## Next

- [Shape an idea into tickets](product-shape-an-idea-into-tickets.md): when the report shows gaps and the questions have answers.
- [Decide whether to build](product-decide-whether-to-build.md): when nobody knows yet whether the feature is worth building.
- [Refine a vague story](qa-refine-a-vague-story.md): when the ask is a ticket or story that is almost ready.
- [Fix a reported bug](dev-fix-a-reported-bug.md): when the ask is really a report of broken behavior.
- [Answer an architecture question](arch-answer-an-architecture-question.md): when the open question is about structure, not behavior.
- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): when the scope is approved and the work starts.
- [Review outcomes after release](product-review-outcomes-after-release.md): when the feature has shipped and you must check what it changed.
