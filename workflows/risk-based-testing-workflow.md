# Risk-based testing

Put test and review effort where a defect has the highest impact.
A team maps its risk areas once. Each pull request then gets a focused test plan and a review
that look harder at those paths.

<!-- BEGIN catalog stages: risk-based-testing -->
<!-- Generated from catalog/agent-toolbelt.json by scripts/build-workflow-stages.js. Do not edit. -->

| Stage | Skill | Purpose | Next |
| --- | --- | --- | --- |
| 1 | `risk-area-mapping` | Draft risk areas from code, history, ownership, and the workspace map. A person approves each entry before it is applied. | `test-case-design`, `pr-review` |
| 2 | `test-case-design` | Plan focused cases for a pull request. Cases in a matched risk area get high impact. | `cover`, `webapp-testing`, `pr-review` |
| 3 | `pr-review` | Review the pull request with the risk-area tier floor and a lower threshold on matched paths. | `pr-improve`, `pr-review-reply` |
<!-- END catalog stages -->

## Map the risk areas

Run `/risk-areas` in one repository, or `/risk-areas --sweep <dir>` for a folder of repositories.
Add `--atlas <path>` when the workspace has a map of repositories, blast radius, and integration edges.
The command writes a review file and edits no repository.

A person reviews the file. For each entry, the person confirms the impact line, edits it, or deletes it.
Then `/risk-areas --apply <file>` writes the approved entries. The team commits each list through a
normal pull request, so the list is on the base branch before reviews use it.

Run the sweep again when the workspace map changes, after an incident, or when a new module holds
personal data, access rules, or exports. A new sweep shows the existing list next to the new draft.

## Use the risk areas

- `/test-case-design <PR number or branch>` plans focused cases for one change. Cases in a matched
  area get high impact. Give the path of the workspace map
  to find consumers in other repositories.
- `/pr-review` raises a change that touches a risk area to at least the standard tier. Each facet
  lowers its reporting threshold on the matched paths.

The risk areas add effort. They never remove a case or a finding outside the list.
