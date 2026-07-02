# Multi-agent isolation with worktrees

## The problem this solves

A git repository has **one HEAD per working tree**. If several agents share a single checkout of a
repo, the moment one runs `git checkout <other-branch>` / `git switch` / `git reset`, every other
agent in that directory is now on a different branch — mid-edit, mid-commit, with a working tree that
no longer matches what they think they're on. In a directory of ten repos with a handful of agents,
this is a constant, silent hazard: nobody clobbered a *file*, but the **branch state** got pulled out
from under someone.

A **git worktree** removes the contention: it's an additional working directory linked to the same
repository (shared objects, refs, and config) but with **its own HEAD, branch, and index**. Two
worktrees of the same repo can sit on two different branches at once, edit independently, and commit
independently. So the rule for a shared dir is simple:

> **One worktree per task. Never switch branches in a checkout someone else might be using.**

## The polyrepo model

This pack assumes the common "many repos under one parent dir" layout and keeps all isolation in one
place beside them:

```
<parent>/
  .worktrees/<repo>/<branch-slug>/   <- every agent worktree, for every repo
  repo-a/  repo-b/  …                <- the main checkouts, branches left alone
```

Because the worktrees live under `<parent>`, not inside any repo, they never show up in a repo's
`git status`, need no `.gitignore`, and `list --all` can show you every agent's checkout across every
repo from one call. `<parent>` is derived from each repo's **main** tree, so all repos under the same
shared dir converge on the same `.worktrees/`.

## The contract (claim → work → hand back)

1. **Claim.** Before starting work on a repo in a shared dir, create your own worktree:
   `worktree new <repo> --task <what-you-are-doing>`. Take the printed path; that is your workspace.
   Omit the branch so the auto `agent/<task>-<n>` name can't collide with another agent's.
2. **Work there, only there.** `cd` into the printed path. Edit, commit, and push from inside it. Do
   **not** `git checkout` a different branch in the main tree (`repo-a/`) — that's the shared one.
3. **Hand back.** When the branch is merged or the task is abandoned, remove the worktree:
   `worktree rm <branch> --delete-branch`. Don't leave stale checkouts piling up under `.worktrees/`;
   `worktree list --all` is the periodic "what's still open" sweep, and `worktree prune` cleans up
   metadata after any manual deletions.

A worktree you created but never changed is cheap to remove — discard it rather than leaving it
around (the same "an unchanged worktree is discarded" discipline the harness applies to managed
worktrees).

Typical single-agent flow:

```bash
# 1. carve out an isolated checkout for this task
bash skills/worktree/bin/worktree.sh new repo-a --task fix-login
#    -> prints:  cd "<parent>/.worktrees/repo-a/agent-fix-login"
# 2. cd into the printed path and do the work (edit, commit, push) on its own branch
# 3. when merged/abandoned, remove it
bash skills/worktree/bin/worktree.sh rm agent/fix-login --delete-branch
```

## When NOT to use this — prefer in-run `Workflow` isolation

If your parallelism is **inside a single `Workflow` run** (you're fanning out N agents over N items
in one script), don't hand-manage worktrees here — pass `isolation: 'worktree'` to those `agent()`
calls. The harness then gives **each spawned agent its own worktree and removes it automatically**
when the run ends (discarding it if unchanged). That is strictly better *for that case* because the
lifetime is bounded by the run and cleanup is automatic.

This pack is for the case the harness **can't** manage: **independent agents/sessions** sharing a
directory, where the isolated checkout must **outlive a single tool call or workflow** and no single
orchestrator owns all the agents. There, an explicit, persistent, named worktree — created here,
torn down here — is the right tool.

The discipline is identical in both cases (one worktree per unit of work; prefer a managed worktree
over hand-rolled `git worktree`; discard the unchanged). The `retrofit` pack
(`skills/retrofit/references/transform-and-verify.md`) applies it to in-run fan-out; this pack applies
it to cross-session work. Both descend from obra/superpowers' `using-git-worktrees` +
`subagent-driven-development` patterns.
