---
description: Create, list, or remove an isolated git worktree so multiple agents can work a shared polyrepo directory without clobbering each other's branch. One worktree per task, on its own branch, with collision-safe naming. Wraps the worktree pack's CLI.
argument-hint: "new|list|rm|prune [repo] [branch] [--task <slug>] [--all] [--force] [--delete-branch]"
---

# /worktree

Carve out an **isolated checkout** for a task using the `worktree` pack, so that several agents (or
sessions, or harnesses) sharing one directory of repos never pull the branch out from under each
other. One worktree per task, on its own branch, collected under `<parent>/.worktrees/`.

> Background, the multi-agent contract, and when to prefer `Workflow`'s in-run `isolation:
> 'worktree'` instead: `skills/worktree/SKILL.md`, `skills/worktree/references/isolation.md`.

**Arguments:** `$ARGUMENTS`

Run the shipped CLI at its installed path and act on what it prints:

```bash
bash skills/worktree/bin/worktree.sh <op> …
```

- **`new [repo] [branch] [--task <slug>] [--from <ref>]`** — create a worktree on a **new** branch.
  Omit `repo` to use the repo containing the current dir, or pass a path / a bare sibling name. Omit
  `branch` to auto-name `agent/<repo|task>-<n>` (collision-safe for concurrent agents); an explicit
  branch errors if it already exists. **`cd` into the printed `worktree:` path and do all the work
  there** — never `git checkout` a different branch in the shared main tree.
- **`list [repo]` / `list --all`** — show worktrees for one repo, or across every repo under the
  parent dir (a `*` marks a dirty worktree). Use `--all` as the "what is every agent doing" sweep.
- **`rm <path-or-branch> [--force] [--delete-branch]`** — remove a worktree when the task is merged
  or abandoned (refuses if dirty unless `--force`; keeps an unmerged branch unless `--force`).
- **`prune`** — clear stale worktree metadata after manual deletions and tidy empty `.worktrees`
  dirs.

Default to **auto-named branches** (omit the branch arg) when spawning work as one of several agents,
so two agents never request the same branch. Clean up with `rm` when done so stale checkouts don't
accumulate. Full flag/exit contract: `skills/worktree/references/cli.md`.
