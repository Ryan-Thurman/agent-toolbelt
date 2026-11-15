# Risk areas

A risk area is a part of the code where a defect has high impact, for example access control,
personal data, or data export. A team declares its risk areas once. Test planning and code
review then put more effort on a change that touches one.

## Where to find the list

Read the first `## Risk areas` section that you find, in this order:

1. `.pr-review.md` at the repository root
2. `.claude/pr-review.md`
3. `AGENTS.md` at the repository root
4. `CLAUDE.md` at the repository root

Use only one list. Do not merge lists from two files. When no file has the section, the
repository has no declared risk areas. Do not invent them.

For a review of a pull request, read the list from the base branch, not from the pull request.
A change cannot remove the risk area that it touches.

## Format

Each entry is one list item with a name, one or more path globs, and the impact of a defect:

```markdown
## Risk areas

- **Access control** (`src/auth/**`, `src/roles/**`): A defect can show one clinic's records to another clinic.
- **Data export** (`src/export/**`): A defect can send personal data to the wrong recipient.
```

Write the impact as a fact about users, money, data, or access. Do not write a priority word
such as "critical" without the reason. When code in other repos consumes a contract in the area,
name those repos in the impact line.

The `risk-area-mapping` skill (`/risk-areas`) drafts the list from evidence, for one repo or a
folder of repos. A person confirms each impact line before the list is committed.

## How to apply the list

1. Compare each changed or planned file path with the globs.
2. A match makes the impact of a defect in that area high. The likelihood still comes from the
   change itself.
3. Name each matched area and its impact line in the output, so that a reader can check the match.
4. A match adds effort. It never removes a case, a finding, or a check from an area that is not
   on the list.
