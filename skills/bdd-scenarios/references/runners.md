# BDD runners

Read this when a repository has no BDD runner, or when you set up or debug one.
Before you name a feature or a configuration key, read the installed version and its official documentation.
These notes give the model of each runner, not its exact API.
Do not add a runner without the user's agreement. Reuse the repository's existing test framework when it can run Gherkin.

| Stack | Runner | Model |
| --- | --- | --- |
| TypeScript or JavaScript | `playwright-bdd` | A generator converts `.feature` files into normal Playwright test files. The Playwright test runner then runs them, so BDD tests and other Playwright tests share one runner, one configuration, and one report. |
| Python | `pytest-bdd` | pytest collects scenarios from `.feature` files. Step functions are pytest fixtures. `pytest-playwright` gives the browser `page` fixture. |
| Java or Kotlin | Cucumber-JVM | Runs through the JUnit Platform engine. Step classes form the glue. Use Playwright for Java for browser steps, and the project's HTTP or framework test client for API steps. |

## playwright-bdd

- Configure the feature and step paths in `playwright.config`, next to the other Playwright projects.
- Run the generator before the Playwright test command, in local scripts and in CI.
  Do not commit the generated test files. Add their folder to `.gitignore`.
- Write step definitions with Playwright fixtures. Use `page` for `@e2e` scenarios and `request` for `@api` scenarios.
  An `@api` scenario does not start a browser.
- Use separate Playwright projects or tag filters to run `@api` and `@e2e` scenarios at different times.
- The package is third-party (MIT). Pin its version together with `@playwright/test`, because each release supports a range of Playwright versions.

## pytest-bdd

- Bind scenarios to test modules, then write steps as fixtures with `given`, `when`, and `then`.
- Use a step's target fixture to pass state between steps of one scenario.
- Select scenarios with pytest markers that match the Gherkin tags.

## Cucumber-JVM

- Configure the feature path, the glue package, and tag filters in the JUnit Platform configuration.
- Use the dependency-injection module that the project already uses, such as Spring, to share state between step classes.
- For an `@integration` scenario in a Spring project, the steps can call the application through the framework test client without a deployed server.

## In every stack

- CI runs every scenario except `@wip`. A failing scenario fails the build.
- Keep the runner's report and, for browser scenarios, traces or screenshots of failures as CI artifacts.
- The same feature file format works in all three runners. Keep the files in one folder for each service.
