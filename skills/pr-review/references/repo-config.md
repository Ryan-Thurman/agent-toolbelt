# Per-repo review config (`.pr-review.md`)

Tiers say *how hard to look*; this file says *what matters in this codebase*. A target repo can ship
an optional `.pr-review.md` that the orchestrator discovers and threads into the review — domain
context (e.g. "this service targets 1M concurrent users"), which facets always run, concrete budgets,
accepted patterns to stop flagging, severity overrides, and a minimum tier. It lives **in the repo
being reviewed**, versioned with the code it governs, so it travels to every clone/host
(GitHub, Azure, local) with no coupling to this toolbelt.

This is the **priorities** axis, orthogonal to tier (depth) and `--focus` (per-run emphasis).

## Discovery (in the *target* repo)

First file found wins:
1. `.pr-review.md` (repo root)
2. `.claude/pr-review.md`

If none exists, the review runs exactly as today — the config is purely additive (though when the
run hits a situation the config would have solved, the report footer may nudge once toward
`/pr-review-init`; conditions in `output-format.md`, generation recipe in `config-init.md`). The repo's
`CLAUDE.md`/`AGENTS.md` are still loaded as general standards regardless; `.pr-review.md` is the
**review-specific** layer on top (use it when you want review priorities separated from agent
instructions, or richer structure than a CLAUDE.md section).

## Trust & hardening (load from the BASE, not the PR head)

`.pr-review.md` is **trusted** (committed by the team, like CI config) — unlike the diff, which is
untrusted. But a PR could try to weaken its own review by editing the config in the same change. So:

- **Load the config as it exists on the base/target branch**, not the PR head:
  ```bash
  base="$(…)"                              # the resolved base (targets-and-diff.md)
  git show "$base:.pr-review.md" 2>/dev/null || git show "$base:.claude/pr-review.md" 2>/dev/null
  ```
  For local/branch review, read it from the merge-base. The config *in effect* is the one already
  approved on the target branch — a PR cannot relax the rules that judge it.
- **If the PR modifies `.pr-review.md`**, do **not** honor the new version; instead surface it as a
  `standards` finding ("this PR changes the review config — review the change on its own merits")
  so a human approves the policy change separately. (The reviewer-safety rule in `_shared.md` still
  applies to any instructions embedded in the diff.)

## Sections (all optional; lenient markdown)

The orchestrator and facet agents are LLMs — write it as readable markdown, not strict schema. Missing
sections just mean "no override". Recognized headings:

```markdown
## Context
Free text injected verbatim into every facet agent. The domain, scale targets, what "good" means here.
> This service targets 1M concurrent users. Latency and resource bounds are first-class.

## Always run
Facets to run on every PR regardless of change signal or tier (union with auto-selected + --focus).
- performance
- security

## Emphasis
Facets to weight harder — go deeper, lower the reporting threshold a notch, raise prominence.
- performance

## Budgets
Concrete bars the facets cite as the standard (turn vague "perf" into a testable line):
- No unbounded queries or result sets on request paths; paginate/stream.
- No N+1; batch or join.
- No sync I/O / heavy compute on hot paths; precompute or make async.
- p99 request latency target: 150ms.

## Severity overrides
Re-rate findings that match a rule (applied host-side after aggregation, so it's auditable):
- performance findings on hot paths (`*/api/*`, `*/handlers/*`) → blocker
- missing test for a new public function → should-fix (min)

## Do not flag
Accepted patterns / known false positives to suppress (drops matching findings post-aggregation):
- Direct `console.*` in `scripts/` and `*.dev.ts`.
- The bespoke `retryWithBackoff` wrapper (intentional, not a "thin wrapper").

## Minimum tier
A floor for auto-tiering (light | standard | deep). Auto-selection never drops below it.
- standard
```

## How each section is applied

| Section | When | Where (host vs agent) |
|---|---|---|
| Context | facet fan-out | **injected** into every facet prompt (verbatim) |
| Budgets | facet fan-out | injected into every facet prompt (cited as the bar) |
| Emphasis | facet selection + fan-out | forces facet on; instructs it to go deeper + lower threshold |
| Always run | facet selection | facet set = auto-selected ∪ always-run ∪ `--focus` |
| Minimum tier | tier resolution (`auto-tier.md`) | raises the auto-selected default to the floor |
| Severity overrides | aggregation/threshold | **host-side** re-rate after findings return (auditable) |
| Do not flag | aggregation/threshold | host-side suppression after findings return (auditable) |

Apply **Context/Budgets/Emphasis inside the agents** (they shape what gets found) but **Severity
overrides / Do-not-flag host-side, after aggregation** — never let a single facet agent silently
self-suppress; the suppression should be visible and reversible in the orchestrator.

## Precedence

Explicit beats policy beats default:

1. **Explicit CLI flags** (`--tier`, `--focus`) — always win. An explicit `--tier` *below* the repo
   **Minimum tier** is honored but **warned** ("repo floor is standard; you forced light"), same
   posture as the token guardrail (`auto-tier.md`).
2. **Repo config** (`.pr-review.md`) — raises the floor, forces facets, sets budgets/overrides.
3. **Auto/defaults** — diff-derived tier, change-signal facet selection.

## Auditability

When the config changed anything, say so in the report footer so it's never silent:

```markdown
_repo-config: .pr-review.md · forced facets: performance, security · 1 finding re-rated (hot-path → blocker) · 2 suppressed (do-not-flag)_
```

If the config is malformed/unreadable, note it in one line and proceed as if absent — never block a
review on a bad config.

## Recipe: never let a runtime-risk finding get suppressed

The rubric already floors concrete runtime/security consequences at **should-fix** before nits are
hidden (`review-rubric.md` → severity floors; applied in every facet via `facets/_shared.md`). That
floor is a *tendency*, not a guarantee — a borderline finding can still be graded `nit` by one agent
and then suppressed because a clear blocker is present in the same diff. When a repo has a class of
issue it has been **burned by in real PRs** (the common one: missing input validation that ships, then
crashes or returns garbage), pin it host-side so a single agent's grading can't bury it:

```markdown
## Severity overrides
- missing input validation on a request/handler path (`*/api/*`, `*/handlers/*`, `*/routes/*`) → blocker
- missing input validation anywhere in production source → should-fix (min)
- unguarded division / array or string index from caller-supplied values → should-fix (min)
```

Why this is robust where the in-agent floor alone is not:

- **Host-side, after aggregation.** The re-rate runs in the orchestrator on the merged findings, so it
  fires even if the facet agent under-graded — it's the backstop *below* the agent's own calibration.
- **It runs before the posting threshold.** A finding raised to `should-fix`/`blocker` is no longer a
  `nit`, so the "hide nits when blockers exist" rule can't suppress it.
- **It's auditable.** Every re-rate shows up in the footer (`1 finding re-rated …`), so a human can
  see the policy fired and reverse it — unlike a silent self-suppression inside one agent.

Keep the rule **specific** (path globs + a named condition) so it re-rates the real class and not
every defensive nit. Pair it with a `## Minimum tier: standard` floor so these diffs never auto-pick
light (the tier with the least reachability context). See `auto-tier.md` for the production-logic
floor that already nudges logic diffs to standard.

## See also

- `templates/pr-review.md` — a copyable starter to drop into a target repo.
- `config-init.md` — draft the config from repo evidence instead of the blank starter (`/pr-review-init`).
- `auto-tier.md` — tier resolution (Minimum tier plugs in here).
- `fan-out.md` / `deep-tier.md` — where Context/Budgets/Emphasis/Always-run are wired in.
