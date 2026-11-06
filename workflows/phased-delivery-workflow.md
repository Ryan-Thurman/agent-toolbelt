# Phased Delivery Workflow

Use `$phased-delivery` for a human-guided implementation loop. It can start
from a raw requirement, an approved plan, or approved project tickets.
The source requirement or ticket remains authoritative; this workflow adds
execution context and PR boundaries, not a duplicate product process.

```text
Source requirement / approved plan / tickets
→ inspect repo and map phases to PRs
→ human approves the map
→ implement and verify one phase
→ review its diff and fix blockers
→ open one PR for that phase
→ human reviews and merges
→ continue or advance an approved PR stack
```

For a small standalone change, one phase and one PR are sufficient. For approved
tickets, **one ticket is one phase and one PR**. Use the
ticket's acceptance criteria and traceability fields unchanged. The agent may
discover files, interfaces, tests, checks, technical sequencing, and risks, but
must ask before changing ticket scope or making an unresolved release/doc/QA
decision. Do not add Foundation, Polish, or Testing phases around a ticket.

Each phase has its own branch, acceptance evidence, and PR readiness review.
Dependent tickets may form a stack: branch a child from the parent ticket
branch and target the child's PR at that parent branch. Record the parent PR,
target branch, and merge order. After the parent merges, verify the child PR's
base and diff and retarget if needed; do not rewrite published history without
authorization. Independent phases target the default branch. Never push
directly to the default branch unless the user explicitly requests that.

The human approves the plan and owns PR review and merge. The agent may open a
PR when the user has authorized delivery, but must not merge by default. A
subsequent stacked phase may start while its parent PR is open only if that
stack was approved; otherwise wait for the parent merge.

The legacy `/dev-*` commands remain shortcuts for intake, planning, phase
start, implementation, review, fixes, and PR readiness. In Codex, invoke
`$phased-delivery` directly. Use `templates/phased-delivery-plan.md` only when
the existing plan cannot track phase branches, PRs, and evidence.
