# Find themes in a set of interview notes

This page is for a product researcher who has several interview notes and must learn what they show before anyone decides what to build. You get a report where each theme links to the notes that support it, the notes that contradict it, and the limits of the sample.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Product researcher | [`user-research-synthesis`](../../skills/user-research-synthesis/SKILL.md) (`/user-research-synthesis`) | No levels. The skill has no depth levels. | Research notes in files (the run used four), one research question, and the date and method of each note. With one note, the skill still works, but expect no themes across participants. |

## Quick path

1. Put each note in its own file. The first lines give the note ID, the date, the method, and the participant. Number each item. The IDs are your own choice. A note looks like this:

   ```markdown
   # <note-ID>: <method>, <participant-ID>
   Date: <yyyy-mm-dd>. Method: <length and type>. <Interviewer notes or transcript>.
   1. <What the participant said or did.>
   2. <The next statement or behavior.>
   ```

2. Start Claude Code in the folder with the notes and the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. For Cursor and Codex, install with `./install.sh --harness all user-research-synthesis <project-folder>` and see the Installation section of the README.
3. Run the skill. Use the form first, then the sample value:

   ```text
   /agent-toolbelt:user-research-synthesis "<research-question>" <note-files>
   /agent-toolbelt:user-research-synthesis "How do readers decide to save an article, and what happens to saved articles afterward?" N1.md N2.md N3.md N4.md
   ```

4. Ask for the report as a file with the template: `Write the report to <folder>/research-synthesis.md with the Toolbelt template.` The template has a source table and an observation table. Each observation row has a location and a kind: `reported`, `observed`, or `interpretation`. The run predates PR #60 and asked for these two tables by hand.
5. For each theme, open the cited notes. Read the counterexamples and the "Limits and next evidence" section before you share anything.

Stop here if each theme has a counterexample or a recorded search for one. To choose what to build from the themes, go to [Decide whether to build something](product-decide-whether-to-build.md).

You get a report with themes, counterexamples, and limits. The source table and the observation table come from the template.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

You have four notes from interviews about reading and saving articles. You want to know how readers decide to save an article and what happens to saved articles afterward. Nobody has asked you to propose a feature.

All four notes on this page are invented sample input. They are not real research. The notes are not published with the Toolbelt. One note is shown in full below so that you can follow the key excerpt. The run used these four files:

| Note | Method | Participant |
| --- | --- | --- |
| N1 | 30 min video interview, interviewer notes | P1, a commuter who reads on a phone |
| N2 | 45 min video interview, interviewer notes | P2, a freelance designer |
| N3 | 30 min screen-share session with one task, observer notes | P3, a university student |
| N4 | 40 min phone interview, interviewer notes | P4, a retired teacher |

A location such as N1.3 means item 3 of note N1. The notes are interviewer notes, not transcripts. This is note N3, as the run read it:

```markdown
# N3: Observed session, P3 (university student)
INVENTED SAMPLE INPUT. This note is not real research.
Date: 2026-10-12. Method: 30 min screen-share session with one task. Observer notes.
1. P3 is 21 and studies economics. P3 reads on a laptop and a phone.
2. Before the task P3 said: "I always find what I saved. It is easy."
3. Task: find an article about interest rates that P3 saved the week before.
4. Observed: P3 scrolled the saved list for about 2 min. The list held about 60 items.
5. Observed: P3 did not find the article in the list. P3 then opened the browser history and found it there.
6. P3 said after the task: "I thought it was in there. Maybe I never saved it."
7. P3 shares articles with a study group by copying the link into a chat. P3 does not use the saved list for sharing.
```

The skill reads research, not code. The Conduit sample API (the RealWorld article app in TypeScript) was in the working folder during the run. It is not an input, and nothing on this page depends on it. The run used the Toolbelt at commit 695056c. Every excerpt below comes from this run on four invented notes.

## Why this path

The obvious alternative is to read the notes and write a summary yourself. The skill adds steps that a summary can skip. It records the sample and what is unavailable. It separates what a participant reported from observed behavior. It keeps counterexamples. It gives a count only when the denominator is known (the denominator is the number of people that the count is out of). These steps come from the skill procedure. That a plain summary tends to skip them is practice, not a skill claim.

As an illustration, take the P3 case. P3 said "I always find what I saved" and then did not find an item in a list of about 60. A summary that keeps only the first statement says that readers find their items. A summary that keeps only the second says that finding fails. The report keeps both and labels one as reported and one as observed. The run did not write a plain summary to compare with, so this shows what the checks guard against, not what they changed.

The alternative that the skill description names is [`product-discovery`](../../skills/product-discovery/SKILL.md). It frames an opportunity and ends with a decision state: ready to shape, needs evidence, or intentionally deferred. Its first step reuses available research synthesis. The [Product decisions and learning workflow](../../workflows/product-learning-workflow.md) puts research synthesis at stage 1 and `product-discovery` after it. If you start at `product-discovery` with raw notes, they go in as unsynthesized evidence, and you get a decision state, not a theme report. Run the synthesis first when the question is "what do these notes show".

The order of the procedure follows the data. The skill first records the sample, then extracts observations with locations, then groups them into themes, and then explains the consequence of each theme. A reason in practice: a consequence that comes before you know the sample has no stated limits.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all user-research-synthesis /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:user-research-synthesis` (plugin) or `/user-research-synthesis` (installed copy). |
| 2 | Put each note in its own file. Write the note ID, date, method, and participant ID at the top. Number each item. Say if the file holds a transcript or interviewer notes. Skip this step if your notes already carry IDs and numbered items. | The skill records source IDs, dates, method, and sample. It cites exact source locations, and numbered items give you a location that you can open. The numbering is practice, not a skill rule. | Each file has an ID, a date, a method, a participant ID, and numbered items. |
| 3 | Write the research question in one sentence. In the sample: "How do readers decide to save an article, and what happens to saved articles afterward?" | The skill records the research question first. The themes answer this question. | The sentence names what you want to learn, not a feature. |
| 4 | Run `/agent-toolbelt:user-research-synthesis "<research-question>" <note-files>`. In the sample, pass the four files `N1.md` to `N4.md`. | The command takes the research question and the sources as one argument. The run was headless, which means that no person answered questions. | The source table in the report lists every file that you passed, with date, method, and unavailable inputs. |
| 5 | Ask for the report as a file in a folder that you name: `Write the report to <folder>/research-synthesis.md`. | The skill defaults to report-only. It writes a research artifact when you request one. It writes to `.atb-work/user-research-synthesis/<scope-slug>.md` when the request names no folder. This run predates that rule. Name a folder that your project uses for research, if you want one. If your project has a research record format, name it in the request. The skill uses it when suitable. | The file exists and has the sections of `templates/user-research-synthesis.md`, or of your project record. |
| 6 | Read the observation table. Check that each row has a location and a kind: reported, observed, or interpretation. Open two or three locations. | A theme is only as good as the observations under it. The skill separates what a participant reported, what was observed, and the analyst's interpretation. | Each row you open matches the note. |
| 7 | Read each theme. Check the counterexamples column and the status, if the report has one. | The skill requires that each material theme links to evidence and has counterexamples or a recorded search for them. | Each theme has a counterexample, or a statement that the search found none. |
| 8 | Read every count. Check that it names its denominator. | The skill gives counts only when the denominator is known. A convenience sample (people who were easy to reach, not chosen to represent readers) cannot show how common a view is in the population. | Each count reads like "3 of 4 participants", and no sentence claims a share of all readers. |
| 9 | Read "Limits and next evidence". Name the next evidence and an owner. | The skill reports sample limits, unanswered questions, and the next evidence or decision. | You can name the next piece of evidence that you will collect, or the decision that you will take to the owner. |

## Decision points

- Skip step 2 if your notes already carry IDs and numbered items. If your notes are unnumbered, ask the skill to cite the nearest quote as the location. If you hold one note, use the skill but expect no themes across participants. If you hold raw transcripts, pass them as they are and say that they are transcripts.
- If no theme has defensible evidence, accept the report that says insufficient evidence. The skill allows this result.
- If a note carries no consent to quote, check permission before you copy a quotation into a shared document. The skill quotes a participant only when permission for the intended output is known. When permission is unknown, it paraphrases the statement and labels it `paraphrase`. If you have no consent record, treat permission as unknown. The run predates this rule. It kept quotations in the internal report and shared source IDs and locations instead.
- If a participant repeats a request, count it as one participant. The skill separates participants from repeated comments.
- If the sources are a survey with a known number of respondents, the skill gives counts when the denominator is known. Check the sampling method yourself before you claim a share. That is practice, because the skill only says that a convenience sample cannot establish prevalence.
- Stop when each material theme has a counterexample or a recorded search, and the limits section names the next evidence. The skill does not require a feature, a ticket, or an opportunity.
- Choose [`product-discovery`](../../skills/product-discovery/SKILL.md) when you want to choose an opportunity or an experiment from the themes. The skill hands off only when you request that decision. The page [Decide whether to build something](product-decide-whether-to-build.md) shows that path.
- Choose [Compare a customer ask with the product](product-compare-an-ask-with-the-product.md) when you have one request and no research notes.
- Choose [Shape an idea into tickets](product-shape-an-idea-into-tickets.md) when the opportunity is already chosen and you need scope.

## What you get

The run was headless, so no person answered questions. The skill asks none. The run chose the research question itself because the task gave none, so replace it with your own. The report has five parts: a source table, an observation log, a theme table, a list of conflicting accounts, and a list of limits.

The report uses these IDs. P1 to P4 are participants. N1 to N4 are notes, and N1.3 is item 3 of N1. O-01 to O-20 are observations. T-01 to T-05 are themes. The log and the source table are additions of this run. `templates/user-research-synthesis.md` now has a section for each, with the kinds `reported`, `observed`, and `interpretation`. Ask for the template, as in step 4 of the Quick path.

First, the observations that show a reported statement and an observed behavior side by side.

Excerpt from the run on four invented notes, Toolbelt commit 695056c. Rows O-12 to O-14 of the log. Other rows are skipped.

| ID | Source | Type | Observation |
| --- | --- | --- | --- |
| O-12 | N3.2 | Reported | Before the task, P3 said "I always find what I saved." |
| O-13 | N3.4, N3.5 | Observed | P3 scrolled a list of about 60 items for about 2 min and did not find the article. P3 found it in the browser history. |
| O-14 | N3.6 | Reported | After the task, P3 was not sure that P3 had saved the article. |

Next, one theme row.

Excerpt from the run on four invented notes, Toolbelt commit 695056c. Condensed from the run report: the columns "Interpretation and confidence" and "Product implication" are left out. The text of the columns that remain is verbatim.

| Theme ID | Observation and source evidence | Counterexamples |
| --- | --- | --- |
| T-02 Participants have trouble finding a specific saved item, or work around it | P1 does not know what the list holds and found no way to clean it (O-03, O-04). P2 search fails and P2 keeps a separate notes file (O-08, O-09, O-10). P3 did not find an item in 60 (O-13). Status: Supported for 3 of 4 participants. | P2 says the list is fine at about three saves a week (O-11). P3 first said "I always find what I saved" (O-12). The observation O-13 contradicts that statement. |

The status words are the labels of `shared/contracts/references/evidence-quality.md`: `Supported`, `Contradicted`, `Mixed`, `Insufficient evidence`. That file scopes them to factual claims. The skill now gives each theme one of these labels: `Supported`, `Mixed`, or `Insufficient evidence`. This run predates that rule, and it applied the labels to themes as its own choice. The Low, Medium, and High confidence words in the report are also a choice of the run. The skill sets no scale for them.

Last, the limits.

Excerpt from the run on four invented notes, Toolbelt commit 695056c. Lines are wrapped. Two of the six bullets of "Limits and next evidence". The other four are skipped.

```markdown
- Denominators: 4 participants from an unknown recruitment, so no
  prevalence claim. The statement "3 of 4" describes this sample only.
- Source type: 3 interviews and 1 observed session. Reported behavior
  (19 of 20 observations) can differ from actual behavior, as P3 shows.
```

The report marks two themes as `Insufficient evidence`: T-03 and T-05. T-03 claims that list size causes the finding problem. The list sizes are known for only 2 of 4 participants. P2 has trouble with search at a list size that the notes do not record. T-05 rests on one participant who took the heart icon for a "like". The report does not rest a design on either claim.

The run did not execute code or tests, because the skill reads research and not code. It used no real research. It had no second researcher to challenge the themes. A person with real notes must still open the cited locations.

What you must check in the output:

- Each theme cell cites observation IDs, and each observation row has a source location that you can open.
- Each count names a denominator, and the report makes no claim about all readers.
- Each theme has a counterexample or a recorded search for one.
- A statement that the participant said and a behavior that the observer saw are not mixed in one row.
- A request that one participant repeats is not a theme. The run kept three text-size requests from P4 as one outside note (O-20).

## Common mistakes

- You read "3 of 4" as a share of all readers. The sample is a convenience sample, so the count describes only these participants. Keep the denominator in the sentence.
- You take what a participant says as what the participant does. P3 said "I always find what I saved" and then did not find an item. Check each theme for observed rows, and treat reported rows as claims.
- You count a repeated comment as support from several people. P4 asked for a larger text size three times, and that is one participant. The skill separates participants from repeated comments.
- You expect a feature recommendation. The skill reports themes, limits, and the next evidence. A recommendation comes from [`product-discovery`](../../skills/product-discovery/SKILL.md) when you request it.
- You copy a quotation into a shared document. The notes in this run had no record of consent, so the run kept quotations internal. Check permission first.
- You treat a note as a transcript. Interviewer notes carry the interviewer's wording, so a quotation is faithful to the note and not proven word for word.

## Next

- [Decide whether to build something](product-decide-whether-to-build.md): when the themes point to an opportunity and you must decide if it is worth building.
- [Shape an idea into tickets](product-shape-an-idea-into-tickets.md): when the opportunity is chosen and needs scope.
- [Review outcomes after a release](product-review-outcomes-after-release.md): when you want to check later if the problem improved.
- [Product decisions and learning workflow](../../workflows/product-learning-workflow.md): the stage order from research to outcome review.
- [Idea to release journey](journey-idea-to-release.md): the full path from research to a release.
- [Use-case index](README.md): the full list of use-case pages.
