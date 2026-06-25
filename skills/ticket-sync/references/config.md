# Per-repo tracker config (`.tickets.md`)

The slicers say *what* the tickets are; this file says *where they go and how their fields map*. A
target repo ships an optional `.tickets.md` declaring the tracker (`github | jira | azure`), the
project/board key, default issue type, labels/components, and the FIELD MAPPINGS from ticket-template
fields to tracker fields. It lives **in the repo whose work is being tracked**, versioned with the
code, so it travels to every clone with no coupling to this toolbelt. It mirrors `.pr-review.md` from
the pr-review pack.

## Discovery (in the *target* repo)

First file found wins:
1. `.tickets.md` (repo root)
2. `.claude/tickets.md`

If none exists, ticket-sync still runs: it falls back to sensible defaults (provider inferred from
the origin remote — `github.com` → `github`, `dev.azure.com`/`visualstudio.com` → `azure`, otherwise
ask), and **asks for the project/board key** before posting anything. The config is purely additive.

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
How ticket-template fields land in the tracker. Left = ticket field, right = tracker destination.
- Feature ID        -> label `feat:{value}`        (or a custom field, e.g. Jira `customfield_10010`)
- Release ID        -> label `rel:{value}`         (or fixVersion / Azure Iteration Path)
- Acceptance criteria -> appended into the description as a checklist
- Dependencies      -> issue links ("Blocked by") between the created issues
- Test expectation  -> appended into the description under a "Testing" heading
- Doc-delta status  -> label `doc-delta:{value}`   (or a custom field)
```

## Field-mapping rules

The mapping turns the slicer ticket templates into tracker payloads. The two real source templates:

- **`templates/refinement-ticket-template.md`** (from `/refine-to-tickets`) — `Feature`, `Release`,
  `Requirement`, `Acceptance Criteria`, `Test Expectations`, `Doc Delta Required` / `Document
  Updates`, `Dependencies`, plus `Title` / `Description`.
- **`templates/shape-up-issues.md`** (from `/to-issues`) — `What to build`, `Acceptance criteria`,
  `Blocked by`, optional `Parent`.

Defaults when a mapping is unspecified:
- **Title** ← the ticket title.
- **Description / body** ← the description / "What to build", with **Acceptance criteria** appended as
  a checklist and **Test expectation** under a "Testing" heading.
- **Feature ID, Release ID, Doc-delta status** ← labels (`feat:…`, `rel:…`, `doc-delta:…`) unless the
  config maps them to a custom field / fixVersion / iteration path.
- **Dependencies / Blocked by** ← issue links between the created issues, resolved through the
  recorded `Tracker:` keys (see idempotency below).

When the config maps a field to a **custom field** (e.g. a Jira `customfield_#####` for Feature ID),
use that instead of the label default. Unknown/unmapped fields fall back to labels or the description
so nothing is silently dropped.

## Idempotency key (the `Tracker:` line)

ticket-sync records the created issue's key back into the ticket file so re-runs **update** instead
of duplicating. The recorded form per provider:

- GitHub: `Tracker: #57` (or the full issue URL)
- Jira:   `Tracker: ABC-1234`
- Azure:  `Tracker: AB#4321`

On each run, a ticket **with** a `Tracker:` key → update that issue; **without** → create, then write
the key back. Dependency links are resolved by looking up the blocker ticket's recorded key.

## Precedence

1. **Explicit command input** — paths/flags in `$ARGUMENTS` and any confirmed override at the prompt.
2. **Repo config** (`.tickets.md`, from the base branch) — provider, project, defaults, mappings.
3. **Defaults** — provider inferred from the remote; labels for unmapped IDs; ask for the project key
   when it can't be inferred.

## See also

- `templates/tickets-config.md` — a copyable starter to drop into a target repo as `.tickets.md`.
- `references/providers.md` — how each provider consumes the mapped fields (create / link / update).
