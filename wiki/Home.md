# agent-toolbelt wiki

Agent Toolbelt is an independent, general-purpose collection of reusable
skills for software delivery. It has no AI-SDLC or team-workspace dependency.

The [README](../README.md) is the concise entry point and the
[generated portal](../portal/generated/index.html) owns discovery, taxonomy,
examples, and the common workflow map. This wiki is the deeper operational and
compatibility guide. Individual `SKILL.md` files remain canonical for behavior.
Commands and hooks are optional project-scoped compatibility surfaces.

## Pages

| Page | Covers |
|---|---|
| [Installation](Installation.md) | Native plugin setup, `install.sh`, harness selection, polyrepo `--sweep`, Cursor routing rule, first repository setup |
| [Workflows](Workflows.md) | Phased Delivery, Phase Context, Bug to Fix, System Design, Production Readiness, Incident Follow-Up, Product Discovery, Threat Model, Shape Up, Story Refinement, Risk-Based Testing |
| [Code Review](Code-Review.md) | PR Review, Code Quality Gate, PR Improve, and the triggers: Review Reply, Review on Open, Review Queue, Phase Gate, Cursor Hooks |
| [Utilities](Utilities.md) | Style Guide Init, Test Case Design, BDD Scenarios, Security Audit, Simplify, React quality specialists, Cover, Ship It, Retrofit, Worktree, CRAP Analysis, Handoff, Ticket Sync |

## What is included

The [generated portal](../portal/generated/index.html) lists every skill, with its purpose and examples.
Run `./install.sh --list` to see each installable pack.

`phased-delivery` owns shared implementation and PR boundaries.
`bug-to-fix` owns defect diagnosis. Project repositories own their lifecycle
records and approvals. Review, test, and release methods remain shared Toolbelt skills.

See the [repository layout](../README.md#repository-layout) and [repository safety](../README.md#repository-safety) sections of the README.
