# Cursor-First AI Feature Delivery

Use this when packaging the AI Feature Delivery System into a project that uses
Cursor.

## Mapping

- Cursor rules: persistent process guardrails.
- Cursor commands: repeatable actions humans run from chat.
- Workflow docs: ordered command recipes.
- Templates: required output structures.
- Scripts/CI later: automation and enforcement outside Cursor.

## Installed Layout

`install-ai-feature-delivery.sh` writes everything **flat** — there are no `dev/`
or `bridge/` rule subfolders:

```text
<project>/
  .cursor/
    rules/        000-050 process rules + 100/130/150 dev rules + 200 bridge rule (flat)
    commands/     all feature-delivery command .md files (flat)
  skills/         ai-feature-delivery/ and webapp-testing/ SKILL.md trees
  templates/      *-template.md output structures (e.g. feature-master-record.md, sdd-template.md)
  workflows/      ai-feature-delivery-lifecycle.md and the other playbooks
```

The installer's file lists are the source of truth for exactly what lands; run it
with `--dry-run` to preview before installing.

## Command Recipes

### Define to Refinement

1. Run `/feature-start`.
2. Run `/feature-fleshout`.
3. Run `/doc-impact`.
4. Run `/draft-pings` for unresolved stakeholder questions.
5. Update the Feature Master Record with decisions.
6. Run `/gate-check` for Gate 1.
7. If Gate 1 passes, run `/refine-to-tickets`.

### Refinement to Dev

1. Run `/refine-to-tickets`.
2. Run `/doc-impact` or `/doc-delta`.
3. Run `/gate-check` for Gate 2.
4. Start dev only after tickets have acceptance criteria, impacted repos,
   doc-delta flags, test expectations, dependencies, and open questions.

### Dev to PR

1. Run `/start-dev-from-feature`.
2. Run `/implementation-plan`.
3. Work one scoped ticket.
4. Run `/write-tests`.
5. Run `/dev-doc-delta-check`.
6. Update required docs in the same change.
7. Run `/review-diff`.
8. Run `/pr-ready-check`.
9. Run `/pr-traceability-review`.
10. Do not approve if required tests or doc deltas are missing.

### PR to QA

1. Ensure PR is merged or a build is available.
2. Run `/qa-handoff`.
3. Run `/gate-check` for QA readiness.

### QA to Release

1. Update QA evidence and known risks.
2. Run `/release-manifest`.
3. Run `/release-doc-check`.
4. Exclude anything not in the manifest or not marked
   `APPROVED_FOR_RELEASE`.

## V1 Adoption

Start with rules, templates, and these commands:
- `/feature-start`
- `/feature-fleshout`
- `/doc-impact`
- `/gate-check`
- `/draft-pings`
- `/steward-review`
- `/refine-to-tickets`

Keep scheduled scans, automatic Teams/Slack pings, Jira comments, PR bot
comments, stale-action escalation, and release checks in scripts/CI after the
manual workflow proves useful.

## Dev Execution Pack

Keep dev-only commands usable on ordinary coding work. Add feature delivery
awareness as an optional section: if a Feature Master Record or ticket is
present, preserve feature ID, target release, related SDD section,
`doc_delta_required`, QA evidence needs, and PR traceability notes.
