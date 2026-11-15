---
description: Guidance for choosing between similar Agent Toolbelt commands and entry points.
---

# commands/

These slash commands are for the `install.sh` compatibility path.
Native plugin installs do not load them.
Each command file gives its argument syntax and names the skill to follow.
That skill's `SKILL.md` owns the behavior.
Each command's `description` field states its purpose.
The [offline portal](../portal/generated/index.html) lists all commands and skills.

If the next command is not clear, start with `/workflow-router` (installed with `phased-delivery` or `all`).

## Choose between similar commands

The task-to-skill table lives in [workflow-router.md](workflow-router.md). This page only separates similar commands.
Each row separates commands that can match the same request.

| Commands | Skill | Choose by |
|---|---|---|
| `/product-discovery` · `/shape-up` · `/user-research-synthesis` | `product-discovery` · `shape-up` · `user-research-synthesis` | Decide whether to build · shape a selected ask or compare it with current behavior · understand supplied research. |
| `/shape-up` · `/to-issues` | `shape-up` | Gap review or shaping · slice an approved brief into tickets. |
| `/story-refinement` | `story-refinement` | Prepare a ticket for refinement, resolve its questions, or check whether it is ready. |
| `/shape-up` · `/dev-intake` | `shape-up` · `phased-delivery` | Shape a vague ask into an approved brief · clarify a raw requirement that enters Phased Delivery. |
| `/tech-assess` · `/ticket-discover` · `/tech-debt-discovery` | `tech-backlog-assessment` · `ticket-discovery` · `tech-debt-discovery` | Decide one item · adapt a named precedent · find candidates across a repository. |
| `/product-outcome-review` · `/ship-it` | `product-outcome-review` · `ship-it` | Customer outcome after an experiment or release · immediate release readiness and health. |
| `/dev-plan` · `/plan-review` | `phased-delivery` | Plan a requirement or ticket set as one PR per phase · review an existing plan. |
| `/dev-intake` -> `/dev-plan` -> `/dev-start-phase` -> `/dev-implement-task` -> `/dev-phase-review` -> `/dev-pr-review` -> `/dev-fix-review-issues` | `phased-delivery` | Use in this order. Clarify a raw requirement · plan the phases · prepare the next phase · implement a bounded step · review the phase branch · check the open PR · fix scoped findings. |
| `/phase-create` -> `/phase-start` -> `/phase-close` · `/phase-status` | `phase-context-workflow` | Use in this order. Create a phase file · start or resume from a context packet · close with a handoff. `/phase-status` shows phase files and handoff state. |
| `/system-design` · `/dev-plan` | `system-design` · `phased-delivery` | Architecture questions, designs, decision records, repository maps · phase and PR map. `/implementation-plan` is an alias for `/dev-plan`. |
| `/threat-model` · `/security-audit` | `threat-model` · `security-audit` | A design before it is built · implemented code. |
| `/reliability-review` · `/failure-scenario-design` | `reliability-review` · `failure-scenario-design` | Failure modes and reliability requirements for a design, or production readiness · failure scenarios and staging experiment plans. |
| `/bdd-scenarios` | `bdd-scenarios` | Write or review feature files from acceptance criteria · plan a BDD runner. |
| `/risk-areas` | `risk-area-mapping` | Draft risk areas for one repo or a folder of repos · apply the approved entries. |
| `/test-case-design` · `/cover` (`/write-tests`) · `/cover-gaps` · `/webapp-test` | `test-case-design` · `cover` · `webapp-testing` | Design cases only · write tests · find coverage gaps only · verify a browser flow. |
| `/pr-review` · `/review-diff` · `/role-review` | `pr-review` | A pull request · a local diff before a PR exists (never posts) · a supplied artifact from one role's perspective. |
| `/pr-review` · `/code-quality-gate` · `/pr-ready-check` · `/dev-pr-review` | `pr-review` · `code-quality-gate` · `pr-review` · `phased-delivery` | Code findings · policy gate with recorded evidence · readiness to open a PR · one Phased Delivery PR against its acceptance criteria. |
| `/pr-improve` · `/pr-review-reply` | `pr-improve` · `pr-review-reply` | Fix accepted findings · answer a human reviewer's threads. |
| `/phase-gate` · `/review-on-open` · `/enqueue-review` + `/review-queue-worker` | `phase-gate` · `review-on-open` · `review-queue` | Review at a phase boundary · review when a PR opens or updates · review from a local queue. |
| `/simplify` · `/code-smell` · `/retrofit` · `/crap-refactor` | `simplify` · `retrofit` · `crap-analysis` | Apply small cleanups · detect smells only · apply one defined change at every site · refactor after a CRAP verdict. |
| `/phase-close` · `/handoff` | `phase-context-workflow` · `handoff` | Close a phase file · hand off any other work. |
| `/papercuts` · `/papercuts --feature` | `papercuts` | Friction in this session · friction across one feature. Use the delivery retrospective workflow for the process after a release. |
| `/bug-intake` -> `/reproduce` -> `/rca` -> `/fix-plan` | `bug-to-fix` | Use in this order. `/rca --diagnose` does not edit files. |
| `/to-issues` or `/bug-intake` -> `/ticket-sync` | `ticket-sync` | Publish the written ticket files to the tracker. |
