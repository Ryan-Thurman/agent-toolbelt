---
name: ticket-sync
description: "Publish approved ticket files to the repository's tracker: GitHub Issues, Jira, or Azure Boards. Use after shape-up slicing, bug-to-fix intake, or a project-owned ticket workflow. Preview changes, preserve tracker keys, and write a manifest when offline."
---

# ticket-sync

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Publish local ticket files from `shape-up` slicing (`/to-issues`), `bug-to-fix` intake (`/bug-intake`),
or project-owned ticket workflows to the tracker that the repository declares.
Slicing belongs to those workflows.

## Mutation Policy

Default: dry-run preview.
Modify remote tracker issues only after explicit confirmation.
Edit local ticket files only to record tracker keys created during a confirmed apply.

## Principles

- **One flow, one provider.** Detect the provider once from `.tickets.md` or the repo.
  Send every create, link, and update call through it.
  Ticket parsing and field mapping are the same for every provider.
- **No data loss.** Publish every field and section of a ticket.
  Fields without a mapping go into the issue body.
- **Idempotent via recorded keys.** Record each created issue's key in the ticket file as a `Tracker:` line.
  On a re-run, update the issue that the recorded key names.
- **Credentials from env / CLI auth only.** Never hardcode, prompt for, or echo a token/PAT.
  Auth comes from the tracker CLI's own login (`gh auth`, Jira CLI config, `az login` / PAT env var).
- **Degrade to a manifest when offline.** If the tracker CLI or credentials are absent, do not fail.
  Write a publish-ready manifest and tell the user.
- **Trust the config from the base.** Load `.tickets.md` from the base/default branch where applicable.
  If the current change modifies `.tickets.md`, show that change and get confirmation of the new target.

## Flow

Before an apply or retry, read `shared/contracts/references/operation-retries.md`.
If issue creation may have succeeded before its key was saved, reconcile remote identity before another create.
When that identity cannot be established, report an unknown outcome and preserve the pending operation.

1. **Resolve config** (`references/config.md`). Find `.tickets.md` in the target repo.
   Read the provider, project/board key, default issue type, labels/components, and field mappings.
   If it is absent, use the defaults, and ask for the project/board key before posting.
2. **Collect tickets.** Gather the ticket files named in `$ARGUMENTS` (paths, a directory, or a
   feature/brief context). Parse each ticket with the rules in `references/config.md`.
3. **Detect provider + auth** (`references/providers.md`). Confirm that the tracker CLI is installed and
   authenticated. If it is not, switch to **manifest** mode for this run.
4. **Plan (dry-run preview).** For each ticket, choose **create** (no recorded key) or **update**
   (a recorded `Tracker:` key). Show the provider, project, mapped fields, body, and dependency links.
   Stop for confirmation. Nothing is posted yet.
5. **Apply on confirmation.** Create or update each issue through the provider's commands in `references/providers.md`.
   Link dependencies through the blockers' recorded keys.
   On create, write the new key into the ticket's `Tracker:` line.
   In manifest mode, write the manifest instead.
6. **Report.** List each ticket with its tracker key, URL, and action
   (created / updated / manifest-only / skipped).
   Name each dependency that could not be linked yet.

To start a `.tickets.md` file in a target repository, copy `templates/tickets-config.md`.
