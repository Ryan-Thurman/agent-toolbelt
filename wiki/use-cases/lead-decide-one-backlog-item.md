# Decide one technical backlog item

This page is for a tech lead who must decide one backlog item, such as a major dependency upgrade. You get one verdict (`Do`, `Defer`, `Reject`, or `Spike`) with the evidence, the options, the risks, and the next command. For a dependency upgrade, the report also lists version changes that touch your code.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`tech-backlog-assessment`](../../skills/tech-backlog-assessment/SKILL.md) (`/tech-assess`) | No levels. | The backlog item as text. Read access to the repository. Internet access, so that the agent can read official release notes. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Assess the item and name a save folder, because the skill sets none. Sample: `/agent-toolbelt:tech-assess "Must we upgrade Prisma 4 to the current major version? Save the report in .atb-work/."`
3. Read the verdict and its confidence first. Then read "Open questions" and answer each one. Look for checks that the report leaves unexecuted. This run marks them `Not run`. The skill's own term is `Not verified`.
4. Run the command that the report names under "Next workflow". For `Spike`, the skill has no command. Copy the repository and run the spike table from the report by hand.

You get a verdict, the evidence behind it, and the exact next step. The skill reports only. It edits no file until you accept the recommendation and ask for the change.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The sample commands and excerpts use the Conduit API at commit 30b68e1. Replace them with your own item.

The backlog item reads: "Must we upgrade Prisma 4 to the current major version?" The project pins Prisma 4.16.2. Tell the team whether the upgrade is forced. Say which version to aim for and what the first step is. The repository has no ticket, no pipeline file, and no policy file. The only evidence is the code, the lockfile, and the public release notes.

The run on this page was headless: no person answered, and no subagents were available. The skill asks a person no question by name. It records open questions with a recommended default. The run used each default and says so.

## Why this path

The obvious alternative is to read the vendor's upgrade guide and decide from it. That costs you the link between the guide and your code. The guide for Prisma 7 lists changes to the schema, the client, the command line, and the environment. In this run, the code search found no removed API in the repository. The schema itself still fails on the new version. A reader of the guide alone cannot tell which items apply.

The sibling skill [`ticket-discovery`](../../skills/ticket-discovery/SKILL.md) (`/ticket-discover`) handles a narrow ticket that references a precedent. Its description points to `tech-backlog-assessment` when the work itself is in question. Here that skill compares against a precedent, and Conduit has none. "Whether" is the question.

The skill is also not the tool to find candidates. [`tech-debt-discovery`](../../skills/tech-debt-discovery/SKILL.md) ranks many items across a repository. Use it when you have no single item. The page [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md) shows that path.

The skill classifies the item first. It then inspects the repository, compares options, and makes risks concrete. Only then does it give one verdict. Step 2 of the skill says to inspect the repository before you recommend. The reason that each step limits the next is practice, not a skill rule.

For a source-to-target upgrade, the skill also points to `references/version-delta.md`. It tells the agent to read the official migration notes for that version pair. The agent reports only the changes that touch code you use.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all tech-backlog-assessment /path/to/project`. Start the agent in the repository root. | The skill reads the repository, so the agent must start where the code is. | You type `/` and see `/agent-toolbelt:tech-assess` (plugin) or `/tech-assess` (installed copy). |
| 2 | Write the item as one sentence with the decision in it. Sample: "Must we upgrade Prisma 4 to the current major version?" Use `<package>` and `<old major>` for your item. Add the ticket text if one exists. | The skill classifies the item first. A vague item gives a vague verdict. | The sentence names the package or area and the decision. |
| 3 | Run `/agent-toolbelt:tech-assess "<item>"`. In the sample: `/agent-toolbelt:tech-assess "Must we upgrade Prisma 4 to the current major version?"` | The command follows the `tech-backlog-assessment` skill. | The agent starts to read the repository and the lockfile. |
| 4 | Allow web access, so that the agent can read the official release notes. If you have no web access, give the agent the notes as files. | When package metadata, advisories, license, or support status affects the recommendation, the skill requires primary and current sources. | Sources and dates are named, or the report says what the agent searched. This run added a "Sources" section. The template has none. |
| 5 | Read "Current state". Make sure that each claim has a file, a command, or a count behind it. | The verdict depends on what the code uses. A count shows the size of the change. | Each row names a file, a search, or a command output. |
| 6 | Read "Options considered". Make sure that the status quo is a row and that each rejected option has a reason. | The skill compares at least two options when the item holds a real decision. It includes the status quo when plausible. | You can say why each option was rejected. |
| 7 | For an upgrade only, read the version delta. Skip this step when the item is not a version upgrade. Find each row marked as intersecting your code and each row marked `Unknown`. | The skill reports only changes that touch actual usage, and it separates removed APIs from silent behavior changes. | Each `Unknown` row has an owner or a spike step. |
| 8 | Read the verdict, then "Test strategy" and "Open questions". Answer each question. Run the commands in "Test strategy" that the report marks `Not run` (or `Not verified`), if your environment allows it. Unit tests that use the Prisma mock need no database: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest <path>`. Migration, route, and pool checks need a scratch database. | The skill must state the test strategy and the exact next command. A check that did not run proves nothing. | Each open question has an answer or an owner. Each `Not run` check has a plan. |
| 9 | Run the command in "Next workflow". For `Spike`, set a time box and run the spike table from the report in a copy of the repository. | `Do` leads to a plan. A `Spike` is cheaper than a guess when uncertainty is material. | For `Do` or `Spike`, the next result exists: a plan or a spike result. For `Defer` or `Reject`, see Decision points. |

The agent runs searches and reads files in step 3. Commands that install or generate files belong in an isolated folder outside your working tree. The skill does not prescribe this. The version-delta reference says to run tools that can write only in an authorized isolated copy. The run did this for the validation probes that the excerpts below show.

## Decision points

- If the report says `Do`, ask for a phased plan with `/dev-plan`. The skill creates a phased plan only when you ask to continue. The page [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md) shows that path.
- If the report says `Spike`, do not plan the full work yet. Run the spike first. The report names the steps and the evidence that ends the spike.
- If the report says `Defer` or `Reject`, update the ticket with the rationale and stop. The file `workflows/tech-backlog-assessment-workflow.md` gives that step.
- If the item is a confirmed bug, choose [Fix a reported bug](dev-fix-a-reported-bug.md).
- If the item is ready to build and needs a plan, choose [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md).
- If you have no web access, give the agent the notes as files. Expect `Spike` or `Low` confidence. The report must say what it searched.
- If the change is the same edit at many call sites, hand it to `/retrofit`. The page [Swap a library at every call site](dev-swap-a-library-everywhere.md) shows that path.
- If the item names a precedent to copy, stop and use `/ticket-discover`. The page [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md) shows that path.
- If nobody can give a missing fact, such as a deadline, accept the recommended default in the report. This is practice, not a skill rule. Mark it as a default in the ticket.
- If a check was `Not run` (or `Not verified`), do not treat its claim as true. Plan the check, or ask for a `Spike`.
- If the item is a feature question, not a technical one, choose [Decide whether to build](product-decide-whether-to-build.md).
- Stop when the verdict, the confidence, each open question, and the next command are in the ticket.

## What you get

The agent saved the report with the layout of the skill's template, `templates/tech-backlog-assessment.md`. The skill sets no save folder. Name one if you want the file in a place you control. The skill defines the verdict names. The template sets the confidence values: `High`, `Medium`, or `Low`. A release candidate is a build that the vendor published before the final release.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The text is verbatim. Lines are wrapped for width, and `...` marks cut text.

```markdown
Verdict: Spike

Confidence: Medium

Summary: Nothing forces the upgrade this week, but the project must not
stay on Prisma 4.16.2 without a plan. Run a time-boxed spike that upgrades
a copy of the project to Prisma 7.10.1 against a scratch Postgres
database. ... Do not target Prisma 6 (security patches end on 19 November
2026). Do not target Prisma 8 (still a release candidate). The "current
major" in this item is read as 7, the newest generally available major.
This is a default of the run, see "Open questions".
```

Check three things in this output. First, the report names the major that it chose. The registry tag `latest` pointed to `8.0.0-rc.33` on the run date, so "current" was ambiguous. The open question asks you to confirm the choice. Second, the report gives reasons against the other majors. Third, the summary asks for a time-boxed spike on a copy, not an upgrade order.

The next excerpt shows how the report links the release notes to your code. The run chose this layout of the version delta. The skill's reference says what to record but gives no table.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: 3 of the 11 rows, and the Type column. The text of the cells that remain is verbatim.

| Change | Intersects this repository? | Evidence |
| --- | --- | --- |
| `url` in the datasource removed from schema files | Yes. `schema.prisma` line 3. | Tool run: `prisma validate` on 7.10.1 fails with P1012. |
| Driver adapter required | Yes. 2 `new PrismaClient()` sites. | Guide, "Driver adapters". Not run. |
| `$use` middleware, `rejectOnNotFound`, `NotFoundError`, `Buffer` for Bytes, metrics | No. No match in the code. | `usage-scan.txt`. |

A driver adapter is a package that connects the Prisma client to the database. The evidence column separates a tool that ran from a guide that the agent read. The run's "Not run" label keeps a read claim from passing as a test result. The skill's own term is `Not verified`.

The executed evidence for the first row is the raw tool output. The run installed Prisma 7.10.1 in a separate folder with a copy of the unchanged schema. It ran the validation command with a dummy database URL.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Output of `npx prisma validate` on Prisma 7.10.1. Color codes are removed and lines are wrapped for width. The header lines, the source pointer, and the schema lines are cut.

```text
Error code: P1012
error: The datasource property `url` is no longer supported in schema
files. Move connection URLs for Migrate to `prisma.config.ts` and pass
either `adapter` for a direct database connection or `accelerateUrl`
for Accelerate to the `PrismaClient` constructor. ...
Validation Error Count: 1
Prisma CLI Version : 7.10.1
```

On Prisma 5.22.0 and 6.19.3, the same validation command printed "The schema ... is valid". The run read the official guide as saying "deprecated", through a summary tool. The Prisma tool printed an error. The report quotes the tool.

The run did not execute these checks, so the page cannot claim them. No database was available. No migration, end-to-end route, connection-pool check, or build of the app ran.

The baseline Jest run without a database gave 19 passing tests and 7 failing tests. All 7 failures are in the authentication test file, with "Can't reach database server at localhost:5432". The report lists these checks as `Not run` in its test strategy and makes them the steps of the spike.

The run used the skill's recommended default for each open question and did not ask a person. In a real session, you answer them.

## Common mistakes

- Reading "current major" as the newest tag. The registry tag can point to a release candidate, as it did in this run. Read the vendor's release status page, and answer the open question about the target.
- Treating a missing support date as support. The vendor's release status page did not list Prisma 4 and 5. The report marks their support status `Insufficient evidence`. Do not write "supported" or "end of life" in the ticket without a source.
- Counting a clean `npm audit` as "secure". The run found no advisory for the Prisma packages in the npm data. The report limits the claim to that data.
- Accepting a verdict with no `Not run` (or `Not verified`) list. If the report has no such list on an upgrade, ask what was not executed.
- Starting the code change from the assessment. The skill reports only. Ask for a plan with `/dev-plan` first, and for a `Spike`, run the spike in a copy.
- Skipping the characterization test. Some behavior changes silently, such as pool defaults. Record the current behavior on the old version before you change anything.

## Next

- After `Do`: [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md) for the plan.
- For a repeated edit: [Swap a library at every call site](dev-swap-a-library-everywhere.md).
- After a `Spike` that passes: run `/dev-plan` with the spike result as input.
- To find more candidates: [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md).
- To protect the change with tests before you start: [Find coverage gaps before release](qa-find-coverage-gaps-before-release.md).
- To see how several skills connect from idea to release: [Journey: idea to release](journey-idea-to-release.md).
- All use cases: [Use-case index](README.md).
