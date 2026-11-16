# Install the Toolbelt for a team across several repositories

This page is for a platform engineer who installs the Toolbelt for a team that uses Claude Code, Cursor, and Codex in several repositories. You install the same files into every repository in one folder with one command, and you can run that command again without damage.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Platform engineer | `install.sh` with `--harness`, `--sweep`, and `--dry-run`. Plugin mode from [Installation](../Installation.md). | No levels. The installer has no depth setting. | A clone of the Toolbelt, and one folder that holds your repositories side by side. |

Terms: a harness is one host (`cursor`, `claude`, or `codex`). A pack is one group of skills and files. `--sweep` installs into the folder and into each repository directly under it. In the command below, `--harness all` is the host list, and the word `all` after `--sweep` is the pack list. The last argument is the target folder.

## Quick path

1. Clone the Toolbelt once and open its folder in a terminal: `git clone <toolbelt-repository-url> <toolbelt-folder>`.
2. Preview the install: `./install.sh --dry-run --harness all --sweep all <workspace-folder>`. The command writes no file.
   The pack `all` leaves out the opt-in Cursor hooks, which change what Cursor users see on `git commit` and `git push`. Name `cursor-hooks` in the pack list only when you want them. See the first point in Decision points.
3. Save and filter the preview: add `> preview.txt 2>&1` to the command in step 2, and run it from the Toolbelt folder. Then run `grep -E 'Packs:|Sweep targets|child repo|AGENTS.md|CLAUDE.md' preview.txt`. The file has more than 2300 lines, so read only these lines. Each target ends with a total, such as `596 to create, 0 to change, 0 same, 0 skipped`. Make sure that each of your repositories appears as `(child repo)`. You can delete `preview.txt` afterwards.
4. Install for real. Run the same command without `--dry-run`.
5. In each repository, run `git status --short`, review the new files, and commit them.

You get one identical install in the folder and in each repository under it. A second run creates and updates no file. Each target showed `0 created, 0 updated, 596 skipped`, and the `AGENTS.md` and `CLAUDE.md` blocks print `= unchanged`.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The folder `workspace` holds two separate clones of the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The clones are `conduit-api` and `conduit-admin`, and both are at commit 30b68e1. The folder `workspace` is not a repository. In this run the two clones stand for two services of one team.

Some of your people use Claude Code, some use Cursor, and some use Codex. You want one install that works for all three, and you want to repeat it when the Toolbelt changes.

One repository already has team text. Before the install, `conduit-admin` got an `AGENTS.md` file with the text "Run npm test before you push." This is a setup choice of the run. It shows what happens to existing instructions.

The run used a clean checkout of the Toolbelt at commit 8ac3e11 (plugin version 1.3.0).

## Why this path

The obvious alternative is plugin mode only: each person runs `claude --plugin-dir <toolbelt-folder>`, or the Codex equivalent, once. This is the primary path in [Installation](../Installation.md), and it needs no change in your repositories. It costs you three things here.

- The plugin exposes 44 skills, 0 commands, and 0 hooks (Installation, "Cross-host plugin"). The `/command` entries, the `AGENTS.md` and `CLAUDE.md` pointers, and the Cursor routing rule exist only with `install.sh`.
- Each person installs for themselves. Nothing in the repository pins a version, so two people can run different versions. This is practice, not a statement in the Toolbelt docs.
- Cursor's public marketplace is not approved. The Toolbelt docs say that publishing has not been performed. Cursor users need `cursor-agent --plugin-dir` or `install.sh` in any case.

The compatibility installer answers this: use it "when a project needs local commands, templates, workflow files, rules, or opt-in hooks". With `--sweep`, one run covers the parent folder and every immediate child repository. Without it, you repeat the command for each repository, and the parent folder gets no shared files.

The steps have this order for two reasons. The real install writes about 590 files into each folder, so you preview first. The installer also requires `--harness`, so you choose the hosts before you start.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Clone the Toolbelt: `git clone <toolbelt-repository-url> <toolbelt-folder>`. Then run `cd <toolbelt-folder>` and `./install.sh --list`. | The installer lives in the Toolbelt clone, and the list shows the pack names. | The list prints the packs, with one line for each pack. |
| 2 | Put your repositories side by side under one parent folder, for example `<workspace-folder>/<repo-a>` and `<workspace-folder>/<repo-b>`. | `--sweep` finds only immediate child folders that have a `.git` entry. | `ls -a <workspace-folder>/<repo-a>` shows `.git`. |
| 3 | Preview the install: `./install.sh --dry-run --harness all --sweep all <workspace-folder>`. Save the output: add `> preview.txt 2>&1`. The file lands in the Toolbelt folder, so delete it when you are done. | The preview shows the targets and the packs before any file exists. | The output ends with `Dry run complete.` and no `.agents/` folder exists in your repositories. |
| 4 | Read the preview. Check the "Sweep targets" lines, the "Packs:" line, and the line for any `AGENTS.md` that you already have. | A folder without `.git` gets no files. The installer prints a `skipped (not a git repository)` line for it. | Each repository has a `(child repo)` line. An existing `AGENTS.md` shows `would update AGENTS.md block`. |
| 5 | Install: `./install.sh --harness all --sweep all <workspace-folder>`. | This writes the files for all three hosts into the parent and each repository. | The last line is `Install complete.` and each target shows a `created` count. In this run each target showed 587 or 588 created. The preview total (596) equals created plus skipped. |
| 6 | Check each repository: `git -C <repo> status --short`, `ls <repo>/.agents/skills \| wc -l`, and `grep -c 'BEGIN agent-toolbelt' <repo>/AGENTS.md`. | A repository that you open alone must carry its own files. | The skill folder count equals the number of folders in `<toolbelt-folder>/skills` (44 in this run), and the grep count is 1. |
| 7 | Run the install command from step 5 again. | The rerun shows that the install is safe to repeat. | Each target shows `0 created, 0 updated, 596 skipped` in this run, and each block prints `= unchanged`. |
| 8 | Review the new files in each repository and commit them. This is practice, not a Toolbelt rule. | A committed install gives every clone the same files and the same version. | `git status --short` is clean after the commit. |
| 9 | For people who want no files in the repository, give them plugin mode: `claude --plugin-dir <toolbelt-folder>` for Claude Code. For Codex, run the two `codex plugin` commands on the Installation page. | These people get the skills without repository files. | In Claude Code, `/agent-toolbelt:` lists the skills. In Codex, `/skills` lists them. |

## Decision points

- If you do not want Cursor commit and push prompts, do not name `cursor-hooks` in the pack list. `all` leaves it out: the run's preview and install wrote no `.cursor/hooks.json` and no hook script. If you name it (`./install.sh --harness cursor cursor-hooks <repo>`), the pack writes eight files in the run: `.cursor/hooks.json`, two hook scripts, the router rule, the `AGENTS.md` block, and three shared contract files under `.agents/shared/contracts/`. A repository that already has a `.cursor/hooks.json` keeps it, and the installer prints the two entries to merge and marks the pack `Not wired`. The hooks ask for confirmation and never block (see [Code-Review](../Code-Review.md#cursor-hooks)). To turn them off, set `TOOLBELT_DOC_CHECK=0` and `TOOLBELT_REVIEW_NUDGE=0` (Code-Review). This run tested neither variable.
- Do not leave `cursor` out of `--harness` to avoid the hooks. Then Cursor users get no Cursor files: no `.cursor/commands`, no router rule, and no Cursor pointer in `AGENTS.md` (Installation, harness table). The shared `.agents/` folder still installs for the other hosts. This run did not test it.
- If everyone uses one host and no repository needs commands or templates, stop here and use plugin mode from [Installation](../Installation.md).
- If some people use only one host, pass only that host, for example `--harness claude`. The installer then writes only that host's files and the shared `.agents/` folder. This run did not test a single-host install.
- If a repository already has an `AGENTS.md` or `CLAUDE.md`, rerun is safe. The installer replaces only the text between its two markers and keeps the rest. In this run, the team line stayed. If `CLAUDE.md` is a symlink to `AGENTS.md`, the installer writes through the link and the file gets one block (Installation). This run did not test the symlink.
- If installed files already exist, the installer skips them. A rerun does not update them. After you update the Toolbelt clone, review local edits first, then rerun with `--force`. The flag overwrites each file that you select, including local edits. It also replaces a `.cursor/hooks.json` that your team edited, although a normal run skips that file. Copy it first, or merge by hand (see [Code-Review](../Code-Review.md#cursor-hooks)). The `--force --dry-run` preview marks each file as `= same`, `~ would change`, or `+ would install`. Read the `would change` lines to see which local edits the run removes.
- If your repositories are not direct children of one folder, run the installer once for each parent. A plain folder gets a `skipped (not a git repository)` line. A repository two levels down gets no files: its parent folder gets the `skipped` line, the nested repository is not named, and a note says that the sweep reaches immediate children only.
- If your people use Cursor with several repositories in one workspace, expect that only the top root's `AGENTS.md` loads reliably. The Installation page documents this limit. Open one repository as the project, or move the always-on rules to Cursor User Rules. This run did not test it.
- If your team members are not developers, the Installation page names the macOS `install.command` wrapper. It asks the same questions. This run did not use it.
- Stop when each target shows one skill folder for each skill in `<toolbelt-folder>/skills` (44 in this run), one marker block, and `0 created` on the rerun. Then read the "Not executed" list below.
- Choose [Set up a new team repository](lead-set-up-a-new-team-repo.md) when you also need repository policy files, such as the style guide and `.pr-review.md`. The installer creates no policy file.
- Choose [Run Cursor hooks](ops-cursor-hooks.md) when you want to understand or tune the hooks that an install with `cursor-hooks` adds.

## What you get

The run installed all standard packs for all three hosts into the parent folder and into both clones. The preview wrote nothing. The real install ran once. The rerun ran twice, and one of those runs came after a local edit. The counts below are from this run, which used the installer at commit 8ac3e11.

The first block is the head of the preview.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the Toolbelt at commit 8ac3e11. Condensed from the run output: the "Packs:" line and the note line are left out, and the long run folder prefix is cut from each path.

```text
Harness: cursor claude codex
Cursor rules: minimal
Mode: dry run

skipped (not a git repository): workspace/sweep-check
Sweep targets:
  workspace  (parent / workspace root)
  workspace/conduit-admin  (child repo)
  workspace/conduit-api  (child repo)
```

The parent folder is a target as well, although it is not a repository. The `sweep-check` folder is a plain folder that this run added, and the installer names it as skipped. The "Packs:" line lists 44 packs and does not hold `cursor-hooks`. Next, the preview lines for the repository that already had team text.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the Toolbelt at commit 8ac3e11. Condensed from the run output: the long run folder prefix is cut from each path.

```text
~ would update AGENTS.md block: workspace/conduit-admin/AGENTS.md
+ would create CLAUDE.md: workspace/conduit-admin/CLAUDE.md
  (dry run) workspace/conduit-admin: 595 to create, 1 to update, 0 skipped.
```

The real install and the rerun print one summary line for each target. First, the install, from `02-install.txt`.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the Toolbelt at commit 8ac3e11. Condensed from the run output: the long run folder prefix is cut, and only the three summary lines remain. The `Install complete.` line is left out.

```text
  workspace: 588 created, 0 updated, 8 skipped.
  workspace/conduit-admin: 587 created, 1 updated, 8 skipped.
  workspace/conduit-api: 588 created, 0 updated, 8 skipped.
```

Next, the rerun, from `03-rerun.txt`.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the Toolbelt at commit 8ac3e11. Condensed from the run output: the long run folder prefix is cut, and only the lines for `conduit-api` remain.

```text
= unchanged: AGENTS.md block in workspace/conduit-api/AGENTS.md
= unchanged: CLAUDE.md block in workspace/conduit-api/CLAUDE.md
  workspace/conduit-api: 0 created, 0 updated, 596 skipped.
```

On the first run, the 8 skipped files are files that an earlier pack in the same run already wrote. The preview does not predict this split: it printed `596 to create, 0 skipped` for the same target. The marker block count stayed at 1, and the `git diff` of `AGENTS.md` stayed at 10 added lines.

Last, the `git diff` of the `AGENTS.md` file that had team text.

Excerpt from a run on the Conduit sample API at commit 30b68e1, with the Toolbelt at commit 8ac3e11. Condensed from the run output: only the changed lines and the context lines of the diff remain.

```diff
 # Team notes
 
 Run npm test before you push.
+
+<!-- BEGIN agent-toolbelt -->
+Before writing for the user, read
+`.agents/shared/contracts/references/human-readable-output.md`.
+For project documents, also read
+`.agents/shared/contracts/references/docs-writing.md`.
+
+Use a matching installed skill in `.agents/skills/` when the task needs its workflow.
+Read its `SKILL.md`, then load the references and templates that it specifies.
+<!-- END agent-toolbelt -->
```

The numbers below come from the saved output and the installed folders. The installer printed the totals in the preview and in the install. The first four rows are counts that the run made by hand.

| Check | Result in this run |
| --- | --- |
| `would install` lines in the preview | 1782, which is 594 for each of 3 targets |
| Distinct files under `.agents/`, `.claude/`, and `.cursor/` in `conduit-api` | 586 |
| Skill folders under `.agents/skills/` | 44, which equals the 44 `SKILL.md` files in the Toolbelt `skills/` folder |
| Commands in `.claude/commands/` and in `.cursor/commands/` | 64 in each (a folder count). The Toolbelt `commands/` folder holds 65 files, and one is `README.md`. The numbers change as the Toolbelt grows. |
| `git status --short` in `conduit-api` | `.agents/`, `.claude/`, `.cursor/`, `AGENTS.md`, `CLAUDE.md`, all untracked |
| `git status --short` in `conduit-admin` | `AGENTS.md` modified. The other four are untracked. |
| Install without `--harness` | Exit code 2: `install: --harness is required (no implicit default).` |
| Local edit to `.cursor/rules/agent-toolbelt-router.mdc`, then a rerun without `--force` | The edit stayed. |
| The same rerun with `--force` and `--dry-run` | 1782 lines `would overwrite` (`594 to update` for each target), with no way to tell which files differ. The run did not apply it. |
| `claude plugin validate <toolbelt-folder>` | `Validation passed`, with advice only. The validator found no icon and no marketplace install line in the READMEs. |

What you must check in the output:

- Each repository that you own has a `(child repo)` line. A repository that is missing from the list gets no files.
- The "Packs:" line shows whether `cursor-hooks` is in the install. Decide before you run for real.
- A repository with an existing `AGENTS.md` or `CLAUDE.md` shows `would update ... block`, not `would create`.
- The rerun shows `0 created` and `0 updated`. A rerun that creates files means that some files were missing. Read which files it created.

Not exercised in this run. Each item names the evidence that verifies it:

- Cursor or Codex finding the installed skills, rules, and commands. Evidence: start each host in a repository and run one installed command, such as `/pr-review`, then save the host's reply.
- Plugin mode. Evidence: run `claude --plugin-dir <toolbelt-folder>` and see `/agent-toolbelt:` list the skills. The run ran `claude plugin validate` only. It ran no `claude plugin marketplace add`, `claude plugin install`, or `codex plugin` command, because they change the user's own host configuration.
- The Cursor hooks firing. Evidence: with `cursor-hooks` installed and merged, run `git commit` with code changes and no documentation change in Cursor, and see the confirmation prompt.
- Committing the installed files. Evidence: `git status --short` is clean after the commit, and a fresh clone holds the files. Nobody committed or pushed in the sample repositories.
- A Toolbelt update with `--force`. Evidence: run it after an update, then read `git diff` in each repository. The run only previewed it.

## Common mistakes

- You omit `--harness`. The installer stops with exit code 2 and writes nothing, because it has no default. Add `--harness all`, or name the hosts that your team uses.
- You try a command without `--dry-run` "just to see". The installer then creates a missing target folder and installs into it. In an earlier run of this page, a probe command without `--dry-run` created a missing target folder, and the run deleted it. The run that this page quotes used `--dry-run` for its probe, and the folder was not created. Check the command line for `--dry-run` before you press Enter.
- You expect `all` to include every pack. It leaves out opt-in packs such as `cursor-hooks`, so name them in the pack list when you want them. Read the "Packs:" line in the preview.
- You expect a repository two levels down, or a folder with no `.git`, to be a target. The installer prints a `skipped (not a git repository)` line for a folder with no `.git` and a depth note for the sweep. It does not name a repository two levels down. Compare the "Sweep targets" list with your repository list.
- You rerun to pick up a new Toolbelt version and see `0 created`. The installer skips existing files unless you pass `--force`. Review local edits, then use `--force`.
- You commit nothing and leave about 590 untracked files in each repository. Each person who clones the repository then has no Toolbelt files. Commit them, or ignore them on purpose.
- You treat the file listing as proof that every host works. The run did not start Cursor or Codex.

## Next

- [Set up a new team repository](lead-set-up-a-new-team-repo.md): when the install is done and the repositories need a style guide and a `.pr-review.md` file.
- [Set up quality rails](lead-set-up-quality-rails.md): when you want checks that block a pull request.
- [Run Cursor hooks](ops-cursor-hooks.md): when the install added `.cursor/hooks.json` and you want to tune it.
- [Review every pull request on open](ops-review-every-pr-on-open.md): when the team wants an automatic review for each new pull request.
- [Enforce a pre-pull-request gate](ops-enforce-a-pre-pr-gate.md): when documentation must be current before a pull request opens.
- [Run agents in parallel](dev-run-agents-in-parallel.md): when several agents share one folder.
