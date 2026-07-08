# Utilities

Cross-cutting tools that support the [delivery lanes](Workflows.md): cleanup,
test authoring, release, codebase-wide change, handoff, and tracker sync.

- [Simplify](#simplify) — active code cleanup plus detect-only smell scans.
- [Cover](#cover) — test authoring.
- [Ship It](#ship-it) — release readiness.
- [Retrofit](#retrofit) — one change across many sites.
- [Worktree](#worktree) — isolated worktrees for parallel agents.
- [CRAP Analysis](#crap-analysis) — complexity + coverage risk via repo-configured commands.
- [Handoff](#handoff) — resumable handoffs.
- [Ticket Sync](#ticket-sync) — publish tickets to a tracker.

## Simplify

The `simplify` tool is the active counterpart to `pr-review`: where review *finds* problems
and applies nothing, simplify *drives the cleanup* and applies it on opt-in.

```sh
./install.sh --harness all simplify /path/to/project
```

- `/simplify` — diff/feature-scoped: propose high-conviction cleanups (dead code, debug
  remnants, thin wrappers, reuse, small inefficiencies), then apply the ones you select.
  Every candidate must state `rootIssue -> consequence -> benefit`, and changes are
  behavior-preserving (existing tests must pass unmodified).
- `/code-smell` — detect-only scan of an area, ranked by severity × confidence; applies
  nothing. Use `/code-smell <path> --architecture` for no-code architecture/deepening
  candidates.

## Cover

The `cover` tool is the test-authoring lane — the active/detect pair that mirrors `simplify`. It
authors and strengthens **behavior-pinning** tests for a diff, a module, or a bug reproduction, and
turns a bug repro into a committed regression test. It writes tests only — it never edits production
code.

```sh
./install.sh --harness all cover /path/to/project
```

- `/cover` — author/strengthen tests for a diff, module, or bug reproduction, applied on opt-in.
  Tests pin observable behavior (not implementation); every new test is **falsified** (confirmed to
  fail when the behavior is broken); for a bug repro it writes the test that fails before the fix and
  passes after (a red→green regression lock). It detects the repo's test framework first and keeps
  tests deterministic (no real network/time/RNG, no flaky sleeps).
- `/cover-gaps` — detect-only scan of an area for missing/weak coverage (untested branches, error
  paths, boundary conditions, regressions waiting to happen), ranked by risk × likelihood; applies
  nothing and hands its top gaps to `/cover`.

It is the hand-off target from `bug-to-fix`: `/reproduce` establishes a manual or failing-test repro,
and `/cover` turns it into the committed regression test. `/ship-it`'s readiness checklist wants that
suite green.

## Ship It

The `ship-it` tool is the lightweight release step at the tail of the dev lanes — they end at
"PR merged," this takes it to "released safely."

```sh
./install.sh --harness all ship-it /path/to/project
```

Run `/ship-it` after a change is merged/approved. It produces a **go/no-go readiness check**, a
**rollback plan + trigger**, a **release-notes draft** (`.atb/templates/release-notes.md`), and a
**rollout/monitor plan** with advance/hold/roll-back thresholds.

It is **pipeline-aware**: when an external CI/CD pipeline you don't control owns the deploy (a
common org setup), `/ship-it` prepares the release package and **hands off** — it does not run
deploy steps, and frames the monitor plan as the watch-list for after the pipeline deploys. When
*you* own the deploy, it walks the staged rollout and proposes the exact commands, never executing
a deploy without explicit confirmation. It's the lightweight sibling of the regulated
`/release-manifest` + `/release-doc-check` path.

## Retrofit

The `retrofit` tool applies **one defined change across every site that needs it** — a library
swap (moment → dayjs), an API/symbol rename across N call sites, a framework upgrade, a pattern
replacement. It is *not* a database migration and does *not* decide what the change is.

```sh
./install.sh --harness all retrofit /path/to/project
```

`/retrofit` runs **discover → transform → verify**: enumerate every site (grep / AST / the rct graph
when available), classify mechanical vs. judgment, transform each in worktree isolation (a codemod
for the mechanical bulk), and verify exhaustively — full suite green, the judgment sites
adversarially checked, zero references to the old path before it's removed. Every site ends
`done` or `skipped (reason)` — no silent truncation.

It's a deterministic fan-out, so it maps onto the `Workflow` orchestration tool and is **explicitly
opt-in** (it can spawn many agents). Distinct from `/simplify`, which makes many small *different*
cleanups in a diff; retrofit makes the *same* change in *many* places.

## Worktree

The `worktree` tool gives **independent agents sharing one directory of repos** a safe way to
isolate work: **one worktree per task, on its own branch**, instead of a `git checkout` in one
checkout that yanks the branch out from under another agent.

```sh
./install.sh --harness all worktree /path/to/project
```

`/worktree new [repo] [branch]` creates a worktree on a new branch and prints the path to `cd` into;
omit the branch and it auto-names `agent/<repo|task>-<n>` so concurrent agents never collide (an
explicit name errors if taken). Worktrees live **outside** the repos at
`<parent>/.worktrees/<repo>/<branch-slug>`, so repos stay clean and `worktree list --all` shows every
agent's checkout across every repo. `worktree rm <branch> --delete-branch` tears one down (refusing a
dirty tree or unmerged branch without `--force`). Pure bash + git — no runtime.

Scope boundary: this is for **cross-session** work the harness can't coordinate. Parallel fan-out
*inside a single `Workflow` run* should use the tool's `isolation: 'worktree'` (auto-cleanup)
instead — the same discipline `retrofit` uses for its in-run transforms.

## CRAP Analysis

The `crap-analysis` tool orchestrates CRAP (complexity + coverage) checks using **commands the repo
defines** — no embedded analyzer, no language lock-in. A wizard hydrates `.crap-analysis.json`;
a bash orchestrator runs coverage and analysis **once** per invocation; review is **deterministic**.

```sh
./install.sh --harness all crap-analysis /path/to/project
```

- `/crap-config` — wizard: collect analysis, coverage, verify commands, output paths, threshold;
  write `.crap-analysis.json`.
- `/do-crap-analysis` — run on uncommitted changes: orchestrator `execute --changed`, read report
  JSON, apply fixed PASS/REFACTOR/ERROR templates. **Detect-only** — never edits source.
- `/crap-refactor` — apply-on-opt-in: read refactor brief, change source/tests, run verify once,
  re-review.

Config is loaded from the base branch (a working branch cannot silently weaken thresholds). When
CRAP exceeds threshold, the agent **must** read the refactor brief markdown into context before
prompting the user toward `/crap-refactor`.

## Handoff

The `handoff` tool is a small, cross-cutting capability: `/handoff` writes a resumable handoff so a
fresh agent — or a teammate — can continue work without context loss (the most common cause of
multi-session and multi-agent failure). Useful in any lane.

```sh
./install.sh --harness all handoff /path/to/project
```

It leads with the single concrete **next action**, references the lane's durable state file (the
bug-investigation file, the implementation plan, or the retrofit plan) instead of duplicating it,
captures what's been ruled out, redacts secrets, and stays compact. It's bundled with the
`bug-to-fix` pack and also installs standalone for the other lanes.

## Ticket Sync

The `ticket-sync` tool is a **provider-agnostic issue-tracker adapter**. The lanes already slice work
into tickets (`/refine-to-tickets`, `/to-issues`, `/bug-intake`) but only ever as local markdown or
GitHub Issues; `/ticket-sync` publishes those same ticket files to whichever tracker a repo declares
— **GitHub Issues, Jira, or Azure Boards** — so `/refine-to-tickets` can land its tickets in Jira
instead of staying as markdown. It mirrors how `pr-review` abstracts the gh-vs-az *host*; here the
abstraction is the *tracker*.

```sh
./install.sh --harness all ticket-sync /path/to/project
```

A target repo declares the tracker in a repo-local `.tickets.md` (copy `.atb/templates/tickets-config.md`)
— `provider`, the project/board key, default issue type, labels/components, and FIELD MAPPINGS from
the ticket-template fields (feature ID, release ID, acceptance criteria, dependencies, test
expectation, doc-delta status) to the tracker's fields. When absent, ticket-sync infers the provider
from the remote and asks for the project key.

`/ticket-sync` is **idempotent** — it records the created issue's key back into each ticket (a
`Tracker:` line) and on re-run **updates** rather than duplicating. It **never creates or modifies
remote issues without confirmation** (a dry-run preview first), takes credentials only from the
tracker CLI's own auth, and **degrades to a publish-ready manifest** when no tracker CLI/credentials
are present. Like pr-review, it loads `.tickets.md` from the base branch so a working branch can't
silently retarget publishing.
