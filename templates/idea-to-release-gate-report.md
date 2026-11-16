# Gate report: <feature> - gate <n>, <stage name>

This report is a draft until the gate owner approves it. Agents fill the evidence
and the verdict proposal. People fill the rows under Human records.

## Header

- Feature record:
- Brief or tracker item:
- Stage and gate: `<n>. <stage name>` from `workflows/idea-to-release-workflow.md`
- Date:
- Prepared by: agent or skill run, with the skill names
- Source revision: commit, or document version and date

## Verdict

- Proposed verdict: `Ready`, `Ready with risks`, or `Blocked`
- Verdict basis: the rows in the result-to-verdict table of the workflow
- Gate owner approval: `TBD` until the gate owner approves. Name and date come from the owner.

## Skill results used

| Skill | Result | Verdict from the table | Evidence path |
|---|---|---|---|
| ... | ... | ... | ... |

## Evidence found

| Evidence | Source (path or link) | Checked by |
|---|---|---|
| ... | ... | ... |

## Missing evidence

| Missing item | Needed from | Blocks the gate |
|---|---|---|
| ... | ... | Yes / No |

## Human records

Keep the rows that this gate needs. Write `TBD` with the owner for each row that a person has not filled.
An agent never writes a name that a person did not give.

| Record | Value |
|---|---|
| Product owner | TBD |
| QA lead approval of the test cases (gate 2) | TBD |
| Stories selected, their order, and the person who selected them (stage 5) | TBD |
| Delivery mode for each ticket: human team or agent pod (stage 6) | TBD |
| Human technical reviewer and human QA for each ticket (stage 7) | TBD |
| Product owner acceptance (stage 7) | TBD |

## Blockers

| Blocker | Owner | Clears when |
|---|---|---|
| ... | ... | ... |

## Risks

Each risk needs a named owner before the gate can be `Ready with risks`.

| Risk | Owner | Decision and date |
|---|---|---|
| ... | ... | ... |

## Next actions

| Action | Owner | Done when |
|---|---|---|
| ... | ... | ... |
