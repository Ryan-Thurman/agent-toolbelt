# Installation

The native cross-host plugin is the primary installation path. The repository
root exposes 37 skills for Cursor, Claude Code, and Codex from one canonical
tree. For a local clone:

```sh
cursor-agent --plugin-dir /path/to/agent-toolbelt
claude --plugin-dir /path/to/agent-toolbelt
codex plugin marketplace add /path/to/agent-toolbelt
codex plugin add agent-toolbelt@agent-toolbelt
```

Use `/skill-name` in Cursor, `/agent-toolbelt:skill-name` in Claude Code, and
`$skill-name` or `/skills` in Codex. The [offline portal](../portal/generated/index.html)
owns discovery and examples; this page covers installation and compatibility.

## Optional project-scoped compatibility install

`./install.sh` remains available when a project needs local commands, templates,
workflow files, rules, or opt-in hooks. It answers **which packs**, **which
harness(es)**, and **into which folder**, plus optional Cursor rule mode:

```sh
./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>
```

The most common command — install every standard pack into one project for Cursor:

```sh
./install.sh --harness cursor all /path/to/project
```

Other shapes:

```sh
./install.sh --list                                          # list the available packs
./install.sh --harness cursor phased-delivery ~/pilot    # one pack, one harness
./install.sh --harness cursor,claude bug-to-fix simplify shape-up ~/project
./install.sh --harness all react-quality ~/project
./install.sh --harness all all ~/project                     # every pack, every harness
```

New to the compatibility installer? Take the guided path:

- `wiki/Workflows.md` — the shared workflow entry points.

After install, open the target folder and run `/workflow-router` (or a specific
pack's entry command) from chat.

## First repository setup

An installation provides agent workflows, templates, and pointers. The target
repository still needs a small amount of repository-owned policy before agents
can consistently implement and review code in its local style.

### Baseline files

| Artifact | Create or update | Ownership |
|---|---|---|
| The existing canonical style owner, or root `STYLE_GUIDE.md` when no owner exists | Run `/style-guide-init`. Use repository instructions, enforced configuration, representative code and tests, domain vocabulary, and accepted external standards as evidence. A newly created guide remains `Status: Draft` until maintainers approve it. | Team-owned and tracked. Keep the rules here, not duplicated in agent pointer files. |
| Root `.pr-review.md` | Run `/pr-review-init`. Remove generic sections that lack evidence and review the resulting priorities before committing them to the base branch. | Team-owned and tracked. PR review reads the base-branch copy so a change cannot weaken its own review policy. |
| Root `AGENTS.md` and/or `CLAUDE.md` | Let `install.sh` maintain its marker-delimited workflow block. Merge around existing content and add only a concise pointer to the canonical style owner when one is needed. | Installer-maintained pointer block plus any existing team-owned instructions. |

An existing `CONTRIBUTING.md`, engineering handbook, or repository-specific
standards document may already be the canonical style owner. Update that owner
instead of adding a competing `STYLE_GUIDE.md`.

### Conditional and generated artifacts

Do not create empty documents to make the repository look complete:

- Product-discovery reports, QA test cases, threat models, and security audits
  are work artifacts. Create one from the corresponding installed template only
  when a real request supplies evidence and scope, and place it according to the
  repository's existing documentation convention.
- `.atb-work/pr-improve/<target-slug>/` contains generated baselines, diffs, and
  ledgers for a bounded improvement loop. It is scratch state and must remain
  ignored.
- Installed `.atb/`, `.cursor/`, and `.agents/` content is workflow machinery,
  not a substitute for repository policy.

### React quality specialists

Install `react-quality` to include the Vercel Labs composition and React/Next.js
specialist skills, or install either pack separately:

```sh
./install.sh --harness all react-quality /path/to/project
./install.sh --harness cursor vercel-react-best-practices /path/to/project
```

The packs preserve the substantive MIT-licensed upstream rules as progressive
disclosure references. They are conditional guidance, not universal repository
policy. The baseline's React rule scan lists the installed
`vercel-composition-patterns`, `vercel-react-best-practices`,
`use-effect-killer`, `vercel-react-view-transitions`,
`vercel-web-interface-guidelines`, and
`vercel-react-native-skills` rules that changed code triggers. Check the
repository's React/Next versions, runtime boundaries, local conventions, and
concrete performance impact before applying a rule.

Repository bootstrap is complete when:

- exactly one canonical style owner is named, its evidence paths resolve, and
  weak or conflicting conventions are recorded as decisions rather than facts;
- the team baseline and any local TypeScript/React deviations are explicit,
  without repeating formatter or linter configuration in prose;
- `.pr-review.md` contains only repository-relevant priorities and is ready for
  team review on the base branch;
- agent instruction files point to policy instead of maintaining duplicate
  copies; and
- no placeholders, empty conditional artifacts, or accidentally tracked
  `.atb-work/` files remain.

## Choosing harnesses

`--harness` is required (there is no implicit default) and takes a comma-separated
list of `cursor`, `claude`, `codex`, or `all`. Only the selected harness' files are
written:

| Harness | Installs |
|---|---|
| `cursor` | `.cursor/commands/`, `.cursor/rules/`, and skills into `.agents/skills/` |
| `claude` | `.claude/commands/` |
| `codex`  | skills into `.agents/skills/` |
| _always_ | the shared `.atb/` folder: the canonical `.atb/skills/` tree (commands reference it by path), plus `.atb/templates/`, `.atb/workflows/`, `.atb/examples/` |

## Cursor rule modes

Cursor installs default to **minimal** project rules:

```sh
./install.sh --harness cursor all /path/to/project
```

Minimal mode writes one small always-on router/guardrail rule at
`.cursor/rules/agent-toolbelt-router.mdc`. It keeps always-injected context small
and points the agent to the matching installed command or skill when a task needs
workflow-specific detail.

The former `--rules full` mode is retired.
The target repository owns process rules, forms, and approval requirements.

The installer does not delete rules from earlier installations.
Review each old rule against its owner before removing it.
Preserve project-owned rules and local changes.
Read [the ownership boundary](../README.md#what-belongs-here) before an update.

## Polyrepo / `--sweep`

For repos kept side-by-side under a common parent, `--sweep` treats the target as
the **parent** and installs into it **and** every immediate child git repo, so the
tooling works both inside a single repo and across the whole application:

```sh
./install.sh --sweep --harness cursor all /path/to/parent
```

Each level is a self-contained install — its own `.atb/` folder (commands
reference the skills tree by path), root instruction pointer files, and selected
`.cursor/rules` mode — so a repo opened on its own carries its guardrails.

**Multi-root caveat (verified against Cursor):** in a Cursor multi-root workspace,
only the **top root's `AGENTS.md`** reliably loads into context (nested per-repo
`AGENTS.md` files do not auto-apply), and per-root `.cursor/rules` are not applied
consistently across the session. This is a documented Cursor limitation, not an
installer issue. The per-repo project rules this installs are reliable when you
**open a single repo as the project**; for always-on behavior across the *whole
application* in a multi-root workspace, promote those rules to **Cursor User Rules**
(Settings → Rules, Skills, Subagents → User) instead of relying on a repo's
`.cursor/rules`.

## Cross-host plugin (Cursor, Claude Code, and Codex)

The repository root is the canonical skills-only plugin package. It contains
native manifests for all three hosts and one shared `skills/` tree, exposing 37
on-demand skills, 0 commands, and 0 hooks; no committed skill copies are
generated. The root `commands/` remain available through `install.sh`. The
`cursor-hooks` pack remains available through `install.sh`, but its manifest and
scripts live under `optional/cursor-hooks/` so installing the plugin does not
enable hooks automatically.

### Local clone

Use the host-native local plugin entry points:

```sh
# Cursor — load for one session
cursor-agent --plugin-dir /path/to/agent-toolbelt

# Claude Code — load for one session
claude --plugin-dir /path/to/agent-toolbelt

# Codex — add the repo-local marketplace, then install its entry
codex plugin marketplace add /path/to/agent-toolbelt
codex plugin add agent-toolbelt@agent-toolbelt
```

The Claude and Codex marketplace catalogs both have a standard root entry and
an optional Auto Agent entry. For
GitHub-backed installation, replace the local path with
`Ryan-Thurman/agent-toolbelt` in each host's marketplace-add command:

```sh
claude plugin marketplace add Ryan-Thurman/agent-toolbelt
codex plugin marketplace add Ryan-Thurman/agent-toolbelt
```

Cursor's public marketplace requires review and a manual submission at
`https://cursor.com/marketplace/publish`; publishing has not been performed.
Until approval, use `cursor-agent --plugin-dir` or a local plugin link.

Validate the package and all catalogs from the repository root:

```sh
scripts/check-plugin-package.sh
```

This check verifies the three manifests, aligned version and identity metadata,
both catalog source paths, all 37 canonical skills, and that default plugin
payloads do not include hooks or always-on rules. Claude's installed validator is
run as part of the check. Run the repository check script from the clone rather
than relying on an installation-specific validator path.

### Optional Auto Agent package

The unattended runner contract and its legacy Dev Lite adapter live in the separate
[Auto Agent plugin](../plugins/agent-toolbelt-auto-agent/README.md). Neither the
standard native plugin nor `install.sh all` includes those skills. Install
`agent-toolbelt-auto-agent@agent-toolbelt` explicitly from the Codex or Claude
marketplace, load its directory in Cursor, or use the compatibility installer:

```sh
./install.sh --harness all auto-agent-contract /path/to/project
```

### Private Cursor plugin build (one global install)

Instead of installing into each repo, you can bundle the toolbelt as a **private,
user-scoped Cursor plugin** — its skills become available in *every* project from a
single install, with nothing published. `build-cursor-plugin.sh` assembles the plugin:

```sh
./build-cursor-plugin.sh                       # skills-only frozen Cursor package
ln -s "$(pwd)/build/cursor-plugin/agent-toolbelt" ~/.cursor/plugins/local/agent-toolbelt
# then enable "agent-toolbelt" in Cursor → Settings → Plugins, and run Developer: Reload Window
```

Notes:
- **Skills** are the reliable, self-contained unit here — Cursor auto-discovers them
  globally and surfaces them on demand with the same `agents/openai.yaml` metadata
  shipped by per-repo installs. This is the main reason to use the plugin.
- **Rules are omitted by default**: most of the repo's rules are `alwaysApply: true`,
  and a user-scoped plugin would fire them in *every* project. Pass `--with-rules` only
  if you want that. For scoped, per-project rules, use the per-repo `install.sh` instead.
- **Commands** are intentionally not included in the global plugin build. Use the
  project-scoped `install.sh --harness cursor` flow for the `/command` UX and its
  project-local `.atb/` paths.

The symlink picks up rebuilds live (Reload Window); `build/` is gitignored.

Each pack's file list lives in `install/<pack>.sh`; the shared logic is in
`install/lib.sh`. Use `--dry-run` to preview and `--force` only when replacing a
previous install:

```sh
./install.sh --dry-run --harness cursor phased-delivery /path/to/pilot-folder
```

On macOS, non-developer pilot users can double-click `install.command`, which
asks which pack(s) to install, which harness(es), whether to sweep child repos,
and then the target folder (drag it into the Terminal prompt and press Enter).
