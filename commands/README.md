# commands/

Slash commands and reusable command snippets worth saving. One `.md` per
command (Claude Code command format), or short shell snippets you reuse.

For a guided command path, see `../docs/tutorial.md`. If the next command is
unclear inside a pilot repo, start with `/workflow-router`.

- `/pr-review` - run the tiered PR/code review workflow.
- `/shape-up` - interrogate a vague request into an agreed brief before building.
- `/to-issues` - slice an approved brief into vertical-slice tickets.
- `/simplify` - actively clean up a diff/area and apply cleanups on opt-in.
- `/code-smell` - detect-only scan of an area for structural smells.
- `/cover` - author/strengthen behavior-pinning tests for a diff/module/bug repro, on opt-in.
- `/cover-gaps` - detect-only scan for missing/weak coverage, ranked by risk × likelihood.
- `/ship-it` - prepare a merged change for release (readiness, rollback, notes, rollout).
- `/retrofit` - apply one defined change across every site (library swap, API rename, upgrade).
- `/bug-intake` - triage a bug report and open a durable investigation.
- `/reproduce` - establish a manual or automated reproduction before RCA.
- `/rca` - root-cause a reproduced bug (`--diagnose` for read-only).
- `/fix-plan` - turn a confirmed root cause into the smallest verified fix.
- `/handoff` - write a resumable handoff so a fresh session can continue.
- `/dev-intake` - create a lightweight feature brief from an idea or ticket.
- `/dev-plan` - create a phased implementation plan for dev-lite work.
- `/dev-start-phase` - prepare the next dev-lite phase before coding.
- `/dev-implement-task` - implement exactly one planned task.
- `/dev-phase-review` - review a completed dev-lite phase before continuing.
- `/dev-fix-review-issues` - fix only the latest phase review findings.
- `/dev-pr-review` - run final PR readiness review for the dev-lite workflow.
- `/workflow-router` - choose the smallest useful toolbelt command or workflow.
- `/feature-start` - create a Feature Master Record and Gate 1 questions.
- `/feature-fleshout` - flesh out stakeholder questions, risks, and Gate 1 readiness.
- `/steward-review` - review feature health, blockers, stale actions, and next actions.
- `/draft-pings` - draft stakeholder follow-up messages from owned open items.
- `/sdd-draft` - draft or update an SDD from the master record.
- `/doc-impact` - map CDP/SRS/SAD/SDD impacts.
- `/doc-delta` - check whether implementation or ticket changes require doc updates.
- `/refine-to-tickets` - slice a feature package into traceable tickets.
- `/start-dev-from-feature` - bridge a refined feature/ticket into dev execution.
- `/implementation-plan` - create a concise implementation plan.
- `/write-tests` - plan or write tests for behavior changes.
- `/webapp-test` - plan or run browser/webapp verification for user-facing changes.
- `/dev-doc-delta-check` - bridge dev work back to required document deltas.
- `/review-diff` - review a local diff before PR.
- `/pr-ready-check` - check whether implementation is ready for PR.
- `/pr-traceability-review` - compare PRs to tickets, docs, tests, and release metadata.
- `/role-review` - run a product, engineering, design, QA, security, or release review gate.
- `/gate-check` - validate readiness for a lifecycle gate.
- `/qa-handoff` - build a QA execution package.
- `/release-manifest` - create or update a release documentation manifest.
- `/release-doc-check` - validate docs against release eligibility rules.

## Choosing between similar commands

Some commands overlap. Use these tables to pick the right one.

**Reviewing a change**

| Command | Use it for |
|---|---|
| `/pr-review` | Deep, tiered, multi-agent code review (bugs, security, perf, tests, maintainability, standards). The heavy code-quality pass. |
| `/review-diff` | Quick local-diff review before a PR — lighter than `/pr-review`. |
| `/pr-ready-check` | Readiness checklist: is the change *ready to open or complete* a PR (summary, tests, risks)? Not code review. |
| `/pr-traceability-review` | Does the PR trace to its feature record, ticket scope, docs, tests, and release metadata? Not code quality. |
| `/dev-pr-review` | Dev Lite final readiness gate against the Feature Brief + plan + diff. |

**Checking documentation impact**

| Command | Use it for |
|---|---|
| `/doc-impact` | Up-front map of which controlled docs (CDP/SRS/SAD/SDD) a feature will touch. |
| `/doc-delta` | Formal check that a ticket/PR's changes *require* controlled-doc updates. |
| `/dev-doc-delta-check` | Lightweight in-dev / pre-PR bridge to keep code aligned with controlled docs. |

**Planning implementation**

| Command | Use it for |
|---|---|
| `/dev-plan` | Phased Dev Lite build plan from a Feature Brief. |
| `/implementation-plan` | Concise single-ticket plan in the feature-delivery track. |

**Shaping a request before building**

| Command | Use it for |
|---|---|
| `/shape-up` | *Interrogate* a vague request into an agreed brief (one question at a time, repo-first, gated on approval). |
| `/dev-intake` | *Capture* a brief by making safe assumptions — lighter, no grilling. Compose: `/shape-up` -> `/dev-intake`. |
| `/feature-fleshout` | The heavy, regulated, stakeholder version (Feature Master Record, gates). |
| `/to-issues` | Slice an approved brief into vertical-slice tickets (dev lane). Use `/refine-to-tickets` for the regulated lane. |

**Cleaning up code**

| Command | Use it for |
|---|---|
| `/simplify` | *Apply* high-conviction cleanups to a diff/area (dead code, thin wrappers, reuse, small inefficiencies), on opt-in. Many small, *different* changes. |
| `/code-smell` | *Detect-only* scan of an area for structural smells ranked by severity × confidence. Applies nothing. |
| `/pr-review` | *Find* bugs/quality issues with a merge verdict on changed lines. Applies nothing. |
| `/retrofit` | Apply *one defined* change across *every* site (library swap, API rename, framework upgrade). The same change, many places — discover/transform/verify, opt-in. |

**Authoring tests**

| Command | Use it for |
|---|---|
| `/cover` | *Author/strengthen* behavior-pinning tests for a diff, module, or bug repro (red→green regression lock), on opt-in. Framework-detected, falsified, deterministic; lane-agnostic. Writes tests only. |
| `/cover-gaps` | *Detect-only* scan for missing/weak coverage, ranked by risk × likelihood. Applies nothing — hands top gaps to `/cover`. |
| `/write-tests` | Regulated AI Feature Delivery test planning/authoring tied to a feature/ticket's traceability and doc control. The gated lane; `/cover` is the standalone one. |

**Diagnosing a bug (Bug-to-Fix lane)**

| Command | Use it for |
|---|---|
| `/bug-intake` | Triage a defect: severity, intake schema, dedup, seed the durable investigation file. |
| `/reproduce` | Establish reproduction — confirm a manual (QA) repro, or build an automated failing test. |
| `/rca` | Root-cause a reproduced bug; `--diagnose` for a read-only analysis that never edits files. |
| `/fix-plan` | Turn a confirmed cause into the smallest safe fix + verification, then hand to dev/review. |
| `/handoff` | Cross-cutting: write a resumable summary before a context reset or session transfer. |

The Bug-to-Fix lane hands off to the shared back half: `/fix-plan` → `/dev-implement-task` (or
`/implementation-plan`) → `/pr-review` / `/dev-pr-review`. `/reproduce` also hands the repro to
`/cover`, which turns it into a committed red→green regression test.

**Releasing a change**

| Command | Use it for |
|---|---|
| `/ship-it` | Lightweight launch readiness: go/no-go check, rollback plan, release notes, rollout/monitor plan. Pipeline-aware — hands off when external CI/CD owns the deploy. |
| `/release-manifest` + `/release-doc-check` | The regulated path: release manifests + controlled-doc eligibility (AI Feature Delivery). |
| `/dev-pr-review` / `/pr-ready-check` | Earlier gate — is the change ready to *open/complete a PR* (not to release). |
