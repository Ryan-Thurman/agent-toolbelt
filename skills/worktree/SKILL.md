---
name: worktree
description: Create, list, and remove isolated git worktrees for multi-agent shared repo directories. Use when several sessions need separate branches, or when a task wants an isolated checkout without disturbing the main tree.
---

# worktree

A thin, safe wrapper over `git worktree` for the **multi-agent, shared-directory** case. When several
agents (or sessions, or harnesses) operate on the same directory of repos, a plain `git checkout` /
`git switch` in one agent's shell **moves the branch out from under** every other agent in that same
checkout. The fix is one **worktree per task**: a separate working directory, on its own branch,
sharing the repo's object store but isolated on disk. This pack makes that a one-line call with
collision-safe branch naming and a tidy, predictable layout.

> Adds no review/build logic — it only manages checkouts. The agent still does its work inside the
> worktree the normal way.

## When to use this (vs. not)

- **Use it** when: multiple agents share one polyrepo dir; an agent needs to start work on a repo
  another agent might also be touching; or any time you want an isolated checkout without disturbing
  the main tree's branch.
- **Don't bother** when: you're the only agent in the dir and a normal branch is fine; or you're
  doing **parallel fan-out *inside a single `Workflow` run*** — there the `Workflow` tool's
  `isolation: 'worktree'` already gives each spawned agent its own worktree and auto-cleans it. This
  pack is for **independent sessions** that the harness can't coordinate, where the worktree must
  outlive a single tool call.

## The layout

Worktrees live **outside** the repos, collected under the shared parent so they never pollute a
repo's tree and are trivial to see/prune in one place:

```
<parent>/                      # your shared working dir
  .worktrees/
    repo-a/agent-fix-login/    # agent 1's isolated checkout of repo-a
    repo-b/agent-perf-1/       # agent 2's isolated checkout of repo-b
  repo-a/   <- main tree, branch untouched by the worktrees
  repo-b/
  …
```

`<parent>` is the directory that contains the repo's **main** working tree, so every repo under one
shared dir routes to the same `.worktrees/`. Nothing inside any repo changes, so there is no
`.gitignore` to manage.

## The CLI

One shipped script — `bin/worktree.sh` (pure bash + `git`, nothing to install). Invoke it at its
installed path:

```bash
bash skills/worktree/bin/worktree.sh <op> …
```

| op | what |
|---|---|
| `new [repo] [branch] [--task <slug>] [--from <ref>]` | create a worktree on a **new** branch; prints the path to `cd` into |
| `list [repo]` / `list --all` | show worktrees for one repo, or across every repo under the parent (a `*` marks dirty) |
| `rm <path-or-branch> [--force] [--delete-branch]` | remove a worktree (refuses if dirty unless `--force`) + prune |
| `prune` | drop stale worktree metadata + tidy empty `.worktrees` dirs |

Full contract, flags, and resolution rules: `references/cli.md`. The multi-agent discipline (claim,
work, hand back) and how this relates to retrofit's fan-out: `references/isolation.md`.

## Principles (always)

- **One worktree per task, on its own branch.** Never `git checkout` a different branch in a
  checkout another agent shares — make a worktree instead. That is the whole point of the pack.
- **Collision-safe by default.** Omit the branch and `new` auto-names `agent/<repo|task>-<n>`,
  bumping `<n>` until both the branch and the path are free, so concurrent agents never clash. An
  **explicit** branch is honored but **errors if it already exists** (no silent reuse of another
  agent's branch).
- **Never nest.** `new` always resolves the repo's **main** tree and creates off it, even when called
  from inside a linked worktree (it says so when it does) — so you never get worktrees-inside-worktrees.
- **Don't discard work silently.** `rm` refuses a worktree with uncommitted changes unless `--force`;
  `--delete-branch` keeps an unmerged branch unless `--force`. Clean up when done so stale checkouts
  don't accumulate.
- **The main tree is sacred.** `rm` refuses to remove the repo's main working tree.

## Typical flow (one agent)

```bash
# 1. carve out an isolated checkout for this task
bash skills/worktree/bin/worktree.sh new repo-a --task fix-login
#    -> prints:  cd "<parent>/.worktrees/repo-a/agent-fix-login"
# 2. cd into the printed path and do the work (edit, commit, push) on its own branch
# 3. when merged/abandoned, remove it
bash skills/worktree/bin/worktree.sh rm agent/fix-login --delete-branch
```

## References

- `references/cli.md` — every op, flag, exit behavior, and the repo/branch/base resolution rules.
- `references/isolation.md` — the multi-agent contract, the polyrepo model, cleanup discipline, and
  when to prefer `Workflow`'s in-run `isolation: 'worktree'` instead.
