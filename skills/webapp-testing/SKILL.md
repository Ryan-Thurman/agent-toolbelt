---
name: webapp-testing
description: Verify browser and web application behavior for user-facing changes. Use when planning or running Playwright/browser checks, smoke-testing a local app, debugging UI failures, capturing screenshots/traces, or producing QA evidence for feature delivery or PR review.
---

# webapp-testing

Use this skill to verify webapp behavior from the user's point of view. Prefer
existing project test commands and official tool help over inventing a custom
browser harness.

> This skill backs the `/webapp-test` command — the command name is shorter than
> the skill name (`webapp-testing`). Both refer to this same capability.

## Operating Rules

- Start from the requested user flow, acceptance criteria, or bug report.
- Discover how the app runs and how tests are executed before changing code.
- Prefer existing Playwright/Cypress/test setup when present.
- When using Playwright, inspect available commands or project config before
  assuming flags, projects, ports, or report locations.
- For unknown Playwright behavior, prefer `playwright --help`,
  `npx playwright --help`, project docs, or official Playwright docs.
- Capture enough evidence for another person to reproduce a failure: URL,
  viewport, steps, expected result, observed result, console/network clues, and
  screenshot/trace/video paths when available.
- Do not claim browser coverage if the flow was only inspected statically.
- If feature metadata exists, preserve feature ID, ticket, acceptance criterion,
  QA handoff link, and release risk.

## Workflow

1. Identify the target: URL, route, component, user role, data state, viewport,
   and expected behavior.
2. Find the app command and test command from `package.json`, repo docs, CI
   config, or existing Playwright/Cypress config.
3. If a dev server is needed, use the repo's standard command. If a server is
   already running, reuse it.
4. Run the narrowest useful browser check first:
   - Existing focused test when available.
   - Smoke test of the changed flow when no focused test exists.
   - Broader regression only when the change is shared or risky.
5. Wait for stable UI/network states before asserting.
6. Record results, artifacts, unverified gaps, and follow-up tests.

## Output

Return:
- Verdict: `Pass`, `Needs Work`, or `Blocked`
- Target URL/flow and viewport
- Commands run
- Evidence collected
- Failures with reproduce steps and file/line references when applicable
- Coverage gaps or manual QA notes
- Feature/ticket/release traceability when present
