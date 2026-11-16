---
name: webapp-testing
description: Verify browser and web application behavior for user-facing changes. Use when planning or running Playwright/browser checks, smoke-testing a local app, debugging UI failures, capturing screenshots/traces, or producing QA evidence for feature delivery or PR review.
---

# webapp-testing

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Verify webapp behavior from the user's point of view. The `/webapp-test` command uses this skill.

## Operating rules

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
   Also find the steps that must run before the first start. Generated code that `.gitignore` hides is one example.
   Check the README, the scripts, and `.gitignore`. Run each such step first and record it as a setup step.
3. If a dev server is necessary, use the repository's standard command. Reuse a server that is already running
   only when you can show that it runs the current code.
   Check that one process listens on the port, for example with `lsof -iTCP:<port> -sTCP:LISTEN`.
   Check that the server log shows a successful build before you open a browser.
   Stop a stale server by its process ID, not by a process name pattern.
4. Run the narrowest useful browser check first:
   - Use an existing focused test when it exists.
   - With no Playwright or Cypress harness, drive the flow with an available browser MCP tool,
     such as Playwright MCP. Otherwise, write an ad-hoc `npx playwright` script outside tracked source.
   Keep the script, its installed packages, and all evidence in `.atb-work/webapp-testing/<scope-slug>/`.
   Set the screenshot, trace, and video paths to that folder.
   If the browser build that the installed Playwright needs is missing, install it or set the browser path, and record the choice.
   - Run a broader regression only when the change is shared or risky.
5. Wait for stable UI and network states before you assert.
   Before you trust a pass, make the check fail once for a known reason. Break one API answer or one expected value.
   Then restore it and run the check again. Follow `shared/contracts/references/test-driven-development.md`: a check counts only when it was seen to fail.
6. To debug a failure, capture the console errors, failed network requests, and DOM state at the failing step.
   Then reduce the flow to the shortest steps that still fail.
7. When the app cannot start or no flow can run, record `Blocked` and follow "Blocked reports".
8. Record results, artifacts, unverified gaps, and follow-up tests.

## Verdicts

| Verdict | Use when |
| --- | --- |
| `Pass` | Every target flow ran in a browser and met its expected result. |
| `Needs Work` | A flow ran and showed a defect or an unmet acceptance criterion. |
| `Blocked` | A flow was not able to run, for example because of a server, data, credential, or tool problem. |

## Mocked backend

When route mocks or a stub server answer the API, label the run as mocked in the plan, on the page when you can, and in the verdict.
Write the verdict as `Pass (mocked)`. Name the source of the mock data, for example an API schema file.
State that the pass proves the front end against the contract and does not prove the backend.
List the backend behavior as `Not verified`.

## Blocked reports

An app can need a sign-in with an identity provider and the repository gives no test account.
A mock session or a stubbed provider is allowed only when the app can start with it and the user approves it.
Label a flow that runs on a mock session as mocked. A mock cannot replace the provider redirect flow, so list that flow as `Not verified`.
When no mock is possible, do not run a partial flow that only reaches the login redirect and call it coverage.
Record `Blocked`. Plan the check and record the blocker with `Decision needed` as in `shared/contracts/references/evidence-quality.md`.

A dependency install can fail because a package comes from a private registry and the copy has no registry settings.
Do not skip the install silently. Record `Blocked` and the failed command with its error text.
Name the missing input in generic words, for example "registry settings". Never write a token or a private host name.
List the checks that did not run, such as the browser flow, as unexercised.

Every `Blocked` report holds these items:
- The step that failed and the exact command
- The missing input and who can supply it
- The plan of flows, expected results, and data states for the run
- The checks that did not run

## Output

Return:
- Verdict and the reason, with the mock label and the mock source when the API was mocked
- Target URL or flow, and viewport
- Commands run
- Evidence: steps, expected result, observed result, console and network clues,
  and screenshot, trace, or video paths in `.atb-work/webapp-testing/<scope-slug>/`
- The setup steps that ran, the server check, and the failing run that proved the check can fail
- Failures with reproduction steps and file and line references when applicable
- Coverage gaps, what a mocked pass does not prove, or manual QA notes
- Feature, ticket, and release traceability when present
