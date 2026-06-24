---
description: Perform a final lightweight PR readiness review for a completed feature or app
argument-hint: "<feature-brief-plan-and-diff-context>"
---

# /dev-pr-review

Perform a final PR readiness review for the completed feature or app.

Use this after all phases are completed and phase review issues are fixed.

This review happens before opening or marking a PR ready. Do not push directly
to `main`, `master`, or the repository default branch as part of this command
unless the user explicitly asks for that exact behavior.

Update the Implementation Plan with PR readiness result, branch/PR notes,
required fixes, next step, and resume instructions.

> **When to use vs related:** `/dev-pr-review` is the Dev Lite final readiness gate
> (Feature Brief + plan + diff). Use `/pr-review` for a deeper standalone code
> review and `/pr-ready-check` for the feature-delivery readiness checklist.

**Arguments:** `$ARGUMENTS`

## Compare Against

Review the final implementation against:

- Feature Brief
- App or feature flows
- Acceptance criteria
- Implementation Plan
- Phase reviews
- Tests/checks
- Final diff

## Review Areas

### Correctness

Check whether the feature behaves as intended.

### Acceptance Criteria

List each acceptance criterion and whether it is met.

### Flow Coverage

Check whether each app/feature flow works.

### Tests

Check test coverage, missing tests, and whether behavior-changing tasks built
out the test suite as they were implemented. Treat missing feasible tests as a
Should Fix issue by default, or Blocking when core behavior, permissions, data
safety, or high-risk edge cases are unverified.

### Performance

Look for inefficient rendering, data fetching, loops, queries, caching issues,
and scalability risks.

### Security

Look for input validation, auth/permissions, data exposure, secrets, unsafe
logging, dependency risks, and unsafe error handling.

### Code Quality

Look for readability, maintainability, duplication, naming, unnecessary
complexity, poor abstractions, and inconsistent project conventions.

### UX / Product Quality

Look for empty states, loading states, error states, accessibility issues, and
confusing behavior.

### Documentation

Check whether README, usage docs, comments, or examples need to be updated.

### Branch / PR Safety

Check whether the work is on a feature/fix branch rather than the default
branch. If the implementation is on `main`, `master`, or the repository default
branch, classify that as Blocking unless the user explicitly approved direct
default-branch work.

## Output

Produce a PR Readiness Review following the structure in
`templates/dev-pr-review.md`. Include the Acceptance Criteria Matrix, Flow
Coverage Matrix, findings buckets (Blocking / Should Fix / Nice to Have), Test
Suite Changes, Test Gaps, the per-area notes, Branch / PR Notes, Plan Document
Updates, and the Suggested PR Description. Treat missing feasible tests as a
Should Fix issue by default, or Blocking when core behavior, permissions, or data
safety is unverified. In Branch / PR Notes, state the current branch, whether it
is safe to open a PR, and the recommended PR command (when the host CLI is
available) or PR title/body for manual creation.
