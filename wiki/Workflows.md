# Workflows

The delivery lanes. The [offline portal](../portal/generated/index.html) owns
discovery, examples, and the common workflow map; this page provides deeper
operational guidance. Each workflow below identifies its commands and completion boundaries.

- [Phased Delivery](#phased-delivery): requirements or tickets to one PR per phase.
- [Phase Context Workflow](#phase-context-workflow): durable state across resets.
- [Bug to Fix](#bug-to-fix): the diagnostic lane.
- [System Design](#system-design): architecture questions, design documents, diagrams, and decisions.
- [Shape Up](#shape-up): review current-state gaps, shape an approved brief, or slice it into tickets.
- [Product Discovery](#product-discovery): evidence before deciding what to shape.
- [Threat Model](#threat-model): design-time security analysis.

## Phased Delivery

Phased Delivery turns a raw requirement or existing approved plan into
human-reviewed PRs. It reuses supplied approved tickets:
**one ticket = one phase = one PR**. The agent fills in technical context such
as files, interfaces, tests, and checks without changing ticket scope.

Behavior changes use the [shared TDD procedure](../shared/contracts/references/test-driven-development.md).
Each selected behavior starts with an observed failing test, then the smallest implementation that passes it.
Plan unit tests for important branches, boundaries, and errors.
Use existing coverage tools and report uncovered behavior or unmeasured coverage.

```text
Source requirement or tickets -> phase/PR map -> plan approval -> implement
-> verify and review phase -> open its PR -> human review/merge or approved stack
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install.sh --harness all phased-delivery /path/to/project
```

Use `--dry-run` to preview the install:

```sh
./install.sh --dry-run --harness all phased-delivery /path/to/project
```

The installer adds legacy `/dev-*` Cursor and Claude command shortcuts, a
repo-scoped `.agents/skills/phased-delivery` Codex skill, a shared
`.atb/skills/` copy, templates, and the workflow playbook. The former
`dev-lite-workflow` pack name remains an explicit compatibility alias. Quality
gates are applied when repository policy, the user, or the phase's risk requires
them; they are not a universal pre-PR dependency.

In Cursor or Claude Code, use `/dev-plan` with an approved source, adding
`/dev-intake` only for an unclear raw requirement. In Codex, invoke the skill
with `/skills` or by mentioning `$phased-delivery`, then ask
for the action you want:

```text
$phased-delivery
Plan these approved tickets as stacked PRs, one ticket per phase.
```

## Phase Context Workflow

The Phase Context Workflow keeps long agent work resumable by writing phase
state into repo files before context resets:

```text
Plan -> Phase File -> Context Packet -> Implement -> Phase Handoff -> Clear/Compact
```

Install it into a project:

```sh
./install.sh --harness all phase-context-workflow /path/to/project
```

It adds `/handoff`, `/phase-create`, `/phase-start`, `/phase-close`, and
`/phase-status`, plus templates for `.acc/phases/<room>/` phase files,
handoffs, and context packets. `/phase-close` reuses the `handoff` rules
(reference durable artifacts, lead with the next action, capture ruled-out
paths, redact secrets, keep it compact) but saves into the tracked phase
directory. It pairs well with `phased-delivery` for phased implementation and
with `phase-gate` when each phase opens its own PR.

## Bug to Fix

The `bug-to-fix` tool is the diagnostic lane: it takes a bug report from triage
to a verified fix.

```text
Bug report -> /bug-intake -> /reproduce -> /rca -> /fix-plan -> /dev-implement-task -> /code-quality-gate -> /dev-pr-review
```

Install it into a project for Cursor, Claude Code, and Codex skill use:

```sh
./install.sh --harness all bug-to-fix /path/to/project
```

Use `--dry-run` to preview and `--force` only when replacing a previous install.
The installer adds the `/bug-*` commands, the `bug-to-fix` skill tree, the
investigation/RCA/fix-brief templates, and the workflow playbook. On macOS,
double-click `install.command` and follow the prompts.

Key ideas:

- A **durable investigation file** (`.atb/templates/bug-investigation.md`) is updated
  *before* each action, so the work survives a context reset and hands off cleanly.
- **No fix without a confirmed root cause**, and **no "fixed" without verification**.
- **Reproduction is manual-first**: `/reproduce` asks whether you or QA reproduced
  the bug before dev, and keeps the automated failing-test path for when a test
  harness exists.
- `/rca --diagnose` runs a read-only root-cause analysis that never edits files.

## System Design

Use `system-design` for architecture questions, design documents, diagrams, decision records, and repository maps.
A full design proposal also gets a linked `threat-model` review for the same revision.
The [skill](../skills/system-design/SKILL.md) owns the modes and the completion rules.

```text
$system-design
Help our team work through this architecture question and compare the options.
Record the design, diagrams, decision reasons, and important open questions.
```

The compatibility install includes the design and decision-record templates:

```sh
./install.sh --harness all system-design /path/to/project
```

Keep generated internal documents in the project's designated location or outside the public Toolbelt repository.

## Product Discovery

Use `product-discovery` before Shape Up when the open question is whether a candidate should be
built at all. It separates evidence from assumptions, identifies value/usability/feasibility/viability
risks, proposes the cheapest useful experiments, and sets observable success/failure thresholds.
It hands only an evidenced candidate to `/shape-up`.

```sh
./install.sh --harness all product-discovery /path/to/project
```

## Threat Model

Use `threat-model` before implementing a security-sensitive design. It maps assets, actors, flows,
trust boundaries, abuse paths, mitigations, testable requirements, and residual risk. It is design
analysis, not active testing.

```sh
./install.sh --harness all threat-model /path/to/project
```

## Shape Up

Use `shape-up` for three jobs:

- Compare a product ask with current system behavior (report-only gap review).
- Shape a vague request into a brief that you approve.
- Slice an approved brief into vertical-slice tickets (`/to-issues`).

The [skill](../skills/shape-up/SKILL.md) owns the modes and the approval gate.
An approved brief goes to `$phased-delivery` or `/dev-plan`.
Use `/dev-intake` for an unclear raw request that has no approved brief, plan, or ticket.

```sh
./install.sh --harness all shape-up /path/to/project
```
