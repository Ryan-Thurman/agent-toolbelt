---
name: ship-it
description: Prepare a change for release safely — readiness check, rollback plan, release notes, and a rollout/monitor plan. Pipeline-aware: prepares and hands off when an external CI/CD owns the deploy, or walks the rollout when you own it. Use after a PR is merged/approved and you're about to release. Not for regulated release-manifest/doc-control work (use ai-feature-delivery).
---

# ship-it

The lightweight release-readiness step that closes the dev lanes — they end at "PR merged," this
takes it to "released safely." Every release should be **reversible, observable, and incremental**.

> Lifts concepts (MIT) from addyosmani/agent-skills (shipping-and-launch) and gstack
> (land-and-deploy, document-release) — see **Credits**.

## Principles (always)

- **Rollback first.** The one thing teams skip. Do not call a change ready to release until there's
  a concrete way to undo it and a clear trigger for using it.
- **Reversible, observable, incremental.** Prefer feature-flagged + staged rollout over a big-bang
  deploy; know what you'll watch and for how long.
- **Pipeline-aware — don't assume you own the deploy.** In many orgs an external CI/CD pipeline you
  can't change takes over once a PR is approved/merged. In that case ship-it **prepares and hands
  off**: it produces the readiness verdict, rollback plan, release notes, and watch-list, and stops
  — it does not run deploy steps. Only when *you* own the deploy does it walk the rollout.
- **Never deploy without explicit confirmation.** Even when you own it, ship-it proposes the
  deploy/tag commands; it does not execute them unprompted, and never pushes to a default branch
  unless asked.

## Flow

1. **Readiness check** (`references/readiness-checklist.md`) — verify tests/build/lint, security,
   performance, infra (env/migrations/health check), and docs. Produce a **go / no-go** verdict
   with the blocking gaps listed. Scope the checklist to the change (skip the a11y/Web-Vitals rows
   for a backend-only change, etc.).
2. **Rollback plan** — state exactly how to revert (git revert / flag-off / migration-down / prior
   release), and the **trigger** that says "roll back now" (see the thresholds in
   `references/rollout-and-rollback.md`).
3. **Release notes** — draft a changelog / release-notes entry from the merged commits/PRs since
   the last tag, using `templates/release-notes.md`; suggest the version/tag. Cross-check that
   README / docs the change affects are updated (or flag them).
4. **Rollout + monitor plan** (`references/rollout-and-rollback.md`) — choose big-bang vs.
   flagged/staged/canary, and list the metrics + window to watch at each stage.
5. **Hand off or roll out:**
   - **Pipeline owns the deploy** → output steps 1–4 as the release package and stop. Frame step 4
     as "what to watch once the pipeline deploys," since you won't be driving it.
   - **You own the deploy** → walk the staged rollout, proposing the exact deploy/tag commands at
     each gate and pausing for confirmation; advance only when the stage's thresholds pass.

## Determining who owns the deploy

Ask, or infer from the repo: a CI/CD config that deploys on merge to the default branch (GitHub
Actions `deploy`, GitLab CI, a release pipeline) usually means **the pipeline owns it** — prepare
and hand off. A repo with no deploy automation, or manual deploy scripts, usually means **you own
it**. When unsure, ask before doing anything that deploys.

## References

- `references/readiness-checklist.md` — the pre-launch checklist (code quality, security,
  performance, accessibility, infrastructure, docs), to scope to the change.
- `references/rollout-and-rollback.md` — feature-flag lifecycle, the staged rollout sequence, the
  advance/hold/roll-back threshold table, the roll-back triggers, and the monitoring list.

## Credits

Concepts adapted (MIT, reworded) from addyosmani/agent-skills `shipping-and-launch` (pre-launch
checklist, feature-flag lifecycle, staged rollout + decision thresholds, rollback triggers) and
gstack `land-and-deploy` / `document-release` (the deploy-handoff boundary, release-notes/doc audit).
