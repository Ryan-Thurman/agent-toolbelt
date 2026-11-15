# From a card to Given/When/Then

Read this in step 5 of `failure-scenario-design`.

| Card field | Gherkin |
| --- | --- |
| Steady state and preconditions | `Given` |
| Fault, with its size and scope | `When` |
| Expected behavior from the hypothesis | `Then` |
| Detection and recovery | `And` |

Abort conditions are not steps. They stay in the experiment plan.
Write the steps in business terms, as `skills/bdd-scenarios/references/writing-features.md` requires.
Tag the scenario with `@negative`, the card ID, and the level.

## Example

The numbers are placeholders. The project gives the real values.

```gherkin
@FS-001 @REL-003 @integration @negative
Scenario: Checkout when the payment service is slow
  Given checkout works normally
  And the payment call has a timeout of <payment timeout>
  When the payment service answers after <slow response> for every request
  Then checkout tells the customer that the payment is pending within <checkout deadline>
  And the order is stored once
  And the payment dependency alert fires
```

## Test-first case

For each card, name the test, the seam that causes the fault (a fake, a fault proxy, or a stub),
and the assertion. Write it so that it fails before the control exists.
For example: "Given a payment stub that answers after the timeout, the checkout handler returns
`payment pending` and writes one order." The test fails while the handler has no timeout.
