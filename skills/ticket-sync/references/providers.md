# Tracker providers — GitHub Issues, Jira, Azure Boards

ticket-sync is not GitHub-only. `gh` is the GitHub Issues path; **Jira** uses a Jira CLI (or REST);
**Azure Boards** uses the `az boards` CLI; and when none is present/authenticated the publish still
runs as a **manifest** (report-only). Detect the provider once from the config (`config.md`), then
route every tracker-touching step — **create**, **link**, **update** — through it. Parsing the ticket
files and mapping their fields are provider-independent; only these three operations branch on
`provider`.

## Detect the provider + auth

The provider comes from `.tickets.md` (`## Provider`), or is inferred from the origin remote when the
config is absent:

```bash
case "$provider" in
  github) gh auth status >/dev/null 2>&1            && ok=1 ;;
  jira)   jira me >/dev/null 2>&1                   && ok=1 ;;   # ankitpokhrel/jira-cli
  azure)  az account show >/dev/null 2>&1           && ok=1 ;;
esac
```

If the configured tracker's CLI isn't installed or isn't authenticated, **degrade to manifest mode**
(see the bottom of this file) — never hard-fail because a CLI is missing. Credentials always come
from the CLI's own auth (`gh auth login`, the Jira CLI config / `JIRA_API_TOKEN`, `az login` /
`AZURE_DEVOPS_EXT_PAT`). **Never hardcode, prompt for, or echo a token/PAT.**

## Capability matrix

| Capability | GitHub Issues (`gh`) | Jira (`jira` / REST) | Azure Boards (`az`) |
|---|---|---|---|
| Create | `gh issue create` | `jira issue create` | `az boards work-item create` |
| Title | `--title` | `--summary` | `--title` |
| Body | `--body` (markdown) | `--body` (markdown→ADF) | `--description` |
| Type | — (no native type) | `--type Story\|Bug\|Task` | `--type "User Story"\|Bug\|Task` |
| Labels | `--label` | `--label` | `--fields "System.Tags=…"` |
| Component / area | — (use a label) | `--component` | `--area` / `--iteration` |
| Parent / epic | `--milestone` (loose) | `--parent EPIC-1` | `--fields "System.Parent=#"` via relation |
| Dependency link | task list / "Blocked by #N" | `jira issue link A B "Blocks"` | `az boards work-item relation add` |
| Update | `gh issue edit <n>` | `jira issue edit <KEY>` | `az boards work-item update --id <id>` |
| Auth check | `gh auth status` | `jira me` | `az account show` |

The plan/preview, field mapping, idempotency, and confirmation gate are **provider-independent** —
only create/link/update branch on `provider`.

## GitHub Issues (`gh`)

- **Create:**
  ```bash
  gh issue create --title "<title>" --body "<body>" \
    --label "<l1>" --label "<l2>" [--milestone "<rel>"]
  ```
  `gh` returns the issue URL; parse the number for the `Tracker: #<n>` key.
- **Field mapping:** Feature/Release/Doc-delta IDs → labels (`feat:…`, `rel:…`, `doc-delta:…`);
  acceptance criteria → a `- [ ]` checklist in the body; test expectation → a "Testing" section in
  the body. No native issue type — encode it as a label if the config asks.
- **Dependencies:** GitHub has no first-class "blocked by" link — render it in the body as
  `Blocked by #<n>` and/or a task list referencing the blocker issues (resolved from their recorded
  keys). Order creation blockers-first so the references are real.
- **Update:** `gh issue edit <n> --title … --body … --add-label …`.

## Jira (`jira` CLI — ankitpokhrel/jira-cli; or `acli`/REST)

- **Create:**
  ```bash
  jira issue create -p"<PROJECT>" -t"<Type>" \
    -s"<summary>" -b"<description>" \
    -l"<label>" -C"<component>" [--parent "<EPIC-KEY>"]
  ```
  Returns the key (e.g. `ABC-1234`) → `Tracker: ABC-1234`. Description is markdown; the CLI/REST
  converts to ADF (Atlassian Document Format).
- **Field mapping:** project key + issue type come from the config `Defaults`. Acceptance criteria →
  appended into the description (a checklist, or a custom "Acceptance Criteria" field if the config
  maps one). Feature ID / Release ID → labels by default, or a **custom field** (`customfield_#####`)
  / **fixVersion** when the config's field mapping says so (`-l` / `--custom field=value` / `--fix-version`).
  Test expectation → a "Testing" section in the description.
- **Dependencies:** link issues by their recorded keys:
  ```bash
  jira issue link <THIS-KEY> <BLOCKER-KEY> "is blocked by"   # or "Blocks" from the blocker side
  ```
  Epic/parent: `--parent` on create, or `jira epic add <EPIC> <KEY>`.
- **Update:** `jira issue edit <KEY> -s… -b… -l…`.

## Azure Boards (`az boards`)

- **Create:**
  ```bash
  az boards work-item create --org "https://dev.azure.com/<org>" --project "<project>" \
    --type "<User Story|Bug|Task>" --title "<title>" --description "<html/markdown>" \
    --fields "System.Tags=<l1>; <l2>" --area "<area>" --iteration "<iteration>"
  ```
  Returns JSON; parse `.id` → `Tracker: AB#<id>`.
- **Field mapping:** issue/work-item type + area/iteration from the config. Labels → `System.Tags`.
  Feature ID / Release ID → tags by default, or a custom field / iteration path per the config.
  Acceptance criteria → `Microsoft.VSTS.Common.AcceptanceCriteria` when present, else appended to the
  description. Test expectation → the description.
- **Dependencies:** add a relation between the created work items (resolved from recorded ids):
  ```bash
  az boards work-item relation add --id <this-id> \
    --relation-type "Predecessor" --target-id <blocker-id>
  ```
  Parent link: `--relation-type Parent --target-id <epic-id>`.
- **Update:** `az boards work-item update --id <id> --title … --description … --fields …`.

## Manifest degrade (no CLI / no credentials)

When detection fails, **do not post** — write a publish-ready manifest and say so. The manifest is
the plan made durable: per ticket, the resolved action (create/update), the provider, and the exact
mapped fields (and the command that *would* run). Format it so a person with credentials can run it
later, e.g.:

```markdown
# ticket-sync manifest (provider: jira · project ABC · NOT POSTED — jira CLI unauthenticated)

## ABC ← tickets/03-checkout-api.md   [action: create]
- type: Story   labels: feat:FEAT-1042, rel:REL-2026.06, doc-delta:yes
- summary: Checkout API accepts saved cards
- description: <built body with acceptance-criteria checklist + Testing section>
- blocked by: tickets/02-payment-token.md  (link once both keys exist)
- would run: jira issue create -pABC -tStory -s"…" -b"…" -lfeat:FEAT-1042 …
```

Manifest mode is also the safe **preview** when the user wants the plan without committing to a
post — it never touches the tracker and never records a `Tracker:` key.

## See also

- `references/config.md` — the `.tickets.md` schema, field-mapping rules, base-branch trust, and the
  `Tracker:` idempotency key.
