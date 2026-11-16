# BDD scenarios: <story or phase>

Source: <tracker key, refined story, or plan phase>
Runner: <playwright-bdd | pytest-bdd | Cucumber-JVM> - <In use | Proposed, waits for the user's choice>

## Feature files

| File | Rules | Scenarios | New or changed |
| --- | --- | --- | --- |
|  |  |  |  |

## Traceability

| Criterion | Scenario or unit test | Level | Expected before implementation |
| --- | --- | --- | --- |
| AC-1 |  | Unit, Integration (`@api` at the HTTP boundary), Contract, or End-to-end | Fails, Passes (existing behavior), `@wip` (later phase), or `@open-question` (waits on <question ID>) |

Criteria with no test:

## Step map

| Step text | Existing definition | New | Driver |
| --- | --- | --- | --- |
|  | <file> or none | Yes or No | Page, API client, or service |

## Negative coverage

| Family | State | Scenario or reason |
| --- | --- | --- |
|  | `Covered`, `Not applicable`, or `Gap` |  |

## Runner plan

Only when the repository has no runner. The proposed runner, the alternative, the files that it adds,
the commands for local use and CI, and who chooses.

## Handoff

The scenarios that each `phased-delivery` phase must turn from red to green.
