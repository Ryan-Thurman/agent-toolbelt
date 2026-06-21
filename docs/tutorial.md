# Tutorial: Install and Use the AI Feature Delivery Pack

This walkthrough installs the feature-delivery pack into a pilot folder, starts
a feature record, and shows the normal command path from idea to release docs.

## Prerequisites

- A local checkout of this `agent-toolbelt` repo.
- A target repo or pilot folder where the commands, rules, templates, skills,
  and workflows should be installed.
- Cursor for the slash-command workflow. The installed files are markdown, so
  they can also be read and adapted manually.

## 1. Preview the install

From this repo:

```sh
./install-ai-feature-delivery.sh --dry-run /path/to/pilot-folder
```

The dry run shows the files that would be installed:

- `.cursor/commands/*.md`
- `.cursor/rules/*.mdc`
- `skills/*/SKILL.md`
- `templates/*.md`
- `workflows/*.md`

Existing files are skipped by default during a real install.

## 2. Install into the pilot folder

```sh
./install-ai-feature-delivery.sh /path/to/pilot-folder
```

Use `--force` only when you intentionally want to replace previously installed
files:

```sh
./install-ai-feature-delivery.sh --force /path/to/pilot-folder
```

On macOS, a non-developer pilot user can double-click
`install-ai-feature-delivery.command`, drag the target folder into the Terminal
prompt, and press Enter.

## 3. Open the target in Cursor

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

## 4. Flesh out the feature package

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

## 5. Draft design and document impacts

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

## 6. Refine into implementation tickets

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

## 7. Carry a ticket through development

For an implementation ticket, use the dev workflow:

```text
/start-dev-from-feature
/implementation-plan
/write-tests
```

Implement the change, then verify with the commands that match the work:

```text
/webapp-test
/dev-doc-delta-check
/review-diff
/pr-ready-check
/pr-traceability-review
```

Use `/webapp-test` only for browser or user-flow changes. For non-UI work,
record it as not applicable.

## 8. Prepare QA and release docs

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
