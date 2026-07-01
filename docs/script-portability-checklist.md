# Script Portability Checklist

Use this checklist when editing installer or helper scripts.

- Keep writes confined to the explicit target directory, repo-local generated
  directories, or a caller-provided output path.
- Prefer path-final `mktemp` templates such as
  `"${TMPDIR:-/tmp}/agent-toolbelt-name.XXXXXX"` or
  `"$(dirname "$target")/.name.XXXXXX"`. Avoid fixed temp paths.
- Clean up temporary files/directories with `trap` when they are only needed for
  the current check.
- Quote paths and variables; assume spaces in target folders.
- Avoid hardcoded home directories. Use user-provided paths or documented env
  vars for stateful locations.
- Parse comma/list inputs defensively: trim whitespace, reject unknown tokens,
  and avoid silently accepting empty required values.
- Treat CRLF or platform-specific line endings as input to normalize or reject
  deliberately, not as invisible success.
- Validate before writing when overwriting a user-owned file. Prefer dry-run
  output for installer changes.
- When a script writes into an existing file, use a temp file in the destination
  directory and then move it into place.
- Run `bash -n` on changed shell scripts, plus an installer dry-run or focused
  smoke check for the affected path.
