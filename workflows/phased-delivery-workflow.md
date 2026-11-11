# Phased Delivery Workflow

Use the `phased-delivery` skill for this workflow.
The skill owns the rules for scope, approval, stacked PRs, tests, and merge authority.

```text
Source requirement / approved plan / tickets
→ inspect repo and map phases to PRs
→ human approves the map
→ implement one phase with failing tests, minimal code, and passing tests
→ review its diff and fix blockers
→ open one PR for that phase
→ human reviews and merges
→ continue or advance an approved PR stack
```

When a phase changes browser behavior, use `webapp-testing` to collect browser evidence.
