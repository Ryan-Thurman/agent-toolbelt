# Set up a new team repository on day one

This page is for a tech lead who has just received a repository and must write down how the team works in it. You get a contribution guide that records the real commands and their results, a draft review configuration, and a reviewed list of high-impact paths.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead, with one developer or product owner to confirm impact lines | [`style-guide-init`](../../skills/style-guide-init/SKILL.md) (`/style-guide-init --write`), then [`pr-review`](../../skills/pr-review/SKILL.md) (`/pr-review-init`), then [`risk-area-mapping`](../../skills/risk-area-mapping/SKILL.md) (`/risk-areas`) | No levels. None of the three modes has a depth setting. | A clone of the repository with its packages installed. Permission to run its test, lint, and build commands. A local copy of the Toolbelt. `gh` or `az` signed in (optional, for the review-thread scan). |

## Quick path

1. Get a local copy of the Toolbelt ([Installation](../Installation.md)). Start Claude Code in the repository root with it loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Write the guide: `/agent-toolbelt:style-guide-init --write`. Note the path of the checkpoint in the report (a file that records fingerprints of the inputs, so a later check can see what changed). Check that the status line of the guide says `Draft`.
3. Run each command that the guide marks `Not executed`. Update the guide with each result. List each failing check with an owner. Do not fix the checks now.
4. Draft the risk areas: `/agent-toolbelt:risk-areas`. Confirm each entry in `risk-areas-review.md` with a developer, and set `Status: Approved`.
5. Write the approved entries: `/agent-toolbelt:risk-areas --apply risk-areas-review.md`. Then delete `risk-areas-review.md`.
6. Write the review configuration: `/agent-toolbelt:pr-review-init`. It finds the file that step 5 wrote, and it leaves the risk list as written. Prune `.pr-review.md`. Open one pull request with `CONTRIBUTING.md`, `.pr-review.md`, the README pointer, and the checkpoint file from step 2.

You get a guide that separates enforced rules from observed habits. You also get a review configuration with an evidence note on each non-obvious line, and a risk list that a person approved.
The sections below explain each step. For the skip and stop cases, read "Decision points".

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run on this page used commit 30b68e1.

You are the tech lead of a new team. The team owns this repository from today. The repository has a README and nothing else that tells a contributor what to do. It has no `AGENTS.md`, no `CLAUDE.md`, no style guide, no pull request template, no `CODEOWNERS` file, and no CI file. The history shows that Travis and CircleCI files existed once and were deleted. The README still shows a Travis badge.

Before the first feature, you need three things. Contributors need one place that says how to set up, change, and check the code. The review tool needs the priorities of this codebase. The team needs a list of the paths where a defect costs the most. All three must come from the repository, not from generic advice.

## Why this path

The obvious alternative is to copy the Toolbelt templates (`templates/pr-review.md`) and fill them in from memory. This costs you two things. The sample values in the template (a 1M-user target, a 150 ms latency bar) do not describe your service. And nobody can tell which line rests on evidence. The `/pr-review-init` recipe writes a line only when it traces to a file, a commit, or a review thread. It adds an HTML comment that names the source on each non-obvious line.

The sibling alternative is `/style-guide-init --rails`. It adds one quality command and wires local use, CI, and release to it. It changes check configuration, scripts, and CI files. Use it when your first need is a command that fails on a bad change. This page stays on documentation. `--write` changes the guide and its checkpoint, not the source or the configuration.

The order has these reasons:

- The guide comes first. It runs the repository commands and records each result. `/pr-review-init` then has facts about the tests and the lint. This order is practice, not a rule of the skills. The recipe does not list `CONTRIBUTING.md` as a source, but it also does not forbid it.
- `/risk-areas` comes before `/pr-review-init`, and the skill sets this order (`config-init.md`, "Order with risk areas"). Both write `.pr-review.md`. The apply step writes the approved `## Risk areas` section. The init then finds the file, runs in refresh mode, and leaves that section as written.
- `/risk-areas` stops for a person. The skill drafts the paths. A person confirms each impact line, because the impact of a defect is a business judgment. Start the draft early, so that the confirmation can happen while you run the guide commands.

## Steps

The table writes commands in the Claude Code form `/agent-toolbelt:<name>`. Cursor uses `/<name>`.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Run `claude --plugin-dir /path/to/agent-toolbelt` in the repository root. Run `git status --short`. | The skills must exist in the session. A clean tree shows you which files the skills add. | The three commands appear in the command list. `git status` shows no changes, or you noted them. |
| 2 | Run `/agent-toolbelt:style-guide-init --write`. | `--write` authorizes the guide and its checkpoint. With no existing guide, the skill writes `CONTRIBUTING.md`. | `CONTRIBUTING.md` exists. The report names the checkpoint path. Note that path. The run also added a README pointer to the guide. The default guide has a status line. Keep it at `Draft` until maintainers approve the guide. |
| 3 | Read "Verify the change" and "Evidence and open decisions" in the guide. Run each command that the guide marks as not executed. In the sample, run `npm ci` and `npx prisma generate`. For the start check you need `DATABASE_URL`, `JWT_SECRET`, and a database. Run `npx prisma migrate deploy` first, then `npx nx serve api`. The server does not return, so stop it after the start check. Write each new result into the guide, and capture the checkpoint again. | The skill records a command as executed only when it ran. You confirm the rest in your environment. | Each command has the label `Executed`, `Failed`, or `Not executed` in the guide, and the guide and checkpoint match your results. |
| 4 | Write down each red check as a finding. In the sample, the unit tests, the lint, and the e2e test failed on the unchanged commit. The run had no database, so run the tests with a database and record your own result. Do not assume the same count. Do not fix them in this step. | The guide records the baseline. A fix belongs in a separate change. | You named an owner for each failing check on the open decisions list. |
| 5 | Run `/agent-toolbelt:risk-areas`. | The skill drafts entries into `risk-areas-review.md` and edits no other file. It stops and gives the path. | `risk-areas-review.md` exists in the root. |
| 6 | With a developer or product owner, read the coverage line, the "Not inspected in depth" line, and each `Evidence:` line. Keep, edit, or delete each entry. Set `Status: Approved` or `Status: Skip`. | Impact is a business judgment, and the agent infers it from code. | Each impact line has a person who can defend it. |
| 7 | Run `/agent-toolbelt:risk-areas --apply risk-areas-review.md`. Then delete the review file or move it outside the repository. | Apply writes only the entry lines and their `Paths:` lines. It does not commit. The review file is a draft. The skill says to run this step before `/pr-review-init`. | `.pr-review.md` has a `## Risk areas` section. The run did not run this command (see the questions table). |
| 8 | Run `/agent-toolbelt:pr-review-init`. | The recipe mines the README, the history, the review threads, and the rejection memory (a local file of findings that reviewers rejected). It writes a draft `.pr-review.md`. If step 7 wrote the file, the recipe runs in refresh mode and proposes a diff. | `.pr-review.md` exists and keeps the `## Risk areas` section. Each non-obvious line has a comment that names its source. |
| 9 | Read the draft. Delete each line that you cannot defend. Do not commit yet. | The draft is for review. The configuration takes effect only when it exists on the base branch. | You can name the evidence for each remaining line. |
| 10 | Commit `CONTRIBUTING.md`, `.pr-review.md`, the README pointer, and the checkpoint file in one pull request. | Review loads the configuration from the base branch. A change cannot relax the rules that judge it. | The pull request is open. After the merge, the configuration is in effect. |

### Questions that the skills leave for a person, and the defaults used in the run

The run had no person to answer. The defaults below are not decisions of a person.

| Kind | Skill or step | Decision | Default used in the run |
| --- | --- | --- | --- |
| Skill question | `risk-area-mapping` | Which entries to keep, and the status of the repository. | The run set `Approved` itself. A real run waits for a person. The run did not run `/risk-areas --apply`. It appended `## Risk areas` to `.pr-review.md` by hand, following Apply step 3, so that file is not real apply output. The draft before that change is saved. |
| Skill question | `style-guide-init` | Each policy that the evidence cannot settle (the Prettier settings, the lint policy, CI). | The guide lists them as open decisions and settles none. |
| Skill question | `pr-review-init` | Which draft lines to keep. | Nothing was pruned. The page shows the draft as written. |
| Run decision | `style-guide-init` | A status line on the guide. | The run added `Status: Draft` by hand. The run predates PR #60, and the contribution template now has a status line. A new guide stays a draft. |
| Run decision | `style-guide-init` | The checkpoint path. | `docs/conventions-state.json`, the example path in the maintenance reference. The skill uses this path when the repository names none. |
| Run decision | `risk-area-mapping` | The repository heading in the review file. | The run used the sample name `conduit-prepared`. The skill names the folder name for the heading. Apply matches the heading to a folder name, so use the folder name of your repository, or check the heading before you apply. |

## Decision points

- If the repository already has a contribution guide or a style guide, the skill updates that owner. It does not add `CONTRIBUTING.md`. Ask for `STYLE_GUIDE.md` by name when you want a guide for style only.
- If you want to read the guide before any file changes, run `/style-guide-init --print`. That mode edits nothing.
- If `.pr-review.md` already exists, `/pr-review-init` runs in refresh mode. It proposes changes as a diff and does not overwrite the file. The same is true after `/risk-areas --apply`.
- If a source gives no evidence, the section stays out. In this run, `## Do not flag` is absent. The rejection memory file does not exist, and the 12 comments on 17 merged pull requests in the public sample repository on GitHub show no repeated objection.
- If a command in the guide fails on the unchanged commit, keep it in the guide with its result. Do not fix it during setup. Choose [Set up one quality command](lead-set-up-quality-rails.md) when you want one command that runs all checks.
- If an entry has `Evidence: inferred`, ask the owner of the behavior to check the impact line before you approve it. All three entries in this run were inferred.
- If the entries match a large share of the source files, check whether you can name normal code that the list leaves out. The skill sets no threshold. This run matched 16 of 43 source files (37%). The run was made before PR #58, which fixed the coverage exclusion rule, so the total can differ on the current skill. and left out profile, tag, and configuration code.
- If nobody can confirm impact lines today, skip steps 5 to 7 (Quick path steps 4 and 5). The guide and the review configuration do not depend on them. Review then runs with no declared risk areas, and the skill does not invent them.
- If `AGENTS.md`, `CLAUDE.md`, or an earlier file in the discovery order already has a `## Risk areas` section, readers use that list. Apply warns you and asks which file to write.
- Review loads `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, and an approved `STYLE_GUIDE.md` as standards (`repo-config.md`). You need no line in `AGENTS.md` for that. The run predates that change, so the run did not load `CONTRIBUTING.md`.
- Stop when the pull request is open and each red check has an owner. Stop only when the risk list has an approver or a recorded skip. Run `/agent-toolbelt:style-guide-init --check`. It must return `covered-inputs-unchanged`. A changed result means that a covered input or the guide changed after the capture. Review the change, then capture again.
- Choose [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md) when the next goal is test priority, not review configuration.
- Choose [Install for a team](ops-install-for-a-team.md) when each developer needs the Toolbelt in their own agent tool.

## What you get

No person answered during the run. The first excerpt is from the guide. It shows that the baseline is red, with the result of each command that the run executed.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the guide: the row for a single test file is left out. The text of the rows that remain is verbatim.

| Check | Command | Result in this run |
| --- | --- | --- |
| Unit tests | `npx nx test api` | Failed. 19 passed, 7 failed, 1 todo. See below. |
| Type check | `npx tsc -p tsconfig.app.json --noEmit` | Executed. Passed. This command is not defined in any script. |
| Lint | `npx nx lint api` | Failed with 33 errors. Most are `no-explicit-any` and `ban-ts-comment`. |
| Format | `npx prettier --check "src/**/*.ts"` | Flags 15 files. See "Open decisions". |
| End-to-end | `npx nx e2e e2e` | Failed. Needs a running server. See below. |

The guide also gives the cause of the 7 test failures. The 7 failures were seen with no database. A run with a database was not executed, so your count can differ. The file `auth.service.test.ts` imports the service before the Prisma mock, so the real Prisma client loads. In a temporary copy with the mock import first, all 12 tests passed. The run deleted the copy, and the repository file is unchanged.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are the result lines of the whole suite, then of the temporary copy.

```text
Tests:       7 failed, 1 todo, 19 passed, 27 total
Tests:       12 passed, 12 total
```

The guide marks the Prettier setting as `Conflicted`. The code matches width 100 and trailing commas, but `.prettierrc` sets only single quotes. With `--print-width 100 --trailing-comma all`, the check flags 2 files and not 15. The guide leaves the decision to the team. The skill sorts each claim into one of five classes: documented policy, enforced, observed, proposed, and conflicted. Make sure that no `Observed` claim reads like policy.

The second excerpt is part of `.pr-review.md` (a review configuration that the review tool reads from the base branch).

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
## Budgets
- A token must carry the user ID: the payload of `generateToken`
  stays `{ user: { id } }`. <!-- from: 30b68e1 fixed a token that
  held no ID; src/app/routes/auth/token.utils.ts -->
...
## Severity overrides
- a change in `src/app/routes/auth/**` that removes the user ID
  from the token payload or changes the header check in `auth.ts`
  -> blocker <!-- from: 30b68e1 (missing user id), 2d9df7c
  (Token/Bearer check) -->
```

A budget is a testable bar that review cites. A severity override re-rates a matching finding. Check that each line names a path or a payload, and that its comment names a commit or a file.

The third excerpt is the first entry of the risk review file, before anyone approved it.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
Coverage: 16 of 43 source files (37%). The source count is the
  tracked files without `src/tests/`, `e2e/`, `.vscode/`, Markdown
  files, images, `package-lock.json`, and the Prettier and ESLint
  ignore files and `.prettierrc`. ...
- **Authentication and account credentials**: A defect can let a
  caller act as another user, or can expose or overwrite the
  email, username, and password of an account.
  - Paths: `src/app/routes/auth/**`
  - Evidence: inferred. Files matched: 8. From: `auth.ts` builds
    the `required` and `optional` JWT guards (HS256, secret from
    `JWT_SECRET` with the fallback `superSecret`). ...
```

Make sure that you check three things in the review file. The impact line names users and data. The paths match the files that the evidence names. The evidence line gives a function or a key that you can open. The file also lists a fallback secret under "Other findings", because it applies to the whole deployment and not to one path.

## Common mistakes

- You treat the guide as policy. The default guide has a status line. Keep it at `Draft` until maintainers approve the guide (see [Installation](../Installation.md)). An `Observed` claim only records a habit.
- You expect the new `.pr-review.md` to apply to the pull request that adds it. Review reads the file from the base branch, so it takes effect after the merge.
- You run `/pr-review-init` before `/risk-areas --apply`. By the recipe, apply then adds its section to the file that the init wrote, and a refresh can disagree with it. Run apply first, as `config-init.md` says. This was read from the skill and not run.
- You commit `risk-areas-review.md`. It is a draft. Delete it or keep it outside the repository.
- You approve an `Evidence: inferred` impact line without a check. The agent inferred the consequence from code.
- You fix the red checks inside the setup. The guide must record the baseline. A fix hides what the repository looked like on day one.
- You assume that the guide covers the whole repository. It states what it sampled. In this run, `seed.ts` and the migration SQL were read by name or in part.

## What this run did not execute

- `npm ci`, `npx prisma generate`, `npx prisma migrate deploy`, `npx nx serve api`, and the Docker build. No database was available, and the packages were already installed.
- The unit tests with a database. The 7 failures were seen with no database.
- `/risk-areas --apply`. The run wrote the `## Risk areas` section by hand from Apply step 3.
- Remote settings: branch protection, required reviewers, and required checks. The guide marks them as unknown.
- A review of a pull request with the new configuration. The run wrote the configuration and did not test it.
- The impact lines. No person confirmed them.

## Next

- [Set up one quality command](lead-set-up-quality-rails.md): when the red checks must become one command that CI runs.
- [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md): when the open decisions and the failing checks compete for the next sprint.
- [Review every pull request on open](ops-review-every-pr-on-open.md): when the review configuration is on the base branch and you want reviews to start by themselves.
- [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md): when QA needs test priorities from the same list.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): when the first change arrives.
- [Install for a team](ops-install-for-a-team.md): when each developer needs the Toolbelt in their own tool.
