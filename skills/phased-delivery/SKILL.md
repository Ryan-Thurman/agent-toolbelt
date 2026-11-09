---
name: phased-delivery
description: Review implementation plans or deliver requirements through test-first implementation in reviewable phases, one PR per phase. Use with a raw request, existing plan, or approved tickets; preserve one ticket per phase and PR.
---

# Phased Delivery

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Use this skill to turn approved scope into small, verifiable PRs with a human
reviewing the plan and each PR. A small request may need only one phase. This is
the interactive delivery lane, not the unattended Auto Agent runner.

For plan-review requests, read `references/plan-readiness.md` and report without starting implementation.

## Choose the source of truth

- **Approved Shape Up brief, existing plan, or tickets:** Read and reuse their requirements, acceptance
  criteria, decisions, and test expectations. Add only the implementation context
  needed to execute them; do not create a second feature brief or ticket set.
- **Raw requirement:** Inspect the repository, clarify material ambiguity, and
  record a concise outcome, boundaries, and testable acceptance criteria before
  slicing phases. Use a brief only if it helps resolve genuine uncertainty.
- **Approved project tickets:** Each selected, approved ticket is exactly one
  phase, one work branch, and one PR. Keep its ID, feature/release references,
  acceptance criteria, dependencies, required document updates, and test/QA expectations
  traceable. The ticket is the scope authority; the agent may add file/interface
  discovery, implementation steps, checks, risks, and technical context, but may
  not silently add product requirements or work from another ticket. Preserve
  the project's own readiness and evidence requirements.

If a ticket is too broad to review as one PR, spans repositories that require
separate PRs, requires another ticket's work, or has conflicting or missing
acceptance criteria, stop for a human scope decision.
Do not quietly split, combine, or expand tickets to make the workflow fit.

## Delivery loop

1. **Plan the PR units.** Derive the smallest useful sequence of phases from the
   source of truth. Each phase must have a clear scope, acceptance evidence,
   dependency/base branch, and reviewable PR boundary. In ticket mode, use the
   ticket boundaries rather than inventing Foundation/Polish/Test phases. Review
   repository state and fill missing technical context. Use
   `../../templates/phased-delivery-plan.md` only when no suitable plan exists.
   Record decisions the implementer cannot infer: affected owners, interfaces,
   dependency order, acceptance checks, and exact values the source fixes.
   Leave routine implementation bodies to execution; each step needs a
   checkable result rather than a transcript of future edits.
2. **Check readiness and obtain needed approval.** Read `references/plan-readiness.md`.
   Check requirement coverage, decisions, dependencies, connections, and verification before execution.
   Show the proposed phase/PR map, dependency bases,
   and material assumptions. Wait for approval of this map before implementation
   unless the user has already approved these specific phase and PR boundaries.
   A general request to "start when ready" or an approved source ticket does not
   settle an unreviewed stack topology or unresolved product/release decision.
3. **Implement one phase.** Create or switch to its focused work branch before
   editing; if currently on the default branch and a safe branch cannot be
   established, stop. Keep the diff within its phase or
   ticket. Before changing executable behavior, use
   `shared/contracts/references/test-driven-development.md`.
   Run proportionate checks and record evidence and remaining risk.
   Do not require a commit per task.
   Read `references/implementation-rules.md` for detailed execution checks.
4. **Review and open that phase's PR.** Review its own diff against its acceptance
   criteria, dependencies, and tests; fix blocking findings, then open one PR
   for that phase when authorized. Apply repository-required quality and
   project review requirements; `code-quality-gate` is optional unless policy or risk
   calls for it. Read `references/review-rules.md` at this step.
5. **Human handoff.** Record the PR, base/head, checks, blockers, and next phase.
   A human reviews and merges; the agent does not merge by default. Start a
   dependent phase while its parent PR is open only when an approved stack is
   planned. Otherwise wait for the merge before basing the next phase on the
   updated default branch.

## Stacked PRs

For an approved dependent ticket, branch from the parent ticket's branch and
target the parent PR's branch. Record the parent ticket, branch, PR, and expected
merge order in the plan. Review only the current ticket's diff against that base.
When the parent merges, verify the child's target and diff, retarget as needed,
and update the plan. Do not rewrite published branch history or merge a PR
without authorization. An independent ticket targets the default branch.

## Durable state and stopping points

For managed assignments or work across sessions, read `shared/contracts/references/execution.md`.
Keep task context, authority, evidence, and the next action in the existing execution record.
When repair attempts repeat or verification stalls, read `shared/contracts/references/failure-recovery.md`.
Preserve attempt history across resets and reassess the failed hypothesis before another edit.

Keep the existing plan or a small execution record current with phase/ticket ID,
branch and PR links, target branch, acceptance evidence, checks, blockers, and
next action. Reconcile it from git and PR state before resuming; preserve
human-authored requirements. Stop and ask when a stack dependency/base is
unclear, a ticket scope must change, or required project document/test/QA
evidence is unresolved. Do not stop for ordinary code, file, or test discovery.

For host-specific legacy `/dev-*` commands and templates, read
`references/command-surfaces.md`. For temporary handoffs or explicitly requested
delegation, read `references/execution-support.md`. For a standalone phase or PR
review, read `references/standalone-use.md`.
