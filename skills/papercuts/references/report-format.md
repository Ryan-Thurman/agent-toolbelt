# Papercuts report format

## Table

Use one row for each papercut. Keep each cell to one or two short sentences.
Put a detail that does not fit in a short note under the table.

| Column | Content |
| --- | --- |
| `#` | The rank, from 1. |
| `Papercut` | The concrete event, with file paths or the command. |
| `Cost` | The result: a wrong first attempt, time spent, a failed check, or a near miss. |
| `Fix` | The smallest durable change, and the exact file that it changes. |
| `Key` | `<category>:<path-or-command>`. Teams use it to match the same papercut across reports. |

The categories are `wrong-path`, `discovery`, `stale-doc`, `duplication`, `tooling`, `structure`, and `trap`.
For the key path, use the file that the fix changes. Use the command for a tooling papercut without a file.
Keep the key stable: use a repository-relative path, and no line numbers.

## Example

This report shows the shape and the size of a good entry.

```markdown
## Papercuts: feature/export-csv (2026-11-15)

Repository: `acme/web` at `4f2c1d0`. Scope: feature. Sources: this session, PR #212 review threads, CI runs on the branch.

| # | Papercut | Cost | Fix | Key |
| --- | --- | --- | --- | --- |
| 1 | `npm test` in `packages/api/` runs no tests and exits 0. The script reads `tests/`, but the tests are in `src/**/*.test.ts`. | The first change looked green. CI found the failure. | Point the `test` script in `packages/api/package.json` at `src/`. Delete the empty `tests/` folder. | `tooling:packages/api/package.json` |
| 2 | The README names `config/limits.json`, but the server reads the values in `src/server/limits.ts`. | About 20 minutes to find why the edit had no effect. | Delete `config/limits.json` and correct the README line. | `duplication:config/limits.json` |

Also hit and fixed: the missing `.env.example` entry for `EXPORT_BUCKET`.
```

Do not pad the table with weak rows. Do not report a row without a named fix file.

## Shared-log entry

The saved report is the entry. Its heading gives the scope slug and the date.
Its first line gives the repository, the short commit, the scope, and the evidence sources.
Do not add the name of a person. The person who posts the entry can add their own name.

## Posting

Read `shared/contracts/references/posting.md` before a post.
Without `--post`, show the saved report so that the user can paste it into the team log.

| Target | How to post |
| --- | --- |
| A Markdown file, such as `docs/papercuts.md` in a team repository | Append the entry to the end of the file. Do not commit or push. Tell the user the path. |
| A GitHub issue URL | Add one comment with `gh issue comment <url> --body-file <report>`. |
| An Azure Boards work item URL | Add one discussion comment with `az boards work-item update --id <id> --discussion "<report>"`. Convert the table to HTML if the project does not render Markdown. |
| A Jira key or another tracker | Show the entry for the user to paste. To track a fix as work, write a ticket file for each selected row and use `ticket-sync`. |

Before you post, read the target.
Mark each row whose key is already in the target as a repeat, and add a link or a heading reference to the earlier entry.
A repeat shows the team which papercuts recur.

Put the marker `<!-- papercuts:<scope-slug>:<YYYY-MM-DD>:<short-commit> -->` at the top of the posted entry.
If the target already contains the marker, do not post again. Report the earlier entry.

Show a preview of the exact text and the target, and get confirmation before the write.
If the host CLI is missing or not signed in, do not post. Save the report, and give the reason and the path.
