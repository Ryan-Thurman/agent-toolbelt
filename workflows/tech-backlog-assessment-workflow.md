# Technical Backlog Assessment Workflow

Use this workflow for technical backlog items where the first useful output is a
decision: do the work, defer it, reject it, or run a bounded spike.

## Flow

```text
Backlog Item
↓
/tech-assess
↓
Technical Backlog Assessment
↓
Decision Review
↓
Accepted? -> /ticket-discover, /dev-plan, /implementation-plan, /retrofit, /cover
Rejected/deferred? -> close or update ticket with rationale
Spike? -> create bounded spike plan and evidence target
```

## Use For

- Package import decisions.
- Library/framework switches.
- Technical debt items with unclear value.
- Test investment decisions.
- Migration or upgrade strategy.
- Reliability/performance work needing option comparison.

## Do Not Use For

- A straightforward ticket that names an existing precedent to copy. Use
  `/ticket-discover`.
- A confirmed bug. Use the bug-to-fix lane.
- A feature that already needs a build plan. Use Dev Lite or Feature Delivery.

## Completion Criteria

- The recommendation is one of `Do`, `Defer`, `Reject`, or `Spike`.
- Repo evidence supports the recommendation.
- Options and risks are explicit.
- Test strategy is concrete enough to plan from.
- The next workflow is named.
