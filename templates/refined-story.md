# <title>

Tracker: <tracker key, or leave out when the item is not in a tracker>
Source: <document or ticket, and revision>
Readiness: <Ready | Ready with defaults | Not ready | Not verified>
Risk: <Low | Medium | High> - <one-line reason>

## Outcome

The problem and the observable result that shows the work is done.

## Actors and permissions

Who can do this, who cannot, and what the others see.

## Assumptions

| ID | Assumption | Evidence | If wrong | Confidence |
| --- | --- | --- | --- | --- |
| A-1 |  |  |  | Confident, Likely, or Unclear |

## Acceptance criteria

Write each criterion as Given/When/Then. Give each rule its failure path.
Propose a test level for each criterion.

| ID | Rule | Level |
| --- | --- | --- |
| AC-1 |  | Unit, Integration, Contract, or End-to-end |

```gherkin
Rule: <rule>

  Scenario: <success path>
    Given ...
    When ...
    Then ...

  Scenario: <failure path>
    Given ...
    When ...
    Then ...
```

## Negative coverage

| Family | State | Criterion or reason |
| --- | --- | --- |
| Input values | Covered, Not applicable, or Gap |  |

## Reliability

Complete when the story adds a remote call, a queue, a job, a data store, a migration, or deployment configuration.

| ID | Answer | State |
| --- | --- | --- |
| R1 |  | Answered, Decision needed, or Not applicable |

## Non-functional requirements

| Need | Measure and unit | Condition | Source or owner |
| --- | --- | --- | --- |
|  |  |  |  |

## Rollout and rollback

How the change reaches users, and how to undo it. Write `Not applicable` with a reason for a change with no rollout risk.

## Out of scope

## Must not change

## Dependencies

## Decision log

Use one marked line for each entry.

- `Decision:` <date> <who> <what was decided>
- `Assumption:` <your call that an owner has not confirmed>
- `Source conflict:` <code or document that contradicts a requirement>
- `Deferred:` <idea outside this story>

## Open questions

| ID | Question | Class | Owner | Blocks start | Recommended default | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Q-1 |  | Decision or Challenge |  | Yes or No |  | Open |
