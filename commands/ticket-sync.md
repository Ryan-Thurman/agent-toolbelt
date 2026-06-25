---
description: Publish/sync the ticket files the slicers produce to the repo's configured tracker — GitHub Issues, Jira, or Azure Boards. Provider-agnostic via a repo-local .tickets.md; idempotent (records the tracker key back into each ticket), confirmation-gated with a dry-run preview, and degrades to a manifest when no tracker CLI/credentials are present.
argument-hint: "[tickets-or-feature-context]"
---

# /ticket-sync

Take the ticket files produced by `/refine-to-tickets`, `/to-issues`, or `/bug-intake` and
create/update them in the repo's configured issue tracker using the `ticket-sync` skill. One flow,
swappable tracker — GitHub Issues, Jira, or Azure Boards — chosen by the repo's `.tickets.md`.

> **When to use vs related:** `/ticket-sync` is the optional *publish* step after a slicer. It does
> not slice — run `/refine-to-tickets` (regulated lane), `/to-issues` (dev lane), or `/bug-intake`
> (diagnostic) first. It mirrors how `/pr-review` abstracts the gh-vs-az host: here the abstraction
> is the tracker.

**Arguments:** `$ARGUMENTS` — ticket file paths, a directory of tickets, or a feature/brief context
to gather them from.

## Rules

- Read the skill's `references/config.md` and `references/providers.md`.
- **Provider-agnostic:** resolve the provider once from `.tickets.md` (or infer from the remote /
  ask), then route create / link / update through it.
- **Never create or modify remote issues without confirmation.** Always show the dry-run plan first
  and require explicit confirmation before posting.
- **Idempotent — never duplicate.** A ticket with a recorded `Tracker:` key is **updated**; one
  without is **created**, then the new key is written back into the ticket file. Match by recorded
  key.
- **Credentials from env / CLI auth only** — never hardcode, prompt for, or echo a token/PAT.
- **Degrade, don't fail:** when the tracker CLI/credentials are absent, write a publish-ready
  manifest instead of posting, and say so.
- **Trust the config from the base** branch where applicable; if the current change edits
  `.tickets.md`, surface it rather than honoring the new version blindly.

## Steps

1. **Resolve config** — discover `.tickets.md`; read provider, project/board key, default issue type,
   labels/components, and the field mappings. If absent, infer the provider from the remote and **ask
   for the project/board key** before posting.
2. **Collect tickets** — gather the files in `$ARGUMENTS` and parse each into the common fields
   (title, description, acceptance criteria, dependencies, feature/release IDs, doc-delta, test
   expectation, existing `Tracker:` key).
3. **Detect provider + auth** — confirm the tracker CLI is installed and authenticated; if not,
   switch to **manifest** mode for this run.
4. **Plan (dry-run preview)** — per ticket, decide create vs. update and render the mapped fields +
   dependency links; show the plan and **stop for confirmation**.
5. **Apply on confirmation** — create/update each issue; link dependencies via the blockers' recorded
   keys; on create, write the new `Tracker:` key back into the ticket file. In manifest mode, write
   the manifest instead of posting.
6. **Report** — each ticket → its tracker key + URL and the action taken (created / updated /
   manifest-only / skipped), plus any dependencies that couldn't be linked yet.

## Output

A sync result: the dry-run plan (shown before posting), then per ticket its tracker key + URL and the
action taken, the updated ticket files (with `Tracker:` keys recorded on create), and — when the
tracker is unreachable — a publish-ready manifest instead of remote changes.
