# Feature scope

Use this procedure for `/papercuts --feature <branch | PR | ticket>`.
A feature report covers friction across sessions and people, so most of its evidence comes from records.

## Records to read

Read only the records that exist. Do not create records to fill the report.

| Record | What it can show |
| --- | --- |
| This session | The friction that you saw directly. |
| The phase plan, phase files, and handoffs | Detours, blockers, and "ruled out" notes in Current state or the handoff. |
| A bug-investigation file | Wrong paths during diagnosis, and the records that misled them. |
| PR review threads on the feature PRs | Repeated reviewer corrections about one convention, a stale doc, or a duplicate. |
| CI runs on the feature branch | Checks that failed and then passed with no code change, and failures from setup or configuration. |
| Commits on the branch | Reverts, "fix CI" commits, and fixups that repair the same mistake. |

For a PR or a ticket, find the branch first. Read PR data with the host CLI that `shared/contracts/references/providers.md` selects.
If the host CLI is not available, use the local branch, the commits, and the files only, and state the limit.

## Rules for records

- Report a record event only when you can name a codebase cause for it. A failed test from a real bug is not a papercut.
- Cite the source of each row in the note under the table: the session, a file path, a PR thread link, or a CI run link.
- Count repeats. A cause that appears in two records or two sessions ranks higher than a cause seen once.
- Do not guess about sessions that left no record. State which sources the report used.
- Do not quote review comments word for word in a posted entry. Summarize the event and link the thread.
