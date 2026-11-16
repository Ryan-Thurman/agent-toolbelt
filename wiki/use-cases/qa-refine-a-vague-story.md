# Make a vague story testable before the sprint starts

This page is for a QA engineer who joins refinement with a one-line story and must make it testable.
You finish with a refined spec, one question packet for each owner, and a readiness verdict.
You also get Gherkin (Given/When/Then text) scenarios that trace to the criteria.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer. The product owner and a developer answer the questions. | [`story-refinement`](../../skills/story-refinement/SKILL.md) (`/story-refinement`), then [`bdd-scenarios`](../../skills/bdd-scenarios/SKILL.md) (`/bdd-scenarios`) | `story-refinement` has Light, Standard, and Deep. This run used Standard. `bdd-scenarios` has no levels. | The story text or its tracker key, and read access to the repository |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Refine the story with no meeting: `/agent-toolbelt:story-refinement <story-file-or-key> --scan`.
3. Send each owner packet. After the answers arrive, check readiness: `/agent-toolbelt:story-refinement .atb-work/story-refinement/<key>/refined.md --check`.
4. Write the scenarios: `/agent-toolbelt:bdd-scenarios .atb-work/story-refinement/<key>/refined.md`.

You get a refined spec with failure paths, one question packet for each owner, a readiness verdict, and feature files that trace to the criteria.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

A one-line story arrives for refinement. The sprint starts soon, and nobody has asked a question yet.

```text
CON-12 Bookmark articles. As a reader, I want to bookmark articles so that
I can read them later. Add a bookmark button on articles and a list of my
bookmarks.
```

The example repository is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest).
The story does not mention that the API already has a favorite feature.
The story gives no rule for whether a bookmark is the same as a favorite.
You must turn the story into criteria that a test can prove.
You must also find the questions that only a person can answer.

## Why this path

The obvious alternative is to write test cases from the story text, or to run `bdd-scenarios` on it at once.
In this repository each case then rests on a guess.
The story is silent about the favorite feature, about who can see a bookmark, and about what happens when an article changes.
`bdd-scenarios` itself says to send an item with vague criteria to `story-refinement` first.

The skill states one reason for its order: resolve facts before you ask.
It reads the repository first, because a question that the code can answer wastes an owner's time.
It drafts the criteria and the failure paths, and then it groups the open questions by owner.
It runs the readiness review on the draft while the questions are still open.
The verdict then lists what the owners must answer. After they answer, you run `--check` to get the verdict again.
In practice the scenarios come after the refinement, because each scenario carries the ID of a criterion.

Use `shape-up` instead when the request is a vague idea or spans several subsystems.
CON-12 has a clear goal, so `story-refinement` fits.

## Steps

The skill saves its files in `.atb-work/story-refinement/<key>/`, which git ignores: `refined.md`, `readiness.md`, and one `questions-<owner>.md` packet for each owner.
To use another folder, name it in your prompt.
The run behind this page used its own folder names, because the skill did not name its files at that time.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Open a terminal in the repository that holds the code for the story. Run `claude --plugin-dir your_toolbelt_folder`. To get the Toolbelt folder, read [Installation](../Installation.md). For a project install, run `./install.sh --harness claude story-refinement bdd-scenarios your_project_folder`. | The skill searches the repository for facts, so Claude Code must start inside it. The skills and their references must also be present. | `/agent-toolbelt:story-refinement` (plugin) or `/story-refinement` (project install) appears in the command list. |
| 2 | Save the story text in `CON-12.md` in your notes folder, outside the repository. | The skill reads the item and records its source. It asks you for the text when it cannot read the tracker. | The file holds the exact text of the story. |
| 3 | Send this one line: `/agent-toolbelt:story-refinement your_notes_folder/CON-12.md --scan`. Add `--standard` only when you must force the depth. | `--scan` asks no question, so it works with no person present. The skill chooses a depth and states it first. | The spec starts with a `Depth:` line and a reason. The output folder holds `refined.md`, `readiness.md`, and one packet for each owner. |
| 4 | Read the assumptions table of the refined spec. Make sure that each row cites a file or a search. | You find the guesses that the owners must confirm before you test against them. | Each assumption has evidence, a consequence if it is wrong, and a confidence. |
| 5 | Read the criteria. Make sure that each rule has a failure path and a proposed test level. | A wrong build must fail at least one criterion. | Each criterion has an ID, and each negative family is `Covered`, `Not applicable` with a reason, or `Gap`. |
| 6 | Read the readiness review and its verdict. Note which checks fail. | The verdict tells you what blocks the start of work. | The verdict is one of `Ready`, `Ready with defaults`, `Not ready`, or `Not verified`, and each failed check has evidence. |
| 7 | Send each packet to its owner. After the answers arrive, record them in the spec. Then send this line: `/agent-toolbelt:story-refinement .atb-work/story-refinement/CON-12/refined.md --check`. | An owner reads a packet once, so the most important question is first. `--check` reports the verdict again and does not change the item. | Each packet has an answer, or "I do not know", which stays an open item. |
| 8 | Send this one line: `/agent-toolbelt:bdd-scenarios .atb-work/story-refinement/CON-12/refined.md`. | The scenarios turn the criteria into the outer test loop of `phased-delivery`. Feature files do not depend on the runner. If the repository has no behavior-driven development (BDD) runner, the skill proposes one and continues. | You have feature files, a step map, a traceability table, a statement of which scenarios fail before the work, and a runner plan when the repository has no runner. The skill saves a runner plan to `.atb-work/bdd-scenarios/<scope-slug>.md`. |
| 9 | Read the traceability table and the runner plan. | A criterion with no test is a gap. A proposed runner needs a decision before anyone installs it. | Each gap in the traceability table has an owner or a ticket. The team has chosen the runner, or named who chooses. |

## Decision points

- If the story changes behavior inside existing boundaries, with no new table, endpoint, or dependency, use `--light`. The required checks still run.
- If a person is present, use `--live`. The skill then asks the open decisions in rounds of at most five.
- If an open item can no longer change the scope, the plan, or the criteria, stop asking.
- If the verdict is `Ready`, or `Ready with defaults` and the owners confirmed the defaults, go to step 8.
- If the verdict is `Not ready`, you can still hand the criteria to `bdd-scenarios`. The skill treats the verdict as a warning, unless your project makes the Definition of Ready a gate. If your project has its own Definition of Ready, the skill uses it in place of its default list.
- Wait for the blocking answer before anyone builds. In the run below, Q-1 is the question whether a bookmark is separate from a favorite.
  The answer to Q-1 can remove the new table and shrink the story to a client label.
- If the repository has no BDD runner, the skill proposes the default for the stack and marks it `Proposed`.
  For a TypeScript API with Jest and no browser, it proposes `playwright-bdd` with `@api` scenarios, and names a Jest binding as the alternative.
  It installs nothing until you agree. Use `--setup` to plan the runner alone.
- If the skill cannot start reviewer subagents, it runs the lenses itself and labels the result `Self-review`. Treat that result as less independent.
- Skip steps 8 and 9 when the team writes cases without Gherkin. Use `test-case-design` for the cases.
- If you only need a verdict on a story that someone else refined, run `--check` on it. Skip the other steps.
- If the story sits in a tracker with a `Tracker:` line, wait until an owner approves the changes. Then use `ticket-sync`.
- Choose `shape-up` when the story is a vague idea. Choose `test-case-design` when you need prioritized cases at each test level in addition to the scenarios.

## What you get

The skill began by reading the repository. F-numbers are findings of that repository search. Q-numbers are open questions in the spec.
These findings changed the spec.

Findings from the repository search on the Conduit sample API at commit 30b68e1:

| ID | Finding | Why it matters for the story |
| --- | --- | --- |
| F-2 | The repository holds no user interface. | The button and the list screen need a client ticket. The criteria describe the API. |
| F-4 | `GET /api/articles?favorited=<username>` shows the favorites of any user and allows anonymous requests. | A bookmark list that reuses this filter shows private reading data. |
| F-5 | The favorite join table has two columns and no timestamp. | "Newest bookmark first" needs a saved date and a new join model. |
| F-8 | A title change creates a new slug. | A bookmark must belong to the article and not to its slug. |

Excerpt from a run on the Conduit sample API at commit 30b68e1. The depth line and the verdict of the refined spec:

| Field | Value |
| --- | --- |
| Depth | Standard. The story adds a data store (a bookmark relation with a migration) and new public API endpoints. It does not meet a Deep signal: no money, no new platform, and no change across teams. |
| Readiness | Not ready |

Excerpt from a run on the Conduit sample API at commit 30b68e1. One row of the assumptions table:

| ID | Assumption | Evidence | If wrong | Confidence |
| --- | --- | --- | --- | --- |
| A-1 | A bookmark is a new private concept, separate from a favorite. | The story says "read them later" and "my bookmarks". A favorite is public through `favoritesCount` and `?favorited=<username>` (F-3, F-4). | If the owner wants favorites to act as bookmarks, the story shrinks to a client label and the API needs no new table. See Q-1. | Likely |

Make sure that you can name the evidence for each row. Make sure that the row says what breaks when it is wrong.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Failed checks of the definition of ready:

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 3 | Each term is canonical. | Fail | The term "bookmark" and the existing term "favorite" are not separated until Q-1 is answered. |
| 5 | Each applicable edge and negative family is resolved or dismissed. | Fail | Limits and quotas is a `Gap` (Q-3). |
| 8 | No open question blocks the start of work. | Fail | Q-1. |
| 11 | The builder check returned nothing important. | Fail | Questions 1 and 2. |

In the evidence column, Questions 1 and 2 are the first two questions of the builder check. They map to Q-1 and Q-4 in the open-questions register.
In total the spec held 13 assumptions, 18 criteria, 9 open questions, and 3 owner packets.
Not ready here has four failed checks. Q-1 blocks the start. The product owner can answer it in the meeting.
If the owners accept the recommended answers to Q-1, Q-3, and Q-4, the verdict becomes `Ready with defaults`.

This run had no subagent tool, so the skill labeled the review `Self-review`. One author ran each lens in turn.
The failed builder check is therefore not independent. With subagents, each lens and the builder check run in separate contexts.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Question 1 of the packet for the product owner:

```text
## 1. Is a bookmark a new private list that is separate from favorites?

Recommended answer: Yes. A bookmark is private, has no public count, and does not change favorites.
Why it matters: The Conduit API already has a favorite feature. A favorite shows a public count, and anyone can list the favorites of any user. If a bookmark is the same thing, the story only needs a client label. If it is separate, the story needs a new table.

Answer:
```

No person answered the questions in this run. The `Answer:` line is empty, and the run used each recommended answer as a default.
Each default is the author's call. Send the packets and record the real answers.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Two scenarios from `bookmark-list.feature` and `article-bookmarks.feature`:

```gherkin
@AC-8 @api @negative
Scenario: Another reader's bookmarks do not appear
  Given a reader who bookmarked an article
  And a second signed-in reader who bookmarked a different article
  When the second reader lists their bookmarks
  Then the list shows only the article that the second reader bookmarked

@AC-2 @api
Scenario: Send two bookmark requests at the same time
  Given a signed-in reader and an article that the reader has not bookmarked
  When the reader sends two bookmark requests for the article at the same time
  Then both requests succeed
  And the reader has one bookmark for the article
```

The scenarios use business terms and carry the ID of their criterion.
The run wrote 20 scenarios in two feature files. Each of the 18 criteria maps to a scenario or a named unit test.
Every scenario is expected to fail before the work, because the behavior is absent.
The repository has no BDD runner. The run used `playwright-bdd` with `@api` scenarios, which is now the skill's proposed default for this stack.
The run wrote a runner plan and installed nothing.

## Common mistakes

- You treat the defaults as agreed. The scan marks each default as the author's call. Send the packets, and record each answer as a `Decision:` line.
- You send all open questions to one person. Group them by owner, so that each owner reads only their own packet.
- You trust a fact that the skill took from reading code. In this run, the skill read that a favorite request for an unknown article returns status 500. It did not run the code. Run the request before you write a test that depends on it.
- You write a `Then` step that accepts a missing field. A new `bookmarked` field is absent before the work, so a check for "falsy" passes. Assert the value `false`.
- You install the proposed runner before the team agrees. The skill writes a runner plan and installs nothing. The team chooses the runner, then a developer adds it.

## Next

- Go to [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md) when the build starts and you must plan cases.
- Go to [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md) when you must find high-impact paths before more refinement.
- Use `ticket-sync` to publish approved story changes to the tracker. The `Tracker:` line makes it update the source ticket.
- Use `phased-delivery` to plan the ready story as test-first phases. The [feature refinement workflow](../../workflows/feature-refinement-workflow.md) shows the stage order.
- Read the [use-case index](README.md) for the other situations.
