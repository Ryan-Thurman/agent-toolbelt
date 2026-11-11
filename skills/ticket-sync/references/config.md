# Per-repo tracker config (`.tickets.md`) and ticket parsing

The ticket files say *what* the tickets are; `.tickets.md` says *where they go and how their fields
map*. A target repo ships an optional `.tickets.md` declaring the tracker (`github | jira | azure`), the
project/board key, default issue type, labels/components, and the field mappings from ticket fields
to tracker fields. It lives **in the repo whose work is being tracked**, versioned with the code.

## Discovery (in the *target* repo)

First file found wins:
1. `.tickets.md` (repo root)
2. `.claude/tickets.md`

If none exists, ticket-sync still runs. It infers the provider from the origin remote
(`github.com` → `github`, `dev.azure.com`/`visualstudio.com` → `azure`, otherwise ask).
Show the inferred provider in the preview, and get confirmation of it.
Ask for the project/board key before posting anything. The config is purely additive.

## Trust & hardening (load from the BASE, not the working head)

`.tickets.md` is **trusted** (committed by the team, like CI config). But a working branch could try
to retarget publishing — point it at a different project, or relabel everything — by editing the
config in the same change. So, where a base branch is meaningful:

- **Load the config as it exists on the base/default branch**, not the working head:
  ```bash
  base="$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null || echo origin/main)"
  git show "$base:.tickets.md" 2>/dev/null || git show "$base:.claude/tickets.md" 2>/dev/null
  ```
  The config *in effect* is the one already approved on the base branch.
- **If the current change modifies `.tickets.md`**, do **not** silently honor the new version — note
  it ("this change edits the tracker config — confirm the new target before publishing") and let a
  human confirm the retarget separately.

## Sections (all optional; lenient markdown)

The agent reading this is an LLM — write it as readable markdown, not strict schema. Missing sections
just mean "use the default / ask." Recognized headings:

```markdown
## Provider
One of: github | jira | azure. The tracker every other section targets.
- jira

## Project
The project/board key the issues are created under.
- Jira:   project key, e.g. ABC
- GitHub: owner/repo (defaults to the origin remote)
- Azure:  organization / project [/ team]

## Defaults
- Issue type: Story            # Jira issue type / Azure work-item type; GitHub ignores
- Labels: backend, q3-roadmap  # applied to every issue
- Components: payments         # Jira components / Azure area path
- Milestone / Epic / Parent: REL-2026.06   # parent link if the tracker supports it

## Field mapping
How ticket fields land in the tracker. Left = the field name in the ticket file, right = destination.
- Feature           -> label `feat:{value}`        (or a custom field, e.g. Jira `customfield_10010`)
- Release           -> label `rel:{value}`         (or fixVersion / Azure Iteration Path)
```

## Parse each ticket

Parse the ticket files the same way for every provider.

| Ticket part | Source in the file |
| --- | --- |
| Title | The `Title` section. If there is none, the first `#` heading. If there is none, the file name. |
| Header fields | `Key: value` lines before the first section, or in a `Metadata` section. |
| Description | The `What to build` or `Description` section. |
| Acceptance criteria | The `Acceptance criteria` section. |
| Dependencies | The `Blocked by` or `Dependencies` section. |
| Tracker key | The `Tracker:` line. |
| Other sections | Every other section, in source order. |

Match section names without regard to case or heading level.
When one file holds several `#`-headed tickets, treat each heading as one ticket.

A `Tracker:` value is a key only when it has the provider's key form (see below).
An empty value or placeholder text means that the ticket has no key yet.

## Field-mapping rules

Build each tracker payload with these rules:

1. Put the description first in the body.
2. Add the acceptance criteria to the body as a checklist, unless the config maps them to a tracker field.
3. Send each header field that the config's field mapping names to its mapped destination.
4. Keep every header field that has no mapping in the body, under a "Ticket fields" heading.
   Write each one as its original `Key: value` line.
5. Add every other section to the body under its original heading, in source order.
6. Resolve each dependency that names another ticket file or a tracker key to an issue link.
   Keep each unresolved dependency in the body, and report it.
7. Leave the `Tracker:` line out of the body.

Skip a mapped destination when its value is empty or a placeholder such as `TBD`.
Keep that field in the body instead.
Do not drop a field or a section. When a mapping fails, put the content in the body.

## Idempotency key (the `Tracker:` line)

ticket-sync records the created issue's key back into the ticket file so re-runs **update** instead
of duplicating. The recorded form per provider:

- GitHub: `Tracker: #57` (or the full issue URL)
- Jira:   `Tracker: ABC-1234`
- Azure:  `Tracker: AB#4321`

On each run, a ticket **with** a `Tracker:` key → update that issue; **without** → create, then write
the key back. Replace the value of an existing `Tracker:` line, including a placeholder.
If there is no `Tracker:` line, add one directly below the ticket's title heading.
Dependency links are resolved by looking up the blocker ticket's recorded key.

## Precedence

1. **Explicit command input** — paths/flags in `$ARGUMENTS` and any confirmed override at the prompt.
2. **Repo config** (`.tickets.md`, from the base branch) — provider, project, defaults, mappings.
3. **Defaults** — provider inferred from the remote; unmapped fields in the body; ask for the
   project key when it can't be inferred.

## See also

- `templates/tickets-config.md` — a copyable starter to drop into a target repo as `.tickets.md`.
- `references/providers.md` — how each provider consumes the mapped fields (create / link / update).
