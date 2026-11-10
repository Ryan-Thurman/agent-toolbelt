---
name: style-guide-init
description: Extract and maintain repository contribution guidance from code, tooling, tests, CI, and documented policy. Use to create or refresh contribution/style guides, explain how to contribute, or assess convention drift; not for routine code review.
---

# Repository contribution guidance

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Derive how to work in this repository, then maintain that guidance against new
evidence. A repeated implementation is evidence of practice, not automatic approval of a standard.

## Choose the operation

Select the operation from the flag or from the same request in plain words.
With no flag and no clear request, use explain or draft.

- **Explain or draft (`--print`):** inspect the requested scope and return guidance without
  changing files. `--print` always takes this path.
- **Create or update (`--write`):** a request to write the guide authorizes the relevant doc
  edits and evidence checkpoint. Use the existing documentation owner and format;
  otherwise default to `CONTRIBUTING.md`. Use `STYLE_GUIDE.md` for a specifically
  requested style-only guide. Do not require another approval for authorized edits.
- **Check (`--check`):** report changed inputs and affected guidance without writing files.
- **Refresh (`--refresh`):** re-evaluate changed inputs and affected claims. Apply doc changes
  when the request authorizes them. Otherwise return the proposed patch.
- **Scope (`--scope PATH`):** limit discovery to one package or subtree.
  Repeat the flag for more areas. With no scope, use the whole repository.

This skill changes documentation and its checkpoint, not source/configuration,
CI settings, branch protections, or release state. Do not install automation
unless requested. Follow governing instructions while proposing corrections.

## Derive the guide

1. Establish scope, Git revision and working-tree state, existing guide owners,
   and applicable root/subtree instructions. Read
   `shared/contracts/references/style-precedence.md`. Discover formatter,
   linter, compiler, package/task, test, CI, PR-template and ownership files.
2. Read [references/extraction.md](references/extraction.md). Trace a representative
   change through implementation, tests and required checks. Include active and
   older areas where their practices differ; record unsampled areas. Validate
   commands from their definitions and relevant CI; record actual execution
   separately. Repository scripts are code: inspect before running, and stay
   within the task's execution authority.
3. Classify each claim as **documented policy**, **enforced**, **observed**,
   **proposed**, or **conflicted**. Record source paths/symbols, scope, confidence
   and counterexamples. A new branch or frequent pattern cannot override an
   approved policy. Show stale commands or contradictions with current evidence;
   preserve intent and leave policy decisions unresolved when the evidence cannot
   settle them. Generic advice is never an extracted repository convention.
4. Write only useful contribution decisions: setup, where changes belong,
   representative code/test idioms, verification commands, generated-file handling,
   documentation impact, and submission workflow. Reuse the existing style owner
   for detailed rules. Link from README/agent entry files when useful and authorized;
   keep one owner per fact. Use `templates/repository-contribution-guide.md` or,
   for style-only work, `templates/repository-style-guide.md`.
5. Verify cited paths and command definitions, inspect the scoped doc diff, and
   record unresolved choices and coverage. For persisted guidance, read
   [references/maintenance.md](references/maintenance.md) and capture a checkpoint
   after reviewing the final sources and outputs. A checkpoint detects changes;
   it does not certify that a guide is correct or approved.

When naming or TypeScript/React guidance needs a fallback, consult
`shared/contracts/references/anti-slop-naming.md` or
`shared/contracts/references/typescript-react-baseline.md` as applicable. Label
fallbacks as proposals unless the repository has adopted them.
For a React repository, compare its lint and budget tools with the Tooling table in
`shared/contracts/references/react-acceptance.md`. List each gap as a proposal.

## Maintenance

For check or refresh, read [references/maintenance.md](references/maintenance.md).
It uses `scripts/conventions_state.py` to compare the recorded checkpoint with the current checkout.

## Completion

Return the guide/draft or drift report, source scope and revision, evidence and
conflicts, commands actually run with results, and remaining gaps. For a write,
report artifact/checkpoint paths and what changed. Keep adopted requirements
distinct from observed conventions, and retain a no-change result when it is
supported. Do not claim full coverage from a sample or command success from a
configuration read.
