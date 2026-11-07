# Changelog

## Unreleased

## v1.1.6 - 2026-11-06

### Changed

- Changed workflow number badges to circles with centered numbers and thicker white borders.

## v1.1.5 - 2026-11-06

### Changed

- Enlarged workflow step numbers and badges, with stronger text and border contrast.
- Removed leading zeros from workflow step numbers.

## v1.1.4 - 2026-11-06

### Changed

- Rebuilt workflow guides as numbered stage cards with named category markers and visible skill outputs.
- Added a first-skill action, clearer possible handoffs, and expandable example prompts.
- Used wider responsive stage layouts and retained the approved neutral dark palette.
- Added browser coverage for workflow entry, handoff navigation, prompt expansion, and accessible stage lists.

## v1.1.3 - 2026-11-06

### Changed

- Darkened task cards to charcoal gray and used soft black for the navigation header and hero.
- Changed the dark-theme library background, raised surfaces, and borders to neutral grays.

### Fixed

- Restored the `/workflow-router` table header so that the new routing rows render.
- Aligned the deep PR review coverage step with the orchestrator-owned acceptance-criteria table.
- Added the product learning workflow to the selected research synthesis and outcome review installs.
- Updated the installation guide to 33 skills.

## v1.1.2 - 2026-11-06

### Changed

- Raised dark-theme task cards onto a lighter neutral gray surface with clearer borders and a distinct hover state.
- Kept light-theme task surfaces white and retained the existing category markers and action colors.

## v1.1.1 - 2026-11-06

### Changed

- Grouped task shortcuts into exploration/planning and improvement/verification rows.
- Replaced broad category-colored surfaces with neutral cards and explicit category labels.
- Reserved amber for actions, selection, and branding. Technical improvement now uses green category markers.
- Balanced workflow choices into three desktop columns and reduced repeated card emphasis.
- Recorded a Mobbin reference comparison and checked both themes at desktop and mobile sizes.

## v1.1.0 - 2026-11-06

### Added

- Added research synthesis, product outcome review, technical debt discovery, and system design skills. The standard plugin now contains 33 skills.
- Added five compatibility commands, including `/plan-review`, with templates and installer support.
- Added shared evidence and product measurement rules, plus product learning, technical health, design-security, and retrospective workflow guides.
- Added behavioral evaluation fixtures for research, outcomes, design, planning, and debt discovery.

### Changed

- Added plan-readiness review, decision capture, requirement coverage, integration checks, and evidence freshness to existing delivery workflows.
- Connected system design, threat requirements, control status, and implementation verification.
- Updated the portal with six workflow guides, new task shortcuts, and the four new skills.

### Fixed

- Corrected technical assessment discovery text to describe one supplied item.
- Required supplied acceptance criteria at every PR review depth.
- Preserved intended assertions during regression falsification and required meaningful behavioral failure evidence.
- Replaced universal release thresholds with project baselines, observation limits, and agreed response criteria.
- Distinguished local static source analysis from active security testing and source uploads.

## v1.0.1 - 2026-11-06

### Fixed

- Fixed catalog validation in fresh checkouts. Local Cursor rules and ignored maintainer research directories are optional.
- Added checks for absent and present optional paths. Required repository files must still exist.

## v1.0.0 - 2026-11-06

### Added

- Added GitHub Pages publication after stable version increases on `main`. Package and browser checks must pass before publication.
- Replaced the portal's AT initials with the command buckle brand icon. Added SVG and 16, 32, and 48-pixel PNG favicons.
- Added native skills plugins for Cursor, Claude Code, and Codex, with 29 shared skills and a separate optional Auto Agent package.
- Added an offline portal with search, category guidance, task shortcuts, expected results, workflows, and host setup instructions.
- Added desktop and mobile browser checks, automated accessibility scans, and deterministic catalog and portal builds.
- Added repository contribution guidance with evidence checkpoints and checks for changed conventions.

### Changed

- Replaced the `dev-lite-workflow` skill with `phased-delivery`. Each supplied ticket maps to one phase and one pull request.
- Expanded `shape-up` to compare product requests with current behavior before shaping implementation work.
- Updated review, testing, security, and handoff guidance. Added shared output rules and refreshed upstream provenance records.
- Applied the selected portal design with a charcoal header, slate surfaces, distinct category icons, highlighted results, and amber actions.

### Breaking changes

- Removed the duplicate project lifecycle pack. Target repositories own their delivery forms, approval gates, and controlled records.
- Retired the `ai-feature-delivery` pack selector and `--rules full` mode. Both return migration guidance before writing files.
- Native plugins expose skills by default. Commands, rules, hooks, and unattended Auto Agent skills require their applicable optional installation paths.

### Upgrade notes

- Read [the migration guide](docs/project-workflow-boundary.md) before updating an existing project. Installed legacy files are not removed automatically.
- Use `phased-delivery` for new delivery work. The `dev-lite-workflow` installer selector remains a compatibility alias.
- Preview project installation changes with `--dry-run`. Preserve project-owned command adapters and instruction files.
- All six plugin manifests and the Claude marketplace entries use version `1.0.0`.

## v0.2.0 - 2026-07-07

New CRAP-analysis pack, a `/pr-review-init` config generator, and Claude Code
`CLAUDE.md` pointer support in the installer.

### Added

- Added the `crap-analysis` pack: a skill plus `/do-crap-analysis`,
  `/crap-config`, and `/crap-refactor` commands for wizard-driven config,
  deterministic complexity/coverage scoring, review, and opt-in refactors,
  with a config template and reference docs.
- Added the `/pr-review-init` command to the `pr-review` pack: drafts a
  `.pr-review.md` repo config from repository evidence instead of starting
  from a blank template.
- Added a `CLAUDE.md` pointer block to `claude`-harness installs so Claude Code
  picks up the installed toolbelt the same way `AGENTS.md` serves other
  harnesses.

### Changed

- Tuned `pr-review` auto-tier selection and `phase-gate` mode guidance for
  phase-sized PRs, and added an output footer that nudges toward
  `/pr-review-init` when a repo has no review config.
- Updated README, wiki (Installation, Code-Review, new Utilities page), and
  tutorial docs to cover the new pack, command, and install behavior.

### Upgrade / deploy notes

- No migrations or runtime services are required.
- Rerun `./install.sh --harness <cursor|claude|codex|all> <pack ...|all>
  <target-folder>` in target projects to pick up the new pack and the
  `CLAUDE.md` pointer block.

### Rollback

- Revert the release commit and retag from the prior known-good commit if the
  changelog or release metadata is wrong.
- For installed target projects, rerun the installer from `v0.1.0` with
  `--force` if release files were already copied out.

## v0.1.0 - 2026-07-02

First public release of `agent-toolbelt`: reusable commands, skills, workflows,
templates, and installer packs for AI-assisted software delivery.

### Added

- Added the unified `install.sh` entry point with explicit harness selection for
  Cursor, Claude Code, Codex-style skills, or all harnesses.
- Added installable packs for feature delivery, bug diagnosis, PR review,
  review triggers, test coverage, simplification, release readiness, handoff,
  worktree isolation, ticket sync, and backlog assessment.
- Added hidden `.atb/` shared artifact layout so installed templates, workflows,
  examples, skills, and shared contracts avoid top-level project clutter.
- Added Cursor rule modes, `AGENTS.md` workflow pointers, polyrepo `--sweep`
  installs, and private Cursor plugin build support.
- Added user-facing docs for installation, workflows, code review utilities,
  tutorial usage, command mapping, release versioning, and installer safety.

### Changed

- Reworked earlier per-pack installers into the current single installer model.
- Clarified README entry points and wiki navigation around install paths, packs,
  and when to use each workflow.
- Namespaced shared contracts under `.atb/` for installed projects.

### Fixed

- Hardened installer behavior around harness gating, pack reachability, AGENTS.md
  regeneration, and doc/update guardrails.
- Improved skill metadata and packaging consistency so hosts can discover
  installed skills more predictably.

### Security

- Added project safety guidance to keep private notes, credentials, customer
  data, cloned repositories, and scratch files out of the public toolbelt repo.

### Upgrade / deploy notes

- No migrations or runtime services are required.
- Install by running `./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>`.
- Use `./install.sh --list` to confirm available packs before installing.

### Rollback

- Revert the release commit and retag from the prior known-good commit if the
  changelog or release metadata is wrong.
- For installed target projects, rerun the installer from the prior known-good
  repository revision with `--force` if release files were already copied out.
