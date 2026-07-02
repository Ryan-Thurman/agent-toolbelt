---
name: ticket-sync
description: Publish sliced ticket files to the repo-declared tracker: GitHub Issues, Jira, or Azure Boards. Use after refine-to-tickets, to-issues, or bug-intake. Provider-agnostic, idempotent, confirmation-gated, and manifest-only when offline.
---

# ticket-sync

The lanes already SLICE work into tickets — `/refine-to-tickets` (regulated), `/to-issues` (dev
lane), `/bug-intake` (diagnostic) — but only ever as local markdown or GitHub Issues. ticket-sync is
the **adapter** that takes those same ticket files and publishes them to whichever tracker the repo
declares: **GitHub Issues, Jira, or Azure Boards**. It mirrors how `pr-review` abstracts the
gh-vs-az *host* — here the abstraction is the *tracker*.

> One flow, swappable tracker. The slicers decide *what* the tickets are; ticket-sync only decides
> *where they live* and keeps them in sync.

## Mutation Policy

Default: dry-run preview.
Modify remote tracker issues only after explicit confirmation.
Edit local ticket files only to record tracker keys created during a confirmed
apply; when offline, write a manifest instead.

## Principles (always)

- **Provider-agnostic — one flow, swappable tracker.** Detect the provider once from `.tickets.md`
  (or the repo), then route every tracker-touching step (create / link / update) through it. The
  parsing of ticket files and the field mapping are provider-independent; only the create/link/update
  calls branch on `provider`.
- **Never create or modify remote issues without confirmation.** Always show a dry-run preview first
  (what would be created/updated, with the mapped fields) and require explicit confirmation before
  posting — mirroring pr-review's opt-in posting and ship-it's "never deploy without confirmation."
- **Idempotent via recorded keys — never duplicate.** When an issue is created, record its key back
  into the local ticket file (a `Tracker:` line). On re-run, match by the recorded key and **update**
  the existing issue; only create when there is no key. No duplicates, ever.
- **Credentials from env / CLI auth only.** Never hardcode, prompt for, or echo a token/PAT. Auth
  comes from the tracker CLI's own login (`gh auth`, Jira CLI config, `az login` / PAT env var).
- **Degrade to a manifest when offline.** When the configured tracker's CLI or credentials are
  absent, do **not** fail — write a publish-ready manifest (the would-be create/update calls + mapped
  fields) and say so, so the user can run it later or hand it to someone who can.
- **Trust the config from the base.** Load `.tickets.md` as it exists on the base/default branch
  where applicable (like pr-review loads its config from base), so a working branch can't silently
  retarget publishing. If the current change modifies `.tickets.md`, surface it rather than honoring
  the new version blindly.

## Flow

1. **Resolve config** (`references/config.md`) — discover `.tickets.md` in the target repo; read
   `provider`, the project/board key, default issue type, labels/components, and the FIELD MAPPINGS
   from ticket-template fields (feature ID, release ID, acceptance criteria, dependencies, test
   expectation, doc-delta status) to tracker fields. If absent, fall back to sensible defaults and
   **ask** for the project/board key before posting.
2. **Collect tickets** — gather the ticket files named in `$ARGUMENTS` (paths, a directory, or a
   feature/brief context). Parse each into the common fields the mapping expects (title, description,
   acceptance criteria, dependencies, feature/release IDs, doc-delta, test expectation, and any
   existing `Tracker:` key).
3. **Detect provider + auth** (`references/providers.md`) — confirm the tracker CLI is installed and
   authenticated. If not, switch to **manifest** mode for this run.
4. **Plan (dry-run preview)** — for each ticket, decide **create** (no recorded key) vs. **update**
   (has a `Tracker:` key) and render the mapped fields + dependency links. Show this plan and **stop
   for confirmation** — nothing is posted yet.
5. **Apply on confirmation** — create/update each issue via the provider's commands; add dependency
   links between issues (resolve "Blocked by" to the linked tracker keys); on create, **write the new
   key back** into the ticket file's `Tracker:` line. In manifest mode, write the manifest instead.
6. **Report** — list each ticket → its tracker key + URL and the action taken (created / updated /
   manifest-only / skipped), and note any tickets whose dependencies couldn't be linked yet.

## References

- `references/config.md` — the `.tickets.md` schema (provider, project/board key, issue type,
  labels/components, field mappings), discovery, base-branch trust, and the defaults/ask fallback.
- `references/providers.md` — per tracker (GitHub Issues / Jira / Azure Boards): the create, link,
  and update commands, the field mapping, CLI/credential detection, and the manifest degrade path.

## See also

- `templates/tickets-config.md` — a copyable `.tickets.md` starter to drop into a target repo.
- `/refine-to-tickets`, `/to-issues`, `/bug-intake` — the slicers that produce the ticket files this
  publishes; ticket-sync is the optional publish step after them.
