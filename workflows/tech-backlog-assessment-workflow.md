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
Accepted? -> the next workflow that the assessment names
Rejected/deferred? -> close or update ticket with rationale
Spike? -> create bounded spike plan and evidence target
```

## Do Not Use For

- A straightforward ticket that names an existing precedent to copy. Use
  `/ticket-discover`.
- A confirmed bug. Use the bug-to-fix lane.
- A feature that already needs an implementation plan. Use Phased Delivery or the target project's workflow.

The `tech-backlog-assessment` skill owns the item types, steps, and completion criteria.
