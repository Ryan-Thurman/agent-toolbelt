---
name: vercel-web-interface-guidelines
description: Review web UI code against the Vercel Web Interface Guidelines for accessibility, focus, forms, animation, typography, layout, theming, and interaction. Use when you review or build UI, or when the React rule scan lists this skill.
---

# Web interface review

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

**Arguments:** an optional file, directory, or pattern. Without one, review the
UI files changed since the default branch. When no file changed, review the app
as in "Existing code".

1. Read [references/guidelines.md](references/guidelines.md).
2. Read the repository's design system, copy style, and accessibility policy.
   They win over the guidelines. Record each conflict once in the conflict record, not as a finding.
3. Read each UI file in scope: components, styles, and layout files.
   Check it against every guideline section.
   Also check the two rules in "Toolbelt checks".
   The React rule scan finds the common anti-patterns. It does not replace a full read.
4. Report problems in the changed code and in the files that the user named.
   Also report problems in the shared layout, style, and HTML files that those files use.
   Mark such a finding `shared`.
5. Set each finding's severity with `shared/contracts/references/react-acceptance.md`.
6. Tag each finding `[read]` (seen in code) or `[observed]` (seen in a browser run).
   For a check that code alone cannot settle, follow "Checks that need a browser".

## Existing code

Use this mode when no file changed, or when the user names a whole app or folder.

1. State the file set in the first line of the report, and why you chose it.
2. Read in this order. Stop at 15 files unless the user sets another limit.
   - The HTML entry file, the global styles, and the layout files.
   - Shared form and table components.
   - The pages on the main user path, such as sign-in and the first list or form.
3. Skip test, mock, and snapshot files.
4. List each UI file that you did not read under `Not read`. Do not claim a full review.
5. Use the scan result only as a pointer to files. Count a scan hit as a finding only after you read the line.

## Toolbelt checks

These two rules are not in the upstream guidelines.

- A user-facing string in a component must come from the translation layer when the app has one.
  A literal such as `"Loading..."` is a finding.
- A table head row must use `<th>` cells, with `scope` when the table has both row and column headers.
  A head row of `<td>` cells is a finding.

## Checks that need a browser

Code cannot settle these checks: focus after submit, live-region announcements,
reduced-motion behavior, and overflow with long text.
Hand them to the `webapp-testing` skill (`/webapp-test`) and tag each result `[observed]`.
Without a browser run, tag the finding `[read]` and list the check under `Not exercised`.
Follow the unexercised-check rule in `shared/contracts/references/evidence-quality.md`.
Mark a constructed input, such as a very long word, as constructed.

## Conflict record

Write each conflict once in a `Conflicts` section after the findings.
Use this format: `rule vs policy - reading used`. Use these readings unless the repository policy says otherwise.

- "Interactive elements need keyboard handlers" does not apply to a native `<button>` or `<a>`.
- The repository's text case wins over Title Case.
- A placeholder ends with `…`, and the control still needs a label. Report a missing label, not the placeholder.
- When no policy file exists, the guideline applies. Say so in the record.

## Output

Group findings by file. Use `file:line` locations. Write one line for each finding
in this format: `file:line - [severity] [read|observed] problem. Fix.` Add an explanation only when the fix is not obvious.
After the files, add `Conflicts`, `Not read`, and `Not exercised` sections when they have content.

```text
## src/Button.tsx

src/Button.tsx:42 - [should-fix] [read] icon button has no aria-label. Add aria-label="Close".
src/Button.tsx:67 - [nit] [read] transition: all. List the animated properties.

## src/Card.tsx

Pass.

## Conflicts

Title Case vs sentence-case copy style - sentence case kept.
```
