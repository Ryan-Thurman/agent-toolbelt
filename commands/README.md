# commands/

Slash commands and reusable command snippets worth saving. One `.md` per
command (Claude Code command format), or short shell snippets you reuse.

For a guided command path, see `../docs/tutorial.md`. If the next command is
unclear inside a pilot repo, start with `/workflow-router`.

- `/pr-review` - run the tiered PR/code review workflow.
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
