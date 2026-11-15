# Writing feature files

Read this in step 4 of `bdd-scenarios`.

## Structure

- Write one feature file for each business capability, such as "Order cancellation".
  Do not write one file for each ticket or each screen.
- Group scenarios under a `Rule:` block for each business rule. Put the success and failure scenarios of a rule together.
- Keep a `Background:` to at most three `Given` steps that every scenario in the file needs.
- Use a `Scenario Outline:` with an `Examples:` table when the same rule applies to several values.
  Do not copy a scenario to change one value.

## Steps

1. Write in business terms. Do not name screens, buttons, selectors, URLs, status codes, tables, or functions.
   The scenario must stay true when the UI or the code changes.
   A `Then` step for a rejection names the reason in business terms. Its step definition asserts the specific
   status, error code, and field that `shared/contracts/references/negative-testing.md` requires.
2. Give each scenario one `When` action. A second action is a second scenario.
3. A `Given` step sets up state. It asserts nothing.
4. A `Then` step checks a result that is observable from outside the code:
   a response, a message, a stored record, or a screen state.
5. Keep a scenario to about ten steps or fewer. A longer scenario usually tests more than one behavior.
6. Put only the data that matters to the rule in the scenario. Hide other required data in the step definitions.
7. Each scenario sets up its own data. No scenario depends on another scenario or on run order.

## Tags

| Tag | Use |
| --- | --- |
| `@<ticket-key>` | The tracker key, for example `@PROJ-123`. |
| `@AC-<n>` | The acceptance criterion that the scenario proves. |
| `@integration`, `@e2e` | The Integration or End-to-end level from `shared/contracts/references/test-levels.md`. The runner configuration selects scenarios by this tag. |
| `@api` | An Integration scenario at the HTTP boundary. It starts no browser. |
| `@negative` | A failure-path scenario. |
| `@wip` | A scenario of a later phase that is not implemented yet. CI does not run it. Scenarios of later phases can go into the repository early with this tag. Remove the tag when its phase starts. |

Do not add `@skip` or `@wip` to a failing scenario of a completed phase to make CI pass. Fix it, or report it as a defect.

## Step definitions

- Keep step definitions thin. A step calls a driver layer, such as a page object, an API client, or a service facade.
  The driver chooses how to reach the system for the scenario level.
- Use parameters and data tables. Do not write a new step for each value.
- Prefer Cucumber expressions, such as `{string}` and `{int}`, to complex regular expressions.
  pytest-bdd does not read Cucumber expressions. Use `parsers.parse`, for example `{count:d}`.
- Share state between the steps of one scenario through the runner's fixture or context object.
  Do not use global variables.
- Delete step definitions that no scenario uses.

## Example

```gherkin
@PROJ-123
Feature: Order cancellation

  Rule: A customer can cancel an order until it ships

    @AC-1 @api
    Scenario: Cancel an order that has not shipped
      Given a paid order
      When the customer cancels the order
      Then the order is cancelled
      And the payment is refunded

    @AC-2 @api @negative
    Scenario Outline: Cancel an order that cannot be cancelled
      Given an order that is <state>
      When the customer cancels the order
      Then the cancellation is rejected because the order is <state>
      And the order stays <state>

      Examples:
        | state     |
        | shipped   |
        | cancelled |
```
