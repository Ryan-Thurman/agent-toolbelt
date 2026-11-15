# Test levels

Use these rules to choose the test level that proves a behavior.
A test level is the scope of real code and real dependencies that a test runs.

| Level | Runs | Proves | Does not prove |
| --- | --- | --- | --- |
| Unit | One module in process. Fakes replace slow or external parts. | Logic, branches, boundaries, and error handling inside the module. | Wiring, persistence, serialization, or another service's behavior. |
| Integration | The code with one real boundary, such as a database, a queue, or an HTTP layer. | Queries, transactions, mapping, configuration, and error handling at that boundary. | Behavior of a separate deployed service. |
| Contract | A consumer and a provider against a shared contract or schema. | That two services that deploy separately still agree on requests and responses. | End-to-end business flow. |
| End-to-end | The deployed system through its public interface, often a browser. | A critical user journey across all parts. | Edge cases. Use lower levels for them. |

## Selection rules

1. Choose the lowest level that fails when the risk occurs.
2. Each boundary that a change crosses needs at least one test at that boundary.
   Boundaries are a database, a queue, an HTTP API, another service, and a browser.
   If there is no such test, record `Not covered` with a reason.
3. Use an end-to-end test only for a critical journey or for wiring that no lower level can show.
   Test edge cases and negative cases at lower levels.
4. A Given/When/Then scenario describes behavior. It does not set the level.
   Run each scenario at the level that rule 1 selects.
5. A unit test with a mocked boundary does not prove that boundary.
   Do not report it as integration coverage.

## Isolation choices for an integration test

| Choice | Use when |
| --- | --- |
| In-process fake | The boundary has a reliable in-memory form, and its behavior is not the risk. |
| HTTP stub with error variants | The dependency is a remote API. Stub its failures too, such as an error status, a timeout, and a body that does not parse. |
| Real dependency in a container (for example Testcontainers) | The risk is in queries, transactions, migrations, or broker behavior. |
| Provider sandbox | The provider gives a test environment, and a stub cannot show the risk. |
| Contract test | The consumer and the provider deploy separately. |

## Suite shape

Use the count of tests at each level to find gaps, for example many unit tests and no integration tests.
Do not gate a change on a fixed ratio of levels.
Read the installed test framework versions before you name a tool feature.
