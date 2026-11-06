# Work and personal workflows — initial proposal

> Current ownership: See [the migration guide](project-workflow-boundary.md).
> The 2026-11-03 cleanup removed the project lifecycle pack from Toolbelt.
> Earlier inventories and implementation records below describe their original state.

The reusable engineering skills can serve both contexts. The overlap comes from
how a project chooses a workflow, the policies always loaded into that session,
and which specialist skills are discoverable. Keep those choices local to the
project while maintaining one shared source for debugging, tests, review,
refactoring, and handoff.

This is an initial design, not an installed profile system. The user selected
a work hub and a personal application as pilots. Their on-disk instructions,
installed skill trees, command availability, and workflow ownership have now
been inspected. The observed configuration explains several opportunities for
misrouting; actual unwanted session behavior has not yet been replayed. Work
is not synonymous with regulated delivery: ordinary team projects may use the
same lightweight skills with a PR policy.

## Findings from the selected pilots

- The work hub already has a separate project-owned delivery package. That
  package owns the work-specific lifecycle and router; generic review,
  debugging, and planning remain toolbelt capabilities. The update boundary
  must respect that ownership rather than replacing all commands from the
  shared repository.
- The personal app has no installed formal feature-delivery skill. Its router
  nevertheless points to that lane, a workflow-router command, and a review-
  reply skill that are absent from that selective install. This is an
  availability mismatch, not evidence that the formal workflow is installed.
- Both pilots retain the older Dev Lite and unattended-runner skill names.
  Selected shared entrypoints also differ from current canonical sources after
  accounting for installer path rewriting. Separate upgrading shared skills
  from migrating or retiring legacy execution surfaces.
- The personal root instruction files contain only the generated workflow
  inventory. Put the human-owned project workflow before that managed block,
  with pointers to its existing specification, decision log, contract, and
  test commands. Those artifacts remain useful for a substantial personal app.
- The personal review policy already requires standard review and security/
  correctness attention. Preserve it: personal ownership does not justify
  weakening an explicit project bar.
- The work hub has many always-on process rules, including overlapping legacy
  delivery and planning rules. Scope their lifecycle requirements to applicable
  work while preserving the team's actual evidence and approval obligations.
  The hub's documented multi-root view omits the hub itself, so opening that
  view is also a possible explanation for missing work context.

Detailed source paths, inventory, and candidate project-policy fragments are
kept in local `.atb-work/` research material. Project-specific work skills and
internal process text are not copied into the shared skill package. This
inspection did not change either pilot or verify live host/plugin activation.

## Evidence from this repository

- `/workflow-router` previously checked whether feature metadata existed and
  routed any raw idea or stakeholder request to `/feature-start`. This refresh
  makes task-relevant requirements select the lane and routes ordinary ideas
  through discovery/shaping.
- `phased-delivery` is a deliberate plan-and-PR workflow with human approval.
  It should be chosen for coordinated delivery or when requested, rather than
  attached to every small edit.
- `ai-feature-delivery` contains document-impact, QA, release, and controlled
  record contracts. Those are useful when the project requires them.
- The native plugin exposes all 30 standard skills together. Merely naming a
  context in a prompt changes routing guidance; it does not remove other
  skills from discovery.
- The installer can select packs per repository. `all` expands to standard
  packs, including the specialized feature lane; it is not a personal profile.
- User-level/global plugins, inherited parent rules, and repository-installed
  skills can coexist. A narrow repo install does not disable a globally enabled
  plugin. The existing plugin builder warns that `--with-rules` makes its
  always-on rules apply across projects.

## Separate capability from project policy

| Layer | Keep here | Avoid putting here |
| --- | --- | --- |
| Shared skills | Reproduction, concrete evidence, focused tests, read-only review, bounded fixes, safe handoff | Employer-specific tracker, required release forms, preferred hosting account, personal UI taste |
| Target repo instructions | Project purpose, chosen delivery mode, applicable reviews, artifact owner, tracker, deployment and authorization conventions | Copied skill bodies or another project's requirements |
| Work specialist pack | Controlled records and required requirement/ticket/test/QA/release links | Default activation for any project containing a ticket or a feature idea |
| Personal workflow entry | Goal, smallest useful slice, preview/checks, optional local note or issue, follow-up | Automatic formal documentation, tracker publishing, or a PR per minor edit |
| Host/session setup | Which packages are enabled in the current context | An assumption that all hosts support the same profile switch |

Personal projects still need meaningful checks for concrete risk. Auth, payments,
data migrations, and deployments do not become low risk because the owner is
working alone. Required work traceability also remains required when choosing a
shorter execution path.

## Candidate workflow paths

| Request | Personal/default path | Work path when required by that project |
| --- | --- | --- |
| Clear small feature | Inspect -> implement -> focused checks -> report | Same implementation, with the project's review/PR requirements |
| Uncertain product idea | `product-discovery` or `shape-up`, only for unresolved value/scope | Add approved source requirements and stakeholder decisions when applicable |
| Multi-step feature | Concise plan; choose `phased-delivery` when phase PRs are useful | Approved phase/PR map; carry required ticket and evidence links |
| Broken behavior | `bug-to-fix` -> minimal repair -> regression evidence | Same diagnosis plus applicable issue, QA, and release records |
| UI or app experiment | Small usable slice -> `webapp-testing` for the changed flow | Acceptance and browser evidence linked to the work item if required |
| Change review | `pr-review` at a chosen or risk-derived tier; apply fixes when requested | Repository review policy and severity floors remain binding |
| Pause/resume | `handoff` with branch, checks, and next action | Same handoff, linked to the project's durable record |

## First implementation to evaluate

1. Use the selected pilots to replay representative requests in their actual
   host sessions. Check a small edit, a planned feature, a review, and a formal
   work request. On-disk inventory is complete; enabled global plugins,
   invocation behavior, and unwanted session examples remain to verify.
2. Write a short project workflow section in the existing instruction owner.
   State the desired default and the requirements that justify escalation.
   Keep tracker, artifact, and deployment conventions local. Do not infer a
   context from a directory name, email domain, or a stale feature document.
3. Use the existing selective installer for a shared subset when project-local
   installation is the chosen distribution. Resolve global/plugin duplicates
   in the host setup; the installer adds selected packs and does not prune old
   ones. Preview the payload with its existing `--dry-run` option. The personal
   shared-core dry-run confirms existing files are skipped without `--force`;
   a fresh install alone will not refresh them or remove stale skill names.
   The installer updates its instruction block from the current pack selection,
   so an upgrade must also reconcile that inventory with retained capabilities.
   Preserve project-owned commands and review legacy ownership before removal.
4. If routing instructions alone do not prevent crossover, add derived shared,
   personal, and work package outputs from the canonical skill tree. This would
   require installer/builder and catalog changes; no `--profile` flag exists
   today. Avoid hand-maintained copies with identical skill names.
5. Add a `personal-build` entry only if repeated real requests show a missing
   workflow. Its completion would be a working requested slice with focused
   evidence and a next action. It could reuse shared specialists when needed,
   while keeping formal work artifacts in their own lane.

The strongest new upstream pattern for this proposal is keeping preferences
outside the updateable skill body. [Scoville Code](https://github.com/benjaminstelzer/scoville-code/blob/254ff39/README.md)
does this explicitly. [Gentle Pi's session binding](https://github.com/Gentleman-Programming/gentle-pi/blob/ed536d4f/lib/session-profile-binding.ts)
also provides an isolation example: a session selection does not rewrite shared
settings. These are design inputs, not claims that this toolbelt or every host
already implements isolated profiles.

## Behavior to check before rolling out a split

- A personal request to fix a label finishes the edit and relevant check
  without a feature master record, ticket publication, or approval interview.
- A work ticket requiring QA/release links keeps them through implementation,
  review, and handoff, even if the change itself is small.
- A conceptual question returns an answer without starting a delivery workflow.
- A personal auth or data-loss issue receives proportionate security and
  regression checks without adopting unrelated work paperwork.
- Switching between the selected work and personal repos changes the applicable
  project policy while keeping shared review and debugging behavior consistent.
- Refreshing shared skills preserves each project's local policy and does not
  re-enable excluded specialist packs or duplicate installed skill names.

The next concrete trial is the personal project's lightweight default and the
work project's separately owned routing, using the prepared project-policy
fragments. Verify host behavior before choosing whether derived package
profiles are necessary. A new personal workflow skill is still a candidate,
rather than a prerequisite for correcting the observed routing mismatches.
