---
name: worktree
description: Create, list, and remove isolated git worktrees for multi-agent shared repo directories. Use when several sessions need separate branches, or when a task wants an isolated checkout without disturbing the main tree.
---

# worktree

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

A git checkout has one HEAD. When agents share a checkout, one `git checkout` or `git switch`
moves the branch under every other agent. Give each task its own worktree: a separate directory
on its own branch that shares the repo's object store. This skill manages checkouts only. Do the
task's work inside the worktree as normal.

## When to use it

- **Use it** when several independent agents or sessions share one directory of repos, or when
  you want an isolated checkout that leaves the main tree's branch unchanged. The worktree must
  outlive a single tool call.
- **Use the harness instead** for parallel fan-out inside one `Workflow` run. Pass
  `isolation: 'worktree'` to those `agent()` calls; the harness creates and removes each worktree.
- **Skip it** when you are the only agent in the directory and a normal branch is enough.

## Claim, work, hand back

Run the shipped CLI (bash + `git` only):

```bash
bash skills/worktree/bin/worktree.sh <op> …
```

1. **Claim.** Run `new <repo> --task <what-you-are-doing>` before you start work in a shared
   directory. Omit the branch so the CLI picks a collision-safe `agent/<task>-<n>` name.
2. **Work there only.** `cd` into the printed `worktree:` path. Edit, commit, and push from inside
   it. Do not run `git checkout` for another branch in the shared main tree; create a worktree instead.
3. **Hand back.** When the branch merges or the task stops, run `rm <branch> --delete-branch`.
   Remove a worktree that has no changes. Use `list --all` to find stale worktrees and `prune`
   after manual deletions.

The work is complete when the task's worktree is removed, or its path and branch are reported for
the next owner.

Read `references/cli.md` when you need an argument, a flag, exit behavior, the directory layout,
or the repo and branch resolution rules.
