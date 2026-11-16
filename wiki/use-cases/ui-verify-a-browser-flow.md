# Prove a user flow works in the browser before the pull request merges

This page is for a QA engineer or developer who must show that a user flow works in a real browser. You get a written plan, a Playwright check that was seen failing and then passing, screenshots, a trace, and a verdict.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer, developer | [`webapp-testing`](../../skills/webapp-testing/SKILL.md) (`/webapp-test`) | No levels. The skill has no depth setting. | The flow in plain words, an app that runs locally, and a way to answer its API calls (a real test backend or mocks). |

## Quick path

1. Start the app the way the repository documents it. In the sample, run `yarn install`, then `yarn generate`, then the dev server on a free port with `API_URL=http://localhost:<port>/api`. Check that the log says `compiled successfully`.
2. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
3. Run `/agent-toolbelt:webapp-test http://localhost:<port> <flow in words>`. Sample: `sign in, open the global feed, open one article`.
4. Make the check fail on purpose once. Break one API answer, run the check, and read the assertion and the attached diagnostics. Then restore the answer and run it again.
5. Read the verdict. Open the screenshots and run `npx playwright show-trace <trace.zip>`.

You get a verdict, the commands that ran, the evidence paths, and a list of what the check did not cover.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" front end in React 19 (`yurisldk/realworld-react-fsd`, MIT license). It has Jest unit tests and no browser test. No backend runs. The page needed a check of three steps: sign in, open the global feed, open one article.

The run answered every API call with Playwright route mocks. The mock data follows the schemas in the sample's `openapi.yaml`. A yellow bar on each page says `API MOCKED BY PLAYWRIGHT ROUTES (from openapi.yaml). Not a real backend.` A `Pass` here proves the front end against the API contract. It does not prove the backend.

This run followed `SKILL.md` step by step. It did not type the `/webapp-test` command, whose file only says to follow the skill.

## Why this path

The alternative is [`cover`](../../skills/cover/SKILL.md) (`/cover`), which writes code-level tests. A unit test cannot show that the router, the form, and the API client work together on a real page. The skill states this split: `/webapp-test` verifies a flow in a browser and `/cover` covers code. See [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md).

The skill says to run the narrowest useful browser check first. It says to use an existing Playwright test when one exists. With none, it allows a browser tool or an ad-hoc `npx playwright` script outside tracked source. The sample had none, so the run wrote one file in a folder beside the copy.

The skill says to report browser coverage only for flows that ran in a browser. The check order is: target, commands, narrow run, stable waits, debug a failure, record results.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Write the plan: target, role, viewport, data state, and one expected result for each step. | The skill starts from the flow and its expected behavior. | Each step has a result that a locator can check. |
| 2 | Find the run commands in `package.json` and the README. In the sample: `yarn generate`, then the dev server with `API_URL`. | Generated API code is gitignored. Without it the build fails with `Module not found`. | The log says `compiled successfully` and one process listens on the port (`lsof -iTCP:<port> -sTCP:LISTEN`). |
| 3 | With no Playwright in the repository, install `@playwright/test` in a folder outside the repository. Write one spec. | The skill allows an ad-hoc script outside tracked source. | `npx playwright test` lists the test. |
| 4 | Wait on locators and on the request, never on a timer. Sample: wait for the `POST /api/users/login` request, then assert the URL. | The skill says to wait for stable UI and network states. | The test has no fixed sleep. |
| 5 | Break one API answer. Run the check and read the failure. | A check that never failed can pass for the wrong reason. The skill now requires this step. | The assertion fails for the reason that you broke. |
| 6 | Read the diagnostics: console, failed requests, DOM text at the failing step. | The skill asks for these three. The assertion message alone does not name the cause. | You can state the cause in one sentence. |
| 7 | Restore the answer and run the check again. Run it three times. | One green run can hide a race. | All runs pass. |
| 8 | Write the report: verdict, commands, evidence paths, gaps. | This is the Output list of the skill. | A reader can repeat the run. |

## Decision points

- If a Playwright or Cypress setup exists, use it and skip step 3. Inspect its commands and ports first.
- If the API has a test backend, use it and skip the mocks. If you mock, say so in the plan, on the page, and in the verdict.
- If the build fails or two processes listen on the port, stop. Fix the server first. A stale server can serve an old bundle and move the failure to the wrong step.
- If the flow needs a real account, a real payment, or a destructive action, stop. The skill allows only local or staging targets, with test accounts, unless the user authorizes more.
- Stop when each step has a screenshot or an assertion, the red run and the green run are saved, and the gaps are listed.
- Choose [Clean up React effects](ui-clean-up-react-effects.md) for effect problems, and [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md) when you do not yet know which flows to test.

## What you get

Excerpt from a run on the RealWorld React sample (realworld-react-fsd) at commit 969709a. This is the failing run. The mock answered `GET /api/articles` with status 500. Blank lines and the call log are cut.

```text
Error: expect(locator).toHaveCount(expected) failed
Locator:  locator('[data-test="article-preview"]')
Expected: 3
Received: 0
Timeout:  5000ms
failed responses: ["500 GET /api/articles"]
```

The assertion says what is wrong but not why. The diagnostics name the request. The visible text of the page also held `Could not load articles Request failed`.

Excerpt from a run on the RealWorld React sample (realworld-react-fsd) at commit 969709a. This is the green run, with the injected fault removed.

```text
API calls: POST /users/login | GET /tags | GET /articles?limit=10&offset=0 | GET /articles/mock-article-1 | GET /articles/mock-article-1/comments
  ✓  1 conduit-smoke.spec.ts:60:1 › sign in, open the global feed, open one article (1.8s)
  1 passed (2.2s)
```

Check these points in your own output. Sign in leads to `/settings` in this app, read from `user-login.action.ts` and confirmed by the passing URL assertion. The call list must hold the login call, the feed call, and the article and comments calls. Three repeated runs passed (`--repeat-each=3`). The run did not save that output, so treat it as an observation and repeat it yourself.

The run also saved four screenshots (login, signed in, feed, article), one trace for each run, and the plan. The run chose the verdict `Pass (API mocked)`. The run predates the fix: the skill now names the label `Pass (mocked)` and asks for the mock source. The run also chose its own folder beside the copy. The skill now sets `.atb-work/webapp-testing/<scope-slug>/`. The failing run came from an injected fault, so it has no defect verdict.

## Not exercised

- Register, Your Feed, favorites, pagination, and comment creation. Evidence that verifies them: one more spec for each flow.
- A real backend. Evidence: the same spec against a staging API with a test account.
- Firefox, WebKit, and a mobile viewport. The run used one Chromium headless shell at 1280x720.
- The `/webapp-test` command itself. Evidence: type it in Claude Code and compare the report with the Output list of the skill.

## Common mistakes

- Trusting a green run that was never red. Break one answer first, as in step 5.
- Starting a second dev server on a busy port. The old server keeps answering. Check the listener before the run.
- Reading only the assertion message. Read the failed requests and the page text too.
- Calling a mocked pass a proof of the backend. Say what the mocks hide.
- Putting the spec in the repository by accident. The skill says to keep an ad-hoc script outside tracked source.

## Next

- Turn each step of a passing flow into a lasting test in the repository, with [Turn approved test cases into automated unit tests](qa-turn-test-cases-into-tests.md) for the code-level part.
- Find flows with no check at all with [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md).
- Review your own branch before the pull request with [Check a branch before you open a pull request](dev-self-review-before-a-pr.md).
- See all pages in the [use-case index](README.md).
