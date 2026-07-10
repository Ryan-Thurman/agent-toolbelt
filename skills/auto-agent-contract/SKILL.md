---
name: auto-agent-contract
description: Rules for an orchestrator that shells into agent CLIs to code and review with nobody watching — safe invocation, output parsing, least privilege, review-loop convergence, merge preconditions, and the agent-runner plan format.
---

# auto-agent-contract

Every other pack in this toolbelt assumes an agent running **inside** a harness (Claude Code,
Cursor), with a Task tool and a person nearby to confirm, overrule, and merge. This pack is for the
opposite arrangement: a program **outside** the harness that shells into agent CLIs (`claude -p`,
`codex exec`, `agy -p`), reads what comes back on stdout, and decides what happens next with nobody
watching.

That seam is where the failures live. The rules here are each derived from a specific production
failure in [`agent-runner`](#the-reference-implementation), a local Python orchestrator that runs a
plan through disposable coding and review agents.

> **This pack adds no review logic.** The reviewer is the `pr-review` pack, which already emits a
> structured finding list (`skills/pr-review/references/finding-schema.md`) and a **host-derived**
> verdict computed mechanically from bucket counts (`skills/pr-review/references/output-format.md`).
> Those two files are the orchestrator's input contract. This pack is what you do on either side of
> them: how to *invoke* the reviewer safely, and what to do with its findings when no human will read
> them.

## Scope

Read this pack when you are building, debugging, or auditing a loop where an agent CLI is spawned as
a subprocess. It is **not** for in-harness work — `phase-gate` is the in-harness sibling (a subagent
reviews at a phase boundary, with a human in the session).

| You are… | Read |
|---|---|
| spawning an agent CLI as a subprocess | `references/invocation.md` |
| deciding whether a review loop should run another round | `references/convergence.md` |
| about to merge a PR an agent authored and reviewed | `references/merge.md` |
| deciding what changes when no human is present | `references/unattended.md` |
| writing a plan for `agent-runner` to execute | `references/plan-format.md` |
| running Dev Lite-style implement/fix/review jobs with a caller-owned immutable plan | `$auto-agent-dev-lite` |

## Principles (always)

- **The prompt is one argv entry, and argv is bounded.** `execve` caps argv **plus environ** at 1 MiB
  on macOS. A diff belongs in the agent's hands, not in its command line — pass the PR reference and
  let the agent fetch its own diff. See `references/invocation.md`.
- **Truncate loudly or not at all.** A silently truncated prompt produces a confident review of code
  the reviewer never saw. Every bound announces itself in-band and points at the full text on disk.
- **Parsing agent output is adversarial, not cooperative.** The agent narrates prose around its JSON,
  wraps it in envelopes, and — if you let it — echoes back the previous run's verdict. Extraction has
  to fail closed. See `references/invocation.md`.
- **Least privilege is a security property, not a tidiness one.** A reviewer holding `Bash(gh:*)` can
  approve and merge the pull request it is reviewing. Scope the allowlist to read verbs.
- **Headless denials abort; they do not prompt.** A permission check a headless agent cannot ask about
  is **denied**, and the job dies. Write roles must pre-allow the commands they need.
- **Never let a model decide a verdict or a merge.** Both are computed from findings by the
  orchestrator (`skills/pr-review/references/output-format.md`). The model supplies evidence; the host
  supplies judgment.
- **Bound every loop with an explicit terminal state.** "Retry until clean" is not a termination
  condition. A fix round that cannot converge must land in `BLOCKED` and escalate to a human, not
  spin. See `references/convergence.md`.
- **Do the work at the layer that can see it.** The recurring root cause across `agent-runner`'s
  history: *the runner was doing work on the agents' behalf that the agents are better placed to do
  themselves.* Prefer giving an agent the context to decide over deciding for it.

## The reference implementation

`agent-runner` is a local Python 3 CLI that drives a markdown plan through `IMPLEMENT → REVIEW →
FIX → CLOSE_PHASE → MERGE` per phase, one PR per phase, with state in SQLite. Every rule in this pack
cites the commit that earned it. When a rule and the runner disagree, the runner is the source of
truth — it is executable and this is prose.

The plan it consumes is a specific markdown serialization parsed by regex. Write one with
**`/auto-agent-plan`** (`references/plan-format.md`), which mines the repo for phases rather than
starting from a blank template.

## References

- `references/invocation.md` — argv bounds, structured-output extraction, per-CLI flag semantics, and
  the reviewer privilege boundary.
- `references/convergence.md` — the ratchet, no-op fix detection, and bounded attempts with an
  explicit escalate state.
- `references/merge.md` — the three-check close precondition, host-API eventual consistency, and
  already-merged-is-success.
- `references/unattended.md` — what changes when nobody reads the report: advisory tags become gates.
- `references/plan-format.md` — the `agent-runner` plan serialization contract (`/auto-agent-plan`).
- `skills/pr-review/references/finding-schema.md` — the structured finding the reviewer emits.
- `skills/pr-review/references/output-format.md` — mechanical verdict derivation from bucket counts.
- `skills/phase-gate/SKILL.md` — the in-harness sibling: subagent review at a phase boundary.
