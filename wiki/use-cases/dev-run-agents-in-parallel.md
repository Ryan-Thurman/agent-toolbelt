# Run two agents in one repository at the same time

This page is for a developer who wants two agents to work in one repository at the same time. You get one separate folder and one branch for each agent, a way to see the state of both, and a clean way to remove them.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`worktree`](../../skills/worktree/SKILL.md) (`/worktree`) | No levels. The skill has no depth setting. | A git repository, `bash` and `git` on your path, and one task name for each agent. |

Skip this page if you are the only agent in the folder. A normal branch is enough then.

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Claim a worktree (a separate folder with its own branch) for each task: `/agent-toolbelt:worktree new --task <task-name>`. Run it once for each agent, with a different `<task-name>` each time.
3. Open a new terminal for each agent. Run the `cd:` line that step 2 printed, then `claude --plugin-dir <toolbelt-folder>`. The session that ran `new` stays in the main folder, so it is not one of the two agents.
4. In each worktree, install the dependencies. For the Conduit example, run these two lines. Another project uses its own install command.

   ```bash
   npm ci --ignore-scripts
   DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate
   ```

   Then let the agent edit and commit inside that folder only.
5. Check both agents with `/agent-toolbelt:worktree list`. A `*` after a branch means uncommitted changes.
6. When a branch is merged, remove its folder: `/agent-toolbelt:worktree rm <branch> --delete-branch`.

You get one folder and one branch for each agent, and the main folder stays on its own branch.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The run starts at commit 30b68e1, on the branch `master`.

You have two independent tasks. A tag change raises the number of returned tags from 10 to 20 in `src/app/routes/tag/tag.service.ts`. A profile change returns an empty bio string when the bio is null, in `src/app/routes/profile/profile.utils.ts`. These two edits are the choice of the run. They stand for any two tasks that touch different parts of the code.

You want an agent on each task now. Both agents work in the same repository folder. If one agent runs `git checkout` in that folder, the branch changes under the other agent.

This run used one shell. It did not start two agent sessions. It ran the skill's commands and made both edits in turn. It did run two `new` commands at the same moment, to test the claim step (see "What you get").

## Why this path

The obvious alternative is one folder with a normal branch for each task. A git checkout has one HEAD (the commit and branch that the folder shows). When agents share a folder, one `git checkout` or `git switch` moves the branch under every other agent. This is the reason that `SKILL.md` gives for the skill. In the run, git also refuses a second checkout of a branch that a worktree already uses (see "What you get").

The second alternative is the `isolation: 'worktree'` option of Claude Code. `SKILL.md` says to use it for parallel fan-out inside one `Workflow` run (a script for the Workflow tool in Claude Code, which starts many agents with `agent()` calls). Claude Code then creates and removes each worktree. Here the two agents are separate sessions, so no `Workflow` run owns them. You must create and remove the folders yourself, and this skill does that work.

A third option is a second clone of the repository. This is practice, not a reason from the skill. Each clone has its own copy of the history and its own remote settings. A second clone costs a full copy of the history on disk and a second fetch to keep it current. A worktree shares the object store (the stored history) of the one repository.

The procedure has this order because each step protects the next one. You claim a folder before the agent starts, so no agent works in the shared folder. The CLI picks a numbered branch name, so calls one after the other do not collide. Calls at the same moment with the same task name can fail (see Decision points). You hand back at the end, so no stale folder stays behind.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir <toolbelt-folder>`. Or install the skill into the project: `./install.sh --harness all worktree <project-folder>`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:worktree` (plugin) or `/worktree` (installed copy) in the list. |
| 2 | In the repository folder, run `/agent-toolbelt:worktree new --task <task-name>`. In the sample, run `new --task tag-change`. | The skill tells each agent to claim a worktree before it starts work in a shared folder. The `--task` word goes into the branch name, so the folder tells you what it is for. | The output has four lines: `worktree:`, `branch:`, `base:`, and `cd:`. The branch is `agent/<task-name>-<n>`. The first one is `-1`. |
| 3 | Run the same command for the second agent with a different task name. In the sample, run `new --task profile-change`. | Each agent needs its own folder and branch. | The second output has a different `worktree:` path and a different `branch:`. |
| 4 | Install the dependencies in each worktree. For the Conduit example, run `npm ci --ignore-scripts`, then `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`. Another project uses its own install command. | A new worktree has only the files that git tracks. In the run, it had no `node_modules`, and `npx jest` failed there with "npx canceled due to missing packages". | `npx jest --version` runs inside each worktree. |
| 5 | Open a new terminal for each worktree, run its `cd:` line, then run `claude --plugin-dir <toolbelt-folder>`. The session that ran `new` is not one of the agents. Tell the agent to edit and commit in that folder only. | The skill says to work there only, and to push from inside the worktree. | `git branch --show-current` in each folder prints that agent's branch. |
| 6 | Check the state: `/agent-toolbelt:worktree list`. For all repositories in the parent folder, run `list --all`. Other projects in that folder appear too. | You see each folder, its branch, and a `*` when it has uncommitted changes. | The listing shows the main folder and one line for each agent. |
| 7 | Run the tests in each worktree. In the sample, run `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/profile.service.test.ts` in the profile worktree. | Each agent proves its own change in its own folder. | The test has a result. This test uses the Prisma mock, so it needs no database. |
| 8 | Hand back each task. If the branch is merged, run `/agent-toolbelt:worktree rm <branch> --delete-branch`. If it is not merged, run the same command and report the kept branch to the next owner. | The skill is complete when the worktree is removed, or its path and branch are reported. | `list` shows no folder for the task, and `git branch --list "agent/*"` shows only the branches that you chose to keep. |
| 9 | After you delete a worktree folder by hand, run `/agent-toolbelt:worktree prune`. | Git keeps metadata for the deleted folder. `prune` clears it. | `git worktree list` has no `prunable` entry. |

## Decision points

- If you are the only agent in the directory and a normal branch is enough, skip this page. `SKILL.md` says to skip the skill in that case.
- If the two tasks run inside one `Workflow` run, use `isolation: 'worktree'` on the `agent()` calls instead. Claude Code creates and removes the folders.
- If you want your own branch name, pass the repository first: `new . <branch>`. A branch alone fails, because the CLI reads the first value as the repository. The run shows this (see "What you get"). An existing branch name fails with "branch already exists".
- If two agents start at the same moment, give them different task names. In the run, two calls with the same task name failed for one caller in 3 of 3 attempts. Two calls with different names all worked. If a call fails with a git error, run it again. This advice is practice, not a rule from the skill.
- If `rm` refuses because of uncommitted changes, commit or stash first. Pass `--force` only when you want to discard the changes.
- If `rm --delete-branch` keeps the branch, the branch is not merged. Merge it, or report it to the next owner. Pass `--force` only when you want to delete unmerged commits.
- If the two tasks edit the same files, a worktree does not prevent the merge conflict. It isolates the checkouts only. This is practice, and the run did not test it. The run merged only the tag branch.
- Stop when each task has its worktree removed, or its path and branch reported.
- Choose [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) when the two tasks are phases of one ticket.
- Choose [Run agents without a person](ops-unattended-agent-runs.md) when the agents run on a schedule or in CI and nobody reads the `cd:` line.

## What you get

The run was headless. The excerpts ran the CLI directly (`bash skills/worktree/bin/worktree.sh`). The `/agent-toolbelt:worktree` slash command, the `/worktree` command of an installed copy, and `install.sh` were not run. The run also did not run `npm ci` or `prisma generate` in the worktrees. It linked `node_modules` from a prepared copy, so step 4 and its check `npx jest --version` were not executed. The skill files did not change after this run (last change `fcfa0e7`). Check this page again when a worktree fix merges. The skill asks no question, so no default was used. The skill manages checkouts only. The run pushed nothing and opened no pull request. The run did not execute any test that needs a database. It ran the profile service test with the Prisma mock (6 of 6 passed). The tag service test file has one `todo` test, so it checks nothing.

The folder holding the repository was named `repo` in this run. The worktrees go to a `.worktrees` folder next to it. The excerpts show `<parent>` for the folder that holds the repository. Your path has your own repository name.

First, the claim for the tag task.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the path prefix is shortened to `<parent>`, and the two progress lines that git prints are left out. The other lines are verbatim.

```text
$ bash skills/worktree/bin/worktree.sh new --task tag-change
worktree: <parent>/.worktrees/repo/agent-tag-change-1
branch:   agent/tag-change-1
base:     master
cd:       cd "<parent>/.worktrees/repo/agent-tag-change-1"
exit=0
```

The skill prints the status lines to stderr and the result lines to stdout. The `cd:` line is ready to run. The second claim gave `agent/profile-change-1` in the same way.

Next, the state with both agents at work. Each agent changed one line and had not yet committed.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the path prefix is shortened to `<parent>`, and the spacing between the columns is shortened.

```text
$ bash skills/worktree/bin/worktree.sh list
  <parent>/repo                            master
  <parent>/.worktrees/repo/agent-profile-change-1  agent/profile-change-1 *
  <parent>/.worktrees/repo/agent-tag-change-1      agent/tag-change-1 *
```

The main folder stayed on `master` with no changes. Each agent had its own diff. After the commits, each branch had one commit on top of `30b68e1`, and the main folder still showed `30b68e1`.

Then the refusals that protect the other agent. These are the lines to check in your own output.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the path prefixes are shortened to `<parent>`. The two refusals come from two output files (07 and 08). The exit lines and the notes in parentheses are the run's own.

```text
$ worktree.sh rm agent/tag-change-1   (uncommitted change in the worktree)
worktree: worktree has uncommitted changes:
  <parent>/.worktrees/repo/agent-tag-change-1
  (commit/stash, or pass --force to discard)
exit=1
$ git checkout agent/tag-change-1   (in main tree)
fatal: 'agent/tag-change-1' is already used by worktree at
  '<parent>/.worktrees/repo/agent-tag-change-1'
exit=128
```

Last, the hand back. The profile branch was not merged, so the CLI removed the folder and kept the branch. The run then merged the tag branch into `master` in the copy, with a local merge. The second command then deleted that branch.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run output: the path prefixes are shortened to `<parent>`. Lines are wrapped. The local `git merge --ff-only` between the two commands, the exit lines, and the notes `(branch not merged)` and `(branch merged)` are left out.

```text
$ worktree.sh rm agent/profile-change-1 --delete-branch
kept branch agent/profile-change-1 (not fully merged; rerun with --force
 to delete it)
removed worktree: <parent>/.worktrees/repo/agent-profile-change-1
branch:           agent/profile-change-1 (kept)
$ worktree.sh rm agent/tag-change-1 --delete-branch
removed worktree: <parent>/.worktrees/repo/agent-tag-change-1
branch:           agent/tag-change-1 (deleted)
```

What you must check in the output:

- Each agent has its own `worktree:` path and its own `branch:`. The two must differ.
- The main folder shows its original branch in `list`, and no `*`.
- A `*` in `list` means that folder has uncommitted changes. Do not remove it until the agent commits.
- After the hand back, `list --all` shows only the main folder, and `git branch --list 'agent/*'` shows only the branches that you chose to keep.

The run also found two limits. The `cli.md` reference says that two agents with an auto branch name get different suffixes. In the run, two calls at the same moment with the same task name gave one success and one failure. The run saw this in 3 of 3 attempts. The failure text was `fatal: a branch named 'agent/same-task-1' already exists` in attempt 1, and `fatal: cannot lock ref 'refs/heads/agent/same-task-1': reference already exists` in attempts 2 and 3. Both exited with 255. No checkout was damaged. The second limit is the branch-only call. `new agent/brand-new` printed `worktree: no such directory: agent/brand-new`. `cli.md` and `commands/worktree.md` still describe `new [repo] [branch]` with both optional.

## Common mistakes

- You run `git checkout` for another branch in the shared folder. This is what the skill exists to prevent. Create a worktree instead.
- You start the agent in the main folder, not in the worktree. The agent then edits the shared files. Open the session in the path of the `cd:` line.
- You run the tests in a new worktree and see "missing packages". A new worktree has no `node_modules`. Install the dependencies there first.
- You pass a branch name with no repository. The CLI reads it as a repository path and stops. Use `new . <branch>`.
- You pass `--force` to `rm` to get rid of a refusal. `--force` discards uncommitted changes. Commit or stash first.
- You delete a worktree folder with `rm -rf`. Git keeps the metadata, and `git worktree list` shows the folder as `prunable`. Run `prune`. The branch stays, so delete it if you do not need it.
- You expect `list --all` to show only your repository. It lists every git repository in the parent folder. Other projects in that folder appear too.

## Next

- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): when the parallel tasks are phases of one ticket.
- [Swap a library everywhere](dev-swap-a-library-everywhere.md): when one change must run in many places, with a worktree for each unit inside one run.
- [Survive a context reset](dev-survive-a-context-reset.md): when an agent in a worktree loses its context and another session must continue.
- [Run agents without a person](ops-unattended-agent-runs.md): when no person watches the agents.
