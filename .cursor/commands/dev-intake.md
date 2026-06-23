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

Create or update a Feature Brief using this structure:

# Feature Brief

## Summary

Briefly describe the feature or app idea.

## Target User

Describe who this is for.

## Problem / Goal

Describe the problem being solved or the outcome the feature should enable.

## App or Feature Flows

List the main flows step by step.

Example:

1. User opens the page.
2. User selects an item.
3. User submits a form.
4. System validates the input.
5. System shows a result.

## Acceptance Criteria

Use checkbox format.

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

Acceptance criteria should be specific, testable, and tied to the flows.

## Constraints

List technical, product, design, time, platform, or integration constraints.

## Non-Goals

List what should not be included in this implementation.

## Open Questions

List unresolved questions.

## Suggested Assumptions

List assumptions that allow implementation planning to continue safely.

## Risks

List likely product, technical, security, performance, or UX risks.
