---
name: ai-feature-delivery
description: Create release-traceable delivery artifacts for regulated or cross-functional software work. Use when defining feature records, SDD/doc-impact artifacts, refinement tickets, gate checks, stakeholder pings, QA handoff, PR traceability, or release documentation.
---

# ai-feature-delivery

Use this skill to turn a raw feature idea into traceable delivery artifacts. The
central object is the **Feature Master Record**: every SDD, ticket, test plan,
document delta, QA handoff, and release manifest should derive from it or link
back to it.

## Operating Rules

- Ask for missing release, feature ID, owner, impacted systems, and required
  reviewers before declaring any gate ready.
- Keep assumptions explicit. Do not invent regulatory, medical, security, or
  release claims.
- Keep all controlled artifacts release-scoped with `REL-YYYY.MM` or
  `REL-FUTURE`.
- Treat release packaging as allowlist-based: only documents in the release
  manifest and marked `APPROVED_FOR_RELEASE` are eligible.
- Preserve traceability from feature -> requirement -> ticket -> test ->
  document section -> gate evidence.
- Prefer updating the existing master record over creating disconnected docs.
- Track release eligibility separately from work status.
- Draft stakeholder pings from explicit clarification or pending-action items;
  do not imply that a message was sent unless an integration actually sent it.
- Keep pure dev work lightweight, but when feature metadata exists preserve
  feature ID, target release, doc-delta expectations, test evidence, and PR
  traceability.
- For dev execution, stop after producing an implementation plan and wait for
  user approval before coding unless the user already explicitly asked to
  implement after the plan.
- Treat the implementation plan as durable handoff state. Update current state,
  task status, evidence, checks, blockers, branch/PR state, and resume
  instructions after every meaningful dev step.
- Do not push directly to `main`, `master`, or the repository default branch
  during feature delivery unless the user explicitly asks for that exact
  behavior. Use a feature/fix branch, run PR readiness and traceability checks,
  then open a PR.
- Prefer the smallest useful command for the current state. Use
  `/workflow-router` when the next step is unclear.

## Modes (load the matching reference for the step)

The Operating Rules above always apply. For the detailed procedure of each mode,
load its reference:

- `references/define-and-steward.md` — starting a feature (`/feature-start`),
  fleshing it out (`/feature-fleshout`), stewardship (`/steward-review`), and
  stakeholder pings (`/draft-pings`).
- `references/design-refine-dev.md` — drafting design docs (`/sdd-draft`,
  `/doc-impact`), slicing tickets (`/refine-to-tickets`), and starting dev work
  from a feature (`/start-dev-from-feature`, `/implementation-plan`).
- `references/gates-qa-release.md` — gate checks (`/gate-check`), PR
  traceability and doc-delta review (`/pr-traceability-review`,
  `/doc-delta`), QA handoff (`/qa-handoff`), and release documentation control
  (`/release-manifest`, `/release-doc-check`).

Templates live in `../../templates/`; the lifecycle and gates are in
`../../workflows/ai-feature-delivery-lifecycle.md`.
