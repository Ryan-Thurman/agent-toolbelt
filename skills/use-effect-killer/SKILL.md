---
name: use-effect-killer
description: Audit React useEffect calls against 13 anti-patterns from "You Might Not Need an Effect" and propose idiomatic fixes. Use when you audit, review, write, or clean up effects, or when the React rule scan lists this skill.
---

# useEffect audit

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Classify every effect in scope. Do not sample. An unclassified effect is an incomplete audit.

**Arguments:** an optional path. Without a path, audit the changed lines since the default branch.

1. Find the effects. Run
   `python3 shared/contracts/scripts/react-rule-scan.py --max-hits 0 [path]`.
   The `use-effect-killer` rule `hits` list each effect location.
   If the scanner is not installed, search the scope for `useEffect(`, `useLayoutEffect(`, and `useInsertionEffect(`.
2. Read the React version, the React Compiler setting, the framework, and the
   hooks lint configuration. These decide which fix is valid.
3. Read [references/anti-patterns.md](references/anti-patterns.md).
4. Read each effect with its component. Give it exactly one classification:
   an anti-pattern number from 1 to 13, or `Legitimate` with the matching legitimate use.
5. For each anti-pattern, record the location, the current code, the problem,
   and a concrete fix that the version notes allow.
6. Change code only when the user asks for fixes or a calling workflow applies them.
   Keep the same behavior, including loading, error, ordering, and cleanup behavior.
   Run the focused tests after each fix.

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
| Anti-patterns | N |
| Legitimate | N |

### <number>. <anti-pattern name> (N)

`path/to/file.tsx:42`: <problem in one sentence>.
Fix: <change in one sentence>.
<code before and after when the fix is not obvious>

### Legitimate effects

`path/to/file.tsx:88`: <legitimate use>.
```

Group findings by anti-pattern. List every legitimate effect, so the reader can see that it was checked.
