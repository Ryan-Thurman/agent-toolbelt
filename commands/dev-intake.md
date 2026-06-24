---
description: Create a lightweight feature brief from an app idea, feature idea, ticket, or product request
argument-hint: "<feature-or-app-idea>"
---

# /dev-intake

Create a concise development feature brief from the user's app idea, feature
idea, ticket, or product request.

Use this command before planning implementation.

**Arguments:** `$ARGUMENTS`

## Input

Use the user's provided idea, selected text, files, or ticket context as input.

If details are missing, make safe assumptions and clearly mark them as
assumptions. Do not block on minor missing details unless they are required to
avoid building the wrong thing.

## Output

Create or update a Feature Brief following the structure in
`templates/dev-feature-brief.md`. Fill every section and keep it concise.

Guidance for specific sections:
- **App or Feature Flows** — list the main flows step by step (e.g. open page ->
  select item -> submit form -> validate -> show result).
- **Acceptance Criteria** — checkbox format; each criterion specific, testable,
  and tied to a flow.
- **Suggested Assumptions** — list the assumptions that let planning continue
  safely, and mark anything you assumed because a detail was missing.
- **Risks** — likely product, technical, security, performance, or UX risks.
