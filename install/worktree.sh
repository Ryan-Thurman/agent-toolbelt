# DESC: isolated git worktrees for safe multi-agent work in a shared polyrepo dir: one worktree per task, collision-safe branches, tidy cleanup
pack_worktree() {
  cmd worktree

  skill worktree SKILL.md
  skill worktree bin/worktree.sh
  skill worktree references/cli.md
  skill worktree references/isolation.md
}
