# Add commit and push checks for Cursor users

This page is for a platform engineer whose team uses Cursor. You install two advisory Cursor hooks into a repository. One hook asks for a confirmation when a commit changes code but no documentation. The other hook reminds the team to run `/pr-review` before a push. Both hooks are advisory: they ask, and they never block. Both hooks are fail-open: on a hook error, the action goes ahead.

The run used Toolbelt commit 695056c plus uncommitted edits. Check the page again after the installer files change.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Platform engineer | The `cursor-hooks` pack. It has no skill and no slash command. It installs `.cursor/hooks.json` and two Bash scripts. See [Code Review](../Code-Review.md) for the pack description. | No levels. | A clone of the Toolbelt, a Git repository, Cursor on each machine, and Bash and Git on each machine or cloud agent. |

## Quick path

1. In the Toolbelt folder, run: `./install.sh --harness cursor cursor-hooks <project-folder>`. In the sample, the folder is a copy of the Conduit API.
2. If `<project-folder>/.cursor/hooks.json` already existed, the installer skips it. Copy the two entries from `optional/cursor-hooks/hooks.json` into your file by hand.
3. Test each script from the project folder. Stage one tracked code file that has a real change: `git add <code-file>`. Then run: `echo '{"command":"git commit -m x"}' | bash .cursor/hooks/doc-sync-guard.sh`. Expect `"permission":"ask"`.
4. Test the push hook: `echo '{"command":"git push"}' | bash .cursor/hooks/review-nudge.sh`. Expect `"permission":"ask"`.
5. Unstage the test files: `git restore --staged <code-file>`. Stage the installed files with `git add .cursor AGENTS.md .agents`, and commit them in one commit. Open the project in Cursor. Make sure that the Hooks tab in Customize lists both hooks. The run did not check this step.

You get two hooks that are meant to ask before `git commit` and `git push` in the Cursor agent. The run sent input to the scripts directly. It did not run Cursor, so it did not observe the prompt in Cursor. Both hooks are advisory, and neither hook blocks a command.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). Your team uses Cursor agents on this repository. The agents commit and push code on their own. You want two team rules to show up at the right moment:

- A commit that changes code also updates documentation, or the author says why not.
- A branch gets a `/pr-review` before it leaves the machine.

You do not want a hard block. A hard block stops a run when the rule does not fit. You also want the rules in version control, so that every developer and every cloud agent gets them.

This page covers the project-level hooks. You do not need a Cursor session to check that the scripts work. You do need one to check that Cursor loads them (see "What the run did not cover").

## Why this path

The first alternative is the PR-open check. The command `/pr-ready-check` assesses a change against the project's pull request requirements. One requirement row is "Affected documentation is updated, or the report explains why no update is needed" (`ready-check.md` in the `pr-review` skill). That check runs after the code is committed and pushed. The author fixes a missing doc later, in another commit. The commit hook asks while the author still has the change open. This reason is practice, not a statement in the pack.

The second alternative is [`review-on-open`](../../skills/review-on-open/SKILL.md). It starts `/pr-review` automatically when a PR opens or updates. It needs a CI job or a poller. The page [Review every PR when it opens](ops-review-every-pr-on-open.md) shows that setup. The push hook is cheaper. It needs no CI, and it only reminds a person or an agent. It does not run a review.

The third alternative is a hard block. Per the Cursor hooks docs (read 2026-11-15), `deny` is a hook output, so you can write your own hook that blocks. The Toolbelt hooks never return `deny`. The wiki describes them as advisory and fail-open: the scripts return `allow` or `ask`. As practice, not a statement in the pack: a false positive then costs one confirmation and never a stuck agent.

The pack installs two separate scripts. The hooks run only when `.cursor/hooks.json` points at the scripts. The installer always places the scripts. It places `hooks.json` only when none exists.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Open the Toolbelt folder. Preview the install: `./install.sh --dry-run --harness cursor cursor-hooks <project-folder>`. | You see every file before the installer writes it. The dry run creates nothing. | The list names `.cursor/hooks.json`, two scripts under `.cursor/hooks/`, a Cursor rule, `AGENTS.md`, and three files under `.agents/shared/contracts/`. |
| 2 | Install: `./install.sh --harness cursor cursor-hooks <project-folder>`. | The `--harness cursor` flag is required. The hooks are Cursor-only. | The installer prints `8 created, 0 updated, 0 skipped.` If it prints `skip existing` for `hooks.json`, go to step 3. |
| 3 | If `.cursor/hooks.json` already exists, add the two `beforeShellExecution` entries from `optional/cursor-hooks/hooks.json` to your file. | The installer never overwrites your hooks. The scripts are installed but not wired until you merge. | `.cursor/hooks.json` lists `doc-sync-guard.sh` with the matcher `git commit` and `review-nudge.sh` with the matcher `git push`. |
| 4 | Stage one tracked code file that has a real change: `git add <code-file>`. Run `echo '{"command":"git commit -m x"}' \| bash .cursor/hooks/doc-sync-guard.sh` from the project folder. | You see the decision without Cursor. The script reads the hook input on standard input. | The output has `"permission":"ask"`. |
| 5 | Stage a documentation file next to the code file: `git add <doc-file>`. Run the same command. | You check the pass case. Case D6 (code and README staged) is the run evidence. A `README`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG`, `docs/` file, or any `.md`, `.mdx`, `.rst`, or `.adoc` file counts as documentation. | The output is `{"permission":"allow"}`. |
| 6 | Run `echo '{"command":"git push"}' \| bash .cursor/hooks/review-nudge.sh`. Then unstage the test files: `git restore --staged <code-file> <doc-file>`. | The push hook always asks, unless you bypass it. Test files that stay staged go into the install commit in step 8. | The output has `"permission":"ask"`, and `git diff --cached --name-only` lists no test file. |
| 7 | Decide the bypass rules for your team. Tell the team about `[skip-docs]` (in the commit message) and `[skip-review]` (in the push command). The run checked both tokens. `TOOLBELT_DOC_CHECK=0` and `TOOLBELT_REVIEW_NUDGE=0` also work on the script, but the run did not check that Cursor passes them to a hook. The push prompt text names only `TOOLBELT_REVIEW_NUDGE=0`, and `[skip-review]` also works. | The hooks are advisory. A person or agent with a good reason needs a way past them. | Your team's contributing guide lists the tokens that the run checked. |
| 8 | Stage the installed files: `git add .cursor AGENTS.md .agents`. Commit them in one commit that includes `AGENTS.md`. Push the branch. | The hooks reach every developer and every cloud agent through version control. | `git ls-files .cursor` lists `hooks.json` and both scripts. The run did not do this step. |
| 9 | Open the project in Cursor. Open the Hooks tab in Customize, and the Hooks output channel. Ask an agent to commit a code-only change. | Cursor, not the script, decides when a hook runs. This is the only step that proves the wiring. The Hooks tab, the Hooks output channel, and the dialog come from the Cursor docs, not from the run. | The Hooks tab lists both hooks, and the agent run shows the confirmation. The run did not do this step. |

## Decision points

- If the project already has `.cursor/hooks.json`, merge the two entries by hand. The installer keeps your file and prints only `skip existing`.
- If you do not use Cursor, skip this page. The run checked `--harness claude` only: it printed `cursor-hooks installed nothing for harness 'claude'`. The installer gates the pack on the `cursor` harness in `install/lib.sh`, so the same result is expected for `codex`. That install still wrote `CLAUDE.md` and the three contract files (4 created).
- If a commit is only a lockfile, an image, or a documentation change, expect `allow`. The script ignores lockfiles, images, snapshots, and source maps (see `optional/cursor-hooks/doc-sync-guard.sh` for the full list), and it treats any `.md` file as documentation.
- If an agent runs `git add -A && git commit -m "..."` as one command, the fixed guard reads the files that the add stages, and it asks when the change has code and no docs. The run used the earlier guard, which returned `allow` here. Do not treat the hook as a guarantee. Keep the PR-open check as the gate.
- If your team needs a block, not a prompt, write your own hook that returns `deny`. The pack does not provide one.
- If the commit hook cannot read the project folder, expect `allow`. The run gave `allow` when the folder was not a Git repository (D16) and when it did not exist (D17). Per the Cursor hooks docs (read 2026-11-15), Cursor also fails open on a crash or timeout unless the hook sets `failClosed`. The run did not check `failClosed`.
- Stop when steps 4 to 6 give the expected output and the Hooks tab in Cursor lists both hooks.
- Choose [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md) when the team needs a gate that produces a status record at PR open.
- Choose [Review every PR when it opens](ops-review-every-pr-on-open.md) when you want the review to run, not only to be suggested.
- Choose [Install for a team](ops-install-for-a-team.md) when you roll out more than this pack.

## What you get

The run was headless. No Cursor session ran. A script sent a constructed hook input to each hook, in a copy of the sample at commit 30b68e1. The input has the fields that Cursor documents for `beforeShellExecution` (`command`, `cwd`, `workspace_roots`, `sandbox`, `hook_event_name`, and the conversation IDs). The scripts only search the text for `git commit` or `git push`, so the other fields do not change the result. The run never committed and never pushed.

Here is the answer for a code-only commit.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Case D2 stages one code file, `src/app/routes/auth/auth.service.ts`, and no documentation.

```text
D2 | doc-sync-guard.sh | code staged, no docs | cmd=git commit -m "fix: x" | exit=0 | permission=ask
    output: {"permission":"ask","user_message":"Code changed but no docs were updated in this commit (README, docs/**, *.md, AGENTS.md, CLAUDE.md). Update the relevant docs, or approve to commit anyway. Bypass: add [skip-docs] to the commit message.","agent_message":"Code changed but no docs were updated in this commit (README, docs/**, *.md, AGENTS.md, CLAUDE.md). Update the relevant docs, or approve to commit anyway. Bypass: add [skip-docs] to the commit message."}
```

The `user_message` field is the text that the person sees. The `agent_message` field goes to the agent. The text is the same in both. The case IDs D1 to D19 (commit hook) and R1 to R8 (push hook) are the run's own labels. They are not part of the pack.

Next, the cases that decide how far you can trust the commit hook.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report `03-hook-runs.txt`. The script name, the exit code, and the output text are left out. The rows D1, D4, D5, D7, D8, and D16 to D18 are also left out. The `cmd=` prefix is dropped and commands are in code format. The rest of each cell is verbatim.

| Case | Description | Command | Permission |
| --- | --- | --- | --- |
| D2 | code staged, no docs | `git commit -m "fix: x"` | ask |
| D3 | code staged, [skip-docs] in message | `git commit -m "fix: x [skip-docs]"` | allow |
| D6 | code and README staged | `git commit -m "fix: x"` | allow |
| D9 | code modified, NOT staged, commit -am | `git commit -am "fix: x"` | ask |
| D10 | code modified, NOT staged, commit --all | `git commit --all -m "fix: x"` | ask |
| D11 | code modified, NOT staged, flag after message | `git commit -m "fix: x" -a` | allow |
| D12 | code modified, NOT staged, plain commit | `git commit -m "fix: x"` | allow |
| D13 | code modified, path-limited commit | `git commit src/app/routes/auth/auth.service.ts -m "fix: x"` | allow |
| D14 | chained add and commit (add has not run yet) | `git add -A && git commit -m "fix: x"` | allow |
| D15 | git -C form | `git -C . commit -m "fix: x"` | allow |
| D19 | only .cursor/hooks.json staged | `git commit -m "chore: add hooks"` | ask |

In D11, D13, D14, and D15, the code changed and no docs changed, but the guard returned `allow`. The earlier guard read only the files that are staged when the hook runs. Only when nothing is staged does it read tracked changes, for the `-a`, `--all`, and `-am` forms. With one file staged and `-a`, the unstaged files are not checked. The `-am` match is a text match, so a message that contains `-am` also triggers the read. In D14 nothing is staged yet, because `git add` runs after the hook. The fixed guard reads the files that this add stages. The run did not repeat D14 with the fixed guard. The form `-a` after the message (D11) is not recognized. A commit with a path (D13) commits that file without staging it. The script text match for `git commit` does not match `git -C . commit` (D15). The run did not check whether Cursor's matcher fires for that form. Case D12 is correct: a plain `git commit` with nothing staged commits nothing.

The push hook gave `ask` for three commands: `git push origin feat/x` (R1), `git commit -m "x" && git push` (R5), and `git push --force-with-lease` (R6). It gave `allow` when the command contained `[skip-review]` (R2), when the run set `TOOLBELT_REVIEW_NUDGE=0` on the script (R3), and for `git -C . push` (R7). R7 is a script text match. The run did not check Cursor's matcher. It also gave `ask` for `echo "run git push later"` (R8), because the earlier script matched the text anywhere in the input. The fixed script matches `git push` only at the start of a command, so it returns `allow` for R8. The run did not repeat R8 with the fixed script.

What you must check in the output:

- Each output is one valid JSON line. The run parsed all 27 outputs.
- The permission is `allow` or `ask`. The run saw no `deny`.
- D18 (not in the table) staged only the installed files, including `AGENTS.md`, and returned `allow`. D19 staged only `.cursor/hooks.json` and returned `ask`. Commit the installed files in one commit, as in step 8.

## What the run did not cover

- No Cursor session ran. The run did not check four things: that Cursor loads `hooks.json`, that the matcher fires, that the `ask` dialog shows the message, and that cloud agents run the hooks.
- The run set the bypass variables on the script process. It did not check that Cursor passes your shell environment to a hook.
- The run never ran `git commit` or `git push`.
- The run used Bash on macOS. It did not test Windows.
- The payload fields come from the Cursor hooks documentation (read on 2026-11-15), not from a live Cursor session.

## Common mistakes

- You treat the commit hook as a gate. It misses a commit with `-a` after the message, a commit with a path, and `git -C <dir> commit`. Keep `/pr-ready-check` as the real documentation check at PR open.
- You install into a repository that has hooks and expect the new hooks to run. The installer skips `hooks.json`, and the scripts sit unused. Merge the two entries and read the Hooks tab.
- You commit the install in pieces. A commit with only `.cursor/hooks.json` returns `ask`, because the file is not documentation. Include `AGENTS.md` in the same commit, or add `[skip-docs]`.
- You expect the pack to install a skill or a command. It installs no skill. It also adds `.cursor/rules/agent-toolbelt-router.mdc`, an `AGENTS.md` block, and three files under `.agents/shared/contracts/`. Review all eight files before you commit, or seven when `hooks.json` already exists.
- You tell the team to set `TOOLBELT_DOC_CHECK=0` in a shell. The run did not check that Cursor passes that variable to the hook. Prefer the `[skip-docs]` and `[skip-review]` tokens, which the run did check.
- You expect the push hook to run a review. It only shows a message. Run `/pr-review` yourself, or use `review-on-open`.

## Next

- [Review every PR when it opens](ops-review-every-pr-on-open.md): when the review must run on every PR without a person.
- [Enforce a pre-PR gate](ops-enforce-a-pre-pr-gate.md): when the documentation check must be a blocking gate at PR open.
- [Install for a team](ops-install-for-a-team.md): when you install more packs, or many repositories.
- [Check a branch before you open a pull request](dev-self-review-before-a-pr.md): the local review that the push hook asks for.
- [Wiki home](../Home.md): the full list of wiki pages, until a use-case index exists.
