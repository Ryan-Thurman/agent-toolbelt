---
name: ship-it
description: Prepare a change for release with readiness checks, rollback, release notes, and rollout monitoring. Use after PR merge or approval. Follow the project's release policy and deployment owner.
---

# ship-it

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Take a merged or approved change to "released safely".
Make every release reversible, observable, and incremental.
Prefer a feature flag and a staged rollout to a big-bang deploy.

## Mutation Policy

- Prepare the release package by default.
- Edit release artifacts only when the user explicitly asks.
- When a pipeline owns the deploy, produce the release package and stop. Do not run deploy steps.
- When you own the deploy, propose each deploy, tag, push, or rollout command. Run it only after explicit confirmation at that gate.
- Push to a default branch only when the user asks.
- Before you run or retry an authorized external action, read `shared/contracts/references/operation-retries.md`.
  Keep the pipeline as the operation owner when it controls publication.

## Determine who owns the deploy

Ask, or infer from the repo: a CI/CD config that deploys on merge to the default branch (GitHub
Actions `deploy`, GitLab CI, a release pipeline) usually means **the pipeline owns it** — prepare
and hand off. A repo with no deploy automation, or manual deploy scripts, usually means **you own
it**. When unsure, ask before doing anything that deploys.

## Flow

1. **Readiness check.** Read `references/readiness-checklist.md` and scope it to the change.
   Give a **GO / NO-GO** verdict with the blocking gaps listed.
2. **Rollback plan.** Read `references/rollout-and-rollback.md`. State how to revert and the
   trigger that means "roll back now". When the project has no rollback trigger, the verdict is
   NO-GO. List the missing trigger as the blocking gap.
3. **Release notes.** Draft a release-notes entry from the merged commits or PRs since the last
   tag with `templates/release-notes.md`. Suggest the version or tag. Confirm the documentation
   gate in the readiness checklist.
4. **Rollout and monitor plan.** Choose big-bang, flagged, staged, or canary rollout. List the
   metrics, the observation window, and the advance, hold, and recover rules for each stage.
5. **Hand off or roll out.**
   - **Pipeline owns the deploy:** Give steps 1–4 as the release package. Frame step 4 as the
     watch-list for the pipeline deploy.
   - **You own the deploy:** Walk the staged rollout. Advance only when the stage's rules pass.

## Output

Give a release package: the GO / NO-GO verdict with blockers, the rollback plan and trigger,
the release-notes draft, and the rollout and monitor plan.
When you own the deploy, add the proposed deploy and tag commands.
After the release, recommend `workflows/delivery-retrospective-workflow.md` to review the delivery process.
