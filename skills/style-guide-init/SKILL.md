---
name: style-guide-init
description: Establish or refresh evidence-derived repository coding standards and a style-guide proposal. Use when a repository needs a canonical style owner or implementation conventions are unclear.
---

# style-guide-init

Establish a repository's style evidence and propose a compact canonical owner.
This skill does not invent a style guide from generic preferences.

## Steps

1. Read `shared/contracts/references/style-precedence.md`. When extracting naming,
   comments, or abstraction conventions, also read
   `shared/contracts/references/anti-slop-naming.md`. For TypeScript or React, read
   `shared/contracts/references/typescript-react-baseline.md`.
2. Discover existing `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, style and architecture
   documents; formatter, linter, compiler, test, and CI configuration; then inspect
   representative neighboring production code and tests.
3. Extract repeated evidence for vocabulary, helpers, module boundaries, errors,
   comments, and test idioms. Mark weak or conflicting evidence as uncertain.
4. If a canonical style owner exists, propose a focused update to that file. If none
   exists, present the evidence and proposed `STYLE_GUIDE.md` content, then wait for
   explicit opt-in before creating it. Do not duplicate its rules in `AGENTS.md`.
5. Produce the artifact using `templates/repository-style-guide.md`. Include evidence
   paths and uncertainty notes so a maintainer can review every non-obvious rule.

## Completion

Finish with an evidence-backed style guide update or draft, a concise precedence
statement, and unresolved choices. Do not claim a convention where the evidence is
thin or contradictory.
