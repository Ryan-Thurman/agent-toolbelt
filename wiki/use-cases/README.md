# Use cases

Each page in this folder shows a real run of Toolbelt skills on the Conduit sample API (the RealWorld API in TypeScript with Express, Prisma, and Jest). Find your situation in "Start here by role" or "Decision guide", open the page, and follow its Quick path with your own repository.

## Start here by role

### QA and test

| Situation | Skills | What you get |
| --- | --- | --- |
| [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md) | `test-case-design` | A short, prioritized case list, the code that the change reaches, and a statement about whether the existing tests cover it. |
| [Make a vague story testable before the sprint starts](qa-refine-a-vague-story.md) | `story-refinement`, `bdd-scenarios` | A refined spec, one question packet for each owner, a readiness verdict, and Gherkin scenarios. |
| [Review feature files that a developer wrote](qa-review-feature-files.md) | `bdd-scenarios` (`--review`) | Findings ranked by risk, each with a suggested rewrite. |
| [Set up a BDD runner when you only have feature files](qa-set-up-a-bdd-runner.md) | `bdd-scenarios` (`--setup`) | A runner plan, a proposed install, and one scenario outline that runs against your API and fails for a readable reason. |
| [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md) | `cover` | Unit tests that run in your test runner, each with a red run and a green run. |
| [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md) | `cover` (`/cover-gaps`), `crap-analysis` | A ranked list of coverage gaps with a risk for each, and a list of risky functions scored by complexity and coverage. |
| [Map risk areas in an inherited repository](qa-map-risk-areas-in-an-inherited-repo.md) | `risk-area-mapping`, `test-case-design` | A reviewed risk map and a prioritized set of test cases for the riskiest area. |
| [Plan failure tests for a service in staging](qa-plan-staging-failure-tests.md) | `reliability-review`, `failure-scenario-design` | A reliability review and failure-scenario cards with a hypothesis and a Given/When/Then form. No test runs. |

### Developer

| Situation | Skills | What you get |
| --- | --- | --- |
| [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md) | `bug-to-fix`, `cover` | A written root cause, a failing test that turns passing, a fix with no extra lines, and a record that another person can resume. |
| [Check a branch before you open a pull request](dev-self-review-before-a-pr.md) | `pr-review` (`/review-diff`, `/pr-ready-check`) | A local review report with a verdict, findings, open questions, and a readiness verdict. Nothing is posted. |
| [Answer review comments on your pull request](dev-answer-review-comments.md) | `pr-improve`, `pr-review-reply` | Fixes with tests and a record of each decision, and a drafted answer for every comment. |
| [Clean up a feature before you open the pull request](dev-clean-up-after-a-feature.md) | `simplify` | A ranked list of smells, one behavior-preserving cleanup, and a check that behavior did not change. |
| [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md) | `ticket-discovery` | A brief that maps the existing feature onto the new area, lists the gaps, and names the open questions. |
| [Deliver an approved ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) | `phased-delivery` | A plan with one PR for each phase, a readiness verdict, and phase 1 built test-first. |
| [Refactor the riskiest function in a codebase](dev-refactor-a-risky-function.md) | `crap-analysis`, `cover` | The riskiest function by score, tests that pin its behavior, and the new score. |
| [Swap a library at every call site](dev-swap-a-library-everywhere.md) | `retrofit` | A site list that two searches confirm, a plan in slices, and the first slice applied with tests. |
| [Survive a context reset in the middle of a task](dev-survive-a-context-reset.md) | `phase-context-workflow`, `handoff` | Phase files, a handoff, and a context packet that a fresh session continues from. |
| [Run two agents in one repository at the same time](dev-run-agents-in-parallel.md) | `worktree` | One separate folder and one branch for each agent, a view of both states, and a clean way to remove them. |

### Product

| Situation | Skills | What you get |
| --- | --- | --- |
| [Decide whether a requested feature is worth building](product-decide-whether-to-build.md) | `product-discovery` | A report that checks each claim behind the request, compares the options, and ends in one decision. |
| [Check whether the product already does what was asked](product-compare-an-ask-with-the-product.md) | `shape-up` (gap review mode) | A status for each requested outcome, evidence from the code, and a ranked list of open decisions. |
| [Shape an idea into a brief and tickets](product-shape-an-idea-into-tickets.md) | `shape-up`, `ticket-sync` | An approved brief, ticket files in build order, and a preview of the tracker issues. |
| [Find themes in a set of interview notes](product-synthesize-interview-notes.md) | `user-research-synthesis` | Themes that link to supporting notes, contradicting notes, and the limits of the sample. |
| [Review product outcomes after a release](product-review-outcomes-after-release.md) | `product-outcome-review` | The original hypothesis, the valid before and after comparisons, the uncertainty, and one of four decisions. |

### Architecture, SRE, and security

| Situation | Skills | What you get |
| --- | --- | --- |
| [Answer an architecture question](arch-answer-an-architecture-question.md) | `system-design` (Light) | A direct answer with evidence, the alternatives that the code rules out, and the decisions that only the owner can make. |
| [Design a new capability before you build it](arch-design-a-new-capability.md) | `system-design`, `threat-model`, `reliability-review` | A design document with diagrams and recorded decisions, a threat review, a reliability review, and a verdict. |
| [Right-size a plan that looks over-built](arch-right-size-a-plan.md) | `phased-delivery` (`/plan-review`) with the right-sizing check | A list of the parts that have no ground and a revised plan with a return trigger for each deferred part. |
| [Review the threats of a design before it is built](sec-threat-model-a-design.md) | `threat-model` | Assets, attack paths, a testable security requirement for each accepted fix, and the remaining risk. |
| [Audit the auth area of existing code](sec-audit-existing-code.md) | `security-audit` | A read-only report of evidence-backed findings, the remaining risk, and what the audit did not check. |
| [Follow up an incident after it is mitigated](sre-follow-up-an-incident.md) | `bug-to-fix`, `reliability-review`, `failure-scenario-design` | A root cause with a regression test, a register of failure modes with open decisions, and follow-up plans. |
| [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md) | `reliability-review` (`--readiness`), `ship-it` | A status for each reliability requirement, a list of missing evidence, and a GO or NO-GO verdict. |

### Tech lead

| Situation | Skills | What you get |
| --- | --- | --- |
| [Choose which technical debt to pay in the next sprint](lead-choose-tech-debt-to-pay.md) | `tech-debt-discovery`, `tech-backlog-assessment` | A ranked debt register with evidence, and a Do, Defer, Reject, or Spike decision for the top item with a test plan. |
| [Decide one technical backlog item](lead-decide-one-backlog-item.md) | `tech-backlog-assessment` | One verdict with evidence, options, risks, and the next command. |
| [Prepare a release and decide go or no-go](lead-prepare-a-release.md) | `ship-it` | A GO or NO-GO verdict with blocking gaps, a rollback plan, a release-notes draft, and a rollout and monitor plan. |
| [Run a retrospective with papercuts after a feature](lead-run-a-retrospective-with-papercuts.md) | `papercuts`, delivery retrospective workflow | A ranked list of codebase fixes and a delivery retrospective with an owner and a done condition for each improvement. |
| [Set up a new team repository on day one](lead-set-up-a-new-team-repo.md) | `style-guide-init`, `pr-review` (`/pr-review-init`), `risk-area-mapping` | A contribution guide with the real commands, a draft review configuration, and a reviewed list of high-impact paths. |
| [Set up one quality command for local use, CI, and release](lead-set-up-quality-rails.md) | `style-guide-init` (`--rails`) | One command that local use, CI, and release all call, and a list of the checks that already report findings. |

### Platform and software-factory operators

| Situation | Skills | What you get |
| --- | --- | --- |
| [Install the Toolbelt for a team across several repositories](ops-install-for-a-team.md) | `install.sh` (`--harness`, `--sweep`, `--dry-run`) | The same files in every repository in one folder, from one command that you can run again without damage. |
| [Review every pull request when it opens](ops-review-every-pr-on-open.md) | `review-on-open`, `pr-review` | A trigger that starts a fresh review when a PR opens or gets a push, checked before it posts anything. |
| [Queue branch reviews from coding agents for a reviewer agent](ops-agent-to-agent-review-queue.md) | `review-queue`, `pr-review` | A local queue, a worker that reviews one branch at a time, and one recorded verdict for each job. |
| [Gate each phase with a review before the next phase starts](ops-gate-each-phase.md) | `phase-gate`, `pr-review` | A verdict for the phase head commit and a list of blockers with evidence. |
| [Enforce a pre-PR gate on every branch](ops-enforce-a-pre-pr-gate.md) | `code-quality-gate` | One status (`PASS`, `FAIL`, `CAPPED`, or `BLOCKED`), a folder of evidence, and a way to see when the status is stale. |
| [Add commit and push checks for Cursor users](ops-cursor-hooks.md) | `cursor-hooks` pack | Two advisory Cursor hooks: a confirmation for a code commit with no documentation, and a reminder to run `/pr-review` before a push. |
| [Prepare a plan and task records for unattended agent runs](ops-unattended-agent-runs.md) | `auto-agent-contract`, `auto-agent-dev-lite` | A validated plan that a runner parses, and a configuration to check before the runner starts. |

### Writers

| Situation | Skills | What you get |
| --- | --- | --- |
| [Rewrite a README setup section as a plain runbook](write-make-a-runbook-plain.md) | `simple-english` | A list of rule violations, a runbook in plain English, and a list of the facts that the old text left out. |

### UI and front end

These pages use a second public sample: the RealWorld React front end ([realworld-react-fsd](https://github.com/yurisldk/realworld-react-fsd), MIT, React 19 and TypeScript).

| Situation | Skills | What you get |
| --- | --- | --- |
| [Prove a user flow works in the browser before the pull request merges](ui-verify-a-browser-flow.md) | `webapp-testing` | A plan, a Playwright check that was seen failing and then passing, screenshots, a trace, and a verdict. |
| [Clean up React effects and re-render problems](ui-clean-up-react-effects.md) | `vercel-react-best-practices` | A scan report of effects and rules, and one safe fix with a test that fails before it and passes after it. |
| [Review a page for accessibility and interface quality](ui-review-against-interface-guidelines.md) | `vercel-web-interface-guidelines` | Findings with a file, a line, a severity, and a fix. No code changes. |

### End-to-end journeys

| Situation | Skills | What you get |
| --- | --- | --- |
| [From an idea to an accepted release](journey-idea-to-release.md) | The idea-to-release workflow and its stage skills | A map of seven stages to earlier runs, the gate verdict that the evidence supports, and the approvals that stay with people. |
| [Take a bug from report to a locked regression test](journey-bug-report-to-regression-test.md) | `bug-to-fix`, `test-case-design`, `cover`, `pr-review` | A fix with a regression test, a QA case list for the change, and a readiness verdict. |
| [From an incident to prevention](journey-incident-to-prevention.md) | `bug-to-fix`, `reliability-review`, `failure-scenario-design`, `test-case-design`, `cover`, `pr-review`, `ship-it` | A fix with a regression test, a failure-mode register, test plans for the gaps, and a readiness check. |
| [Pay down the debt in an old area of the code](journey-modernize-a-legacy-area.md) | `tech-debt-discovery`, `tech-backlog-assessment`, `cover`, `crap-analysis`, `simplify` | An updated debt register, tests that pin the code, one cleanup, and one gate status. |

## Decision guide

Each row comes from the "Why this path" section of the linked page.

| You have | You want | Start with | Why |
| --- | --- | --- | --- |
| A small pull request | To know what to test | [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md) | The diff hides how far a change reaches, and a green suite can prove nothing about the fix. `/cover-gaps` ranks weak coverage but cannot ask what the change needs. |
| One focused question about a codebase | A reasoned answer | [Answer an architecture question](arch-answer-an-architecture-question.md) | Building first finds the deciding facts in review. For a whole feature, use [Design a new capability](arch-design-a-new-capability.md) instead. |
| A new capability to build | A design that can go to planning | [Design a new capability before you build it](arch-design-a-new-capability.md) | A conversation gives no design document and no linked reviews. |
| A design that no code implements yet | A security review | [Review the threats of a design before it is built](sec-threat-model-a-design.md) | `security-audit` reads implemented code, so it can reach only the current API. |
| Code that already runs | A security review | [Audit the auth area of existing code](sec-audit-existing-code.md) | A diff review reads changed lines. The auth area has no diff, and the worst problem sat in files that the latest commit did not touch. |
| A bug report with steps | A fix with proof | [Fix a reported bug with a failing test first](dev-fix-a-reported-bug.md) | A change that looks right plus a green suite gives no proof when the existing test cannot fail. |
| A mitigated incident | A fix and the gaps that let it run | [Follow up an incident after it is mitigated](sre-follow-up-an-incident.md) | The bug fix alone ends with a one-line change and does not ask why no alert fired. |
| A finished branch | Problems found before a reviewer sees them | [Check a branch before you open a pull request](dev-self-review-before-a-pr.md) | A review on an open PR is already visible to your reviewers. `/review-diff` never posts. |
| An open pull request with comments | Fixes and replies | [Answer review comments on your pull request](dev-answer-review-comments.md) | `pr-review-reply` alone marks each thread that needs a code change as `needs-follow-up` and does not make the change. |
| A ticket that says "do it like feature X" | A build plan | [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md) | A plain copy repeats the defects of the precedent and hides the questions that the ticket leaves open. |
| An approved ticket | Reviewable pull requests | [Deliver an approved ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) | One branch and one PR for the whole ticket makes a reviewer read all of it in one diff. The skill turns approved scope into small, verifiable PRs. |
| A one-line story | A testable story | [Make a vague story testable before the sprint starts](qa-refine-a-vague-story.md) | Test cases written from the story text each rest on a guess. |
| Feature files and no runner | Scenarios that run | [Set up a BDD runner when you only have feature files](qa-set-up-a-bdd-runner.md) | A scenario that no tool runs cannot be red before the work or green after it. |
| A rough product idea | Approved tickets | [Shape an idea into a brief and tickets](product-shape-an-idea-into-tickets.md) | Asking an agent for tickets skips the questions, and the code answers some of them in a way that you did not choose. |
| A feature request with tickets and stakeholders | A build decision | [Decide whether a requested feature is worth building](product-decide-whether-to-build.md) | Counting tickets hides repeated accounts, claims with no data, and a feature that already exists in part. |
| A technical backlog | An order for the next sprint | [Choose which technical debt to pay in the next sprint](lead-choose-tech-debt-to-pay.md) | Sorting by audit and lint counts gives a poor order. Five of seven high-severity advisories do not apply, and neither tool finds the largest problem. |
| A merged change | A go or no-go | [Prepare a release and decide go or no-go](lead-prepare-a-release.md) | A green suite does not name a rollback signal and does not run the audit, the build, or the documentation check. |
| A branch that policy says must pass a gate | One status you can trust | [Enforce a pre-PR gate on every branch](ops-enforce-a-pre-pr-gate.md) | A review on an open PR gives findings only and runs no repair rounds. |
| Pull requests from a CI system | A fresh review on each one | [Review every pull request when it opens](ops-review-every-pr-on-open.md) | Asking each author to self-review depends on each author, and the reviewer must not share context with the author agent. |
| Pull requests that your own agents open | A reviewer agent | [Queue branch reviews from coding agents for a reviewer agent](ops-agent-to-agent-review-queue.md) | The `review-on-open` trigger fires on a PR event in CI or from a poller. The queue serves local agents. |
| Two agents in one repository | No branch clobbering | [Run two agents in one repository at the same time](dev-run-agents-in-parallel.md) | A git folder has one HEAD, so one `git checkout` moves the branch under every other agent. |

## Not covered yet

- Migrating a Selenium flow to Playwright. No Toolbelt skill exists for it yet.
- Integration tests against a real database. The runs used unit tests and code reading, so each page states what it did not execute.

## How the pages were made

Each page comes from a real run of the skills on the sample app, checked by an independent review. A lessons ledger records each defect and fix, and the next page applies those lessons.
