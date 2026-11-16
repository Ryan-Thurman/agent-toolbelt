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
| Optional unattended workflows and reusable personal workflows | Agent Toolbelt, and optional packages can have separate installation choices |
| Project forms, required approvals, internal references, and workspace automation | The project repository |
| Project adaptations of shared workflows | The project repository, and shared methods retain their Toolbelt source |

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

The portal has four pages: the skill library (`index.html`), `workflows.html`, `use-cases.html`, and `setup.html`.
The build puts each fragment in `portal/src/pages/` into `portal/src/layout.html`, which holds the header, the footer, and the skill dialog.
To add a page, add a fragment and an entry in `PAGES` in `scripts/build-portal.js`, and a link in the layout navigation.

For screenshots of both themes at desktop and mobile sizes, run
`npm run portal:screenshots`. Generated reports stay under ignored `.atb-work/portal/`.
Use `npm run portal:report` to open the local browser report.

### Publish the portal

The [portal workflow](.github/workflows/portal.yml) checks pull requests and pushes to `main`.
It publishes `portal/generated/` only when the release version increases on `main` and all package checks pass.
The version in `.cursor-plugin/plugin.json` is the comparison source.
All six plugin manifests and the Claude marketplace versions must agree.

Before the first publication, select **Settings -> Pages -> Build and deployment -> Source -> GitHub Actions** in this repository.
Only the checked `portal/generated/` directory enters the Pages artifact.

Development and bug-fix work use the [shared TDD procedure](shared/contracts/references/test-driven-development.md)
for behavior changes, with focused unit tests and explicit coverage gaps.

Managed work can use the optional [task execution contract](shared/contracts/references/execution.md)
for compact context, structured results, and explicit caller ownership.
Its record checker validates declarations, but the execution runtime still verifies evidence and controls transitions.

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
`dev-lite-workflow` pack selector remains an explicit compatibility alias.
Its installed skill is `$phased-delivery`. The `/dev-*` command names remain
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
`/workflow-router` (installed with `phased-delivery` or `all`) from chat. Full compatibility mechanics, including
polyrepo `--sweep`, are in the [Installation](wiki/Installation.md) guide.

### First repository setup

Installing the packs does not create repository policy. Run `/style-guide-init` and `/pr-review-init`
to draft the style guide and `.pr-review.md` from repository evidence.
The [First repository setup](wiki/Installation.md#first-repository-setup) guide lists every file and the completion checklist.

## Which path do I start with?

<!-- BEGIN routing table -->
<!-- Generated from commands/workflow-router.md by scripts/build-routing-tables.js. Do not edit. -->

| Task | Shared owner |
| --- | --- |
| Synthesize customer research | `user-research-synthesis` |
| Decide whether an opportunity is ready to shape, or select an opportunity or experiment | `product-discovery` |
| Assess customer outcomes after an experiment or release | `product-outcome-review` |
| Discover maintenance work across a repository | `tech-debt-discovery` |
| Answer architecture questions or design a system | `system-design` (it runs `threat-model` for a design proposal) |
| Review the threats of a design before it is built | `threat-model` |
| Audit existing code for security problems | `security-audit` |
| Review the reliability of a design, or run a production readiness review | `reliability-review` |
| Plan failure scenarios or staging chaos experiments | `failure-scenario-design` |
| Check that a built service is ready to launch | `workflows/production-readiness-workflow.md` |
| Follow up a mitigated incident with a fix and tests | `workflows/incident-follow-up-workflow.md` |
| Compare a product ask with current behavior (gap review), shape a vague idea into an approved brief, or slice an approved brief into tickets | `shape-up` |
| Refine a ticket or story, write Given/When/Then criteria, or check story readiness | `story-refinement` |
| Write or review Gherkin feature files, or set up a BDD runner | `bdd-scenarios` |
| Plan, review, or deliver approved requirements or tickets as human-reviewed PRs | `phased-delivery` |
| Take one feature from a raw idea to an accepted release, with gates and human approvals | `workflows/idea-to-release-workflow.md` |
| Reproduce and repair a defect | `bug-to-fix` |
| Decide whether to do one technical backlog item, or assess a dependency | `tech-backlog-assessment` |
| Adapt a pattern that a ticket names to a new area | `ticket-discovery` |
| Find the high-impact paths of a repository or a folder of repositories for risk-based testing | `risk-area-mapping` |
| Design test cases, write tests, or verify a browser flow | `test-case-design`, `cover`, or `webapp-testing` |
| Review a pull request or a local diff | `pr-review` |
| Check that a branch is ready to open as a PR | `pr-review` (`/pr-ready-check`) |
| Fix accepted review findings, or answer a human reviewer's threads | `pr-improve` or `pr-review-reply` |
| Run a policy- or risk-driven pre-PR maintainability gate | `code-quality-gate` |
| Clean up code with small behavior-preserving changes | `simplify` |
| Apply one defined change across many sites | `retrofit` |
| Review a phase PR at a phase boundary | `phase-gate` |
| Review PRs automatically when they open or from a queue | `review-on-open` or `review-queue` |
| Keep a long task safe across context resets | `phase-context-workflow` |
| Set up or refresh repository conventions | `style-guide-init` |
| Publish tickets to a tracker | `ticket-sync` |
| Measure complexity and coverage risk | `crap-analysis` |
| Isolate parallel agents in one repository | `worktree` |
| Prepare a release | `ship-it` |
| Write a resumable handoff | `handoff` |
| Review the delivery process after completed work | `workflows/delivery-retrospective-workflow.md` |
| Report the codebase friction that slowed a task or a feature | `papercuts` |
<!-- END routing table -->

To install the standard commands and workflows, use the pack `all`.

## Documentation

The [generated portal](portal/generated/index.html) owns discovery, taxonomy,
examples, and the common workflow map. The [wiki](wiki/Home.md) supplies essential
operational and compatibility instructions. `SKILL.md` remains the canonical behavior source.
Maintainer reports, project handoff documents, and evaluations stay outside the public repository.

The [wiki home page](wiki/Home.md) lists every wiki page and what it covers.

## Packs

Packs are installable bundles. Most include slash commands, skills, templates,
or workflow docs.

Project-specific delivery processes belong to their project repositories.
See [What belongs here](#what-belongs-here) for ownership.

Run `./install.sh --list` to see each pack and its purpose.
The catalog lists every skill and the 10 cross-skill workflows. `workflows/README.md` lists every playbook file.

## Repository layout

```text
agent-toolbelt/
  portal/generated/ offline discovery portal (catalog, examples, workflows)
  catalog/          canonical discovery metadata and tooling lifecycle audit
  install.sh        single installer entry point
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
  build-cursor-plugin.sh
                    assemble a private, user-scoped Cursor plugin from the packs
  shared/           shared contracts and references that skills load
  scripts/          catalog, portal, and release build and check scripts
  wiki/             operational and compatibility guides
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

The `commands/`, `skills/`, `workflows/`, `templates/`, and `examples/` folders each have a `README.md` that describes what belongs there.

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
