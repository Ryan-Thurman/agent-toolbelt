---
name: papercuts
description: Report codebase friction that slowed a session or feature, such as stale docs, misleading names, duplicate config, or failing commands, as ranked fixes for a shared team log. Suggest it after work that friction slowed.
---

# papercuts

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Report what in the repository made the work harder than necessary.
A papercut is friction that the codebase, its docs, or its tooling caused.
The difficulty of the task itself is not a papercut.
Each report becomes one entry in a team's shared log, so that repeated friction gets fixed.

## Mutation policy

Default: report only. Write the report file and show it.
Do not edit the repository to fix a papercut unless the user asks after the report.
Post to a shared target only with `--post`. Consent and the preview follow `shared/contracts/references/posting.md`, as `references/report-format.md` states.

## Scope

- **Session** (default): the work in this session.
- **Feature** (`--feature <branch | PR | ticket>`): the work on one feature, across sessions and people.
  Read `references/feature-scope.md` before you collect evidence.

## Steps

1. **Collect the friction.** Go back through the work in scope. For each detour, find what caused it:
   - Wrong path: you edited the wrong file, package, or layer because a signal misled you.
   - Discovery cost: several searches found a fact that one doc line or a better name can give at once.
   - Stale doc: `AGENTS.md`, `CLAUDE.md`, a README, or a comment says something that the code contradicts.
   - Duplication: two copies of a fact, config, or logic exist, and nothing shows which copy is canonical.
   - Tooling: a command failed on the first try, a script or setup step is missing, a test cannot run alone,
     or a check is slow or flaky.
   - Structure: a name does not match its behavior, a file is in a surprising location, or ownership is unclear.
   - Trap: only luck or an old note prevented a mistake.
2. **Remove what is not a papercut.**
   - Friction that is already fixed. List it in one line under the table, not as a row.
   - The difficulty of the task.
   - A style preference with no cost in time or mistakes.
   - Friction from the agent harness, unless the repository can absorb it, for example with a script.
   - A guess about code that the work did not touch.
3. **Write each row.** Give the concrete event with file paths, its cost, and the smallest durable fix.
   Name the exact file and the change for each fix. "Improve the docs" is not a fix.
   Give each row a category and a key, as `references/report-format.md` defines.
   Check each row's cause against the source before you write its fix. Read the file or the command
   output that shows the cause. A cause from a record or from memory alone is a candidate, not a row.
4. **Rank** the rows by expected recurrence. The papercut that every future agent or person will hit goes first.
   Keep only real rows. If nothing slowed the work, write that in one sentence and make no table.
5. **Save the report** to `.atb-work/papercuts/<YYYY-MM-DD>-<scope-slug>.md` and show it.
   Ensure `.atb-work/` has a `.gitignore` that contains `*`.
6. **Post on request.** With `--post <target>`, follow `references/report-format.md`.
   It marks rows that repeat an earlier report and shows a preview before the write.

Do not name people in a row. Name files, commands, and records. Remove secrets, tokens, and personal data.
Cite no private path, such as a folder outside the repository, in the report or a post. Cite the repository path, the command, or the record name.

## Suggest a report

At the end of a task, add one line to the final summary when the codebase caused real friction:
"This work hit codebase friction. Run `/papercuts` for the ranked list."
At the end of a feature, suggest `/papercuts --feature <branch>` instead.
Do not suggest it after work that had no friction.

## Completion

The report file exists and its path is in the reply.
Each row is open, has a key, and names the file that its fix changes.
The reply gives the report state from `references/report-format.md`.
A `preview` that no person confirmed stays a preview. The reply says that nothing was posted.
With `--post`, the target has the entry, or the reply states why the post did not happen.

## Reference map

- `references/report-format.md`: the table, categories, keys, the shared-log entry, and posting targets.
- `references/feature-scope.md`: the records to read for a feature, and how to cite them.
- `references/upstream-attribution.md`: sources. No step loads it.
