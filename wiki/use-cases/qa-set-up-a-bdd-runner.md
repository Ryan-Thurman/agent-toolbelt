# Set up a BDD runner when you only have feature files

This page is for a QA engineer whose team has Gherkin feature files but no BDD runner (a tool that executes Given/When/Then text as tests) in the repository.
You get a runner plan, a proposed install, and one scenario outline that runs against your API and fails for a reason you can read.
Scenarios that need a database stay unwired.
This page covers scenarios that call an HTTP API. Browser scenarios need another path (see Decision points).

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| QA engineer. A developer helps with the CI job. | [`bdd-scenarios`](../../skills/bdd-scenarios/SKILL.md) (`/bdd-scenarios --setup`) | No levels. The skill has no depth setting. | Feature files with tags such as `@api` (a scenario that calls the API and starts no browser), an API that you can start locally, and a branch where you can change `package.json`. |

## Quick path

1. Create a branch in the repository. Start Claude Code there with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Plan the runner: `/agent-toolbelt:bdd-scenarios --setup`. Read the runner question in the plan.
3. Answer the question. To take the default, write: `Yes, install playwright-bdd for the @api scenarios.` The skill installs only after you agree.
4. Ask the agent to wire the scenario. Write: `Wire one @api scenario that needs no database. Set the base URL from API_URL. Set the missing-step option to skip unwired scenarios. Add the script bdd (bddgen && playwright test).` The sample run used the option `missingSteps: 'skip-scenario'`. The agent checks the key name against the installed types.
5. Start your API. Then run: `API_URL=<api-url> npm run bdd`.
6. Read each failure. A red row is valid only when the feature code is absent.

You get a pinned runner, a configuration, one wired outline, and a list of the scenarios that wait for step definitions.
In the sample, two rows are valid red, one row shows a route clash, and one row shows existing behavior.
No row can turn green until a step that needs a database is written.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest), at commit 30b68e1.
The run used the skill before the fix in PR #58. A hand check against Toolbelt 1.3.0, which includes that fix, found the same runner default, pinning rule, and install rule.
The team refined a story, CON-12 "Bookmark articles", and wrote two feature files for it.
The files use Gherkin (the Given/When/Then text format) and hold 20 scenarios. Scenario outlines (one scenario with a table of example rows) expand them to 29 tests.
The page [Refine a vague story](qa-refine-a-vague-story.md) shows how those files came about.

The repository has Jest with `ts-jest`. It has no Cucumber, Playwright, or Gherkin package.
Jest does not read `.feature` files, so the scenarios cannot run today.
A step definition is the code that one Given/When/Then line runs. The files need 53 of them.
You must decide how the team will run the scenarios, and prove that the choice works before anyone writes those 53.
Criteria that only a unit test proves well stay unit tests. Send those to [Turn test cases into tests](qa-turn-test-cases-into-tests.md).

The install on this page happened in a throwaway copy of the sample, to show the result.
On your side, install on a branch of your repository.

## Why this path

The obvious alternative is to leave the feature files as documents and test with Jest.
That costs the outer test loop of [`phased-delivery`](../../skills/phased-delivery/SKILL.md). A scenario that no tool runs cannot be red (failing) before the work or green (passing) after it.
This is practice, not a statement of the skill.

The alternative that the skill names is a Jest binding for Gherkin.
It keeps one test runner. The skill says that browser scenarios then need a second runner later.
The skill does not name a package for it. You must read the package documentation and its Jest version support first.
For a TypeScript repository with Jest and no browser tests, the skill proposes `playwright-bdd` with `@api` scenarios only.
It adds Playwright as a test runner but starts no browser, and the user chooses.
The default adds a generator step before each test run and a second test runner next to Jest.

The skill says to ask the user before it installs a runner.
It also says to read the installed version before you name a configuration key, so the configuration follows the install.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Create a branch. Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all bdd-scenarios /path/to/project`. | The skill must be available, and the install must not touch your main branch. | You type `/` and see `/agent-toolbelt:bdd-scenarios` (plugin) or `/bdd-scenarios` (installed copy). |
| 2 | Check for a runner (command below the table). Find the feature folder. | The skill looks for the runner, the feature folder, and the step definitions first. | You can say "no runner" with the empty result as evidence. |
| 3 | Run `/agent-toolbelt:bdd-scenarios --setup`. | The `--setup` flag selects the runner procedure in `references/runners.md`. | The plan names a proposed runner and asks you to choose before it installs. This run predates the runner-plan section of `templates/bdd-scenarios.md`. The skill now saves the plan to `.atb-work/bdd-scenarios/<scope-slug>.md`. The run's plan listed the repository state, the options, and a question. |
| 4 | Answer the runner question. Ask for a different option if the team already uses a Jest binding. | The skill installs a runner only when you agree. | You wrote "yes" or named another option. |
| 5 | Install on your branch: `npm install --save-dev --save-exact --ignore-scripts @playwright/test@<version> playwright-bdd@<version>`. Pick two versions that work together: run `npm view playwright-bdd@<version> peerDependencies` to read the Playwright range, or ask the agent to choose and show the range. The sample used `playwright-bdd` 9.2.1 with `@playwright/test` 1.65.1, as an example. The run used `--ignore-scripts` so that install scripts do not run. That is the run's choice. | The skill says to pin the two versions together, because each release supports a range of Playwright versions. | `package.json` lists both packages with exact versions. |
| 6 | Read the installed configuration types. In version 9.2.1 the file is `node_modules/playwright-bdd/dist/config/types.d.ts`. Look for the equivalent in your version. | The skill says to read the installed version and its official documentation before you name a configuration key. The run did not open the online documentation. | You can name the keys for the feature path, the step path, and the missing-step behavior. |
| 7 | Ask the agent to write the configuration (feature path, step path, base URL from `API_URL`, and the missing-step option), one step file, one script (`bddgen && playwright test`), and the `.gitignore` lines. | The generator needs the feature path, the step path, and the base URL of the API before it can produce tests. The run chose these files. The skill gives the model of the runner, not the files. | `npx bddgen` finishes and `.features-gen` is ignored by git. |
| 8 | Start your API, then run: `API_URL=<api-url> npm run bdd`. | Scenarios at the `@api` level call a running API. | The runner lists every scenario. Wired scenarios run. The others show as skipped. |
| 9 | Read each failure. Write down if the cause is the absent feature or something else. | The acceptance loop requires each new scenario to fail because the behavior is absent. | Each red row has a cause in your notes. |

Command for step 2, for a JavaScript repository. For Python, look in `pyproject.toml`. For Java, look in `pom.xml` or `build.gradle`.

```bash
grep -n -i -E "cucumber|playwright|gherkin|pytest-bdd" package.json
```

Sample only: the sample ran step 8 as `API_URL=http://localhost:3456 JWT_SECRET=x npm run bdd`.
The sample API started on port 3456 without a database, because its sign-in check runs before any data access.
Your API can need a database to start.
If it cannot start without a database, wire only scenarios that do not reach it, or ask a developer for a test database.

```bash
PORT=3456 JWT_SECRET=x \
DATABASE_URL=postgresql://u:p@localhost:5432/db \
npx ts-node --transpile-only \
  --compiler-options '{"module":"CommonJS"}' src/main.ts
```

## Decision points

- If the repository already has a BDD runner, skip this page. Run `/bdd-scenarios` to write scenarios or `/bdd-scenarios --review` to review feature files.
- If the stack is Python, the skill proposes `pytest-bdd`. If it is Java or Kotlin, it proposes Cucumber-JVM. The steps on this page change for those stacks.
- If your team already runs Jest everywhere and has no browser flow, ask for the Jest-binding option. Read its documentation first, because the skill gives no notes for it.
- If the generator stops with a list of missing step definitions, set the missing-step option to skip unwired scenarios, as the sample does. Wiring one scenario does not clear the list, because every unwired scenario counts. In the run the generator reported 53 missing steps with the sign-in outline already wired. For a first run, the skill also says to point the feature path at one file.
- If your scenarios have no tags, are browser scenarios (`@e2e`), or have no API that you can start locally, stop and read `references/runners.md`, or ask for the Jest-binding option. This page covers `@api` scenarios only.
- If the repository uses Nx, ask a developer whether the script belongs in `package.json` or in an Nx target. This run predates the Nx note in `references/runners.md`, which puts the script in the project's own configuration and target. The run used `package.json`.
- If CI will run the scenarios, it needs a started API and, for most scenarios, a database. This run did not test that.
- If a failure says `ECONNREFUSED`, the API is not running. This is not a valid red. Start the API and run again.
- If a `Then` step passes before the feature exists, the scenario row proves existing behavior. Record it as existing coverage, as the acceptance loop says.
- If CI will run the scenarios, add `@wip` to the scenarios of later phases first. CI runs every scenario except `@wip`, and one failing scenario fails the build.
- Do not add `@wip` to a failing scenario of a finished phase to make CI pass. Fix it or report a defect.
- Stop when one outline runs against the real API, every failing row has a stated cause, and the unwired scenarios show as skipped. Only rows whose `Then` step fails because the feature is absent count as valid red.
- Choose [Review feature files](qa-review-feature-files.md) when you doubt the scenarios themselves.
- Choose [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md) when the runner works and a developer is ready to turn the scenarios from red to green.

## What you get

The skill returns a plan. The run installed the runner in a throwaway copy, then wired one outline.
The outline is "A reader who is not signed in cannot use bookmarks" (criterion AC-4, four example rows). `@api` marks it as a scenario that calls the API and starts no browser. `@wip` marks a scenario of a later phase that CI skips.
The run chose it because it needs no database. The sign-in check happens before any data access.
AC-4 and the other IDs come from the refined story. Tags such as `@AC-4` link a scenario to its criterion.

First, the runner plan. It records that the run used the default and shows the question.
The plan layout is the run's choice.

Excerpt from the plan header and the section "Choice for the user", from a run on the Conduit sample API at commit 30b68e1. Lines are wrapped, and `...` marks skipped text.

```markdown
Mode: `bdd-scenarios --setup`. Status: proposal. The skill says to install
only when the user agrees.
This run is headless, so no person chose. The run used the skill's default
and recorded that fact ...

...

Question for the user: install `playwright-bdd` for the `@api` scenarios?
Default answer: yes.
```

Next, the configuration that the run wrote after it read the installed types.
The `missingSteps` line is the run's choice. The skill does not name it.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is the full file `playwright.config.ts`.

```typescript
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
  missingSteps: 'skip-scenario',
});

export default defineConfig({
  testDir,
  grepInvert: /@wip/,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: process.env.API_URL ?? 'http://localhost:3000' },
});
```

The run with the API up started 29 tests. Four ran and failed, and 25 skipped because their steps do not exist yet.
The first failure is the row "no sign-in, bookmark an article".

Failure 1 of 4 and the summary lines from the run, on the Conduit sample API at commit 30b68e1. `...` marks skipped text.

```text
Running 29 tests using 2 workers
...
    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 401
    Received: 404
...
  4 failed
...
  25 skipped
```

The four rows did not fail for the same reason.
The first column is the example row order in the feature file.

| Row | Sign-in and action | What the run saw | Cause |
| --- | --- | --- | --- |
| 1 | No sign-in, bookmark an article | `Then` failed: 401 expected, 404 received | Valid red. The 404 was observed. The route is absent in the code. |
| 2 | No sign-in, remove a bookmark | `Then` failed: 401 expected, 404 received | Valid red. The 404 was observed. The route is absent in the code. |
| 3 | No sign-in, list bookmarks | `Then` failed: 401 expected, 500 received | The path `/api/articles/bookmarks` matches the existing route `/articles/:slug`. A probe returned a Prisma error from `getArticle`, and no database ran. With a database the result is likely 404, by reading and not run. |
| 4 | Expired sign-in, list bookmarks | `Then` passed. The next step failed with `Not wired`. | `Then` passed (observed). The 401 comes from the existing error handler, read in `main.ts`. The row proves existing behavior. |

The step `no bookmark changes` throws `Not wired: comparing bookmark lists needs a database`.
An empty step body passes for the wrong reason, so the run did not use one.
This step also keeps all four rows red after the feature exists.
Someone must write it against a database before any row can turn green.

Last, the generator with the missing-step option removed. This shows why the first run needs the skip option. The sign-in outline was already wired in this run.

Excerpt from a run on the Conduit sample API at commit 30b68e1. `...` marks skipped text.

```text
Missing step definitions: 53

...
When('the reader bookmarks the article', async ({}) => {
  // Step: When the reader bookmarks the article
  // From: features/article-bookmarks.feature:12:7
});
...
```

The generator prints a skeleton for each missing step. Use the skeletons as the start of your step files.

What you must check in the output:

- The plan names the runner as proposed until you answer. In the run, no person chose, so the run used the default. That note belongs to this excerpt only.
- `package.json` lists both packages with exact versions, and `.features-gen` is ignored by git.
- Wired scenarios fail for a named reason. A failure with `ECONNREFUSED` has no meaning for the feature.
- Skipped scenarios are counted. A skipped scenario is not a passed scenario.
- The existing Jest tests still run. In this run one file ran before and after the install (3 of 3 passed both times). The full suite did not run.

Not executed in this run: any scenario with a signed-in reader, any run against a database, a CI job, and a read of the online documentation of `playwright-bdd`.

## Common mistakes

- You count a red scenario as proof that the feature is absent. A refused connection also gives red. Read the failure text.
- You treat row 4 as red evidence. Its `Then` step passed, because an existing route already rejects an expired token.
- You commit the generated folder `.features-gen`. The skill says not to commit generated test files. Add the folder to `.gitignore`.
- You install the runner without pinning. Each `playwright-bdd` release supports a range of Playwright versions, so pin both packages.
- You expect the skill to write the configuration and the step files. It plans, and it installs only after you agree. The files on this page come from the run.
- You write an empty step body to turn a scenario green. The step then passes for the wrong reason. Make it throw until it can check the result.
- You add the runner to CI while scenarios of later phases are red and not tagged `@wip`. The build fails on the first run.

## Next

- [Refine a vague story](qa-refine-a-vague-story.md): the page that produced these feature files.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when unit-level cases need tests too.
- [Review feature files](qa-review-feature-files.md): before you write step definitions for scenarios that a reviewer has not read.
- [Deliver a ticket as phased pull requests](dev-deliver-a-ticket-as-phased-prs.md): the red-to-green loop for each phase.
- [`phased-delivery`](../../skills/phased-delivery/SKILL.md): the skill that owns the phases.
- [Use-case index](README.md): the full list of use-case pages.
