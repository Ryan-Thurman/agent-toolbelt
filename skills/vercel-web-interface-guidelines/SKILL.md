---
name: vercel-web-interface-guidelines
description: Review web UI code against the Vercel Web Interface Guidelines for accessibility, focus, forms, animation, typography, layout, theming, and interaction. Use when you review or build UI, or when the React rule scan lists this skill.
---

# Web interface review

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

**Arguments:** an optional file, directory, or pattern. Without one, review the
UI files changed since the default branch.

1. Read [references/guidelines.md](references/guidelines.md).
2. Read the repository's design system, copy style, and accessibility policy.
   They win over the guidelines. Record each conflict once, not as a finding.
3. Read each UI file in scope: components, styles, and layout files.
   Check it against every guideline section.
   The React rule scan finds the common anti-patterns. It does not replace a full read.
4. Report only problems in the changed code, or in the files that the user named.
5. Set each finding's severity with `shared/contracts/references/react-acceptance.md`.

## Output

Group findings by file. Use `file:line` locations. Write one line for each finding:
the problem and the fix. Add an explanation only when the fix is not obvious.

```text
## src/Button.tsx

src/Button.tsx:42 - icon button has no aria-label. Add aria-label="Close".
src/Button.tsx:67 - transition: all. List the animated properties.

## src/Card.tsx

Pass.
```
