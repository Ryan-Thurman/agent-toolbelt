# Release Versioning

This repo is public and installable, so releases should make three things clear:
what users are allowed to do with the repo, what changed, and which revision they
can install or reference.

## Minimum Release Files

Before treating the toolbelt as generally reusable by other users, add:

- `LICENSE` - choose the project license intentionally. For this repo, MIT is a
  reasonable default if the goal is broad reuse with minimal friction. Consider
  Apache-2.0 instead if an explicit patent grant is important.
- `CHANGELOG.md` - summarize user-visible changes by version so installers,
  pack users, and contributors can see what changed without reading the git log.

Do not use release tags as a substitute for a changelog. Tags identify a
revision; the changelog explains why that revision matters.

## First Version

Use `v0.1.0` for the first public version once the installer and pack layout are
stable enough that another user can install by version with confidence.

Before tagging `v0.1.0`, confirm:

- `./install.sh --list` shows the expected packs.
- The primary install path works for at least one target folder.
- `README.md`, `wiki/Installation.md`, and `CHANGELOG.md` describe the same
  install surface.
- The selected license is committed as `LICENSE`.

## Version Rules

Use SemVer-style version numbers, but keep the policy practical for this repo:

- Patch: docs clarifications, typo fixes, prompt wording fixes, small installer
  fixes, or non-breaking template updates.
- Minor: new packs, new slash commands, new skills, new workflows, or additive
  installer options.
- Major: breaking changes to install layout, pack names, command names, required
  harness behavior, or files users are expected to reference directly.

When in doubt, choose the higher version bump if existing users may need to
change how they install or invoke the toolbelt.

## Changelog Format

Keep `CHANGELOG.md` short and scannable:

```md
# Changelog

## v0.1.0 - YYYY-MM-DD

- Added initial installer packs for ...
- Documented ...
- Fixed ...
```

Group entries by release version. Prefer user-facing behavior over internal
implementation detail.

## Release Checklist

For each release:

1. Update `CHANGELOG.md`.
2. Confirm docs match the installer and pack list.
3. Commit the changelog and any release docs.
4. Tag the release, for example `git tag v0.1.0`.
5. Push the branch and tag.
