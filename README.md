# agent-toolbelt

Reusable commands, skills, workflows, and templates for AI-assisted software
delivery.

Use this repo when you want to install a repeatable agent workflow into a
project instead of re-writing prompts and handoffs from scratch. The toolbelt
can install into Cursor, Claude Code, Codex-style skill folders, or all three.

Most packs fall into one of these jobs:

- Start new work: `product-discovery`, `shape-up`, `dev-lite-workflow`, `ai-feature-delivery`
- Investigate broken behavior: `bug-to-fix`, `ticket-discovery`
- Review and harden changes: `code-quality-gate`, `pr-review`, `pr-improve`, `pr-review-reply`, `phase-gate`
- Run agents unattended: `auto-agent-contract`
- Improve code or tests: `style-guide-init`, `simplify`, `test-case-design`, `cover`, `crap-analysis`, `retrofit`, `react-quality`
- Keep long work resumable: `phase-context-workflow`, `handoff`
- Prepare to ship: `ship-it`

## Quick start

Everything installs through one entry point: `./install.sh`.

Choose:

1. One or more harnesses: `cursor`, `claude`, `codex`, or `all`
2. One or more packs: for example `dev-lite-workflow`, `pr-review`, or `all`
3. A target project folder

```sh
./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>

./install.sh --harness cursor all /path/to/project
./install.sh --harness cursor --rules full all /path/to/pilot
./install.sh --harness cursor,claude dev-lite-workflow pr-review /path/to/project
./install.sh --harness codex bug-to-fix simplify /path/to/project
./install.sh --list
```

For Cursor, the default rule mode is `minimal`. It installs one small always-on
router rule that points the agent to the installed commands and skills. Use
`--rules full` only for dedicated pilot repos that should receive every pack's
detailed project rules as always-on Cursor context.

After install, open the target folder in your agent tool and run
`/workflow-router` from chat. Full install mechanics, including polyrepo
`--sweep` and the private Cursor plugin, are in the
[Installation](wiki/Installation.md) guide.

### First repository setup

Installing the packs makes the workflows available; it does not invent project
policy. Bootstrap these repository-owned files before relying on style-aware
implementation and review:

| File | Setup rule |
|---|---|
| Existing canonical style owner, or `STYLE_GUIDE.md` when none exists | Run `/style-guide-init`. Mine repository evidence, record the team's external baseline (for example, the Google TypeScript Style Guide), keep repo-specific TypeScript/React conventions local, and leave a new guide `Draft` until the team approves it. |
| `.pr-review.md` | Run `/pr-review-init`. Keep only priorities supported by repository evidence, then have the team prune and commit the draft to the base branch. |
| `AGENTS.md` for Cursor/Codex and `CLAUDE.md` for Claude Code | The installer creates or refreshes its marker-delimited workflow block. Preserve existing content and point to the canonical style owner instead of copying its rules. |

Do not pre-create empty product-discovery, QA test-case, threat-model, or
security-audit documents. Produce those from their templates only when real work
invokes the corresponding workflow. `.atb-work/pr-improve/` is generated,
gitignored scratch state and is never a repository policy file. See
[First repository setup](wiki/Installation.md#first-repository-setup) for the
completion checklist.

## Which path should I start with?

| Goal | Start with |
|---|---|
| Build a normal feature with lightweight structure | `dev-lite-workflow` |
| Turn a vague idea into an approved brief first | `shape-up` |
| Decide whether an opportunity is ready to shape | `product-discovery` |
| Establish repository coding conventions | `style-guide-init` |
| Run a deep code review on a PR or local diff | `pr-review` |
| Run the required pre-PR maintainability and anti-slop gate | `code-quality-gate` |
| Diagnose a bug before fixing it | `bug-to-fix` |
| Keep a long implementation safe across context resets | `phase-context-workflow` |
| Install every available command and workflow | `all` |

## Documentation

The [wiki](wiki/Home.md) is the deep dive. Quick map:

| Page | Covers |
|---|---|
| [Installation](wiki/Installation.md) | `install.sh`, harness selection, polyrepo `--sweep`, private Cursor plugin |
| [Workflows](wiki/Workflows.md) | Dev Lite, Phase Context, AI Feature Delivery, Bug to Fix, Shape Up |
| [Code Review](wiki/Code-Review.md) | PR Review + triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](wiki/Utilities.md) | Simplify, Cover, Ship It, Retrofit, Handoff, Ticket Sync |
| [Phase → Command Map](docs/phase-command-map.md) | Which commands each workflow phase uses (Mermaid diagrams) |
| [docs/tutorial.md](docs/tutorial.md) | Guided first install and first feature walkthrough |
| [Release Versioning](docs/release-versioning.md) | Repo release hygiene: license, changelog, and tag version policy |

## Packs

Packs are installable bundles. Most include slash commands, skills, templates,
or workflow docs.

| Pack | What it does |
|---|---|
| `pr-review` | Tiered, multi-agent pull-request and diff review. |
| `code-quality-gate` | Pre-PR gate: repository checks plus standards, maintainability, naming, deterministic diff evidence, and bounded fix/rereview. |
| `pr-improve` | Bounded finding-fix-rereview loop with a frozen scope and stable ledger. |
| `pr-review-reply` | Round-trip half of `pr-review`: triage and answer a reviewer's PR threads (posting opt-in). |
| `review-on-open` | Trigger layer: auto-review on PR open/update, via GitHub Actions event or a host-agnostic poller. |
| `review-queue` | Local, SQLite-backed work queue — a producer enqueues a PR, a worker runs `/pr-review --comment`. |
| `phase-gate` | In-loop trigger: at each phase boundary a fresh subagent reviews the PR (team stop / solo merge). |
| `auto-agent-contract` | Rules for an orchestrator *outside* the harness that shells into agent CLIs: invocation, convergence, merge, unattended mode, Dev Lite jobs, `/auto-agent-plan`. |
| `bug-to-fix` | Diagnostic lane: triage → reproduce → root-cause → minimal fix → verify. |
| `dev-lite-workflow` | Lightweight dev loop: brief → plan → task → commit → phase review → final-coverage code-quality-gate PASS → final PR review. |
| `phase-context-workflow` | Durable phase files, handoffs, and context packets for safe `/clear` / `/compact`. |
| `ai-feature-delivery` | Traceable feature delivery: design docs, tickets, tests, QA handoff, release docs. |
| `shape-up` | Interrogate a vague request into an agreed brief before building. |
| `product-discovery` | Evidence-led opportunity discovery before shaping a candidate feature. |
| `style-guide-init` | Mine repository evidence into a canonical coding-style guide or update. |
| `tech-backlog-assessment` | Decide whether and how to do technical backlog items before implementation. |
| `ticket-discovery` | Find a referenced precedent for a narrow ticket and produce a concrete gap/test handoff. |
| `simplify` | Active cleanup plus `/code-smell` detect-only scans, including architecture/deepening candidates. |
| `vercel-composition-patterns` | Conditional MIT-licensed React component API and composition references from Vercel Labs. |
| `vercel-react-best-practices` | Conditional MIT-licensed React/Next.js performance references from Vercel Labs. |
| `react-quality` | Convenience bundle that installs both Vercel React specialists; it adds no separate policy. |
| `cover` | Author/strengthen behavior-pinning tests + a detect-only coverage-gap scan. |
| `test-case-design` | Report-only, prioritized QA test-case design that hands selected cases to test authors. |
| `threat-model` | Design-time security model: assets, trust boundaries, abuse paths, mitigations, verification. |
| `security-audit` | Bounded read-only code/config/dependency/secret-exposure security audit. |
| `webapp-testing` | Browser/webapp verification: `/webapp-test` smoke checks, Playwright runs, QA evidence. |
| `ship-it` | Lightweight release readiness: go/no-go, rollback plan, release notes, rollout plan. |
| `retrofit` | Apply one defined change across every site that needs it — discover, transform, verify. |
| `worktree` | Isolated git worktrees so parallel agents share a polyrepo dir without clobbering each other's branch. |
| `crap-analysis` | CRAP analysis via repo-configured commands: wizard setup, single-run orchestration, deterministic review, opt-in refactor. |
| `ticket-sync` | Provider-agnostic adapter: publish tickets to GitHub Issues, Jira, or Azure Boards. |
| `handoff` | Cross-cutting `/handoff` that writes a resumable handoff so a fresh agent can continue. |
| `cursor-hooks` | Project-level Cursor hooks: doc-sync gate on `git commit`, `/pr-review` nudge on `git push`. |

## Repository layout

```text
agent-toolbelt/
  install.sh        single installer entry point
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
  build-cursor-plugin.sh
                    assemble a private, user-scoped Cursor plugin from the packs
  docs/             user-facing setup and usage docs
  commands/         slash commands and reusable command prompts
  skills/           agent skills with operating instructions
  hooks/            Cursor hook scripts + hooks.json (cursor-hooks pack)
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
