# PR readiness review

Review one phase or ticket PR. For a stack, compare this branch with its parent
branch rather than the default branch.

- Phase / source ticket:
- Parent ticket / PR, if stacked:
- Work branch / PR target:

## Result

Use one:

- Ready
- Needs Work
- Blocked

## Done-when / acceptance clauses verified

List the clauses that were verified and the evidence used. Do not list a clause
as verified when it is only Not verified.

| Clause | Status | Evidence |
|---|---|---|
| ... | Verified / Failed / Not verified | ... |

## Acceptance criteria matrix

| Criteria | Status | Evidence / Notes |
|---|---|---|
| ... | Met / Partial / Missing | ... |

## Flow coverage matrix

| Flow | Status | Evidence / Notes |
|---|---|---|
| ... | Covered / Partial / Missing | ... |

## Verification reach

List important requirements or risks as Verified, Failed, or Not verified. For
Not verified items, state the exact evidence needed next.

| Item | Reach | Evidence / Needed Evidence |
|---|---|---|
| ... | Verified / Failed / Not verified | ... |

## Findings

### Blocking

### `Should Fix`

### `Nice to Have`

Cite the specific plan, acceptance, contract, or boundary clause violated
in each request-changes finding.

## Required fixes

## Required quality gate evidence, if applicable

- Report path:
- Why required (repository policy, user request, or phase risk):
- Status: PASS / FAIL / CAPPED / BLOCKED / Missing / Stale / Not required
- Coverage: final / partial / unknown
- Current base and head fingerprint recomputed and verified: Yes / No
- Blocking gate outcome or remaining disposition:

## Tests / checks reviewed

## Test suite changes

Summarize automated tests added or updated during implementation.

## Test gaps

List missing feasible tests and classify as `Blocking`, `Should Fix`, or
`Nice to Have`.

## Performance notes

## Security notes

## Code quality notes

## UX / product notes

## Documentation notes

## Branch / PR notes

- Current branch:
- PR target branch and parent PR:
- Default-branch push avoided: Yes / No / User-approved exception
- Ready to open PR: Yes / No
- Recommended PR command or manual PR title/body:

## Plan document updates

Summarize the existing plan or execution record updates made for PR readiness result,
branch/PR state, required fixes, next step, and resume instructions.

## Suggested PR description

```md
## Summary

- ...

## What Changed

- ...

## How Tested

- ...

## Risks / Notes

- ...

## Screenshots / Videos

- Add if applicable.
```
