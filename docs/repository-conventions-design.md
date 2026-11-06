# Repository contribution guidance from current evidence

The `style-guide-init` skill now creates, checks and refreshes contribution
guidance as well as style-only guides. Its existing ID remains compatible with
installed callers; the display name is **Repository Contribution Guide**. This
extends the existing owner rather than adding an overlapping skill.

## What it derives

The skill investigates instructions, current build/test/format configuration,
CI, representative production code and tests, generated-file workflows, and
contribution templates. It follows the repository's documentation owners:
normally an existing contribution guide, otherwise `CONTRIBUTING.md` for a
requested general guide. Existing style owners retain detailed conventions.
README and agent files can link to them without duplicating the rules.

Each non-obvious claim has a scope and evidence classification:

| Class | Meaning |
| --- | --- |
| Documented policy | An applicable instruction or adopted standard says this is required. |
| Enforced | A configuration/automation path enforces it; record whether execution was actually observed. |
| Observed | Representative independent examples show this practice, with scope and exceptions. |
| Proposed | A useful recommendation that the repository has not adopted. |
| Conflicted | Sources disagree and the decision is still unresolved. |

This distinction prevents stale prose or repeated mistakes from becoming new
policy. A guide can truthfully say that the README prescribes one command while
the current task definitions and CI use another. It can correct a verified stale
command during a requested update while preserving a policy decision that the
code alone cannot settle. It records command definitions separately from actual
successful runs; it does not execute deployment steps to validate documentation.

## Use it in another repository

The native plugin exposes the skill automatically. For a project-scoped install:

```sh
/path/to/agent-toolbelt/install.sh --harness all style-guide-init /path/to/project
```

Example requests:

- “Use `$style-guide-init` to create a contribution guide from this repo's code,
  tests, configuration and CI. Flag stale documentation and conflicting practices.”
- “Use `$style-guide-init` to check whether our contribution guide needs changes.
  Report findings without editing.”
- “Use `$style-guide-init` to refresh the existing guide, preserving human edits
  and keeping package-specific conventions scoped to their package.”

The project compatibility command supports `--print`, `--write`, `--check`,
`--refresh` and repeated `--scope PATH`. No global installation, scheduled task,
CI gate or external PR posting is part of guide creation.

## How it stays current

An evidence appendix records claim sources, classification, counterexamples and
open decisions. A separate JSON checkpoint records scoped source and guide
fingerprints after the evidence review. The bundled Python standard-library
helper discovers tracked/nonignored untracked files, compares their contents,
and detects additions and deletions. It handles dirty checkouts without treating
the Git commit alone as the current state.

For example, after installing the pack and creating the guide:

```sh
python3 /path/to/project/.atb/skills/style-guide-init/scripts/conventions_state.py \
  capture --repo /path/to/project --state docs/conventions-state.json \
  --guide CONTRIBUTING.md --scope src --scope tests --scope .github \
  --scope package.json --scope pnpm-lock.yaml --scope AGENTS.md

python3 /path/to/project/.atb/skills/style-guide-init/scripts/conventions_state.py \
  check --repo /path/to/project --state docs/conventions-state.json
```

Select real source/config/policy scopes for the project. Examples do not imply a
required language or package manager. The checker emits JSON and returns 0 for
unchanged covered inputs/outputs, 1 for review-needed changes or unassessed
links/submodules, and 2 for missing/invalid state or an operational error. It
does not read linked contents, run repo commands or change documentation.

A changed fingerprint is a review signal, not proof of stale prose. The skill
reads affected claims and neighbors, updates only warranted text, and captures
a new checkpoint after the review. An unchanged check proves nothing about
uncovered areas, policy approval, command success or semantic accuracy.

Begin with on-demand updates and docs-impact review. If the team later wants
automation, make checks advisory until their signal is useful. The existing
optional `doc-sync-guard.sh` only notices whether a code commit also changes a
documentation filename; it cannot determine whether the relevant guidance is
accurate. A docs edit on every PR is not a substitute for evidence review.

## Related company approaches and existing capabilities

These are published mechanisms and practices, not evidence that every team at
each company uses the same process or that automatic extraction is solved.

| Source | Published approach | Relevant lesson |
| --- | --- | --- |
| [GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) | Repository/path-specific instructions and a codebase-onboarding prompt for generating build/test/validation guidance | Derive useful commands and checks; scope instructions by area. |
| [Anthropic](https://code.claude.com/docs/en/memory) | `/init` generates starting project instructions; prompt audits inspect stale/conflicting instructions; scoped rules separate concerns | Initialization needs subsequent auditing. Shared project requirements differ from personal auto-memory. |
| [Cursor](https://cursor.com/docs/rules) | Version-controlled project rules, path scoping, and shared team rules | Avoid making every convention apply to every file or task. |
| [Google engineering practices](https://google.github.io/eng-practices/review/reviewer/looking-for.html) | Review includes updating relevant documentation when a change affects how to build, test, interact with or release a system | Maintenance belongs with changes and review, not only periodic regeneration. |

Closest watched-source skills/workflows inspected at pinned revisions:

- Anthropic's [claude-md-improver](https://github.com/anthropics/claude-plugins-official/blob/ea10b213686c90bb1984b2016937310e05336cf3/plugins/claude-md-management/skills/claude-md-improver/SKILL.md)
  audits instruction quality/currency and proposes targeted CLAUDE.md updates.
  Its narrower artifact scope does not supply the contribution-guide checkpoint
  built here.
- Scoville's [project-context cleanup](https://github.com/benjaminstelzer/scoville-suite/blob/fdd5892ec7dfe93685feb029638c7daf65cc52a5/packages/scoville-project-context-cleanup/scoville-project-context-cleanup/SKILL.md)
  preserves ownership, conditions and meaning while improving project rules.
- GSD's [brownfield onboarding](https://github.com/open-gsd/gsd-core/blob/1683183675c125a369fc0ffa4b67b2ec22454b74/docs/features/existing-codebase-onboarding.md)
  routes through codebase mapping and existing docs. Its planning/runtime setup
  is substantially broader than this guide-maintenance task.

Our implementation uses independently written instructions and helper code;
those upstream skills were examined as sources, not invoked or copied.

## Insights and practical limits

Keep human and agent needs distinct. A human may need a repository overview;
an always-loaded agent file should concentrate on non-obvious commands,
constraints and mistakes worth preventing, with links to longer guidance.

There is reason to test the benefit. The September 29, 2026 revision of
[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988v3) reports that context
files did not generally improve task success and increased average inference
cost by over 20% in its evaluated settings. The authors found non-standard
coding practices useful to specify, while repository overviews were unhelpful.
This is evidence about those benchmarks and agents, not proof that contribution
guides are useless or that every tool/model behaves the same.

Measure whether the guide helps a new contributor perform a representative
change: choose the right location, use the correct commands, match local tests,
and avoid known review rework. Measure stale claims and false-positive refresh
requests too. File length, number of extracted rules and a clean fingerprint
check are not measures of contribution quality.

The default implementation has no model/host-specific dependency and no service
access requirement. It cannot infer private maintainer intent, current remote
branch protection, or every subsystem's convention from a sample. Those remain
explicit unknowns until the relevant evidence or decision is available.

## Validation

Twelve automated tests passed for the checkpoint helper and a real all-harness
installation, covering dirty/staged inputs, new/deleted/renamed paths, new config,
manual guide edits, exclusions, invalid state and unassessed links/submodules.
Skill shape, canonical-copy sync, skill-creator validation, package/install,
catalog/audit freshness and portal/browser checks passed. These checks validate
the helper and distribution; real-host extraction/selection accuracy and
contributor outcomes have not yet been measured.
