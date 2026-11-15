# Workflows

The delivery lanes. The [offline portal](../portal/generated/index.html) owns
discovery, examples, and the common workflow map; this page provides deeper
operational guidance. Each workflow below identifies its commands and completion boundaries.

- [Phased Delivery](#phased-delivery): requirements or tickets to one PR per phase.
- [Phase Context Workflow](#phase-context-workflow): durable state across resets.
- [Bug to Fix](#bug-to-fix): the diagnostic lane.
- [System Design](#system-design): architecture questions, design documents, diagrams, and decisions.
- [Shape Up](#shape-up): review current-state gaps, shape an approved brief, or slice it into tickets.
- [Story Refinement](#story-refinement): prepare a ticket for refinement and check whether it is ready.
- [Risk-Based Testing](#risk-based-testing): map high-impact paths, then plan focused tests and reviews for each pull request.
- [Production Readiness](#production-readiness): check reliability evidence before launch, then release with rollback triggers.
- [Incident Follow-Up](#incident-follow-up): fix the root cause of an incident and prove detection and recovery with tests.
- [Product Discovery](#product-discovery): evidence before deciding what to shape.
- [Threat Model](#threat-model): design-time security analysis.

## Phased Delivery

Phased Delivery turns a raw requirement or existing approved plan into
human-reviewed PRs. It reuses supplied approved tickets:
**one ticket = one phase = one PR**. The agent fills in technical context such
as files, interfaces, tests, and checks without changing ticket scope.

Behavior changes use the [shared TDD procedure](../shared/contracts/references/test-driven-development.md).
Each selected behavior starts with an observed failing test, then the smallest implementation that passes it.
When a phase has Given/When/Then scenarios, the scenarios are the outer loop: they fail before the phase and pass after it.
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
shared `.agents/skills/phased-delivery/` skill, templates, and the workflow
playbook. The former
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

- A **durable investigation file** (`.agents/templates/bug-investigation.md`) is updated
  *before* each action, so the work survives a context reset and hands off cleanly.
- **No fix without a confirmed root cause**, and **no "fixed" without verification**.
- **Reproduction is manual-first**: `/reproduce` asks whether you or QA reproduced
  the bug before dev, and keeps the automated failing-test path for when a test
  harness exists.
- `/rca --diagnose` runs a read-only root-cause analysis that never edits files.

## System Design

Use `system-design` for architecture questions, design documents, diagrams, decision records, and repository maps.
A full design proposal also gets a linked `threat-model` review for the same revision.
When the design adds or changes a service, a dependency, a data store, a queue, a job, or the topology,
it also gets a `reliability-review` for the same revision. That review records the dependency inventory,
the failure-mode register, SLO and observability gaps, and testable reliability requirements.
`failure-scenario-design` turns the testable risks into scenario cards.
Each card has a Given/When/Then form for `bdd-scenarios`, a test-first case, and, when needed, a staging experiment plan.
Both skills write plans only. Chaos experiments run in staging, and production needs written approval.
The `pr-review` reliability facet checks timeouts, retries, idempotency, migrations, probes, and telemetry in the diff.
The [skill](../skills/system-design/SKILL.md) owns the modes and the completion rules.

The design skills use three [depth levels](../shared/contracts/references/depth-levels.md).
The agent chooses one from the risk of the change and states it first. `--light`, `--standard`, or `--deep` overrides it.

| Level | `system-design` does |
| --- | --- |
| Light | A short design note for a change inside existing boundaries. No topic references or design review. A design proposal still gets its threat review. |
| Standard | The full design. Topic references load only when they apply: interface contracts, data design, domain language, distributed workflows, and estimation when scale or cost decides the design. |
| Deep | Standard, plus estimation and "design it twice". A multi-lens design review by reviewer subagents runs on request or by project rule. |

`story-refinement`, `reliability-review`, and `failure-scenario-design` use the same levels.
At the Light level, they run the scan, the criteria, and the builder check, the story-tier reliability questions, or the failure criteria only.

```text
$system-design
Help our team work through this architecture question and compare the options.
Record the design, diagrams, decision reasons, and important open questions.
```

The compatibility install includes the design and decision-record templates:

```sh
./install.sh --harness all system-design /path/to/project
./install.sh --harness all failure-scenario-design /path/to/project
```

Keep generated internal documents in the project's designated location or outside the public Toolbelt repository.

## Production Readiness

Use this before the first launch of a service, or before a launch that adds a hard dependency or a data store.
`/reliability-review --readiness` marks each reliability requirement `Verified`, `Failed`, or `Not verified`
with evidence. `/failure-scenario-design --deep` plans staging experiments for the requirements that need
platform evidence. The team that owns the chaos tooling runs them. `/ship-it` then sets SLO burn-rate rollback triggers.
The [workflow](../workflows/production-readiness-workflow.md) gives the stage order.

```sh
./install.sh --harness all reliability-review failure-scenario-design ship-it /path/to/project
```

## Incident Follow-Up

Use this after an incident is mitigated. `bug-to-fix` fixes the root cause after a failing regression test.
`/reliability-review` adds the failure mode to the register and records the missing detection or recovery
as requirements. `/failure-scenario-design`, `/test-case-design`, and `/cover` turn them into tests.
The [workflow](../workflows/incident-follow-up-workflow.md) gives the stage order.

```sh
./install.sh --harness all bug-to-fix reliability-review failure-scenario-design test-case-design cover /path/to/project
```

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

## Story Refinement

Use `story-refinement` for a ticket or story that has a clear goal but open questions.
Run `/story-refinement <ticket> --scan` before the refinement meeting.
The scan settles facts from the repository, states defaults, and writes one question packet for each owner.
It also writes Given/When/Then criteria with failure paths and checks the negative-testing families.
When the story adds a dependency, a job, or a data change, it answers the reliability checklist.
Run `--check` for the readiness verdict. Product, developer, QA, and SRE reviewer subagents check the story.
The verdict is a warning, and a project can make it a gate.
Hand the criteria to `bdd-scenarios` for feature files.
The [workflow](../workflows/feature-refinement-workflow.md) gives the stage order.

```sh
./install.sh --harness all story-refinement /path/to/project
```

## Risk-Based Testing

Use `risk-area-mapping` to find the paths where a defect has high impact, for example personal
data, access control, or exports. Run `/risk-areas` in one repository, or
`/risk-areas --sweep <dir> --atlas <workspace map>` for a folder of repositories.
A sweep runs one subagent for each repository in parallel. The command writes one review file
with evidence for each entry and edits no repository.
A person confirms each impact line, and `/risk-areas --apply <file>` writes the approved entries.
After that, `/test-case-design <PR>` plans focused cases with high impact in those areas, and
`/pr-review` raises a change in a risk area to at least the standard tier.
The [workflow](../workflows/risk-based-testing-workflow.md) gives the stage order.

```sh
./install.sh --harness all risk-area-mapping test-case-design pr-review /path/to/project
```
