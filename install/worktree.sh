# DESC: isolated git worktrees for safe multi-agent work in a shared polyrepo dir: one worktree per task, collision-safe branches, tidy cleanup
# DEPENDS: simple-english
pack_worktree() {
  shared_contract references/human-readable-output.md
  shared_contract references/docs-writing.md
  cmd worktree

  skill worktree SKILL.md
  skill worktree bin/worktree.sh
  skill worktree references/cli.md
}
