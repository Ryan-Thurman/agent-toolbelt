# Set up one quality command for local use, CI, and release

This page is for a tech lead whose repository has separate check tools but no single command that runs them. You get one command that local use, CI, and release all call. You also get a list of the checks that already report findings, with counts.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`style-guide-init`](../../skills/style-guide-init/SKILL.md) (`/style-guide-init --rails`) | None. The skill has no depth levels. | A checkout of the repository with its dependencies installed. Permission to change check configuration, scripts, and CI files. |

## Quick path

1. Start Claude Code in the repository root with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Set up the rails: `/agent-toolbelt:style-guide-init --rails`.
3. Read the report. Find the command name (sample: `npm run quality`), the CI and release steps, and the list of checks pending adoption with counts.
4. Set the environment that your tests need (sample: a dummy `DATABASE_URL` and `JWT_SECRET`, see step 5). Run the command that the report names. Expect a red result with exit code 1 while pending checks have findings. Run `<command> -- required` to see what CI blocks on. Then run `git status --short --untracked-files=all` and read `git diff`.

Stop when each check prints a result and the pending list has counts.

You get one command, its wiring in CI and release, and a list of checks that the team must fix before they become required.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public RealWorld Conduit example app on GitHub (`gothinkster/node-express-realworld-example-app`). The run on this page used commit 30b68e1.

The repository uses Nx (a build and task runner), ESLint, Prettier, TypeScript, and Jest. The only package scripts are `start`, `build`, and `test`. No script runs the format check, the lint, or the type check. The repository has no CI workflow. The README shows a Travis badge, but no Travis file exists. The only release-shaped step is the `docker-build` Nx target, which builds a Docker image. The repository has no contribution guide, `AGENTS.md`, or `CLAUDE.md`.

You want one command that a developer runs before a pull request, that CI runs on each pull request, and that the release step runs before it builds an image. The command must not break anything that works today.

## Why this path

The obvious alternative is `/style-guide-init --write`. It writes a contribution guide from the repository evidence. In every mode except `--rails`, the skill changes documentation and its checkpoint only. It does not change check configuration, scripts, or CI. The repository defines only two such commands (`nx test` and `nx build`, read from `package.json`), so a guide can list only them. No `--write` run was made for this page. The skill does not say how `--write` treats the missing commands.

The second alternative is [`code-quality-gate`](../../skills/code-quality-gate/SKILL.md) (`/code-quality-gate`). It gives a pre-PR verdict on a branch and runs the checks that the repository requires. It does not create the checks or a single command for them. Use it after the rails exist (this is practice, not stated in the skill), unless the project instructions already make it a gate. The page [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md) covers that step.

The third option is `--print`. It gives guidance and changes no file (see Decision points). The procedure in `references/rails.md` has this order:

- The skill inspects first, because it must choose the smallest setup with the tools that the repository already has. The skill states this reason.
- It puts fast checks (format, lint, type check) before tests and builds. The skill requires this order and gives no reason. Practice: a developer gets the cheap failures first.
- It runs each new check once on the current code. The skill says a required workflow that passes now must still pass, so a check with findings does not become required CI yet.
- It names the command once in the guide and adds one line to the agent file. The skill gives no reason. Practice: the two files do not drift.
- It runs rails mode a second time, and the skill requires that this makes no more changes. It gives no reason.

Rails mode does not fix findings. It does not format files, and it adds no suppression or baseline file.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all style-guide-init /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:style-guide-init` (plugin) or `/style-guide-init` (installed copy) in the list. |
| 2 | Open the repository root. Install the dependencies (`npm ci`). Run `git status --short`. | The skill keeps unrelated changes in the working tree. A clean status lets you tell the skill's changes from yours. | `git status` shows the changes that you expect, or none. |
| 3 | Run `/agent-toolbelt:style-guide-init --rails`. A plain request such as "set up quality checks" also starts rails mode. | The flag authorizes the edits to check configuration, scripts, CI, and the guide. The skill asks no question in this mode. | The agent reports the checks that it added, the command, and the CI and release steps. |
| 4 | Read the report. Find the canonical command and the pending-adoption list. | The list tells you which checks fail today and how many findings each has. | Each check with findings has a count. |
| 5 | Run the command. In the sample: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npm run quality`. | A configuration read does not prove that the command runs. The dummy values let `prisma generate` run and avoid a missing-variable error. The run did not confirm whether the auth tests need a database. | The command prints one summary line for each check. A check that depends on a service you do not run can fail for that reason: write the cause next to the count. In the sample, 7 auth tests fail (see the excerpt below). |
| 6 | Run `git status --short --untracked-files=all`, then `git diff`. Run `git diff --stat -- src e2e`. | Rails mode must change configuration, scripts, CI wiring, and documentation only. New files appear in `git status` only, so read each one in full. | The last command prints nothing, and each changed or new file is one of those four kinds. |
| 7 | Compare the CI and release wiring with your host. Run the CI workflow on a branch, and run the release command, outside the agent. | The agent cannot run your CI host. A workflow that was not run is not a passing workflow. | The CI run shows the required step green and the pending step reporting. |
| 8 | Run `/agent-toolbelt:style-guide-init --rails` again. | The skill requires that a second run makes no more changes. | `git status --short --untracked-files=all` lists the same files, and the `git diff` output and a hash of each new file are the same as before. |
| 9 | Commit the setup. Plan the fixes for each pending check as separate work. | The skill sets up the rails and leaves the findings for later feature, bug, and cleanup work. | Each pending check has an owner or a ticket. |

## Decision points

- If the repository already has one entry point that runs most checks, such as `make check`, the skill reuses it. It then wires CI and release to that entry point. Skip the search for a new command.
- If a required CI workflow already passes, it must still pass after the setup. The skill keeps existing correctness, security, release, and operating checks in place.
- If a new check finds problems in existing code, the skill lists it as pending adoption with its count. It keeps the check in the command only in a report-only mode, when the tool has one. Otherwise it leaves the check out of the command. Move it to required when the team has fixed the findings.
- If the repository has no CI, no release step, no contribution guide, or no agent file, the skill skips the step that connects the missing file and names that file in the report. It does not create the file. The run on this page chose to create a CI workflow, a contribution guide, and an agent file, and it edited the existing `docker-build` target for release. Decide before you start, and review each new file in step 6.
- If you want guidance and no file changes yet, run `/style-guide-init --print`. That mode changes no file, and it does not set up the command.
- If a check fails only because of the environment, such as a missing database, the skill separates that case from a finding in the code. It is not a pass. Write the cause next to the count.
- Stop when the command runs and prints a result for each check, the pending list has counts, and a second run makes no more changes.
- Choose [Set up a new team repository](lead-set-up-a-new-team-repo.md) when you start a repository from nothing and also need conventions and review configuration.
- The `required` and `pending` groups are the run's design. The skill requires only the outcome: a check with findings stays out of required CI, and it runs in the command only in report-only mode.
- Choose [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md) when the project instructions or policy require a gate verdict for each pull request.

## What you get

The run was headless, so no person answered a question. The rails procedure asks no question, so no default replaced a decision. No subagent ran, and the second run in step 8 was a manual re-read of the files (their hashes did not change), not a second agent run.

The skill prescribes the checks' order (fast checks first), a non-interactive command that exits with a failure code, one implementation of each check, and a pending-adoption list with counts. The run chose these items itself. The skill does not prescribe them:

- The `scripts/quality.sh` script, with the groups `required` and `pending`.
- The new GitHub Actions workflow (Node 18, taken from the `@types/node` version, because the repository declares no runtime).
- The `docker-build` change.
- The new `CONTRIBUTING.md` and `AGENTS.md`.
- The `/tmp` entry in `.prettierignore`.

The script lists the groups in one place. This is the part that decides what blocks.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Lines 11 to 17 of `scripts/quality.sh`.

```bash
# Checks in run order: fast checks first.
ALL="format lint typecheck test build"
# Required checks pass today, so CI and release block on them.
REQUIRED="typecheck build"
# Pending adoption: each check reports findings in existing code.
# Move a check to REQUIRED after the team fixes its findings.
PENDING="format lint test"
```

CI runs the same command twice. The first step blocks. The second step reports only.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The last three steps of `.github/workflows/quality.yml`.

```yaml
      - run: npx prisma generate
      - name: Required checks
        run: npm run quality -- required
      - name: Checks pending adoption (report only)
        run: npm run quality -- pending
        continue-on-error: true
```

Then the full command on the unchanged code. It exits with 1, because three checks have findings.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Selected lines of the output of `npm run quality`, from three places in the output. The summary block is complete, apart from the `exit 1` line that the run's wrapper added after it.

```text
[warn] Code style issues found in 18 files. Forgot to run Prettier?
✖ 33 problems (33 errors, 0 warnings)
Tests:       7 failed, 1 todo, 19 passed, 27 total

Quality summary:
  FAIL  format
  FAIL  lint
  pass  typecheck
  FAIL  test
  pass  build
```

The required group passes, so CI and release do not break.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The summary of `npm run quality -- required`.

```text
Quality summary:
  pass  typecheck
  pass  build
```

The report lists what is pending.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report. The "Pending adoption" table is verbatim, and the other sections are left out.

| Check | Findings now | Note |
| --- | --- | --- |
| format | 18 files | Includes `README.md` and two tsconfig files. |
| lint | 33 errors in 11 files | 21 `no-explicit-any`, 6 `no-unused-vars`, 5 `ban-ts-comment`, 1 `no-namespace`. |
| test | 7 failed of 27 | All 7 in `auth.service.test.ts`. No database was available. |

What you must check in the output:

- The summary has one line for each check, and the exit code is 1 while any pending check fails.
- Each pending check has a count and a note about its cause. In this run the cause of the 7 test failures is not confirmed. Four of the messages are `PrismaClientInitializationError`, and the same 7 tests fail with no environment values at all.
- `git diff --stat -- src e2e` prints nothing. The run changed three files (`.prettierignore`, `package.json`, `project.json`) and added four (`.github/workflows/quality.yml`, `AGENTS.md`, `CONTRIBUTING.md`, `scripts/quality.sh`). `git diff` does not list the four new files. `git status` does.
- The page states what did not run. The run did not execute the CI workflow, the `docker build` command, or the tests against a database. The `docker-build` change is read from the file, and only its `npm run quality -- required` part ran.

## Common mistakes

- You run `prettier --write .` as part of the setup. Rails mode does not format files. The command changes 18 files, including `README.md`, and hides the pending count. Fix findings in later, separate changes.
- You read the red result of `npm run quality` as a failed setup. The skill keeps checks with findings out of required CI. The sample command exits 1 while a pending check fails, because this run wrote the script that way. Use `npm run quality -- required` to see what CI blocks on.
- You make the pending checks required in CI on the first day. A new required step that fails today turns every pull request red. Keep it report-only until the count is zero.
- You format after a build and see one more finding. In this run, Prettier 2.8.8 checked `tmp/api/main-with-require-overrides.js`. This file is gitignored build output. The format count went from 18 to 19 until `/tmp` was ignored. Compare counts from a clean tree, and check each ignore entry against `.gitignore`.
- You treat the test failures as code findings. In this run no database was available, and the cause of each failure is not confirmed. Run the tests against a database before you assign the work.
- You call the CI workflow done. It did not run in this run. Run it on a branch first.

## Next

- [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md): when policy requires a gate verdict on each pull request, after the command exists.
- [Set up a new team repository](lead-set-up-a-new-team-repo.md): when you start a repository from nothing and need conventions and review configuration.
- [Choose tech debt to pay](lead-choose-tech-debt-to-pay.md): when you must rank the pending checks and other debt for the next sprint.
- [Clean up after a feature](dev-clean-up-after-a-feature.md): when a developer fixes the findings of one pending check in a feature.
- [Prepare a release](lead-prepare-a-release.md): for the go or no-go decision on a release.
- [Install for a team](ops-install-for-a-team.md): when the whole team needs the Toolbelt in Claude, Cursor, and Codex.
- [Self-review before a PR](dev-self-review-before-a-pr.md): the developer path that runs before a pull request.
