---
description: Scan a path or area of code for structural smells (complexity, duplication, coupling, state, errors, performance, maintainability, architecture) ranked by severity and confidence. Detect-only — never edits code. Use to survey an area before refactoring.
argument-hint: "<path-or-area> [focus|--architecture]"
---

# /code-smell

Survey an area of code for structural smells using the `simplify` skill. This is the **detect-only**
mode: it reports, it never edits.

> **When to use vs related:** `/code-smell` scans a whole path/area and ranks smells but applies
> nothing. Use `/simplify` to actually apply cleanups (diff-scoped), or `/pr-review` for a
> changed-lines review with a verdict. Use `/code-smell <path> --architecture` for a no-code
> deepening-opportunity scan. Hand the safe subset of these findings to `/simplify`.

**Arguments:** `$ARGUMENTS`

## Rules

- Read the skill's `references/smell-taxonomy.md`. **Detect-only — do not edit any files.**
- One cause-effect chain per smell: `smell → evidence → impact → recommendation`. No subjective
  style nits. Do not recommend large rewrites unless a small first slice is clear.
- Treat lexical/regex cues as leads to verify by reading, not as truth.
- In `--architecture` mode, report candidate deepening opportunities only. Do not create HTML, do
  not modify domain docs or ADRs, and do not propose full interfaces yet.

## Steps

1. **Scope** to the path or area in the arguments (this mode is not diff-bound).
2. **Scan** by family: complexity, duplication, coupling, state, errors, performance,
   maintainability. If `--architecture` or an architecture focus is present, scan for shallow
   modules, weak seams, poor locality, and deepening opportunities.
3. **Rank** each finding by `severity` (high/medium/low) × `confidence` (high only after reading
   enough to verify).
4. **Report** the findings with evidence (symbol/line/pattern) and a small, behavior-preserving
   recommended next step + `action` (`inspect`/`delete`/`inline`/`extract`/`refactor`/`guard`).

## Output

A ranked findings list — `category, severity, confidence, file, lines, smell, evidence, impact,
recommendation, action` — highest severity×confidence first. No files are modified. Note which
findings are `safe` enough to route to `/simplify`.

For `--architecture`, output `candidate, strength, files, current shape, deepening opportunity,
locality/leverage gain, smallest next slice, ADR or constraint notes`. Rank by confidence and value,
not by visual polish.
