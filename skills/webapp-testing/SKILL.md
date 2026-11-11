---
name: webapp-testing
description: Verify browser and web application behavior for user-facing changes. Use when planning or running Playwright/browser checks, smoke-testing a local app, debugging UI failures, capturing screenshots/traces, or producing QA evidence for feature delivery or PR review.
---

# webapp-testing

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Verify webapp behavior from the user's point of view. The `/webapp-test` command uses this skill.

## Operating Rules

- Start from the requested user flow, acceptance criteria, or bug report.
- Discover how the app runs and how tests run before you change code.
- Use the existing Playwright, Cypress, or project test setup when it exists.
  Inspect its commands and configuration before you assume flags, projects, ports, or report paths.
- Test only local or staging environments.
  Use another environment only when the user authorizes it.
  In that environment, use test accounts, and do not run destructive actions without approval.
- Report browser coverage only for flows that you ran in a browser.
  Label a flow that you only inspected in code as `Not verified`.
- If feature metadata exists, keep the feature ID, ticket, acceptance criterion,
  QA handoff link, and release risk.

## Workflow

1. Identify the target: URL, route, component, user role, data state, viewport,
   and expected behavior.
2. Find the app command and test command from `package.json`, repository docs, CI
   configuration, or existing Playwright or Cypress configuration.
3. If a dev server is necessary, use the repository's standard command. Reuse a server that is already running.
4. Run the narrowest useful browser check first:
   - Use an existing focused test when it exists.
   - With no Playwright or Cypress harness, drive the flow with an available browser MCP tool,
     such as Playwright MCP. Otherwise, write an ad-hoc `npx playwright` script outside tracked source.
   - Run a broader regression only when the change is shared or risky.
5. Wait for stable UI and network states before you assert.
6. To debug a failure, capture the console errors, failed network requests, and DOM state at the failing step.
   Then reduce the flow to the shortest steps that still fail.
7. Record results, artifacts, unverified gaps, and follow-up tests.

## Verdicts

| Verdict | Use when |
| --- | --- |
| `Pass` | Every target flow ran in a browser and met its expected result. |
| `Needs Work` | A flow ran and showed a defect or an unmet acceptance criterion. |
| `Blocked` | A flow could not run, for example because of a server, data, credential, or tool problem. |

## Output

Return:
- Verdict and the reason
- Target URL or flow, and viewport
- Commands run
- Evidence: steps, expected result, observed result, console and network clues,
  and screenshot, trace, or video paths
- Failures with reproduction steps and file and line references when applicable
- Coverage gaps or manual QA notes
- Feature, ticket, and release traceability when present
