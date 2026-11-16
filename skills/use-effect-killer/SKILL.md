---
name: use-effect-killer
description: Audit React useEffect calls against 13 anti-patterns from "You Might Not Need an Effect" and propose idiomatic fixes. Use when you audit, review, write, or clean up effects, or when the React rule scan lists this skill.
---

# useEffect audit

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Classify every effect in scope. Do not sample effects. An unclassified effect is an incomplete audit.

**Scale:** the rule applies to every effect in the scope you set. For a whole app, set the scope first, such as a folder or the entry pages, and state it in the report. Exclude test and mock files, and name them as excluded.

**Arguments:** an optional path. Without a path, audit the changed lines since the default branch.

1. Find the effects. Run
   `python3 shared/contracts/scripts/react-rule-scan.py --max-hits 0 [path]`.
   The `use-effect-killer` rule `hits` list each effect location.
   If the scanner is not installed, search the scope for `useEffect(`, `useLayoutEffect(`, and `useInsertionEffect(`.
2. Read the React version, the React Compiler setting, the framework, and the
   hooks lint configuration. These decide which fix is valid.
3. Read [references/anti-patterns.md](references/anti-patterns.md).
4. Read each effect with its component. Give it exactly one classification:
   an anti-pattern number from 1 to 13, a check letter from A to E, or `Legitimate` with the matching legitimate use.
5. Read [references/additional-checks.md](references/additional-checks.md). Check each component that holds an effect, and each component in scope that you read, for checks A to E.
   Checks A and D are not effects. Record them with the component location.
6. For each anti-pattern or check, record the location, the current code, the problem,
   and a concrete fix that the version notes allow.
7. Change code only when the user asks for fixes or a calling workflow applies them.
   Keep the same behavior, including loading, error, ordering, and cleanup behavior.
   Run the focused tests after each fix.

When the audit is a report run and the user names no path, write the report to
`.atb-work/use-effect-killer/<scope-slug>.md`. Follow "Durable report location" in
`shared/contracts/references/execution.md`.

When a review or gate calls this skill, set each finding's severity with
`shared/contracts/references/react-acceptance.md`.
Repository policy and enforced lint rules win over this catalog.
Record a conflict instead of a finding.

## Output

```markdown
## useEffect audit

| Result | Count |
| --- | --- |
| Files scanned | N |
| Effects found | N |
| Anti-patterns and checks | N |
| Legitimate | N |

### <number or letter>. <anti-pattern or check name> (N)

`path/to/file.tsx:42`: <problem in one sentence>.
Fix: <change in one sentence>.
<code before and after when the fix is not obvious>

### Legitimate effects

`path/to/file.tsx:88`: <legitimate use>.
```

Group findings by anti-pattern. List every legitimate effect, so the reader can see that it was checked.
