# skills/

Agent **skills** live in one canonical folder per skill, each with a `SKILL.md`.
The native plugin exposes the 33 canonical skills across Cursor, Claude Code,
and Codex. Use the [offline portal](../portal/generated/index.html) for the
complete searchable catalog, taxonomy, examples, and workflow map.
This page documents authoring and copy ownership,
not a manually maintained second skill catalog.

The unattended runner skills live in the separate
[Auto Agent plugin](../plugins/agent-toolbelt-auto-agent/README.md) and are not
part of this standard skill tree.

`style-guide-init` derives and maintains contribution/style guidance from repo
evidence. It distinguishes policy, enforcement, observations and conflicts, and
ships a local checkpoint helper for changed-input detection.
Its skill references define extraction, maintenance, and validation.

Project-specific delivery skills belong to their project repositories.
See the [ownership boundary](../README.md#what-belongs-here).

For managed or resumed assignments, the [execution contract](../shared/contracts/references/execution.md)
defines compact task context, results, and authority.
The [execution schema](../shared/contracts/references/execution-schema.md) defines the optional JSON records and their checker.
`system-design` also maintains current repository maps; `handoff` can preserve evidence-backed execution lessons.
These are conditional procedures within existing skills.

The Vercel specialists preserve their substantive upstream rules under each
skill's `references/rules/` tree. They are not universal policy: repository
instructions, configuration, versions, runtime boundaries, and measured impact
remain authoritative. Install them individually or use the `react-quality`
convenience pack.

## Optional rct acceleration

`pr-review`, `bug-to-fix`, `simplify`, and `shape-up` each ship a
`references/rct-acceleration.md`. If the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt)
MCP tools are available in the session, the skill uses the code graph for the
retrieval-heavy steps (blast radius, callers, scope, localization) at a fraction
of the tokens. It is strictly optional — every skill works by reading files
directly when rct is not present.

## Canonical copies

`skills/phased-delivery/` is the **canonical** source. The repo also ships
`.agents/skills/phased-delivery/` as the repo-scoped Codex copy; the full tree
must stay byte-identical, including `SKILL.md`, `references/`, and
`agents/openai.yaml`. Edit the canonical tree, then mirror the change. Run
`scripts/check-skill-sync.sh` to verify the two copies match (also runnable in
CI).

The repository's `.cursor/commands/dev-*.md` files also mirror their canonical
`commands/dev-*.md` sources. The same check detects command drift.

## Skill authoring checklist

Use this checklist when creating or updating a skill:

- Keep runtime skills agent-invoked with a model-facing `description`. Human
  entry points belong in `commands/`; do not add `disable-model-invocation` for
  runtime skills unless a future support-only artifact explicitly needs it.
- Make the description pay for its context load. Use leading words users and
  agents actually say, and keep distinct trigger branches rather than repeated
  synonyms.
- Keep ownership clear: command files own argument syntax and user-facing entry
  text; `SKILL.md` owns process, invariants, gates, mutation policy, and output
  contracts; `agents/openai.yaml` owns host UI metadata; references own
  provider/framework mechanics, long examples, and branch-only detail.
- Keep project-specific work and personal conventions in the target project's
  instruction owner. Shared skills should select formal traceability from the
  task's requirements, rather than from nearby artifacts or an installed pack.
- Keep `agents/openai.yaml` concise and generated from the cleaned description:
  exactly `display_name`, `short_description`, and `default_prompt`, with no
  optional icon/color fields unless the repo standardizes them.
- Keep `SKILL.md` focused on steps and always-needed rules. Move branch-only
  reference behind a clearly worded pointer in `references/`.
- Use progressive disclosure by branch: inline what every successful invocation
  needs to choose and execute the workflow; move variant-specific detail,
  optional paths, schemas, examples, and provider/framework mechanics to
  `references/`. The pointer from `SKILL.md` should name the exact condition for
  loading the file, such as "Read `references/provider.md` when posting to that
  provider." If the condition is vague or every branch needs the material, keep
  it inline.
- State completion criteria that let the agent tell done from not done.
- Use the [human-readable output contract](../shared/contracts/references/human-readable-output.md)
  when defining outputs: tables for structured findings and comparisons,
  diagrams for relationships, and actions with a reason and completion check
  for plans. Apply its ASD-STE100 rules to all new text for the user.
  ASD-STE100 output is an intentional Toolbelt-wide standard, not a personal
  convention. It keeps output from many parallel agents consistent and easy to review.
  All standard skills load this reference. New skills must include its runtime
  pointer and installer dependency.
- Keep one source of truth for each behavior. Do not repeat the same rule in the
  description, body, commands, and references unless each copy has a distinct
  job.
- Prune no-ops and sediment: remove lines that do not change agent behavior,
  stale provenance notes, or branches no current workflow can reach.
- Phrase the target behavior positively first. Keep prohibitions only for hard
  safety guardrails, and pair each one with the action the agent should take
  instead.

Applied check:

- `shape-up/`: keep the model-facing description because it has distinct trigger
  branches for fuzzy ideas/tickets before Phased Delivery planning, with clear
  exclusions for bug diagnosis and project-owned delivery rules. Keep
  `references/interrogation.md` behind a pointer because only the questioning
  branch needs those techniques; do not inline it into `SKILL.md`.
- `pr-review/`: keep tier choice, reviewer-safety, inputs, and short tier
  skeletons inline because every invocation needs them to pick scope, intensity,
  and output. Keep `## References` as navigation only; detailed provider,
  posting, tier, rubric, and schema mechanics belong in the referenced files.
