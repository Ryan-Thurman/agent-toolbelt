# Installation

Everything installs through one entry point — `./install.sh` — which answers three
questions: **which packs**, **which harness(es)**, and **into which folder**:

```sh
./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>
```

The most common command — install every pack into one project for Cursor:

```sh
./install.sh --harness cursor all /path/to/project
```

Other shapes:

```sh
./install.sh --list                                          # list the available packs
./install.sh --harness cursor ai-feature-delivery ~/pilot    # one pack, one harness
./install.sh --harness cursor,claude bug-to-fix simplify shape-up ~/project
./install.sh --harness all all ~/project                     # every pack, every harness
```

New here? Take the guided path:

- `docs/tutorial.md` — a first install and first feature walkthrough.
- `docs/README.md` — the documentation map.

After install, open the target folder and run `/workflow-router` (or a specific
pack's entry command) from chat.

## Choosing harnesses

`--harness` is required (there is no implicit default) and takes a comma-separated
list of `cursor`, `claude`, `codex`, or `all`. Only the selected harness' files are
written:

| Harness | Installs |
|---|---|
| `cursor` | `.cursor/commands/`, `.cursor/rules/`, and skills into `.agents/skills/` |
| `claude` | `.claude/commands/` |
| `codex`  | skills into `.agents/skills/` |
| _always_ | the canonical `skills/` tree (commands reference it by path), plus `templates/`, `workflows/`, `examples/` |

**Skills:** Cursor and Codex both auto-discover skills under `.agents/skills/`, so the
installer writes that one native copy for either harness (a separate `.cursor/skills/`
would make Cursor list every skill twice). The bare `skills/` tree at the root is *not*
an auto-discovery root, so it never double-registers — it exists only because the
commands reference it by relative path. Each `SKILL.md` carries `name`/`description`
frontmatter, so Cursor surfaces them as first-class, on-demand skills alongside the
`/commands`.

When `cursor` or `codex` is selected, the installer also writes an **`AGENTS.md`
pointer** at the target — a marker-delimited "Available workflows" block listing the
installed commands and skills so the agent discovers them. It is regenerated
idempotently and never disturbs the rest of your `AGENTS.md`.

## Polyrepo / `--sweep`

For repos kept side-by-side under a common parent, `--sweep` treats the target as
the **parent** and installs into it **and** every immediate child git repo, so the
tooling works both inside a single repo and across the whole application:

```sh
./install.sh --sweep --harness cursor all /path/to/parent
```

Each level is a full, self-contained install — its own `skills/` tree (commands
reference it by relative path), `AGENTS.md`, and `.cursor/rules` — so a repo opened
on its own carries its guardrails.

**Multi-root caveat (verified against Cursor):** in a Cursor multi-root workspace,
only the **top root's `AGENTS.md`** reliably loads into context (nested per-repo
`AGENTS.md` files do not auto-apply), and per-root `.cursor/rules` are not applied
consistently across the session. This is a documented Cursor limitation, not an
installer issue. The per-repo project rules this installs are reliable when you
**open a single repo as the project**; for always-on behavior across the *whole
application* in a multi-root workspace, promote those rules to **Cursor User Rules**
(Settings → Rules, Skills, Subagents → User) instead of relying on a repo's
`.cursor/rules`.

## Private Cursor plugin (one global install)

Instead of installing into each repo, you can bundle the toolbelt as a **private,
user-scoped Cursor plugin** — its skills become available in *every* project from a
single install, with nothing published. `build-cursor-plugin.sh` assembles the plugin:

```sh
./build-cursor-plugin.sh                       # skills + commands (recommended)
ln -s "$(pwd)/build/cursor-plugin/agent-toolbelt" ~/.cursor/plugins/local/agent-toolbelt
# then enable "agent-toolbelt" in Cursor → Settings → Plugins, and run Developer: Reload Window
```

Notes:
- **Skills** are the reliable, self-contained unit here — Cursor auto-discovers them
  globally and surfaces them on demand. This is the main reason to use the plugin.
- **Rules are omitted by default**: most of the repo's rules are `alwaysApply: true`,
  and a user-scoped plugin would fire them in *every* project. Pass `--with-rules` only
  if you want that. For scoped, per-project rules, use the per-repo `install.sh` instead.
- **Commands** are included for the `/command` UX, but some reference skill files by
  project-relative `skills/...` paths; for the full command-driven flow with those
  references resolving, a per-repo `install.sh --harness cursor` is still the way.

The symlink picks up rebuilds live (Reload Window); `build/` is gitignored.

Each pack's file list lives in `install/<pack>.sh`; the shared logic is in
`install/lib.sh`. Use `--dry-run` to preview and `--force` only when replacing a
previous install:

```sh
./install.sh --dry-run --harness cursor ai-feature-delivery /path/to/pilot-folder
```

On macOS, non-developer pilot users can double-click `install.command`, which
asks which pack(s) to install, which harness(es), whether to sweep child repos,
and then the target folder (drag it into the Terminal prompt and press Enter).
