# Acceptance criteria

Read this in step 4 of `story-refinement`. Write criteria that a test can prove,
and that fail when the build is wrong.

## Given/When/Then rules

1. Write each criterion as a scenario: `Given` the context, `When` one action, `Then` the observable result.
2. State a rule, not one instance. Put the instances in an examples table (a Scenario Outline).
3. Give each rule its failure path. For each success scenario, write the scenario for the input,
   permission, or state that the rule rejects.
4. Use business terms. Do not name screens, buttons, selectors, tables, or functions.
   The same scenario must stay true when the UI or the code changes.
5. Make each result observable from outside the code: a response, a message, a stored record, or a screen state.
6. Give each criterion an ID, such as `AC-1`. Do not reuse an ID after you remove a criterion.
7. Together, the criteria must fail any build that does the wrong thing. If a wrong build passes them all,
   add the missing criterion.
8. Put every criterion in the spec as a scenario. Do not leave sample scenarios and point to feature files.
   `bdd-scenarios` later copies the scenarios into feature files. After that, the feature files own the
   executable text, and the spec keeps the rule table with links to the scenarios.

## From scan items to criteria

- A resolved edge from the scan becomes a `Then` line or a row in an examples table.
- Each family in `shared/contracts/references/negative-testing.md` that applies becomes a scenario,
  or it gets `Not applicable` with a reason.
- An answered reliability question, such as "dependency down" or "dependency slow", becomes a scenario.
- Behavior that must stay the same goes in the "Must not change" list, with a scenario when the risk is high.

## Test level

Give each criterion a proposed test level from `shared/contracts/references/test-levels.md`.
The level is a proposal for the plan. The scenario text does not change with the level.

## Non-functional requirements

Write each one with a measure, a unit, a condition, and a source.
For example: "Search returns the first page in under X ms at the 95th percentile, for Y requests per second, source: <owner or document>".
If no source gives the target, write `Unknown` and name the owner. Do not choose a number.

## Example

```gherkin
Rule: A customer can cancel an order until it ships

  Scenario: Cancel an order that has not shipped
    Given an order in the "paid" state
    When the customer cancels the order
    Then the order is in the "cancelled" state
    And the payment is refunded

  Scenario Outline: Cancel an order that cannot be cancelled
    Given an order in the "<state>" state
    When the customer cancels the order
    Then the request is rejected with the reason "<reason>"
    And the order stays in the "<state>" state

    Examples:
      | state     | reason          |
      | shipped   | already shipped |
      | cancelled | already cancelled |
```
