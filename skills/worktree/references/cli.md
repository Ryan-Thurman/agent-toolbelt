# worktree CLI contract

The shipped `bin/worktree.sh` is pure bash + `git`. Invoke it at its installed path:

```bash
bash skills/worktree/bin/worktree.sh <op> [args]
```

All human-readable status (the `git worktree` chatter, notes, errors) goes to **stderr**; the
machine-useful result (the worktree path, the listing) goes to **stdout**. Every op exits non-zero
with a `worktree: <reason>` line on failure.

## Resolution rules (shared by all ops)

**Which repo** a `repo` argument refers to:

| `repo` arg | resolves to |
|---|---|
| *(omitted)* | the repo containing the current directory |
| a path to a directory | that directory |
| a bare name (no `/`) | a **sibling** repo: `<parent-of-cwd-repo>/<name>` |

**The main tree.** Every op finds the repo's **main** working tree from wherever you call it (the
first entry of `git worktree list --porcelain` is always the main tree), so calling from inside a
linked worktree still resolves correctly and never nests.

**The parent.** `<parent>` is `dirname` of that main tree. Worktrees are created under
`<parent>/.worktrees/<repo-name>/<branch-slug>`, where `<branch-slug>` is the branch name with `/`
replaced by `-` (so `agent/fix-login` → `agent-fix-login`).

## `new [repo] [branch] [--task <slug>] [--from <ref>]`

Create a worktree on a **newly created** branch and print where it is.

- **`repo`** *(optional, positional)* — resolved per the table above.
- **`branch`** *(optional, positional)* — the branch to create.
  - **Omitted** → auto-name `agent/<base>-<n>`, where `<base>` is `--task`'s slug if given else the
    repo name, and `<n>` is bumped until **both** the branch and the target path are free. Safe for
    many concurrent agents.
  - **Given** → used verbatim; **errors if the branch already exists** (won't silently reuse another
    agent's branch). Pick another name or omit it.
- **`--task <slug>`** — flavors the auto branch name (`agent/<slug>-<n>`) so the checkout is
  self-describing. Ignored when an explicit `branch` is given.
- **`--from <ref>`** — base commit/branch for the new branch. Default: the main tree's current branch
  (or its `HEAD` sha if detached). The ref must resolve to a commit.

Output (stdout) — the last line is a ready-to-run `cd`:

```
worktree: /abs/path/.worktrees/repo-a/agent-fix-login
branch:   agent/fix-login
base:     main
cd:       cd "/abs/path/.worktrees/repo-a/agent-fix-login"
```

Creating a new branch never conflicts with the branch the main tree has checked out (it's a *new*
branch off `--from`, not a second checkout of an existing one).

## `list [repo]` / `list --all`

Show worktrees and their branches; a trailing `*` marks a worktree with uncommitted changes.

- **`list`** / **`list <repo>`** — the one repo (main tree + its linked worktrees).
- **`list --all`** — sweep every immediate child of `<parent>` that is a git repo and list each. The
  `.worktrees/` dir itself is skipped. This is the cross-repo "what is every agent doing" view.

## `rm <path-or-branch> [--force] [--delete-branch]`

Remove a worktree and prune its metadata.

- **target** — either the worktree's path, or a **branch name** (resolved to its worktree via
  porcelain).
- Refuses to remove the repo's **main** working tree.
- Refuses when the worktree has **uncommitted changes**, unless **`--force`** (which discards them).
- **`--delete-branch`** — also delete the worktree's branch. A not-fully-merged branch is **kept**
  with a note unless **`--force`** (then force-deleted). Without `--delete-branch` the branch is kept.
- After removal, runs `git worktree prune` and removes the now-empty `.worktrees/<repo>` (and
  `.worktrees`) dirs.

## `prune`

Run `git worktree prune` for the current repo (clears metadata for worktrees whose directories were
deleted out from under git) and tidy empty `.worktrees` dirs. Use after manual deletions.

## Notes

- The script needs only `bash` and `git` on `PATH`; no executable bit is required (it's invoked via
  `bash <path>`).
- `git`'s own worktree locking + the unique-path/branch checks make concurrent `new` calls from
  different agents safe: two agents asking for an auto branch get distinct `-<n>` suffixes; two
  agents naming the **same** explicit branch — the second errors instead of colliding.
- Removing a worktree does **not** touch its commits; they live in the shared object store and on its
  branch until the branch itself is deleted.
