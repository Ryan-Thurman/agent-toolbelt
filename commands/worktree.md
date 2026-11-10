---
description: Create, list, or remove an isolated git worktree so multiple agents can work a shared polyrepo directory without clobbering each other's branch. One worktree per task, on its own branch, with collision-safe naming. Wraps the worktree pack's CLI.
argument-hint: "new|list|rm|prune [repo] [branch] [--task <slug>] [--from <ref>] [--all] [--force] [--delete-branch]"
---

# /worktree

Use this command to create, list, or remove an isolated checkout in a shared repo directory.
Follow the `worktree` skill and run its CLI with `$ARGUMENTS`.
