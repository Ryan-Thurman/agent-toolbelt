---
description: Index of the Agent Toolbelt commands and guidance for choosing an entry point.
---

# commands/

Project-scoped slash commands and reusable command snippets worth saving. These
files support the legacy `install.sh` compatibility workflow; they are not
native plugin skills, and native plugin manifests intentionally suppress
command discovery. Canonical behavior lives in each skill's `SKILL.md`.

Use the [offline portal](../portal/generated/index.html) for discovery,
taxonomy, examples, and common workflow sequences.

For workflow entry points, see [the wiki](../wiki/Workflows.md). If the next command is
unclear inside a pilot repo, start with `/workflow-router`.

## Choosing between similar commands

Some commands overlap. Use these tables to select the correct command.

**Reviewing a change**

| Command | Use it for |
|---|---|
| `/pr-review` | Deep, tiered, multi-agent code review (bugs, security, perf, tests, maintainability, standards). The heavy code-quality pass. |
| `/code-quality-gate` | Optional unless policy or risk requires it: freezes scope, fingerprints the diff/untracked content, runs required checks plus focused standards/maintainability review, and records PASS/FAIL/CAPPED/BLOCKED evidence. `--mode=report` never edits; `--mode=apply` is bounded and explicit. |
| `/pr-improve` | Fix accepted findings in bounded, scope-guarded rounds with a durable ledger; run after review. |
| `/pr-review-init` | Draft the repo's `.pr-review.md` (per-repo review priorities that `/pr-review` loads) from repo evidence — docs, revert/hotfix history, review threads, rejection memory. Draft only; the team prunes and commits. |
| `/pr-review-reply` | The round-trip: answer a human reviewer's PR threads — triage each (`answered`/`changed`/`needs-follow-up`), re-review only the code changed since the review, reply per-thread. Run after `/pr-review`. |
| `/phase-gate` | In-loop gate at a phase boundary: a fresh subagent reviews the phase PR and posts comments. The team mode stops for human merge; `--merge` fixes blockers and merges. |
| `/review-on-open` | The trigger: auto-fire `/pr-review --comment` in a fresh agent when a PR is opened/updated. Host-agnostic poller (drive with `/loop` / `/schedule`); ships a GitHub Actions event workflow too. Doesn't review itself — it invokes `/pr-review` for you. |
| `/enqueue-review` · `/review-queue-worker` | Push-based trigger: a producer agent enqueues a PR onto a local SQLite queue (`/enqueue-review`); a worker claims jobs and runs `/pr-review --comment` on each (`/review-queue-worker`, drive with `/loop` / `/schedule`). Decoupled, fully local — no CI/webhook/API key. |
| `/review-diff` | Local-diff entry to the shared `pr-review` process; preserves tier and focus options. |
| `/pr-ready-check` | Readiness checklist: is the change *ready to open or complete* a PR (summary, tests, risks)? Not code review. |
| `/dev-pr-review` | Readiness review for one Phased Delivery PR against its source acceptance criteria, own diff, and correct base. |

**Planning implementation**

| Command | Use it for |
|---|---|
| `/dev-plan` | Source-aware phase/PR map; an approved project ticket becomes one phase and one PR. |
| `/implementation-plan` | Concise single-ticket plan for supplied requirements or tickets. |
| `/phase-create` | Durable phase file for a bounded implementation phase that must survive context resets. |
| `/phase-start` | Context packet for a fresh or reset session starting a phase. |
| `/phase-close` | Phase handoff before clearing, compacting, or transferring context. |
| `/phase-status` | Current phase and handoff state for a room or project. |

**Shaping a request before building**

| Command | Use it for |
|---|---|
| `/shape-up` | Compare an ask with current system behavior in a report-only gap review, or shape a vague request into an approved brief. |
| `/product-discovery` | Assess evidence, assumptions, risks, and thresholds before deciding a candidate is ready to shape. |
| `/tech-assess` | Decide whether and how to do a technical backlog item before implementation: options, dependency/library decision, risks, tests, and next workflow. |
| `/ticket-discover` | Turn a narrow ticket that references an existing precedent into a concrete gap analysis, test plan, and implementation handoff. |
| `/dev-intake` | Clarify an unclear raw requirement entering Phased Delivery; skip it when an approved brief, plan, or ticket already exists. |
| `/style-guide-init` | Derive contribution/style guidance from repository evidence, then check and refresh affected claims as inputs change. |

**Cleaning up code**

| Command | Use it for |
|---|---|
| `/simplify` | *Apply* high-conviction cleanups to a diff/area (dead code, thin wrappers, reuse, small inefficiencies), on opt-in. Many small, *different* changes. |
| `/code-smell` | *Detect-only* scan of an area for structural smells ranked by severity × confidence; `--architecture` reports deepening candidates. Applies nothing. |
| `/pr-review` | *Find* bugs/quality issues with a merge verdict on changed lines. Applies nothing. |
| `/retrofit` | Apply *one defined* change across *every* site (library swap, API rename, framework upgrade). The same change, many places — discover/transform/verify, opt-in. |

**Authoring tests**

| Command | Use it for |
|---|---|
| `/cover` | *Author/strengthen* behavior-pinning tests for a diff, module, or bug repro (red→green regression lock), on opt-in. Framework-detected, falsified, deterministic; lane-agnostic. Writes tests only. |
| `/test-case-design` | *Design* prioritized QA cases from requirements and risks; report-only, then hand selected cases to `/cover` or `/webapp-test`. |
| `/cover-gaps` | *Detect-only* scan for missing/weak coverage, ranked by risk × likelihood. Applies nothing — hands top gaps to `/cover`. |
| `/write-tests` | Alias for `/cover`. Use `test-case-design` for case planning. |

**Security and architecture decisions**

| Command | Use it for |
|---|---|
| `/threat-model` | Design-time assets, trust boundaries, attacker paths, mitigations, and verification. |
| `/security-audit` | Bounded read-only security review; active testing requires written authorization. |

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
| `/dev-pr-review` / `/pr-ready-check` | Earlier gate — is the change ready to *open/complete a PR* (not to release). |

## Other commands

The comparison tables do not include these commands.

- `/user-research-synthesis` - connect customer research to themes, counterexamples, and sample limits.
- `/product-outcome-review` - assess whether an experiment or release improved its original customer problem.
- `/tech-debt-discovery` - find and prioritize evidence-backed maintenance work across a repository.
- `/system-design` - produce a design document with a linked threat review and security requirements.
- `/plan-review` - review requirement coverage, decisions, dependencies, connections, and verification before execution.
- `/to-issues` - slice an approved brief into vertical-slice tickets.
- `/ticket-sync` - publish/sync sliced tickets to the repo's tracker (GitHub Issues / Jira / Azure Boards).
- `$vercel-composition-patterns` - conditional React component API/composition guidance.
- `$vercel-react-best-practices` - conditional React/Next performance guidance.
- `/worktree` - create/list/remove an isolated git worktree so parallel agents in a shared polyrepo dir don't clobber each other's branch.
- `/crap-config` - wizard: hydrate `.crap-analysis.json` with analysis, coverage, verify commands and output paths.
- `/do-crap-analysis` - run CRAP analysis on branch changes since the base (committed, staged, unstaged, and untracked). The script runs the commands once and returns a deterministic verdict.
- `/crap-refactor` - apply behavior-preserving refactor from the brief after `/do-crap-analysis` flagged REFACTOR (opt-in).
- `/dev-start-phase` - prepare a phase branch, target, checks, and dependencies.
- `/dev-implement-task` - implement a bounded step within one phase or ticket.
- `/dev-phase-review` - review one phase against its source and PR base.
- `/dev-fix-review-issues` - fix only the latest phase review findings.
- `/workflow-router` - choose the smallest useful toolbelt command or workflow.
- `/webapp-test` - plan or run browser/webapp verification for user-facing changes.
- `/role-review` - run a product, engineering, design, QA, security, or release review.
