# Changelog

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
