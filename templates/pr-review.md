<!--
  Copy this to the ROOT of a repo you review as `.pr-review.md` (or `.claude/pr-review.md`).
  It tells the pr-review tool what matters in THIS codebase — the "priorities" axis, separate from
  the light/standard/deep depth tiers. Every section is optional; delete what you don't need.
  Loaded from the BASE branch (a PR can't relax its own review). Full contract:
  agent-toolbelt/skills/pr-review/references/repo-config.md
-->

## Context
<!-- Free text injected into every facet reviewer: the domain, scale targets, what "good" means. -->
This service targets 1M concurrent users. Latency and resource bounds are first-class — a change that
doesn't scale is a real defect here, not a nit.

## Always run
<!-- Facets run on every PR regardless of tier or change signal (union with auto-selected + --focus). -->
- performance
- security

## Emphasis
<!-- Facets to weight harder: review deeper, lower the reporting threshold, surface first. -->
- performance

## Budgets
<!-- Concrete bars the reviewers cite — turn vague "perf" into testable lines. -->
- No unbounded queries or result sets on request paths; paginate or stream.
- No N+1 access patterns; batch or join.
- No synchronous I/O or heavy compute on hot request paths; precompute or make it async.
- p99 request latency target: 150ms.

## Severity overrides
<!-- Re-rate matching findings (applied host-side, after aggregation, so it's auditable). -->
- performance findings on hot paths (`*/api/*`, `*/handlers/*`) → blocker
- missing test for a new public function → should-fix (minimum)

## Do not flag
<!-- Accepted patterns / known false positives to suppress (also stop recurring noise). -->
- Direct `console.*` in `scripts/` and `*.dev.ts`.
- The bespoke `retryWithBackoff` wrapper — intentional, not a "thin wrapper".

## Minimum tier
<!-- Floor for auto-tiering: light | standard | deep. Auto-selection never drops below it. -->
- standard
