# Ticket Discovery Workflow

Use this workflow for narrow implementation tickets that are valid but vague and
point to a precedent.

Example:

```text
Add e2e tests to the billing API. The accounts API already has them.
```

## Flow

```text
Ticket
↓
/ticket-discover
↓
Find precedent
↓
Compare source and target
↓
Ticket Discovery Brief
↓
Implementation planning or test-authoring workflow
```

## Use For

- "X already has this; add it to Y."
- "Copy the pattern from A to B."
- "Add tests for service Y like service X."
- "Wire target Y into the same setup as source X."

## Do Not Use For

- A backlog item whose value or technical direction is still disputed. Use
  `/tech-assess`.
- A defined many-site transformation. Use `/retrofit`.
- A bug investigation. Use the bug-to-fix lane.

The `ticket-discovery` skill owns the steps and completion criteria.
