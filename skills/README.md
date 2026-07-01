# skills/

Agent **skills** you want to keep or adapt — each in its own subfolder with a
`SKILL.md`. Lifted from reviewed repos or written from scratch.

The AI Feature Delivery skills are installed into pilot repos by
`../install.sh ai-feature-delivery`. See `../docs/tutorial.md` for the first-run
workflow.

- `pr-review/` - tiered multi-agent PR/code review.
- `pr-review-reply/` - the round-trip half of pr-review: read a human
  reviewer's PR threads, triage each, re-review only the code changed since the
  review, and reply per-thread (posting opt-in, idempotent).
- `review-on-open/` - the trigger layer for pr-review: auto-run a fresh
  `/pr-review --comment` when a PR is opened or updated. Two triggers — a
  GitHub Actions event workflow (the PR event fires a headless review) and a
  host-agnostic poller (`/loop` or `/schedule`) that reviews open PRs unseen at
  their current head SHA. Idempotent; adds no review logic.
- `review-queue/` - the push-based third trigger: a local, SQLite-backed work
  queue (pure bash + `sqlite3`, no runtime) that decouples PR-opening agents from
  the reviewer. A producer agent enqueues a PR; a worker claims jobs (atomic,
  exactly-once, crash-safe leases, dead-lettering) and runs `/pr-review --comment`
  on each. Fully local — no CI/webhook/API key. Drive the worker with `/loop` or
  `/schedule`.
- `bug-to-fix/` - diagnostic lane: triage, reproduce, root-cause analysis,
  minimal fix, and verification for a reported bug.
- `shape-up/` - interrogate a vague request into an agreed brief before
  building (the front-door to the dev lanes).
- `tech-backlog-assessment/` - assess technical backlog items before
  implementation: do/defer/reject/spike, options, dependency choices, risks,
  tests, and next workflow.
- `ticket-discovery/` - investigate a narrow implementation ticket that points
  to an existing precedent, compare source and target, and produce a concrete
  implementation/test handoff.
- `simplify/` - active code cleanup: apply high-conviction simplifications on
  opt-in (the counterpart to pr-review).
- `cover/` - author/strengthen behavior-pinning tests for a diff, module, or bug
  reproduction on opt-in, plus a detect-only coverage-gap scan; turns a bug repro
  into a committed red→green regression test (the active/detect pair).
- `ship-it/` - lightweight release readiness: go/no-go check, rollback plan,
  release notes, and rollout/monitor plan (pipeline-aware).
- `retrofit/` - apply one defined change across every site (library swap, API
  rename, framework upgrade): discover, transform in isolation, verify
  exhaustively. Opt-in; orchestrated fan-out.
- `worktree/` - isolated git worktrees (pure bash + git, no runtime) so multiple
  agents can work a shared directory of repos without clobbering each other's
  branch: one worktree per task on its own branch, collision-safe auto-naming,
  collected under `<parent>/.worktrees/`, with tidy cleanup. For independent
  sessions; in-run fan-out should use `Workflow`'s `isolation: 'worktree'`.
- `handoff/` - cross-cutting: write a resumable handoff so a fresh agent or
  person can continue without context loss (any lane).
- `ticket-sync/` - provider-agnostic issue-tracker adapter: publish the tickets
  the slicers produce to GitHub Issues, Jira, or Azure Boards via a repo-local
  `.tickets.md`. Idempotent (records the tracker key back), confirmation-gated
  with a dry-run preview, and degrades to a manifest when offline.
- `dev-lite-workflow/` - lightweight dev workflow for feature/app ideas,
  phased implementation, per-task commits, phase reviews, and final PR review.
- `phase-context-workflow/` - durable phase context files, handoffs, and context
  packets for safe context resets during long agent work; composes `handoff`
  for phase closeout.
- `ai-feature-delivery/` - release-traceable feature definition, design docs,
  refinement tickets, QA handoff, and release document control.
- `webapp-testing/` - browser/webapp verification for user-facing changes and
  QA evidence.

## Optional rct acceleration

`pr-review`, `bug-to-fix`, `simplify`, and `shape-up` each ship a
`references/rct-acceleration.md`. If the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt)
MCP tools are available in the session, the skill uses the code graph for the
retrieval-heavy steps (blast radius, callers, scope, localization) at a fraction
of the tokens. It is strictly optional — every skill works by reading files
directly when rct is not present.

## Canonical copies

`skills/dev-lite-workflow/SKILL.md` is the **canonical** source. The repo also
ships `.agents/skills/dev-lite-workflow/SKILL.md` (the repo-scoped Codex copy);
it must stay byte-identical. Edit the canonical file, then mirror the change.
Run `scripts/check-skill-sync.sh` to verify the two copies match (also runnable
in CI).

## Skill authoring checklist

Use this checklist when creating or updating a skill:

- Decide invocation first. Keep a `description` only when the agent should
  discover and invoke the skill on its own; otherwise make the skill
  user-invoked and route to it from docs or commands.
- Make the description pay for its context load. Use leading words users and
  agents actually say, and keep distinct trigger branches rather than repeated
  synonyms.
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
- Keep one source of truth for each behavior. Do not repeat the same rule in the
  description, body, commands, and references unless each copy has a distinct
  job.
- Prune no-ops and sediment: remove lines that do not change agent behavior,
  stale provenance notes, or branches no current workflow can reach.

Applied check:

- `shape-up/`: keep the model-invoked description because it has distinct
  trigger branches for fuzzy ideas/tickets before Dev Lite planning, with clear
  exclusions for bug and regulated feature lanes. Keep `references/interrogation.md`
  behind a pointer because only the questioning branch needs those techniques;
  do not inline it into `SKILL.md`.
- `pr-review/`: keep tier choice, reviewer-safety, inputs, and short tier
  algorithms inline because every invocation needs them to pick scope, intensity,
  and output. Do not move the tier summaries yet; the long-skill audit found the
  better cleanup candidate is duplicated reference cataloging. Future edits
  should keep `## References` as navigation only and move detailed provider,
  posting, tier, and schema mechanics into the referenced files.
