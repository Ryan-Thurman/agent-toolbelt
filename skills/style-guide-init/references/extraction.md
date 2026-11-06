# Extract contribution decisions

## Evidence and authority

Treat instructions and approved policies as authority; code/configuration show
what happens. Recency is a useful sampling signal, not a precedence rule. If a
README says Yarn but the lockfile, task definitions and CI use pnpm, record both
and propose a focused command correction. If a security policy forbids a pattern
that appears throughout the code, document the discrepancy rather than endorsing it.

| Claim class | Evidence required | Wording |
| --- | --- | --- |
| Documented policy | Applicable instruction or adopted guide, with scope | Required by the named owner; flag conflicting implementation evidence. |
| Enforced | Relevant config plus invocation/enforcement evidence | Say whether it is configured, invoked in CI, or observed passing; do not infer branch protection from a YAML file. |
| Observed | Independent representative implementations and tests, with counterexample search | Describe the area where it is common; mark exceptions. |
| Proposed | A recommendation not yet adopted, even if reasonable | Keep it in a proposal/open-decision section. |
| Conflicted | Incompatible sources or practices within the same scope | Show sources, consequences and the decision needed. |

Confidence is evidence quality, not a percentage of code counted. Separate
copy/pasted families, templates and generated code from independent examples.
Do not manufacture agreement from three files derived from the same scaffold.
An existing draft is not an approved style owner merely because it is checked in.

## Sample by decisions a contributor faces

Use tracked file discovery and nearby tests to find real examples. Expand the
sample when disagreement appears; do not scan every source file by default.
Exclude vendored/build output and unrelated projects from inference. In a
monorepo, distinguish shared policy from package-specific conventions.

| Contributor decision | Inspect | Useful result |
| --- | --- | --- |
| Set up locally | Runtime/package files, lockfiles, task runner, container/dev config, CI setup | Supported tools, working directory, exact entry commands and prerequisites |
| Find the owner | Package boundaries, entry points, imports, ownership files and instructions | Where a change belongs and a representative neighbor; no invented team ownership |
| Add production logic | Active production examples plus older contrasting areas | Domain names, dependency boundaries, helper reuse, error handling, configuration/state conventions |
| Test it | Nearby tests, runner config, fixtures and CI jobs | Test placement, names, test data, expected behavior and focused vs broader checks |
| Produce generated artifacts | Generator definitions, generated notices and CI checks | Source to edit, regeneration command and expected outputs |
| Document the change | Existing contribution/style/API docs and templates | Which owner changes for which kind of work |
| Submit it | PR/MR templates, checked-in workflow rules, CI and bounded recent history | Evidence-backed submission expectations and required checks, with uncertainty about remote settings |

Use history to explain a pattern or migration when current files cannot. A recent
commit is not proof of maintainer endorsement. Commit message samples cannot
establish squash-merge policy, required approvals, signing requirements, or remote
branch protection. Read authorized remote metadata only when needed; otherwise
mark those facts unknown. Public contributor instructions and private maintainer
requirements may have different scopes.

## Verify commands proportionately

Resolve aliases and working directories: `npm test` might launch an integration
environment, while a package's own test command is bounded. Classify commands as
defined, actually executed/passed, failed, or unverified with reason. Record the
tool/environment and exact command for a run. Do not execute deployment,
destructive cleanup, production migration, or credential-dependent steps merely
to test documentation. Never copy real environment values into a guide.

Prefer existing check commands over repeating formatter/linter rules in prose.
Explain the non-obvious invocation or exception. “Run the configured formatter”
with its verified command is more maintainable than restating every format option.

## Preserve document ownership

- Existing contribution guide owns the contributor journey; an existing style
  guide owns detailed coding conventions. Link rather than move or duplicate.
- README remains the entry point. A short pointer is normally enough.
- Agent instruction files hold concise project instructions and pointers. Do
  not mirror the entire human guide into each agent's format.
- Follow established ADR and package-doc locations. Create a new owner only for
  a requested gap; keep unrelated prose and human edits intact.

For non-obvious claims, retain a compact evidence appendix or the project's
established evidence record: claim, class, source paths/symbols, area, confidence,
counterexamples and unresolved decision. Use paths/symbols with a baseline
revision; line numbers alone become stale. A coverage note should explain which
packages, sources, tests and generated/legacy areas were sampled or excluded.
