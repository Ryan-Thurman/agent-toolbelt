# Change risk planning

Use this procedure when the input is a pull request, a branch, a commit range, or a diff
instead of a requirement. The output is a focused test plan for that change.

## 1. Get the change

- For a branch, use `git diff <base>...HEAD`, where `<base>` is the merge base with the default branch.
- For a GitHub pull request, use `gh pr diff <number>`. For an Azure Repos pull request, fetch
  the source branch and use `git diff` against the target branch.
- Record the base and the head commit in "Change Scope". The plan applies to that range only.

## 2. Classify each changed file

Give each changed file one kind: behavior, interface (a public function, an API, an event, or
a schema), configuration, data migration, test only, or documentation. Group the files by module.
A test-only or documentation change needs no new cases unless it removes a test.

## 3. Find the affected code

For each changed interface, search for its callers, importers, and consumers. Search one step
out from the change. Record each search and its result count. For a consumer in another
repository, use the workspace map (integration edges or repo cards) when the user gives its path,
and cite the edge. When no map lists the consumer and a search is not possible, record it as
`Not searched` with the reason.

## 4. Match the risk areas

Read `shared/contracts/references/risk-areas.md` and apply the repository's risk-area list, read
from the base branch, to the changed and affected paths. Record each match with its impact line.

## 5. Find the intended behavior

Read the linked ticket, the pull request description, and the commit messages. Use their
acceptance criteria as the requirements. When no source states the intended behavior of a
change, do not take the expected result from the new code. Write `Confirm with the owner` as
the expected result and list the case in "Inputs and Assumptions".

## 6. Check the existing tests

Find the tests that already exercise each changed module. Do not write a new case for behavior
that an existing test already covers. Name that test in "Coverage Notes". A changed behavior
with no test is a gap. A removed or weakened assertion is a gap.

## 7. Set the priority

- Impact is high when the change is in a risk area, crosses a boundary from
  `shared/contracts/references/test-levels.md`, or changes an interface that other code uses.
- Likelihood is high when the change alters a branch, a calculation, a state transition, or an
  error path, or when the module has no tests.
- Put the high-impact, high-likelihood cases first. A low-impact, low-likelihood area can get no
  case when you record the reason in "Coverage Notes".
