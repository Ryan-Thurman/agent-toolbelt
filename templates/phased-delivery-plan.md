# Phased Delivery Plan

Use this template only when an existing approved plan cannot hold the execution
state. Link to source requirements or tickets instead of copying them wholesale.
Keep the project's approved requirements and tickets as the scope authorities.

## Source and approval

- Source requirement, plan, or ticket set:
- Outcome and acceptance links:
- Scope exclusions:
- Plan approval / decision:
- Open product or release questions:
- Agreed decisions, delegated technical choices, and deferred ideas:

## Plan readiness

| Source requirement | Owning phase and work | Integration dependency | Verification method | Coverage or unresolved gap |
|---|---|---|---|---|

Record `Ready`, `Needs revision`, or `Not verified` with reasons.
Preserve source scope and approved project ticket boundaries.

## Phase / PR map

One row is one PR. When approved tickets are supplied, one row is exactly one
ticket; implementation tasks may be added within the row, but ticket scope may
not be silently expanded. Use one row for a small standalone request.

Keep the source ID and acceptance link with the phase outcome. State the work
branch and PR target explicitly, including the parent branch for a stack.

| Phase / source | Outcome, reason, and acceptance link | Depends on | Work branch → PR target | PR URL / status |
|---|---|---|---|---|
| 1 / <source ID> |  |  |  |  |

## Current state

- Current phase / ticket:
- Status: Planning / Approved / In Progress / In Review / Blocked / Complete
- Work branch and PR target:
- Last completed step:
- Next action and owner:
- Blockers or material assumptions:
- Last updated:
- Last verified revision and evidence freshness:
- Repeated failure history and remaining attempt limit, when applicable:
- Pending external operations with unknown outcomes, when applicable:
- Caller-owned actions and worker authority, for managed work:

## Phase 1: [ticket ID or phase title]

- Source ticket / requirement and acceptance criteria link:
- Feature ID / target release / source master record (if applicable):
- Dependencies and parent ticket / PR (if stacked):
- Scope boundary and exclusions:
- Agent-added implementation context: affected files, interfaces, migrations,
  sequencing, technical assumptions, and risks. Distinguish these from source
  requirements.
- Decisions needed for execution: owners, interfaces, source-pinned values,
  dependency order, and a checkable result per step. Include code only for
  decisions an interface and acceptance check cannot convey.
- Test and verification plan, including exact commands when known:
- Unit-test targets: source criteria, observable interfaces, important branches, boundaries, and error paths:
- Coverage command, measurement scope, and existing thresholds, or why coverage is unmeasured:
- Doc delta, QA, and PR traceability expectations (if applicable):
- Work branch:
- PR target branch:
- PR URL / status:
- Checks and acceptance evidence:
- Red/green evidence for selected behaviors: expected failure, commands, results, and tested revision:
- Uncovered changed behavior and remaining integration or manual verification gaps:
- Review findings / disposition:
- Human review / merge status:
- Next phase dependency or retarget action:

### Implementation steps

| Step | Do | Why | Done when |
|---|---|---|---|
| 1 | <bounded action> | <outcome or risk addressed> | <command, observation, or artifact> |

Include the owner and prerequisite within the action when they are not obvious.

Duplicate the phase block for each additional approved phase or ticket. Do not
add separate Foundation, Polish, or Test phases to a ticket-scoped plan.
When a parent PR merges, verify each dependent PR's base and diff before
continuing; record any authorized retarget or history rewrite here.
