# Architecture Smell Mode Decision

## Decision

Do not add a separate `improve-codebase-architecture` command in this pass.
Absorb the useful architecture vocabulary into `/code-smell --architecture`.

Reasoning:

- `/code-smell` is already the detect-only structural scan.
- A separate command would overlap with `/code-smell`, `/simplify`, and deep
  `pr-review` maintainability.
- The upstream HTML report and grilling loop are heavier than this repo's
  command surface and would add new side-effect expectations.
- Architecture review should first produce ranked candidates, not files, ADRs,
  domain-model edits, or proposed interfaces.

## No-Code Candidate Report

Area scanned: `commands/code-smell.md` plus
`shared/contracts/references/maintainability-taxonomy.md`.

Candidate: absorb architecture review into `/code-smell --architecture`.

Strength: strong.

Files:

- `commands/code-smell.md`
- `shared/contracts/references/maintainability-taxonomy.md`
- `skills/simplify/SKILL.md`
- `commands/README.md`
- `commands/workflow-router.md`

Current shape: `/code-smell` owns detect-only structural findings, while
`/simplify` owns opt-in cleanup and `pr-review` owns changed-line review with a
verdict.

Deepening opportunity: make `/code-smell` the deeper structural interface by
adding an architecture mode rather than creating a peer command with overlapping
scope.

Locality/leverage gain: one command and one taxonomy now cover ordinary smells,
the compact maintainability baseline, and architecture candidates. Users can
choose a focus without learning a new workflow.

Smallest next slice: run `/code-smell <path> --architecture` on a real module
after this branch lands and tune the candidate fields if the report is too broad
or too vague.

ADR or constraint notes: no ADR conflict found. Keep the mode detect-only and
avoid HTML/CDN report generation unless user demand proves the plain report is
not enough.
