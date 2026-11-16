# Review product outcomes after a release

This page is for a product manager who ships a change and must judge whether it moved the outcome. You get a review with the original hypothesis, the before and after comparisons that are valid, and the uncertainty of the result. It ends with one of four decisions: `Continue`, `Revise`, `Stop`, or `Gather evidence`.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Product manager | [`product-outcome-review`](../../skills/product-outcome-review/SKILL.md) (`/product-outcome-review`) | No levels. | The original hypothesis, the dates of the release, and the metric exports for the periods before and after. |

## Quick path

1. Start Claude Code in the folder that holds your brief and exports, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Put the hypothesis, the success criteria, the release dates, and the metric definitions with their change log in files. Add the exports for both periods. Each export needs one row per week with these columns at least: week start, days with data, active readers, new readers, readers who favorited, add events, remove events, readers who opened a favorite, and p75 load time. Step 2 below lists the brief fields. The sample input files are not published, so write your own from the columns and fields here. A brief can be short: the problem, the audience, the hypothesis, the release date, the decision, and the success criteria, one line each.
3. Run the review and ask for a saved record: `/agent-toolbelt:product-outcome-review <brief-file> <before-export> <after-export> <definitions-file>. Save the review with the Toolbelt template to <output-file>.`
4. Read the decision, then the section "Guardrails and counterevidence". A guardrail is a metric that must not get worse. Answer each open question that names you as the owner, then run the review again when the new evidence arrives.

No written hypothesis? Stop and use [Decide whether to build](product-decide-whether-to-build.md) first.

You get a saved review with the hypothesis, the valid comparisons, and the uncertainty. It also has a decision with an owner and the evidence that can change it.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

You are the product manager. The team released a favorites redesign on 2026-09-29 for the RealWorld "Conduit" API sample (TypeScript, Express, Prisma, Jest). The redesign added a favorite button on every article card and a "Favorites" tab. The project brief gave a problem and a hypothesis. Readers cannot find the articles that they saved, so more readers will favorite and come back to their favorites. Your lead asks if the redesign worked and if the team keeps it.

The metric exports on this page are invented sample input. They are made up for this page and are not data from a real product. The Conduit repository has no analytics code and no user interface, so it only supplies the context. The run used commit 30b68e1 of the repository and the skill at Toolbelt commit 695056c.

The exports have the problems that real exports have:

- The favorite event was renamed and now also fires from article cards.
- A new bot filter and the event rename both went live on 2026-10-06, the first week of the after period and one week after the release. The earlier weeks were not reprocessed.
- A campaign brought five times the normal number of new readers in one week.
- One week of the export has only 6 days of data.
- The brief names four success criteria but sets no size for the rise.

A reader who compares the headline averages sees a favorite rate that goes from 10.00 to 11.21 percent and reports a win. The steps below show what that comparison misses.

## Why this path

The obvious alternative is to compare the averages before and after and report the difference. That costs you three things here. The event definition changed, so the count of add and remove events does not compare. The campaign changes the population, and the bot filter changes the measurement. The size of the rise then depends on which weeks you keep, from +1.0 to +2.1 points, and the average hides this.

The alternative that the skill description names is [`ship-it`](../../skills/ship-it/SKILL.md). It prepares a change for release with readiness checks, rollback, and rollout monitoring. Use it for the health of the release in the first days. It does not ask whether the original customer problem improved. This page starts after that point.

The procedure has this order because each step limits the next one. You first fix the hypothesis, the audience, the exposure dates, and the agreed success criteria. Results read before that point tend to shape the goal. This reason is practice, not text of the skill. The skill states the order and the instruction to preserve agreed success criteria.

The skill separates an observed change from evidence about its cause. It also says that an inconclusive result is a valid result. In this run, that rule led to `Gather evidence` and not to a forced verdict.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all product-outcome-review /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:product-outcome-review` (plugin) or `/product-outcome-review` (installed copy) in the list. |
| 2 | Write the inputs as files. The brief holds the problem, the audience, the hypothesis, the intervention, the exposure dates, the decision to make, and the agreed success criteria. A second file holds the definition of each metric and a change log of the export. A third holds feedback notes, if you have them. In the sample, the files are named in step 3. They are not published, so write your own. | The skill needs the problem, the audience, the hypothesis, the intervention, the exposure dates, and the decision. The measurement rules add fields for each metric. They are the calculation, the population, the source, the period, and the owner. The rules also list the numerator, the denominator, and the exclusions. | Each metric has a definition and an owner. Each change to an event, a filter, or the export has a date. |
| 3 | Run the review: `/agent-toolbelt:product-outcome-review <brief-file> <before-export> <after-export> <definitions-file>. Save the review with the Toolbelt template to <output-file>.` In the sample, the files are `brief.md`, `weekly-before.csv`, `weekly-after.csv`, and `metric-definitions.md`. | The skill reviews supplied measurements against the original hypothesis. It uses the template for a durable record only when you ask. | The review file exists and has four sections: hypothesis and decision, measurement and results, guardrails and counterevidence, and decision. |
| 4 | Read "Original hypothesis and decision". Check that the success criteria match your brief. Read the list of missing definitions. | The skill keeps agreed criteria and names missing ones. A rise with no agreed size can pass or fail by opinion. | Each criterion from the brief appears unchanged. Each missing size or limit is named. |
| 5 | Read the measurement table row by row. Check the periods, the population, and the exclusions. | The skill tells the review to state which comparisons stay valid when populations or event definitions change. | Each metric row names its periods and its population. A row that cannot compare says so. |
| 6 | Read the result and uncertainty cells. Look for a range and not one number. An observational comparison has no random assignment, so it cannot show cause. A holdout group is a random share of readers who keep the old design. | The review must report uncertainty, and the skill separates an observed change from evidence about its cause. | Each result has a range or a reason that none exists. |
| 7 | Read "Guardrails and counterevidence". A guardrail is a metric that must not get worse. Check each finding against the data and the feedback notes. | The skill looks for counterevidence before it recommends a decision. | Each guardrail has a finding or a reason that the data cannot answer it. |
| 8 | Read the decision. Check the owner and the observation that can change it. Answer the open questions that name you. Run the review again when the new evidence arrives. | The skill names the next decision owner and the observable evidence that is needed. | The decision names a state, a reason, an owner, and an observation. |

The skill is report-only by default. It reads the files that you give it. It changes nothing in measurement configuration and notifies no one unless you authorize it.

## Decision points

- If the review shows a rise in the main metric and nothing else, check the metric that matches the original problem. In this run, a rise in readers who favorited (the first criterion) did not show that readers came back to their favorites (the second criterion).
- If an event or a filter changed during the periods, compare only metrics that count the same thing before and after. The skill tells the review to state which comparisons remain valid. In this run, add and remove events did not compare, and reader counts did.
- If you ran a controlled experiment (random assignment to groups), add four items to the inputs: the assignment, the exposure, the sample assumptions, and the stopping rule. The measurement rules ask for these fields. An observational comparison cannot show cause.
- If the brief sets no size for success, ask the owner to set it before you read the results. This advice is practice. The skill only says to identify missing definitions. A size chosen after the results is not an agreed criterion.
- If you have no feedback notes, skip the third file. The review then has no qualitative evidence and says so.
- If the brief lacks the exposure dates or the metric definitions, stop and fix the inputs first. The review cannot compare periods without them.
- If the data is too thin or too mixed, accept `Gather evidence`. The skill says that an inconclusive result is valid. Name the observation that ends the doubt.
- If the release is a few days old and the question is health, stop and use [`ship-it`](../../skills/ship-it/SKILL.md). Outcome review needs enough weeks to compare. This is practice, not a rule of the skill.
- Stop when each success criterion has a result or a reason that the data cannot show it. The uncertainty must be stated, and the decision must name an owner and an observation.
- Choose [Decide whether to build](product-decide-whether-to-build.md) when no hypothesis or measure exists. This page needs the original hypothesis.
- Choose [Prepare a release](lead-prepare-a-release.md) when the question is whether the change can go out safely.

## What you get

The run was headless, so no person answered. The skill asks no question of a person. Two decisions belong to the product owner: how big a rise counts as success, and whether to hold the redesign back from a random group. The review lists both as open actions and picks no value. A real reader answers them and records the answers in the brief.

The review uses IDs that the run chose, not the skill. S1 to S4 are the four success criteria from the brief. M1 to M4 are the metrics that measure them. G-1 to G-8 are findings, and N-1 to N-5 are next actions. The four decision states come from the skill. The labels `Supported` and `Insufficient evidence` come from the evidence-quality reference, which lists them for factual claims. The skill requires only that unsupported conclusions say `insufficient evidence`.

First, the weekly values. The Toolbelt gives no calculator. The skill and the measurement rules say to use a checked statistical implementation. The skill now names a two-proportion z-test with the standard library as the fallback. This run predates that fallback, so the agent picked the method. Ask the review to name its method and its check. This run used a script (`analysis.py`, in a private folder, so you cannot open it). It uses only the Python standard library because no statistics package was installed, and it checks itself against a textbook example before it prints. That check is the run's choice, and it is one example of a check. M1 is the share of active readers who favorited. M2 is the share who opened a favorited article. M3 is remove events divided by add events. The p75 load time is the 75th percentile: three quarters of page loads are faster.

Excerpt from a run on invented sample input, with the Conduit sample API at commit 30b68e1 as the repository. The values are made up.

```text
week        M1 favorited  M2 opened-fav  M3 remove/add  p75 ms  days
2026-09-01       10.00%         5.00%          15.7%     820     7
2026-09-08       10.00%         5.06%          16.4%     810     7
2026-09-15        9.80%         4.88%          16.4%     830     7
2026-09-22       10.20%         5.12%          16.2%     815     7
2026-10-06       12.29%         5.61%          23.2%     870     7
2026-10-13       11.91%         5.62%          25.6%     880     6
2026-10-20        9.56%         4.36%          27.1%     895     7
2026-10-27       11.64%         5.41%          26.9%     890     7
```

The weeks of 2026-10-13 and 2026-10-20 are the problem weeks. The first has 6 days of data. The second is the campaign week: new readers were 29.8 percent of active readers that week, against 7.3 to 7.9 percent in the other weeks up to 2026-10-13. Next, the result cells for the two metrics that matter most.

Excerpt from a run on invented sample input, with the Conduit sample API at commit 30b68e1 as the repository. Condensed from the run report: the columns for periods, population, and evidence are left out. The text of the cells that remain is verbatim.

| Metric and calculation | Result and uncertainty |
| --- | --- |
| M1: readers who favorited / active readers, per week | Before 10.00 percent. After 11.21 percent (+1.21 points, 95 percent CI +0.84 to +1.57). Without the campaign week: +1.93 points. With the before denominator cut by 2 percent for the bot filter: +1.00 point. Week range: before 9.80 to 10.20, after 9.56 to 12.29. |
| M2: readers who opened a favorite / active readers, per week | Before 5.01 percent. After 5.18 percent (+0.17 points, CI -0.09 to +0.43). Without the campaign week: +0.53 points. With the bot-filter adjustment: +0.06 points, CI -0.20 to +0.33. |

CI means confidence interval, the range that the data supports for the true change. The review notes that the interval treats each week as an independent sample. Readers return in many weeks, so the real interval is wider. The week range is the better guide.

Now the findings that explain why the result is unclear.

Excerpt from a run on invented sample input, with the Conduit sample API at commit 30b68e1 as the repository. Condensed from the run report: the Type and Effect columns and the rows G-4 to G-8 are left out. The text of the cells that remain is verbatim, and `...` marks skipped text.

| ID | Finding |
| --- | --- |
| G-1 | The favorite event changed on 2026-10-06. `favorite_article` fired on the article page only. `favorite_toggled` also fires from cards. Add and remove counts are not the same kind of event before and after. ... |
| G-2 | Bot filter v2 went live on the same day. The before weeks were not reprocessed. The analytics team estimates 2 percent. The estimate has no source file. |
| G-3 | A newsletter campaign ran from 2026-10-20 to 2026-10-26. New readers were 29.8 percent of active readers that week, against 7.3 to 7.9 percent in every other week except 2026-10-27 (11.6 percent). |

Last, the decision.

Excerpt from a run on invented sample input, with the Conduit sample API at commit 30b68e1 as the repository. Lines are wrapped for width. The text is unchanged.

```text
Decision: `Gather evidence`.

Reason: S1 rose by 1.0 to 2.1 points in the comparisons that this data
allows. S2 is the measure that matches the problem (readers come back to
favorites), and it did not clearly rise. S3 cannot be judged because the
event changed. S4 holds. The data cannot separate the redesign from the
campaign and the bot filter.

Release health: no rollback reason. S4 is under the budget in all 8 weeks.
Keep the redesign live.
```

The skill has no `Release health` field. This run predates its rule for choosing among the four states. The run added the `Release health` line because the measurement rules say to separate release-health action from the longer-term decision. Do not expect the line in every review, and check the reason for the state yourself.

The review then lists five actions with an owner and the observation that closes each one. The first two ask the analytics team to reprocess the earlier weeks with the new bot filter. They also ask for a `surface` property (card or article page) on the event. The third asks the product owner to set the size of success. The fourth waits for four weeks with a normal share of new readers. The fifth asks the product owner to decide on a random holdout group.

What you must check in the output:

- The review keeps the four success criteria from the brief unchanged and names the missing sizes.
- The review says that the comparison is observational, and that it shows no cause.
- Practice, not a rule of the skill: each result shows how it changes when you drop the campaign week or adjust for the filter. The skill requires only that the review states which comparisons remain valid and reports uncertainty. This run used such sensitivity sets. Ask for them when a population changed.
- A metric that cannot compare, such as M3, says so and does not claim a rise or a fall.
- The decision names an owner and an observation. A decision with neither is not finished.

What this run did not execute: no analytics source or database was available, so the review used only the supplied exports. The run did not run the Conduit tests, because the repository has no analytics code. The run did not check the event definitions against code, and took them from the definitions file. No owner answered the open questions.

## Common mistakes

- You report the headline averages. The favorite rate rises from 10.00 to 11.21 percent, and the result looks like a win. The size of the change moves from +1.0 to +2.1 points with the week set and the filter. Ask for each comparison set. The skill does not require these sets, so ask for them when a population changed.
- You compare event counts across a renamed event. The remove ratio went from 16.2 to 25.7 percent, but the event now includes card taps. The comparison proves neither harm nor safety. Ask for a split by surface.
- You read a rise as proof of cause. No holdout group existed, so the campaign and the filter can explain part of it. Use the word "associated" and record the missing evidence.
- You read the interval as exact. The review treats weeks as independent. Read the week range next to it.
- You treat the run's recommendation as the owner's decision. The run answered no open question. The product owner sets the size of success and decides on a holdout group.
- You drop the rollout week without saying so. The run excluded it from both periods, and the review states this. The skill now says to compare complete periods only, and to report a partial week with its exact dates. This run predates that rule, so write your choice in the review.
- You use invented numbers as findings. The data on this page is made up. Do not copy it into a report about a real product.

## Next

- [Decide whether to build](product-decide-whether-to-build.md): when no hypothesis or measure exists yet.
- [Shape an idea into tickets](product-shape-an-idea-into-tickets.md): when the review says `Revise` and the change needs new scope.
- [Synthesize interview notes](product-synthesize-interview-notes.md): when the feedback notes are too few and you need research on why readers tap the card button.
- [Compare an ask with the product](product-compare-an-ask-with-the-product.md): when a stakeholder asks for more favorites features and you must check what the product has.
- [Prepare a release](lead-prepare-a-release.md): for the health of the release itself.
- [`ship-it`](../../skills/ship-it/SKILL.md): when the question is immediate release health.
- [Idea to release](journey-idea-to-release.md): the full path from idea to outcome review.
- [Product learning workflow](../../workflows/product-learning-workflow.md): where outcome review sits in the product sequence.
- [Use-case index](README.md): the full list of use-case pages.
