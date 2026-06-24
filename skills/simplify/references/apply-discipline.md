# Apply discipline

How to apply simplifications safely. Load this before editing (the `/simplify` apply step).
`/code-smell` never reaches here — it stops at the report.

## Report-then-apply

1. Produce the findings list first (structured, no prose dump). Each finding:
   `category, file, lines, rootIssue, consequence, benefit, risk, action`. Empty list if nothing
   survives the consequence test.
2. Let the user select what to apply. `safe` items may be pre-selected; `confirm`/`review` are not.
3. Apply only the selected items, in a second step. Never silently rewrite during the report.

## Behavior-preserving mandate

- Preserve output, errors, side-effects, and ordering.
- **All existing tests must still pass without modification.** If applying a change requires editing
  a test to stay green, you changed behavior — revert it.
- Submit cleanup separately from feature or bug-fix changes (its own commit/PR).

## Chesterton's Fence — pre-removal checklist

Before deleting or inlining anything, answer:

- What is its responsibility?
- What calls it (including dynamic/reflective callers)?
- What edge cases does it handle?
- What tests cover it?
- Why was it written this way — performance, platform, historical reason? Check `git blame`.

If you can't answer these, you're not ready to simplify it — mark it `review` and move on.

## Apply loop

- **One change at a time.** Run the relevant tests after each change. If they fail, revert and
  reconsider rather than piling on fixes.
- **Rule of 500:** if a cleanup would touch more than ~500 lines, use a codemod / AST transform, not
  hand edits.
- Be especially careful with: error-handling code, security logic, migration files, and code that
  looks unused but is reached via reflection/`eval`. Respect existing abstraction boundaries.

## Red flags (stop and reconsider)

- A "simplification" that requires modifying tests to pass (you changed behavior).
- "Simplified" code that is longer or harder to follow.
- Removing error handling because "it makes the code cleaner."
- Batching many simplifications into one large, hard-to-review commit.

## Scope and ignore handling

- **Scope:** default to the working diff if the tree is dirty; otherwise the named path/area, or
  `previous` (`git diff HEAD~1..HEAD`), or a free-text focus ("focus on the auth module").
- **Ignore markers:** skip any block fenced by `simplify-ignore-start: <reason>` /
  `simplify-ignore-end` comments (any comment syntax). Do not flag or edit inside them.
- **Classify scope:** don't flag legacy/untouched code unless the current change touches it.
