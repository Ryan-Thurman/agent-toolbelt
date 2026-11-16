# Rewrite a README setup section as a plain runbook

This page is for anyone who writes runbooks, error messages, or release notes and has a setup text that readers misread. You get a list of the rule violations in the text. You also get a runbook in plain English and a list of the facts that the old text left out.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer, on-call engineer, technical writer | [`simple-english`](../../skills/simple-english/SKILL.md) (`/agent-toolbelt:simple-english`). The skill has no command file. | No levels. The default is Plain mode. Strict mode starts only when you name STE or compliance. | A text file with the steps, the repository that the steps describe, and a shell. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Check the text: `/agent-toolbelt:simple-english Check <file> from the heading "<first-heading>" to the end against the writing rules. Report each violation with its rule number, the text, and a rewrite. Do not edit the file.`
3. Run each command of the text on a clean copy of the repository. Write down each step that a command needs and the text does not name. These are your command notes. Start from a clean copy, install the dependencies, and then run the build and start commands of the text. See step 5 of the table for the sample.
4. Rewrite: `/agent-toolbelt:simple-english Rewrite those sections as a runbook in <runbook-file>. Keep every command. Add each step and fact from my notes.` Paste your command notes into the prompt.
5. Run the commands of the runbook in order on a clean copy. Fix each step that fails.
6. Search the runbook for the faults in step 7 of the table, and fix each hit by hand.

Stop when each violation is fixed or rejected with a reason, and each command has a result or `Not executed`. If the text has no commands, skip steps 3 and 5. Then read "Decision points" for the pattern of your text type.

In the sample, `<file>` is `README.md` and `<first-heading>` is `Getting Started`.
You get a rule-numbered list of violations and a runbook with one command for each step. The missing facts are your own command notes from step 3.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

This page checked its claims about the skill against the skill files at Toolbelt commit 695056c.

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. This page uses commit 30b68e1.

The README has 66 lines of setup. The part "Getting Started" has six steps. They install the dependencies and set the environment variables. They generate the Prisma client (database code) and run the migration (a script that changes the database structure). They start the API and add seed data (sample data). The part "Deploy on a remote server" is one command line.

You must give a new team member, or the person on call, a runbook that they can follow without asking you. A runbook is a list of steps that a person follows during an operation. The README is your only source.

The run had no database.

## Why this path

The obvious alternative is to ask an agent to "make the README clearer". That is practice, not a skill step. The cost here is that you name no rules. The agent then reports no rule numbers, so you cannot accept or reject a change one by one. You must also say in the prompt that each command and each fact stays as it is.

The skill gives the rules and the report format. The rules come from ASD-STE100, the controlled English that aerospace uses for maintenance manuals (STE). The reference `use-cases.md` says that a maintenance manual is the text type that STE was written for, and it treats an on-call runbook as one. The skill's check mode reports each violation as a rule number from `rule-catalog.md`, the offending text, and a compliant rewrite.

The other alternative in the skill is Strict mode. It starts when you name STE, ASD-STE100, or compliance. It reads `strict-vocabulary.md`, which is a lossy index of the official dictionary. The skill tells you that no tool guarantees compliance. Use Strict mode only when someone requires STE. For a README setup text, Plain mode is enough.

The skill rewrites words. It does not run commands, and its rules say never to change facts. A rewrite of the README therefore copies a wrong command. In this run, the last command of the deploy line failed on a fresh checkout (see "What you get"). That is the reason for steps 4 and 5 in the table below: they put the facts into the rewrite and test the result. The skill does not prescribe these two steps. They are this page's practice.

The check comes before the rewrite because the report shows each fault before any text changes. A rewrite alone is also allowed (see "Decision points").

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all simple-english /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:simple-english` in the list. |
| 2 | Copy the part of the text that you own into a file, or name its first heading and its last line. In the sample, the part starts at `## Getting Started` and ends at the last line of `README.md`. | The report covers the passage that you name. The product description above the setup part is not setup text. | You can name the first and the last line of the passage. |
| 3 | Run the check: `/agent-toolbelt:simple-english Check README.md from the heading "Getting Started" to the end against the writing rules. Report each violation with its rule number, the text, and a rewrite. Do not edit the file.` | The skill opens `rule-catalog.md` first and quotes rule numbers from it. You see each fault before any text changes. | The report lists each violation with a rule number, the text, and a rewrite. The file has no edit. |
| 4 | List each command of the text. These are your command notes. Next to each one, write the host, the folder, and the earlier step that it needs. Read the project files for this: in the sample, `package.json`, `project.json`, `.gitignore`, and `src/main.ts`. | The skill rewrites wording only. It does not find a step that the text leaves out. | Each command has a note, or the note `none found`. |
| 5 | Run each command that you can run on a clean copy of the repository. Record the result and the commands that you did not run. Install the dependencies without a database first (see the sample commands below the table). | A command that runs in your copy is a fact. A command that you only read is not. | Each command has the result `ran`, `failed`, or `Not executed` with a reason. A failed command has its error text saved. |
| 6 | Run the rewrite: `/agent-toolbelt:simple-english Rewrite those sections as a runbook in <runbook-file>. Keep every command. Add each step and fact from my notes.` Paste your command notes from steps 4 and 5 into the prompt. | The skill can use a fact only when you give it to the skill. The skill keeps commands, flags, and file paths as they are. | The runbook has one instruction for each sentence, and each command sits in a code block. |
| 7 | Search the runbook for the items on the skill's self-check list: `'`, `has been`, `should`, `may`, `;`, the em dash, `, making`, `**`, `check`, `verify`, and `config`. Also look for any heading that covers fewer than three sentences. Count the words in your three longest sentences, and split any sentence over 20 words (procedural text) or 25 words (descriptive text). Fix each hit by hand. | The skill lists these as the usual faults. A script that swaps one for another leaves broken sentences. The lint does not count sentence length. | The search finds no hit that is a fault. In the Toolbelt repository, the lint script `python3 scripts/check-writing-rules.py --files <runbook-file>` reports no finding. |
| 8 | Run the commands of the runbook in order on a clean copy. Fix each step that fails. | The rewrite adds facts. This run tests them. | Each step has a result, and the steps that you did not run are marked `Not executed`. |

Sample commands for step 5. The sample copy for this page already had `node_modules` and the Prisma client. On a clean copy, install the dependencies with `npm ci --ignore-scripts`, and set a dummy `DATABASE_URL` (for example `postgresql://u:p@localhost:5432/db`) before you run `npx prisma generate`. These commands need no database:

```text
node dist/api/main.js
npx nx build api
PORT=3999 DATABASE_URL=postgresql://db_user:db_password@localhost:5432/db_name JWT_SECRET=your_secret_value node dist/api/main.js
```

The first command fails on a copy with no build. Run it first to see that failure. Then run the build, and then the start command. The run did not execute the install and the Prisma generate steps.

## Decision points

- If you need only a rewrite, skip step 3. The skill rewrites without a check report. You lose the list of faults.
- If the text has no commands, as in an error message, skip steps 4, 5, and 8. Read `use-cases.md` of the skill for the pattern of each text type. The skill names the mode for each. An error message is procedural: state what happened in the simple past, state the cause if known, and give the command or condition that fixes it.
- If your prompt names STE, ASD-STE100, or compliance, the skill starts Strict mode. Use that on purpose. Otherwise say "the writing rules".
- If a command fails on the clean copy, write the working command in the runbook. Tell the owner of the README. Do not keep the command that fails.
- If a step needs a database or a credential that you do not have, write `Not executed` in your notes. Do not write that the step works.
- If the text is marketing or brand copy, stop. The skill says that its rules delete persuasion. Use the rules for the documents that the copy links to. In the sample, the product description above "Getting Started" stays as it is.
- Stop when each violation is fixed or rejected with a reason and each command has a result or `Not executed`. Then run the search in step 7.
- If the text is release notes, this skill covers them. Use descriptive mode: one entry, one change, one sentence where possible. Write a breaking change as a command first, for example "Update your calls to `v2/users`." Choose [Prepare a release and decide go or no-go](lead-prepare-a-release.md) only when you must decide whether to release.
- If the text is an incident report, this skill covers it. Use descriptive mode and the simple past only. Choose [Follow up an incident after it is mitigated](sre-follow-up-an-incident.md) for the follow-up work, not to rewrite the report.
- Choose [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md) when you must find out whether a runbook exists for each failure. This page covers how a runbook reads, not whether one exists.

## What you get

The run was headless: no person answered questions. The run read `SKILL.md` and followed it by hand, and it did not call the slash command. The skill asked none. The run used Plain mode, so the closing sentence about compliance did not apply.

The check report numbers each violation and each fact gap. The numbers belong to this report, not to the skill. The skill prescribes the rule number, the text, and the rewrite. The table form and the fact gaps are the choice of the run. The report has 19 violations and 9 fact gaps.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: 3 of the 19 rows, and the same columns as the report. The columns `#` and `Line` refer to the saved run report, which you do not have. The lint (a script that checks the writing rules) is part of the Toolbelt repository.

| # | Line | Rule | Offending text | Compliant rewrite |
| --- | --- | --- | --- | --- |
| 6 | 15 | Modal ladder (the word "should" as a recommendation) | "Your host provider should included a feature" | "Your host provider has a feature" |
| 7 | 15 | 3.5 | "to avoid exposing them" (an -ing form used as a verb) | "so that the values stay out of the repository" |
| 8 | 15 | GR-3 | "to set them there directly" (what are "them" and "there"?) | "Set the variables with this feature." |

The rule numbers 3.5 and GR-3 are rule IDs from `rule-catalog.md`. "Modal ladder" is the name of the section of the catalog for banned modal verbs, not a rule number. The line numbers refer to the saved copy of the README sections.

Next, the same passage before and after the rewrite.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The first block is the README. The second block is the rewrite.

```markdown
This project depends on some environment variables.
If you are running this project locally, create a `.env` file at the root for these variables.
Your host provider should included a feature to set them there directly to avoid exposing them.
```

```markdown
On a development computer, create a `.env` file in the root folder of the repository. Write the three variables in it.
On a remote server, set the variables with the configuration feature of your host provider. This keeps the values out of the repository.
```

The rewrite names the folder and says where the variables go. It also moves the three variable names above this passage, so the reader knows what "the three variables" are.

The rewrite also adds a fact that the README lacks. The README lists `JWT_SECRET` as required. The code does not stop without it. This warning comes from reading `src/app/routes/auth/token.utils.ts` and `src/app/routes/auth/auth.ts`. The run did not execute it.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The first line is the README deploy line. The second line is the error from `node dist/api/main.js` on a copy with no build. The path is cut to `...`.

```text
npm ci && npx prisma migrate deploy && node dist/api/main.js
Error: Cannot find module '.../dist/api/main.js'
```

The folder `dist` is in `.gitignore`, so a fresh checkout has no `main.js`. After `npx nx build api`, the file exists, and `node dist/api/main.js` prints `server up on port 3999` with `PORT=3999` and no database. The run did not execute `npm ci` or `npx prisma migrate deploy`.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Step 1 of the deploy steps of the rewrite. The code fence around the command is left out.

```text
1. Install the dependencies, including the development dependencies:

   npm ci --include=dev

   The build in step 2 needs the development dependencies. If `NODE_ENV` is `production`, the command `npm ci` skips them.
```

The claim about `npm ci` comes from `NODE_ENV=production npm config get omit`, which printed `dev`. The run did not run `npm ci`, because the command changes the shared `node_modules`.

What you must check in the output:

- Each rule number in the report exists in `rule-catalog.md`. A citation that starts with "Skill rule" names a numbered rule of `SKILL.md` that the catalog does not number.
- The runbook keeps each README command. Each added command or step has evidence in your notes.
- Each fact in the runbook is marked as run or read. In this run, the seed numbers (12 users, 12 articles each) and the `JWT_SECRET` default come from reading code.
- The runbook has no `Not executed` step that reads as if it worked.

## Common mistakes

- You write "ASD-STE100" in the prompt and get Strict mode. The skill then reads the dictionary rules and reports more findings. Write "the writing rules" when you want Plain mode.
- You trust a rewrite that passes the lint. The lint checks wording, not facts. The last command of the README deploy line passes as text and fails on a fresh checkout.
- You copy "required" from the README without a check. The code gives `JWT_SECRET` a built-in default (`superSecret`, read in code and not executed). The runbook now warns about this.
- You run the seed on a production database. The seed adds 12 users, 12 articles for each user, and a comment from each user on each article. The runbook limits the seed to a development database. That limit is the practice of the writer. The README does not state it.
- You fix a lint finding with a script that swaps an em dash or a semicolon for a comma. This leaves comma splices. Rewrite each flagged sentence by hand.
- You rewrite the product description at the top of the README with these rules. The skill says that the rules delete persuasion, so leave that text to its author.

## Next

- [Prepare a release and decide go or no-go](lead-prepare-a-release.md): when the text is a set of release notes.
- [Follow up an incident after it is mitigated](sre-follow-up-an-incident.md): when the text is an incident report.
- [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md): when you must find out whether a runbook exists for each failure.
- [Set up a new team repository on day one](lead-set-up-a-new-team-repo.md): when you must write down how the team works in a repository that you just received.
- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): when the runbook changes are part of a branch that you want reviewed.
- [Use-case index](README.md): the full list of use-case pages.
