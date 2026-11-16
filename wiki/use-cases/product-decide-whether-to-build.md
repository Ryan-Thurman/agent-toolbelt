# Decide whether a requested feature is worth building

This page is for a product manager who gets a feature request and must decide whether to build it. You get a report that checks each claim behind the request and compares the options. It names the riskiest assumptions and ends in one decision: ready to shape, needs evidence, or deferred.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Product manager | [`product-discovery`](../../skills/product-discovery/SKILL.md) (`/product-discovery`) | No levels. The skill has no depth setting. | The request in one sentence. The evidence as files: tickets, usage notes, and stakeholder statements. The product repository is optional. |

## Quick path

1. Write the evidence into one file: an ID for each ticket and stakeholder request, and a source and a limit for each number. [Step 2](#steps) has the details.
2. Start Claude Code in the product repository, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Give the evidence file as a path in the prompt. If you have no repository, start in any folder.
3. Run the skill and name the output file: `/agent-toolbelt:product-discovery <request>. Evidence: <evidence-file>. Write the report to <report-file> with the product-discovery template.` For example: `/agent-toolbelt:product-discovery Add article bookmarks. Evidence: evidence-pack.md. Write the report to product-discovery.md with the product-discovery template.`
4. Check that each claim behind the request has one of four verdicts and a reason, in a table or in text.
5. Read the decision. If it says `Ready to shape`, run `/agent-toolbelt:shape-up <candidate>`. If it says `Needs evidence`, get the owner's approval, then run the cheapest experiment. If it says `Deferred`, stop.

You get a report with a decision that traces to your evidence, and the open questions that only the owner can answer.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The stakeholders of a publishing site ask for article bookmarks. The site runs on the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). You must decide whether bookmarks are worth building before anyone writes a ticket.

**The evidence on this page is invented sample input.** It was written for this example. It is not customer research, and it describes no real product. The pack holds three stakeholder requests (SR-1 to SR-3) and eleven support tickets from nine accounts (T-101 to T-111). It also holds five usage notes (UN-1 to UN-5). The pack says this:

- The Head of Growth says that bookmarks bring readers back and that other sites have them (SR-1). No data comes with the claim.
- Three accounts ask for a bookmark or read-later button. One account asks for folders, one for reminders, one for an export, and one for a private favorite.
- Two accounts say that they already use the heart (favorite) as their bookmark list.
- 1,130 of about 9,400 monthly active accounts favorited an article in the quarter (UN-1). Nothing measures how readers open their favorites list (UN-4).

The sample repository has no UI. The excerpts on this page come from a run on the sample at commit 30b68e1. You use your own repository. The run used Toolbelt commit 695056c. A later change to the skill can make a run differ from this page.

## Why this path

The obvious alternative is to count the tickets and build what the loudest stakeholder asks for. Here that fails in three ways. The eleven tickets come from nine accounts, and two tickets repeat an account. The growth claim has no data behind it. The repository already has a save feature, the favorite, and the request does not mention it.

The sibling skill is [`shape-up`](../../skills/shape-up/SKILL.md) (`/shape-up`). It compares an ask with current behavior, shapes a vague request into a brief that you approve, and slices a brief into tickets. Its own description says to use `product-discovery` to decide whether to build. Its gap review shows what the product does today, but it does not judge the evidence behind the request. Its shaping mode asks you to approve a brief for a feature that no evidence supports yet.

The other sibling is [`user-research-synthesis`](../../skills/user-research-synthesis/SKILL.md). It turns interviews, surveys, and feedback into themes with counterexamples, and it does not choose an opportunity. Use it first when your evidence is interview notes. The page [Synthesize interview notes](product-synthesize-interview-notes.md) shows that path.

The procedure has this order because each step limits the next one. The skill separates evidence from assumptions first. Then it defines the problem and the options, names the risks, and sets measures. It hands off last. This order is practice, not a reason that the skill states.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all product-discovery /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:product-discovery` (plugin) or `/product-discovery` (installed copy). |
| 2 | Write the evidence into files. Give each ticket an ID and an account. Give each number a source and a limit. Name the role of each stakeholder. | The skill separates known evidence from assumptions and never invents research. It needs IDs to trace a claim. | Each item has an ID. Each number has a source and a limit. |
| 3 | Start the agent in the product repository, if you have one. Name the area where a similar feature can exist in your first prompt. | The skill inspects repository context. It can find that the product already does part of the request. | The first prompt names the folder or area. In the sample, the area is the favorite code in `src/app/routes/article`. |
| 4 | Run `/agent-toolbelt:product-discovery <request>. Evidence: <evidence-file>. Write the report to <report-file> with the product-discovery template.` In the sample: `/agent-toolbelt:product-discovery Add article bookmarks. Evidence: evidence-pack.md. Write the report to product-discovery.md with the product-discovery template.` | The skill uses its template when you ask for a durable report. It sets no default path, so you name the file. By default it only reports and creates no ticket. | The file exists. It has the seven template sections, from Desired outcome to Decision. |
| 5 | Read the claims in "Evidence and problem". Check each claim behind the request. | The skill separates known evidence from assumptions, so a stakeholder claim needs its own evidence. | Each claim has `Supported`, `Contradicted`, `Mixed`, or `Insufficient evidence`, and a reason, in a table or in text. The verdict words come from `shared/contracts/references/evidence-quality.md`. |
| 6 | Read "Opportunity and candidate". Make sure that the current experience is one of the options. | The skill compares the current experience as an explicit option. It records selected, deferred, and rejected options with reasons. | Each option has a decision and a reason. |
| 7 | Read "Risks and assumptions". Pick the experiment for the riskiest assumption. It is the assumption that drives the decision. In the sample, it is A1, the return-visit claim. | The skill names the risks and the cheapest experiment that can change the decision. | One assumption is the riskiest, and one experiment targets it. |
| 8 | Read "Success and failure thresholds". Set each number that the evidence cannot support, before any data arrives. | The skill requires a supported baseline for success and failure conditions. | Each threshold has an owner and a value, or stays on the list of open questions. |
| 9 | Read the decision. Act on it as the "Decision points" below say. | The skill ends in an explicit state, and implementation design stays for later stages. | The decision is `Ready to shape`, `Needs evidence`, or `Deferred`, with the missing evidence listed. |

## Decision points

- If your evidence is interview notes or survey answers, run `user-research-synthesis` first. The skill then reuses its findings and does not treat interpretations as customer facts.
- If an approved brief exists, skip this page. The skill is for deciding what to build, not for a brief that is already approved. Use [`shape-up`](../../skills/shape-up/SKILL.md).
- If you have no repository, skip step 3. The report then cannot say what the product already does.
- If you run the [idea-to-release workflow](../../workflows/idea-to-release-workflow.md), its stage 1 says "no repository scan". This run predates the fix that makes step 1 of the skill say the same. In the sample run, the check covered only the one area where a similar feature can exist. That is the run's practice. The skill does not allow a scan, so decide this for your project.
- If the evidence contains no baseline for a measure, the skill records the threshold as `Not set`, and the owner sets it. Do not accept a number that nothing supports.
- If the state is `Needs evidence`, do not hand the candidate to `shape-up`. Run the experiment first. The project owns research access and experiment approval.
- If the state is `Deferred`, record the reason and stop. Create a ticket only if your next action needs one.
- Stop when the report has a decision state, a traceable result, and a list of what is still missing.
- Choose [Compare an ask with the product](product-compare-an-ask-with-the-product.md) when you decided to build and need the gap with current behavior.
- Choose [Review outcomes after release](product-review-outcomes-after-release.md) when the feature is live and you need to know if it worked.

## What you get

The run had no person to answer questions. The skill asks no question of a person. Two items need the owner: the desired outcome and each threshold. The run left both open and listed them as owner questions. The run also chose its own labels. The skill prescribes none of them. C1 to C7 are claims, O0 to O3 are options, A1 to A3 are assumptions, and E1 to E3 are experiments. SR, T, and UN are the IDs of the invented evidence pack. A-nn, such as A-22, is an anonymous account ID in that pack, and it is not an assumption. E1 counts opens of the favorites list for 30 days. E2 asks the nine accounts about their last save. E3 reads the front end. The skill prescribes no claim table. The verdict words come from `evidence-quality.md`, and the table layout is the run's choice, so your report can show the claims as text.

First, the claim verdicts.

Excerpt from a run on the Conduit sample API at commit 30b68e1, on invented sample input. Condensed from the run report: the Reason column and the rows C3 and C6 are left out. Each remaining cell is verbatim.

```markdown
| ID | Claim | Verdict |
| --- | --- | --- |
| C1 | Readers ask for a way to save articles for later. | Supported |
| C2 | Readers already use favorites as a saved list. | Mixed |
| C4 | Bookmarks make readers return more (SR-1). | Insufficient evidence |
| C5 | Other publishing sites have bookmarks (SR-1). | Insufficient evidence |
| C7 | Requests come every week (SR-3). | Mixed |
```

The reasons for the two Mixed verdicts: for C2, 38% of favorite actions are undone within 7 days, which fits both a mistaken click and a short-term save. For C7, 11 tagged tickets in 13 weeks is fewer than one a week, and one agent applied the tag by hand.

The report counts independent sources, not tickets. These two sentences are verbatim from the report:

Excerpt from a run on the Conduit sample API at commit 30b68e1, on invented sample input. Lines are wrapped.

```text
Size of the signal: 9 accounts in 11 tickets, out of 1,840 tickets
(0.6%) and about 9,400 monthly active accounts (about 0.1%).
Asking accounts and active accounts are different populations, so the two
shares are not comparable.
```

Next, the options. The current experience is the baseline that each option must beat.

Excerpt from a run on the Conduit sample API at commit 30b68e1, on invented sample input. Condensed from the run report: the "What it is" column is left out. The other cells are verbatim, and `...` marks skipped text.

```markdown
| Option | Decision | Reason |
| --- | --- | --- |
| O0 | Baseline | It serves A-22 and A-63 today. ... |
| O1 | Selected for the next experiment | It answers C2, C3, T-102, and T-107 with no new concept. ... |
| O2 | Rejected for now | The evidence cannot tell O2 from O1 yet. ... |
| O3 | Deferred | One account asks for each (T-106, T-109). ... |
```

O1 is "make favorites work as a saved list". O2 is a new private bookmarks feature. O3 is folders and reminder email.

The repository check changed the options. The run read in the code that any caller can list favorites by user name. The output below shows that the table that links users to favorites has no timestamp column. The block holds the table definition and the test result of a run that the agent chose to make.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The `...` line marks skipped text.

```text
$ sed -n 55,60p src/prisma/migrations/20210924225358_initial/migration.sql

-- CreateTable
CREATE TABLE "_UserFavorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);
...
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

What the run executed and what it did not:

- Executed: the file searches above, and the Jest file `src/tests/services/article.service.test.ts` with the Prisma mock (a test double for the database). The agent chose to run these checks. The skill does not require tests. The command was `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/article.service.test.ts`, with no database. It passed 5 of 5. Those tests check the returned article only. They do not check who can read a favorite.
- Read in code, not executed: any caller can list favorites by user name. The list returns only articles by a `demo` author or by the caller. No database was available.
- Not run: any experiment, any interview, and any query on real data. The evidence is invented.
- Not assessed: the user interface. The sample repository has no UI files.

Last, the decision.

Excerpt from a run on the Conduit sample API at commit 30b68e1, on invented sample input. Lines are wrapped. The full report has no further lines in this section.

```markdown
## Decision

**Needs evidence.**

Do not hand this to `shape-up` yet.
Missing before shape: the desired outcome (owner question above), the E1
result, the E2 result, and thresholds from the owner.
Hand to `shape-up` when E1 or E2 supports O1 or O2 and the owner sets the
outcome.
Return here (or defer) if E2 shows no shared need.
```

What you must check in the output:

- Each claim that backs the request has a verdict and a reason, in a table or in text. A claim with `Insufficient evidence` cannot justify the build.
- The counts use accounts, not tickets, and each share has its denominator.
- The current experience appears as an option.
- No threshold has a number that the pack does not support.
- The decision lists what is missing, not only the state.

## Common mistakes

- You count tickets and not accounts. T-105 repeats T-101 for one account, so the count of requesters falls. Count each account once.
- You read the 2.1 times return rate (UN-3) as proof that bookmarks bring readers back. The note compares accounts that favorite with other accounts. Active readers can do both.
- You skip the current experience. Two accounts already save with the heart, so the real choice includes improving it.
- You accept a threshold that has no baseline. The favorites-list event does not exist yet, so no number can rest on data.
- You pass a `Needs evidence` result to `shape-up`. The brief then rests on assumptions.
- Your agent runs unit tests and you read a pass as proof of privacy. The sample run's mock tests check the returned article, and they do not check who can read a favorite.
- You expect the skill to run an experiment or to open tickets. It reports only, unless your next action needs a ticket.

## Next

By outcome:

- `Ready to shape`: [Shape an idea into tickets](product-shape-an-idea-into-tickets.md).
- `Needs evidence`: run the experiment. If it is interviews, use [Synthesize interview notes](product-synthesize-interview-notes.md) to turn the notes into themes. If the chosen option changes who can see a reader's saved articles, use [Threat model a design](sec-threat-model-a-design.md).
- `Deferred`: stop, or see [Decide one backlog item](lead-decide-one-backlog-item.md) for where the item ranks.

Related: [Compare an ask with the product](product-compare-an-ask-with-the-product.md), [Review outcomes after release](product-review-outcomes-after-release.md), [Refine a vague story](qa-refine-a-vague-story.md), [Idea to release journey](journey-idea-to-release.md), the [idea-to-release workflow](../../workflows/idea-to-release-workflow.md), the [product learning workflow](../../workflows/product-learning-workflow.md), and the [use-case index](README.md).
