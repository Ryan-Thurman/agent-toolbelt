# Tutorial: Install and Use the Workflow Packs

This walkthrough shows the shared install paths in `agent-toolbelt`:

- Phased Delivery: a requirement or ticket loop with one human-reviewed PR per phase.
- Phase Context Workflow: durable phase files, handoffs, and context packets
  for safe context resets during long agent work.

## Prerequisites

- A local checkout of this `agent-toolbelt` repo.
- A target repo or pilot folder where the commands, rules, templates, skills,
  and workflows should be installed.
- Cursor or Claude Code for slash-command style use.
- Codex can use repo-scoped skills from `.agents/skills`; invoke Phased
  Delivery with `/skills` or `$phased-delivery`.

## Phased Delivery

Use Phased Delivery when you have a raw requirement, an approved plan, or a set
of tickets ready for implementation. For supplied approved
tickets, each ticket is one phase and one PR. The agent adds technical
steps and repository context without changing ticket scope.

### 1. Preview the install

From this repo:

```sh
./install.sh --dry-run --harness all phased-delivery /path/to/project
```

The dry run shows the files that would be installed:

- `.cursor/commands/dev-*.md`
- `.cursor/rules/agent-toolbelt-router.mdc`
- `.claude/commands/dev-*.md`
- `CLAUDE.md`
- `AGENTS.md`
- `.agents/skills/phased-delivery/SKILL.md`
- `.agents/skills/phased-delivery/agents/openai.yaml`
- `.atb/skills/phased-delivery/SKILL.md`
- `.atb/skills/phased-delivery/agents/openai.yaml`
- `.atb/templates/phased-delivery-plan.md`
- `.atb/workflows/phased-delivery-workflow.md`

### 2. Install Phased Delivery

```sh
./install.sh --harness all phased-delivery /path/to/project
```

Use `--force` only when replacing a previous install.

In Cursor or Claude Code, start with `/dev-plan` when the source is already
approved; `/dev-intake` is optional for raw, unclear requirements:

```text
/dev-plan
```

In Codex, use the skill instead of slash commands:

```text
$phased-delivery
Plan these approved tickets as stacked PRs, one ticket per phase: ...
```

For a standalone bug-fix review in Codex:

```text
$phased-delivery
Run a PR readiness review for this bug fix against the current diff.
```

### 3. Phased Delivery Operating Rules

Phased Delivery keeps these checkpoints:

- Stop after the implementation plan so the user can review and approve it.
- Build out tests as implementation progresses; behavior-changing tasks should
  include matching test work.
- Keep the implementation plan current as a living handoff document.
- Do not push directly to `main`, `master`, or the default branch unless the
  user explicitly approves that exact behavior.
- Work from a focused `dev/...` or `fix/...` branch.
- Review and open one PR for each phase; a human reviews and merges it.
- For stacked ticket PRs, target the parent ticket branch and verify the child
  base and diff after the parent merges.
- Run `/code-quality-gate` when repository policy, user request, or risk calls
  for it; it is not a universal prerequisite.

The plan document should be updated after every meaningful step with current
state, current task, evidence, tests/checks, blockers, next step, branch/PR
state, and resume instructions.

## Phase Context Workflow

Use Phase Context when an agent session is getting long, a phase boundary is
coming up, or you want to safely use `/clear` or `/compact` without losing the
work state.

It can wrap Phased Delivery, bug fixing, or ad-hoc implementation.
The key rule is simple: write the context you still need into files before
clearing chat history.

### 1. Preview the Phase Context install

From this repo:

```sh
./install.sh --dry-run --harness all phase-context-workflow /path/to/project
```

The dry run shows:

- `.cursor/commands/handoff.md`
- `.cursor/commands/phase-*.md`
- `.claude/commands/handoff.md`
- `.claude/commands/phase-*.md`
- `.agents/skills/handoff/SKILL.md`
- `.agents/skills/handoff/agents/openai.yaml`
- `.agents/skills/phase-context-workflow/SKILL.md`
- `.agents/skills/phase-context-workflow/agents/openai.yaml`
- `.atb/skills/handoff/SKILL.md`
- `.atb/skills/handoff/agents/openai.yaml`
- `.atb/skills/phase-context-workflow/SKILL.md`
- `.atb/skills/phase-context-workflow/agents/openai.yaml`
- `.atb/templates/phase-file.md`
- `.atb/templates/phase-handoff.md`
- `.atb/templates/context-packet.md`
- `.atb/workflows/phase-context-workflow.md`

### 2. Install Phase Context

```sh
./install.sh --harness all phase-context-workflow /path/to/project
```

Use `--force` only when replacing a previous install.

### 3. Run a phase with durable context

For a room or project slug such as `fix-auth-bug`, use:

```text
/phase-create fix-auth-bug --phase 1 --title "Implement auth session handling"
/phase-start fix-auth-bug --phase 1
```

Do the phase work using the normal development commands. At the phase boundary,
run:

```text
/phase-close fix-auth-bug --phase 1
```

`/phase-close` composes `/handoff`: it uses the handoff rules to keep the
summary compact, reference durable artifacts, lead with the next action, capture
ruled-out paths, and redact secrets. Unlike the generic `/handoff` command, it
saves into `.acc/phases/<room>/phase-NN-handoff.md` because phase handoffs are
tracked project context.

After the handoff says `Safe To Clear: Yes`, start the next session from:

```text
.acc/phases/<room>/context-packet.md
.acc/phases/<room>/phase-NN-handoff.md
```

Use `/phase-status <room>` whenever you need to see which phase files and
handoffs exist.


## Project-owned delivery

The target repository owns its forms, approval gates, and controlled records.
Toolbelt accepts approved requirements and tickets from that process.
It supplies shared planning, implementation, tests, review, and release methods.

Read [the ownership and migration guide](project-workflow-boundary.md) before updating a project with local workflow adaptations.
The installer preserves existing files by default.
Review differences and project ownership before using `--force`.
