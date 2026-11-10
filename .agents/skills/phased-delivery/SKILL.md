---
name: phased-delivery
description: Plan, review, or deliver requirements as test-first, reviewable phases with one PR per phase. Use with a raw request, an existing plan, or approved tickets, or to review a phase branch or PR against its ticket.
---

# Phased Delivery

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Use this skill to turn approved scope into small, verifiable PRs.
A human reviews the plan and each PR.
A small request can need only one phase.
This is the interactive delivery lane, not the unattended Auto Agent runner.

| Request | Do |
| --- | --- |
| Review a plan | Read `references/plan-readiness.md` and report readiness. Change nothing and start no implementation. |
| Review one existing branch or PR | Read `references/standalone-use.md`. |
| Plan, start, implement, review, or fix a phase | Follow the delivery loop. |

## Choose the source of truth

- **Approved Shape Up brief or existing plan:** Reuse its requirements, acceptance
  criteria, decisions, and test expectations. Add only the implementation context
  needed to execute them. Do not create a second brief or ticket set.
- **Approved project tickets:** Map each selected ticket to exactly one phase,
  one work branch, and one PR. Keep its ID, feature and release references,
  acceptance criteria, dependencies, required document updates, and test and QA
  expectations traceable. The ticket is the scope authority. Add file and
  interface discovery, steps, checks, risks, and technical context. Do not add
  product requirements or work from another ticket. Keep the project's own
  readiness and evidence requirements.
- **Raw requirement:** Inspect the repository and clarify material ambiguity.
  Record a concise outcome, boundaries, and testable acceptance criteria before
  you slice phases. Make reversible technical assumptions explicit. Use
  `../../templates/dev-feature-brief.md` only when a brief resolves real uncertainty.

Stop for a human scope decision in these conditions:

- A ticket is too broad for one PR, or it spans repositories that need separate PRs.
- A ticket needs another ticket's work, or its acceptance criteria conflict or are missing.
- A stack dependency or base is unclear.
- Required project document, test, or QA evidence is unresolved.

Do not quietly split, combine, or expand tickets to make the workflow fit.
Continue through ordinary code, file, and test discovery without a stop.

## Delivery loop

1. **Plan the PR units.** Derive the smallest useful sequence of phases from the
   source of truth. In ticket mode, use the ticket boundaries. Do not invent
   Foundation, Polish, or Testing phases. For each phase, record its source,
   scope, acceptance evidence, dependencies, branch and PR target, checks,
   risks, and human review point. Include unit-test targets, observable
   interfaces, important branch and error cases, and focused test and coverage
   commands. Keep tests in the phase that implements the behavior. Record
   decisions the implementer cannot infer, and exact values that the source
   fixes. Give each step a checkable result, not a transcript of future edits.
   Present steps as **Do / Why / Done when**. Flag missing or cyclic
   dependencies for a human decision. Use `../../templates/phased-delivery-plan.md`
   only when no suitable plan exists.
2. **Check readiness and get approval.** Read `references/plan-readiness.md`.
   Show the phase and PR map, dependency bases, and material assumptions.
   Wait for approval of this map before implementation, unless the user already
   approved these specific phase and PR boundaries. A general request to "start
   when ready" or an approved source ticket does not approve an unreviewed stack
   topology or an unresolved product or release decision.
3. **Start and implement one phase.** Read `references/implementation-rules.md`
   before the first edit. When the user asks only to start a phase, prepare the
   branch and context. Implement only when implementation is requested or approved.
4. **Review and open that phase's PR.** Read `references/review-rules.md`.
   Fix blocking findings, then open one PR for the phase when authorized.
5. **Hand off to a human.** Record the PR, base and head, checks, blockers, and
   next phase. Merge authority follows `shared/contracts/references/execution.md`.
   Start the next phase as the Stacked PRs section says.

## Stacked PRs

For an approved dependent ticket, branch from the parent ticket's branch and
target the parent PR's branch. Record the parent ticket, branch, PR, and expected
merge order in the plan. Review only the current ticket's diff against that base.
Start a child phase while its parent PR is open only when the stack is approved.
Otherwise, wait for the parent merge and base the next phase on the updated
default branch. When the parent merges, verify the child's target and diff,
retarget as needed, and update the plan. Do not rewrite published branch history
without authorization. An independent ticket targets the default branch.

## Durable state

Keep the existing plan or a small execution record current. Record the phase or
ticket ID, branch and PR links, target branch, acceptance evidence, checks,
blockers, and next action. Before you resume, reconcile the record as
`shared/contracts/references/execution.md` says. Keep human-authored requirements unchanged.

- For a caller-managed assignment, read `shared/contracts/references/execution.md`.
- When repair attempts repeat or verification stalls, read
  `shared/contracts/references/failure-recovery.md`.
- When you need scratch files or a recovery ledger, or the user asks for
  subagents, read `references/execution-support.md`.
