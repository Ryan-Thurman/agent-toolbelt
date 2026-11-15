---
description: Choose the smallest installed workflow for the current task
argument-hint: "<goal-or-current-state>"
---

# /workflow-router

Read the target repository's instructions and the user's requested outcome.
Choose from workflows that are actually installed.

**Arguments:** `$ARGUMENTS`

<!-- BEGIN routing table -->
| Task | Shared owner |
| --- | --- |
| Synthesize customer research | `user-research-synthesis` |
| Decide whether an opportunity is ready to shape, or select an opportunity or experiment | `product-discovery` |
| Assess customer outcomes after an experiment or release | `product-outcome-review` |
| Discover maintenance work across a repository | `tech-debt-discovery` |
| Answer architecture questions or design a system | `system-design` (it runs `threat-model` for a design proposal) |
| Review the threats of a design before it is built | `threat-model` |
| Audit existing code for security problems | `security-audit` |
| Review the reliability of a design, or run a production readiness review | `reliability-review` |
| Plan failure scenarios or staging chaos experiments | `failure-scenario-design` |
| Check that a built service is ready to launch | `workflows/production-readiness-workflow.md` |
| Follow up a mitigated incident with a fix and tests | `workflows/incident-follow-up-workflow.md` |
| Compare a product ask with current behavior (gap review), shape a vague idea into an approved brief, or slice an approved brief into tickets | `shape-up` |
| Refine a ticket or story, write Given/When/Then criteria, or check story readiness | `story-refinement` |
| Write or review Gherkin feature files, or set up a BDD runner | `bdd-scenarios` |
| Plan, review, or deliver approved requirements or tickets as human-reviewed PRs | `phased-delivery` |
| Reproduce and repair a defect | `bug-to-fix` |
| Decide whether to do one technical backlog item, or assess a dependency | `tech-backlog-assessment` |
| Adapt a pattern that a ticket names to a new area | `ticket-discovery` |
| Find the high-impact paths of a repository or a folder of repositories for risk-based testing | `risk-area-mapping` |
| Design test cases, write tests, or verify a browser flow | `test-case-design`, `cover`, or `webapp-testing` |
| Review a pull request or a local diff | `pr-review` |
| Check that a branch is ready to open as a PR | `pr-review` (`/pr-ready-check`) |
| Fix accepted review findings, or answer a human reviewer's threads | `pr-improve` or `pr-review-reply` |
| Run a policy- or risk-driven pre-PR maintainability gate | `code-quality-gate` |
| Clean up code with small behavior-preserving changes | `simplify` |
| Apply one defined change across many sites | `retrofit` |
| Review a phase PR at a phase boundary | `phase-gate` |
| Review PRs automatically when they open or from a queue | `review-on-open` or `review-queue` |
| Keep a long task safe across context resets | `phase-context-workflow` |
| Set up or refresh repository conventions | `style-guide-init` |
| Publish tickets to a tracker | `ticket-sync` |
| Measure complexity and coverage risk | `crap-analysis` |
| Isolate parallel agents in one repository | `worktree` |
| Prepare a release | `ship-it` |
| Write a resumable handoff | `handoff` |
| Review the delivery process after completed work | `workflows/delivery-retrospective-workflow.md` |
| Report the codebase friction that slowed a task or a feature | `papercuts` |
<!-- END routing table -->

A clear small change can proceed directly with relevant checks.
Use a phase plan when coordinated PR boundaries help the task.
Use project-owned workflows when the project's requirements call for them.
The project owns its forms, approval gates, and release records.
Nearby documents or an installed skill do not select a project lifecycle.

Give the next one to three actions with a reason for each.
Name missing capabilities instead of recommending absent commands.
Resolve repository facts before asking the user for a decision.
