# Skill review — 2026-09-24

## Scope and source refresh

Reviewed all 32 canonical skills in `skills/` against the authoring checklist,
their commands and references, and the [generated taxonomy audit](skill-taxonomy-audit.md).
Ran `repos/scripts/repo-watch-grab-latest.sh` against all 31 watched clones:
20 fast-forwarded, 11 were current, and none failed or had dirty worktrees.
These clones are gitignored research material; the main repository's existing
worktree changes were preserved.

The two copied Vercel rule packs remain at the upstream `vercel-labs/agent-skills`
main commit `063bee94c3f4df8453406c830b0a7df0f2860278`, matching their
recorded attribution. No rule copy was needed.

## Changes made

| Skill | Finding | Correction |
| --- | --- | --- |
| `bug-to-fix` | The RCA reference asked for full input/environment logs, and the durable-state example asked for a token value. The intake command also requested a verbatim report. | Require redacted evidence across the skill, intake command, investigation template, and references; log only fields needed for the hypothesis. This incorporates the redaction guidance in [mattpocock/skills diagnosing-bugs](https://github.com/mattpocock/skills/blob/c55ee46073ed/skills/engineering/diagnosing-bugs/SKILL.md). |
| `handoff` | Ordinary handoffs did not require branch/working-tree state or exact check results, making a fresh session's resume point hard to verify. | Record the branch, committed/uncommitted state, exact checks and outcomes; compare against `git status` and rerun stale checks on resume. This aligns with the existing phase handoff template and the [restartable-boundary guidance](https://github.com/addyosmani/agent-skills/blob/bcab6a1b8503/skills/context-engineering/SKILL.md). |
| `pr-review` | The performance facet and SQL checklist could treat every missing index or scan as a finding. | Require query-shape, selectivity, table-size, or plan evidence; account for index write cost and connection-pool capacity. This adapts the [upstream performance guidance](https://github.com/addyosmani/agent-skills/blob/bcab6a1b8503/skills/performance-optimization/SKILL.md). |

The remaining 29 canonical skills received no change. The review found no broken
local reference paths or frontmatter issues. The `shape-up` question/approval
style and Dev Lite's detailed plan ledger are deliberate workflow contracts;
changing their interaction model without usage evidence would be speculative.
The `cover` command and its authoring reference explicitly require a separate
test commit, so its “committed regression test” wording is consistent.

## Validation and follow-up

- `scripts/check-skill-shape.sh` and `scripts/check-skill-sync.sh` pass.
- `git diff --check` passes.
- The skill-creator `quick_validate.py` could not run because PyYAML is absent;
  the repository's shape check validates frontmatter, names, descriptions,
  metadata, references, and shared contracts.
- The [worktree cleanup script](../skills/worktree/bin/worktree.sh) was
  inspected against newer destructive-path guidance. It checks the main tree,
  refuses dirty worktrees without `--force`, and delegates removal to Git's
  worktree registry; no unsupported cleanup change was made.
