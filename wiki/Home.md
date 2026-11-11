# agent-toolbelt wiki

Agent Toolbelt is an independent, general-purpose collection of reusable
skills for software delivery. It has no AI-SDLC or team-workspace dependency.

The [README](../README.md) is the concise entry point and the
[generated portal](../portal/generated/index.html) owns discovery, taxonomy,
examples, and the common workflow map. This wiki is the deeper operational and
compatibility guide. Individual `SKILL.md` files remain canonical for behavior;
commands and hooks are optional project-scoped compatibility surfaces.

## Pages

| Page | Covers |
|---|---|
| [Installation](Installation.md) | `install.sh`, cross-host skills plugin, harness selection, polyrepo `--sweep` |
| [Workflows](Workflows.md) | Phased Delivery, Phase Context, Bug to Fix, System Design, Product Discovery, Threat Model, Shape Up |
| [Code Review](Code-Review.md) | Code Quality Gate, PR Review, PR Improve and triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](Utilities.md) | Code, test, security, and React utilities; release, worktree, handoff, and ticket sync |

## What's included

The [generated portal](../portal/generated/index.html) lists every skill, with its purpose and examples.
Run `./install.sh --list` to see each installable pack.

`phased-delivery` owns shared implementation and PR boundaries.
`bug-to-fix` owns defect diagnosis. Project repositories own their lifecycle
records and approvals. Review, test, and release methods remain shared Toolbelt skills.

## Repository layout

```text
agent-toolbelt/
  portal/generated/ offline discovery portal (catalog, examples, workflows)
  catalog/          canonical discovery metadata and tooling lifecycle audit
  install.sh        single installer entry point (./install.sh --harness <list> <pack...> <target>)
  install/          per-pack file lists (install/<pack>.sh) + shared install/lib.sh
  build-cursor-plugin.sh  assemble a private, user-scoped Cursor plugin from the packs
  commands/         slash commands and reusable command prompts
  skills/           agent skills with operating instructions
  optional/cursor-hooks/
                    Opt-in Cursor hook scripts + hooks.json (cursor-hooks pack)
  workflows/        multi-step workflow playbooks
  templates/        reusable starting files and Cursor rules
  examples/         worked reference material
```

Each major folder has a `README.md` describing what belongs there.

## Repository safety

This public repo is meant to contain reusable prompts, skills, workflow docs,
and templates only. Do not commit private project notes, internal planning
artifacts, cloned third-party repositories, customer data, credentials, or
workspace-specific scratch files.
