# Tutorial: Install and Use the Workflow Packs

This walkthrough shows the two install paths in `agent-toolbelt`:

- Dev Lite Workflow: a lightweight feature/app loop for practical development.
- Phase Context Workflow: durable phase files, handoffs, and context packets
  for safe context resets during long agent work.
- AI Feature Delivery: the fuller traceable feature-delivery pack for
  cross-functional or regulated work.

## Prerequisites

- A local checkout of this `agent-toolbelt` repo.
- A target repo or pilot folder where the commands, rules, templates, skills,
  and workflows should be installed.
- Cursor or Claude Code for slash-command style use.
- Codex can use repo-scoped skills from `.agents/skills`; invoke the Dev Lite
  skill with `/skills` or `$dev-lite-workflow`.

## Dev Lite Workflow

Use Dev Lite when you want to take an app idea, feature, bug fix, or small
ticket through a practical dev loop without the heavier release-documentation
process.

### 1. Preview the Dev Lite install

From this repo:

```sh
./install.sh --dry-run dev-lite-workflow /path/to/project
```

The dry run shows the files that would be installed:

- `.cursor/commands/dev-*.md`
- `.cursor/rules/dev-lite-*.mdc`
- `.claude/commands/dev-*.md`
- `.agents/skills/dev-lite-workflow/SKILL.md`
- `.atb/skills/dev-lite-workflow/SKILL.md`
- `.atb/templates/dev-*.md`
- `.atb/workflows/dev-lite-feature-workflow.md`

### 2. Install Dev Lite

```sh
./install.sh dev-lite-workflow /path/to/project
```

Use `--force` only when replacing a previous install.

In Cursor or Claude Code, start with:

```text
/dev-intake
/dev-plan
```

In Codex, use the skill instead of slash commands:

```text
$dev-lite-workflow
Create a dev-lite feature brief and implementation plan for this request: ...
```

For a standalone bug-fix review in Codex:

```text
$dev-lite-workflow
Run a PR readiness review for this bug fix against the current diff.
```

### 3. Dev Lite Operating Rules

The Dev Lite workflow now enforces these checkpoints:

- Stop after the implementation plan so the user can review and approve it.
- Build out tests as implementation progresses; behavior-changing tasks should
  include matching test work.
- Keep the implementation plan current as a living handoff document.
- Do not push directly to `main`, `master`, or the default branch unless the
  user explicitly approves that exact behavior.
- Work from a focused `dev/...` or `fix/...` branch.
- Run final PR readiness review before opening or marking a PR ready.

The plan document should be updated after every meaningful step with current
state, current task, evidence, tests/checks, blockers, next step, branch/PR
state, and resume instructions.

## Phase Context Workflow

Use Phase Context when an agent session is getting long, a phase boundary is
coming up, or you want to safely use `/clear` or `/compact` without losing the
work state.

It can wrap Dev Lite, AI Feature Delivery, bug fixing, or ad-hoc implementation.
The key rule is simple: write the context you still need into files before
clearing chat history.

### 1. Preview the Phase Context install

From this repo:

```sh
./install.sh --dry-run phase-context-workflow /path/to/project
```

The dry run shows:

- `.cursor/commands/handoff.md`
- `.cursor/commands/phase-*.md`
- `.claude/commands/handoff.md`
- `.claude/commands/phase-*.md`
- `.agents/skills/handoff/SKILL.md`
- `.agents/skills/phase-context-workflow/SKILL.md`
- `skills/handoff/SKILL.md`
- `skills/phase-context-workflow/SKILL.md`
- `templates/phase-file.md`
- `templates/phase-handoff.md`
- `templates/context-packet.md`
- `workflows/phase-context-workflow.md`

### 2. Install Phase Context

```sh
./install.sh phase-context-workflow /path/to/project
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

## AI Feature Delivery Pack

Use AI Feature Delivery when requirements, tickets, tests, docs, QA handoff, and
release eligibility need traceability back to a Feature Master Record.

### 1. Preview the AI Feature Delivery install

From this repo:

```sh
./install.sh --dry-run ai-feature-delivery /path/to/pilot-folder
```

The dry run shows the files that would be installed:

- `.cursor/commands/*.md`
- `.cursor/rules/*.mdc`
- `skills/*/SKILL.md`
- `templates/*.md`
- `workflows/*.md`

Existing files are skipped by default during a real install.

### 2. Install into the pilot folder

```sh
./install.sh ai-feature-delivery /path/to/pilot-folder
```

Use `--force` only when you intentionally want to replace previously installed
files:

```sh
./install.sh --force ai-feature-delivery /path/to/pilot-folder
```

On macOS, a non-developer pilot user can double-click `install.command`, which
asks which pack(s) to install and then for the target folder (drag it into the
Terminal prompt and press Enter).

### 3. Open the target in Cursor

Open `/path/to/pilot-folder` in Cursor. The main entry points are:

- `/workflow-router` when you are unsure what to run next.
- `/feature-start` when starting from a raw idea or stakeholder request.
- `/feature-fleshout` when the feature exists but still has gaps.

For a first run, use:

```text
/feature-start REL-2026.09 FEAT-1234 patient alert routing
```

The command should create or help fill a Feature Master Record using
`templates/feature-master-record.md`.

### 4. Flesh out the feature package

Run:

```text
/feature-fleshout
```

Expected outputs:

- Stakeholder questions.
- Risks and assumptions.
- Impacted systems and repos.
- Release target checks.
- Gate 1 readiness notes.

If owners or answers are missing, run:

```text
/draft-pings
```

Use the generated text as a human-approved draft. Do not treat a ping as sent
unless an external messaging integration actually sent it.

### 5. Draft design and document impacts

Run:

```text
/sdd-draft
/doc-impact
```

This should produce or update:

- An SDD from the Feature Master Record.
- A document impact map for CDP, SRS, SAD, SDD, and other controlled docs.

If code or ticket changes happen later, run:

```text
/doc-delta
```

That command checks whether the implementation changed the required docs.

### 6. Refine into implementation tickets

Run:

```text
/refine-to-tickets
```

Each ticket should preserve:

- Feature ID.
- Release ID.
- Master-record section.
- SDD or requirement reference.
- Acceptance criteria.
- Test expectation.
- Document delta status.

Before development begins, run:

```text
/gate-check
```

Use the result to decide whether the feature is ready for the next lifecycle
phase or still needs clarification.

### 7. Carry a ticket through development

For an implementation ticket, use the dev workflow:

```text
/start-dev-from-feature
/implementation-plan
```

Stop after `/implementation-plan` and review the plan before implementation.
Once approved, implement the change in small steps and update matching tests as
behavior changes. Keep the implementation plan current with current state,
current task, evidence, checks, blockers, branch/PR state, next step, and resume
instructions.

Work from a focused feature/fix branch. Do not push directly to `main`,
`master`, or the default branch unless that exact behavior was explicitly
approved.

Verify with the commands that match the work:

```text
/webapp-test
/dev-doc-delta-check
/review-diff
/pr-ready-check
/pr-traceability-review
```

Use `/webapp-test` only for browser or user-flow changes. For non-UI work,
record it as not applicable.

Run `/pr-ready-check` and `/pr-traceability-review` before opening or marking a
PR ready. Those checks should block unapproved default-branch work and stale
implementation plans.

### 8. Prepare QA and release docs

After the PR is traceable and ready for QA, run:

```text
/qa-handoff
```

For release documentation, run:

```text
/release-manifest
/release-doc-check
```

Only documents marked `APPROVED_FOR_RELEASE` should be included in the release
package. Future-release material should be explicitly withheld.

## Command Shortcuts

Use these shortcuts while piloting:

- Raw idea: `/feature-start`, then `/feature-fleshout`.
- Bug / broken behavior: `/bug-intake` -> `/reproduce` -> `/rca` -> `/fix-plan`
  (then `/dev-implement-task` -> `/pr-review`). Use `/rca --diagnose` for a
  read-only root-cause analysis.
- Unsure what is next: `/workflow-router`.
- Existing feature health check: `/steward-review`.
- Stakeholder follow-up drafts: `/draft-pings`.
- Design and controlled docs: `/sdd-draft`, `/doc-impact`, `/doc-delta`.
- Ticket slicing: `/refine-to-tickets`.
- Dev execution: `/start-dev-from-feature`, `/implementation-plan`,
  `/write-tests`.
- Browser verification: `/webapp-test`.
- PR readiness: `/review-diff`, `/pr-ready-check`,
  `/pr-traceability-review`.
- Role-specific review gate: `/role-review` (product, engineering, design, QA,
  security, or release).
- QA and release: `/qa-handoff`, `/release-manifest`,
  `/release-doc-check`.

## Recommended First Pilot

Keep the first pilot narrow:

1. Pick one feature with a known release target.
2. Create one Feature Master Record.
3. Draft one SDD and one doc-impact map.
4. Refine two or three implementation tickets.
5. Take one ticket through the dev-to-PR workflow.
6. Generate the QA handoff.
7. Generate the release manifest and run the release doc check.

The system is working when the feature, tickets, tests, docs, QA package, and
release manifest all point back to the same feature ID and release ID.
