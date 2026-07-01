# Ticket Discovery Workflow

Use this workflow for narrow implementation tickets that are valid but vague and
point to a precedent.

Example:

```text
Add e2e tests to HCP API. PWD already has them.
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

## Completion Criteria

- The precedent has been found or explicitly reported missing.
- Source and target differences are recorded.
- The recommended adaptation path is specific.
- Test scenarios and verification commands are named.
- The next workflow is named.
