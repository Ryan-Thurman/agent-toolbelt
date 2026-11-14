# Agent Toolbelt

Agent Toolbelt is an independent, general-purpose collection of reusable skills
for software delivery. It has no AI-SDLC or team-workspace dependency.

The native plugin is the primary installation path: one canonical `skills/`
tree of on-demand skills, and support for Cursor, Claude Code, and Codex.

## What belongs here

Agent Toolbelt is the source for your reusable workflows and skills.
Project repositories own the rules and content specific to those projects.

| Content | Owner |
|---|---|
| Reusable planning, development, QA, review, research, and release methods | Agent Toolbelt, as those capabilities are implemented |
| Shared output formats and ASD-STE100 writing rules | Agent Toolbelt |
| Optional unattended workflows and reusable personal workflows | Agent Toolbelt; optional packages can have separate installation choices |
| Project forms, required approvals, internal references, and workspace automation | The project repository |
| Project adaptations of shared workflows | The project repository; shared methods retain their Toolbelt source |

Installed copies consume this library. Update reusable behavior here and
project-specific behavior in its project owner.

## Start with the native plugin

For a local clone, load the skills in the host you use:

```sh
# Cursor
cursor-agent --plugin-dir /path/to/agent-toolbelt

# Claude Code
claude --plugin-dir /path/to/agent-toolbelt

# Codex
codex plugin marketplace add /path/to/agent-toolbelt
codex plugin add agent-toolbelt@agent-toolbelt
```

Invocation is host-specific: Cursor uses `/skill-name`, Claude Code uses
`/agent-toolbelt:skill-name`, and Codex uses `$skill-name` or `/skills`.
Natural-language requests can also match skills implicitly. The [generated
portal](portal/generated/index.html) is the rich capability reference with
examples, workflow sequences, filters, and host guidance.

Before sharing a clone, run the full package check:

```sh
npm ci
npx playwright install chromium
./scripts/check-plugin-package.sh
```

To rebuild or open the offline portal:

```sh
./scripts/build-portal.sh
open portal/generated/index.html   # macOS; use your browser on other hosts
```

For screenshots of both themes at desktop and mobile sizes, run
`npm run portal:screenshots`. Generated reports stay under ignored `.atb-work/portal/`.
Use `npm run portal:report` to open the local browser report.

### Publish the portal

The [portal workflow](.github/workflows/portal.yml) checks pull requests and pushes to `main`.
It publishes `portal/generated/` only when the release version increases on `main` and all package checks pass.
The version in `.cursor-plugin/plugin.json` is the comparison source.
All six plugin manifests and the Claude marketplace versions must agree.

Before the first publication, select **Settings → Pages → Build and deployment → Source → GitHub Actions** in this repository.
Only the checked `portal/generated/` directory enters the Pages artifact.

Development and bug-fix work use the [shared TDD procedure](shared/contracts/references/test-driven-development.md)
for behavior changes, with focused unit tests and explicit coverage gaps.

Managed work can use the optional [task execution contract](shared/contracts/references/execution.md)
for compact context, structured results, and explicit caller ownership.
Its record checker validates declarations; the execution runtime still verifies evidence and controls transitions.

## Optional project-scoped compatibility install

The compatibility workflow uses one entry point: `./install.sh`.

Use `install.sh` when you specifically want project-local commands, templates,
workflow files, rules, or opt-in hooks in an existing repository. It is a
compatibility path and does not replace native plugin installation.

Choose:

1. One or more harnesses: `cursor`, `claude`, `codex`, or `all`
2. One or more packs: for example `phased-delivery`, `pr-review`, or `all`
3. A target project folder

```sh
./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>

./install.sh --harness cursor all /path/to/project
./install.sh --harness cursor,claude phased-delivery pr-review /path/to/project
./install.sh --harness codex bug-to-fix simplify /path/to/project
./install.sh --list
```

`phased-delivery` is the canonical pack and skill. The old
`dev-lite-workflow` pack selector remains an explicit compatibility alias;
its installed skill is `$phased-delivery`. The `/dev-*` command names remain
available as shortcuts for the new workflow.

The private [Auto Agent package](plugins/agent-toolbelt-auto-agent/README.md)
is excluded from the native plugin and `all` compatibility installs. Install it
explicitly only when needed:

```sh
./install.sh --harness all auto-agent-contract /path/to/project
```

The installer stores one copy of skills and support files under `.agents/`.
It migrates existing `.atb/` installs and stops if duplicate copies contain different edits.
Use `--dry-run` to preview the migration.

Cursor installs use one minimal routing rule. Project process rules belong to
the target repository. The former `--rules full` option is retired.
The generated `AGENTS.md` and `CLAUDE.md` blocks contain compact writing-rule and
skill pointers. Skills load their own references and templates when needed.

After install, open the target folder in your agent tool and run
`/workflow-router` from chat. Full compatibility mechanics, including
polyrepo `--sweep`, are in the [Installation](wiki/Installation.md) guide.

### First repository setup

Installing the packs makes the workflows available; it does not invent project
policy. Bootstrap these repository-owned files before relying on style-aware
implementation and review:

| File | Setup rule |
|---|---|
| Existing canonical style owner, or `STYLE_GUIDE.md` when none exists | Run `/style-guide-init`. Mine repository evidence, record the team's external baseline (for example, the Google TypeScript Style Guide), keep repo-specific TypeScript/React conventions local, and leave a new guide `Draft` until the team approves it. |
| `.pr-review.md` | Run `/pr-review-init`. Keep only priorities supported by repository evidence, then have the team prune and commit the draft to the base branch. |
| `AGENTS.md` for Cursor/Codex and `CLAUDE.md` for Claude Code | The installer creates or refreshes its compact entry instructions between markers. Preserve existing content and point to the canonical style owner instead of copying its rules. |

Do not pre-create empty product-discovery, QA test-case, threat-model, or
security-audit documents. Produce those from their templates only when real work
invokes the corresponding workflow. `.atb-work/pr-improve/` is generated,
gitignored scratch state and is never a repository policy file. See
[First repository setup](wiki/Installation.md#first-repository-setup) for the
completion checklist.

## Which path should I start with?

| Goal | Start with |
|---|---|
| Deliver a requirement or tickets as human-reviewed PRs | `phased-delivery` |
| Compare a product ask with current behavior and find gaps or missing questions | `shape-up` (gap review) |
| Turn a vague idea into an approved brief first | `shape-up` |
| Decide whether an opportunity is ready to shape | `product-discovery` |
| Answer an architecture question or write a design | `system-design` |
| Decide whether to do one technical backlog item | `tech-backlog-assessment` |
| Adapt a pattern that a ticket names to a new area | `ticket-discovery` |
| Review a design for threats, or audit implemented code | `threat-model`, `security-audit` |
| Establish repository coding conventions | `style-guide-init` |
| Run a deep code review on a PR or local diff | `pr-review` |
| Run a policy- or risk-driven pre-PR maintainability gate | `code-quality-gate` |
| Diagnose a bug before fixing it | `bug-to-fix` |
| Keep a long implementation safe across context resets | `phase-context-workflow` |
| Install the standard commands and workflows | `all` |

## Documentation

The [generated portal](portal/generated/index.html) owns discovery, taxonomy,
examples, and the common workflow map. The [wiki](wiki/Home.md) supplies essential
operational and compatibility instructions. `SKILL.md` remains the canonical behavior source.
Maintainer reports, project handoff documents, and evaluations stay outside the public repository.

Quick map:

| Page | Covers |
|---|---|
| [Installation](wiki/Installation.md) | Native plugin setup, `install.sh` compatibility path, harness selection, polyrepo `--sweep` |
| [Portal](portal/generated/index.html) | Searchable skill discovery, taxonomy, examples, workflows, and host invocation guidance |
| [Workflows](wiki/Workflows.md) | Phased Delivery, Phase Context, Bug to Fix, System Design, Product Discovery, Threat Model, Shape Up |
| [Code Review](wiki/Code-Review.md) | PR Review + triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](wiki/Utilities.md) | Code, test, security, and React utilities; release, worktree, handoff, and ticket sync |

## Packs

Packs are installable bundles. Most include slash commands, skills, templates,
or workflow docs.

Project-specific delivery processes belong to their project repositories.
See [What belongs here](#what-belongs-here) for ownership.

Run `./install.sh --list` to see each pack and its purpose.
The portal and the catalog list every skill and workflow.

## Repository layout

```text
agent-toolbelt/
  portal/generated/ offline discovery portal (catalog, examples, workflows)
  catalog/          canonical discovery metadata and tooling lifecycle audit
  install.sh        single installer entry point
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
  build-cursor-plugin.sh
                    assemble a private, user-scoped Cursor plugin from the packs
  commands/         slash commands and reusable command prompts
  skills/           agent skills with operating instructions
  plugins/agent-toolbelt-auto-agent/
                    Optional private Auto Agent plugin and compatibility pack
  optional/cursor-hooks/
                    Opt-in Cursor hook scripts + hooks.json (cursor-hooks pack)
  workflows/        multi-step workflow playbooks
  templates/        reusable starting files and Cursor rules
  examples/         worked reference material
```

Each major folder has a `README.md` describing what belongs there.

## License

MIT. See [LICENSE](LICENSE).

## Repository safety

This public repo is meant to contain reusable prompts, skills, workflow docs,
and templates only. Do not commit private project notes, internal planning
artifacts, cloned third-party repositories, customer data, credentials, or
workspace-specific scratch files.

Keep `docs/` and `evals/` out of commits and plugin packages.
Store durable private reports and project handoffs outside this repository.
Generate disposable maintainer reports under ignored `.atb-work/`.
Automated package checks and tests remain part of the maintained source.
