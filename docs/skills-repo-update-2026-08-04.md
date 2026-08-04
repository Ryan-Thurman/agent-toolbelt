# Skills Repo Update Review - 2026-08-04

Follow-up review after fast-forwarding the watched clones under
`repos/skills-repo/`. The comparison baseline is the local July 9 review and
its recorded heads. Clones are gitignored research inputs; adopted behavior is
implemented in tracked local files with local wording.

## Sync Result

| Repo | Reviewed range | Commits | Result |
|---|---|---:|---|
| `agency-agents` | `9f3e401ccd09..c89557f78509` | 10 | Catalog additions; no local workflow change |
| `agent-skills-addyosmani` | `8d74a4d6046b..bdf76c7c6b7b` | 68 | High signal |
| `awesome-claude-code-subagents` | `977dfeaaf3d2..91810b33c707` | 2 | README/link updates only |
| `awesome-claude-skills` | `92568c1edaff..be2a406907db` | 2 | README updates only |
| `claude-code-best-practice` | `bc67f4628a35..63927033d56c` | 312 | Catalog/drift reports; no local primitive |
| `claude-skills-jeffallan` | `e8be415bc94d` | 0 | Already current |
| `gsd-core` | `960c3eaa1569..4eb8e3648c18` | 579 | High signal, much of it runtime-specific |
| `gstack` | `11de390be1be..a3259400a366` | 35 | Mostly iOS/gbrain fixes; safety confirmation |
| `skills-mattpocock` | `d574778f94cf..2ab958093e83` | 42 | High signal |
| `superpowers` | `d884ae04edeb..44c9b2d6e889` | 52 | High signal |

Sync summary: 9 repositories fast-forwarded, 1 already current, 0 dirty
worktrees, and 0 failures.

## High-Signal Material Inspected

- `skills-mattpocock`:
  - `skills/engineering/improve-codebase-architecture/SKILL.md`
  - `skills/engineering/to-tickets/SKILL.md`
  - `skills/productivity/grilling/SKILL.md`
  - the new `agents/openai.yaml` metadata set
- `superpowers`:
  - `skills/test-driven-development/SKILL.md`
  - `skills/test-driven-development/writing-good-tests.md`
  - `skills/subagent-driven-development/SKILL.md`
  - `skills/finishing-a-development-branch/SKILL.md`
  - `skills/verification-before-completion/SKILL.md`
- `gsd-core`:
  - `gsd-core/references/planner-preconditions.md`
  - `gsd-core/references/planner-reversibility.md`
  - the new debugger RCA/reproduction/fix-acceptance references
  - recent fail-closed worktree, dependency propagation, verification-ledger,
    and catastrophic-shrink guard changes
- `agent-skills-addyosmani`:
  - `skills/test-driven-development/SKILL.md`
  - `skills/performance-optimization/SKILL.md`
  - `skills/code-review-and-quality/SKILL.md`
  - `skills/incremental-implementation/SKILL.md`
- `gstack`:
  - the fail-closed recursive-delete and credential-action fixes

## Adopted Now

### Scope architecture work where it can pay back

Matt Pocock's architecture skill now chooses scope before scanning and favors
recently active modules when the user has not named a target. The local
`/code-smell --architecture` taxonomy now follows the same YAGNI-shaped rule:
honor named scope, otherwise inspect history for real hotspots, and widen only
when history is scattered.

Local files:

- `shared/contracts/references/maintainability-taxonomy.md`

### Make test evidence falsifiable and repository-native

Superpowers tightened test quality around a simple question: what production
change would make this test fail? Addy's pack separately made test-command
discovery ecosystem-neutral. Local test planning and Dev Lite implementation
now discover checked-in commands/conventions, use focused and full-suite
commands at the right points, and require either an observed red state or a
recorded sensitivity argument.

Local files:

- `commands/write-tests.md`
- `skills/dev-lite-workflow/references/implementation-rules.md`
- `.agents/skills/dev-lite-workflow/references/implementation-rules.md`

### Isolate scratch recovery state per plan

Superpowers moved subagent-driven state from one shared ledger to a plan-scoped
workspace. Local Dev Lite now uses `.atb-work/dev-lite/<plan-slug>/`, records
which plan owns the ledger, avoids sibling workspaces, and removes only the
finished plan's directory. The tracked Implementation Plan remains the source
of truth.

Local files:

- `skills/dev-lite-workflow/references/execution-support.md`
- `skills/dev-lite-workflow/references/implementation-rules.md`
- mirrored `.agents/` references

### Fail closed on real task prerequisites

GSD added selective task preconditions for state that dependency ordering
cannot guarantee. Dev Lite plans may now declare a precondition only for
external setup, prior-phase artifacts, or runtime/configuration facts. The
implementer verifies it read-only before mutation and stops rather than
partially executing when it is unmet or unsafe to check. Normal tasks carry no
new field or gate.

Local files:

- `commands/dev-plan.md`
- `commands/dev-implement-task.md`
- `templates/dev-implementation-plan.md`
- `skills/dev-lite-workflow/references/implementation-rules.md`
- `skills/auto-agent-dev-lite/SKILL.md`

### Accept current Codex skill metadata shape

Matt Pocock's pack added `agents/openai.yaml` metadata across its catalog. The
sync also exposed that this repo's latest `auto-agent-dev-lite` already uses the
current nested `interface`/`policy` shape while the local validator accepted
only its legacy flat shape. The validator now accepts both forms, retains the
three required local interface fields, and rejects unknown keys in either form.

Local file:

- `scripts/check-skill-shape.sh`

## Later, With a Concrete Need

- **Reversibility ratings and one-way-door checkpoints:** useful for public
  schemas, wire formats, and external lock-in, but too much standing ceremony
  for ordinary Dev Lite plans. Revisit when a real plan contains such a choice.
- **Dependency-upgrade review discipline:** changelog review, lockfile review,
  and isolated bumps are sound. Add a focused PR-review rule when dependency
  upgrade PRs become a recurring local review target.
- **Performance keep-or-revert ledgers:** strong for measured optimization
  work, but this repo has no standalone performance skill today.
- **Scoped review-fix loops:** Superpowers' resume-based, capped loop is useful
  for explicitly delegated execution. The local unattended contract already
  owns bounded convergence, so do not add a second competing policy.
- **Codex/Claude plugin packaging:** upstream packages continue to mature. Add
  artifact checks only when this repo ships a first-class Codex or Claude
  plugin; the existing Cursor artifact check remains the relevant gate.

## Not Adopted

- New persona and specialist catalogs: idea sources, not new runtime skills for
  this focused toolbelt.
- GSD's state engine, fragment compiler, registries, and runtime host machinery:
  the safety ideas are useful, but the machinery conflicts with the repo's
  lightweight command/skill model.
- Gstack's iOS QA and gbrain-specific changes: solid upstream fixes with no
  matching local surface.
- Wholesale prompts or source: concepts only, independently worded and mapped
  to local contracts. This remains the rule even for permissively licensed
  sources.

## Authoring Check

The `writing-great-skills` checklist was applied during adoption: no new skill
was created where an existing owner existed, optional branches stayed behind
conditional wording, provenance stayed out of runtime skill bodies, and the
mirrored Dev Lite references remain one byte-identical skill surface.
