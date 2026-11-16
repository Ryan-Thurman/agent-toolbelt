# Apply discipline

How to apply simplifications safely. Load this before editing (the `/simplify` apply step).
`/code-smell` never reaches here. It stops at the report.

## Selection

- Pre-select `safe` items. Leave `confirm` and `review` items unselected.
- Apply only after the user confirms the selection. Never silently rewrite during the report.

## Behavior-preserving mandate

- Preserve output, errors, side-effects, and ordering.
- **All existing tests must still pass without modification.** If applying a change requires editing
  a test to stay green, you changed behavior. Revert it.
- Submit cleanup separately from feature or bug-fix changes (its own commit/PR).

## Chesterton's fence: pre-removal checklist

Before deleting or inlining anything, answer:

- What is its responsibility?
- What calls it (including dynamic/reflective callers)?
- What edge cases does it handle?
- What tests cover it?
- Why was it written this way (performance, platform, historical reason)? Check `git blame`.

If you cannot answer these, you are not ready to simplify it. Mark it `review` and move on.

## Apply loop

- **One change at a time.** Run the relevant tests after each change. If they fail, revert and
  reconsider rather than piling on fixes.
- **Check that the test can fail.** For each change that a test protects, remove the protected line, run the test,
  and see it fail for the expected reason. Restore the line, and run the test again. Record each mutation and its result.
  Read `shared/contracts/references/test-driven-development.md#Implement one behavior at a time` for the red rule.
- **Rule of 500:** if a cleanup touches more than ~500 lines, use a codemod / AST transform, not
  hand edits.
- Do not edit inside `simplify-ignore` blocks. Respect existing abstraction boundaries.

## Red flags (stop and reconsider)

- A "simplification" that requires modifying tests to pass (you changed behavior).
- "Simplified" code that is longer or harder to follow.
- Removing error handling because "it makes the code cleaner."
- Batching many simplifications into one large, hard-to-review commit.
