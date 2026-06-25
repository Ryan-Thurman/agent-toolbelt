---
description: Prepare a merged/approved change for release — readiness check, rollback plan, release notes, and a rollout/monitor plan. Pipeline-aware: hands off when an external CI/CD owns the deploy, or walks the rollout when you own it.
argument-hint: "[release-or-change-context]"
---

# /ship-it

Take a merged or approved change from "done" to "released safely" using the `ship-it` skill. Every
release should be reversible, observable, and incremental.

> **When to use vs related:** `/ship-it` is the lightweight launch-readiness step at the tail of the
> Dev Lite / Bug-to-Fix lanes. For regulated release work (release manifests, controlled-doc
> eligibility) use `/release-manifest` + `/release-doc-check`. For PR-open readiness use
> `/dev-pr-review` / `/pr-ready-check`.

**Arguments:** `$ARGUMENTS`

## Rules

- Read the skill's `references/readiness-checklist.md` and `references/rollout-and-rollback.md`.
- **Rollback first:** don't declare it ready to release without a concrete revert mechanism and a
  trigger.
- **Pipeline-aware:** if an external CI/CD owns the deploy, prepare the release package and hand off
  — do not run deploy steps. Determine ownership before doing anything that deploys (ask if unsure).
- **Never deploy without explicit confirmation**, and never push to a default branch unless asked.

## Steps

1. **Readiness check** — run `references/readiness-checklist.md`, scoped to the change; return a
   **go / no-go** verdict with any blocking gaps.
2. **Rollback plan** — how to revert (flag-off / `git revert` / prior tag / migration-down; flag any
   irreversible step) and the trigger that means roll back.
3. **Release notes** — draft from the merged commits/PRs since the last tag using
   `templates/release-notes.md`; suggest the version/tag; confirm affected docs are updated or flag
   them.
4. **Rollout + monitor plan** — pick big-bang vs. flagged/staged/canary; list the metrics + window
   to watch and the advance/hold/roll-back thresholds.
5. **Hand off or roll out** — if a pipeline owns deploy, output the package and stop (frame the
   monitor plan as the hand-off watch-list); if you own deploy, walk the rollout, proposing the
   exact commands and pausing for confirmation at each gate.

## Output

A release package: the go/no-go verdict (with any blockers), the rollback plan + trigger, a release
notes draft, and the rollout/monitor plan. When you own the deploy, also the proposed deploy/tag
commands (never executed without confirmation). When a pipeline owns it, the package plus the
hand-off watch-list.
