<!--
  Copy this to the ROOT of a repo you review as `.pr-review.md` (or `.claude/pr-review.md`).
  It tells the pr-review tool what matters in THIS codebase: the "priorities" axis, separate from
  the light/standard/deep depth tiers. Every section is optional. Delete what you do not need.
  Loaded from the BASE branch (a PR cannot relax its own review). Full contract:
  agent-toolbelt/skills/pr-review/references/repo-config.md
-->

## Context
<!-- Free text injected into every facet reviewer: the domain, scale targets, what "good" means. -->
This service targets 1M concurrent users. Latency and resource bounds are first-class: a change that
does not scale is a real defect here, not a nit.

## Always run
<!-- Facets run on every PR regardless of tier or change signal (union with auto-selected + --focus). -->
- performance
- security

## Emphasis
<!-- Facets to weight harder: review deeper, lower the reporting threshold, surface first. -->
- performance

## Budgets
<!-- Concrete bars the reviewers cite — turn vague "perf" into testable lines. -->
- No unbounded queries or result sets on request paths. Paginate or stream.
- No N+1 access patterns. Batch or join.
- No synchronous I/O or heavy compute on hot request paths. Precompute or make it async.
- p99 request latency target: 150ms.

## Severity overrides
<!--
  Re-rate matching findings (applied host-side, after aggregation, so it is auditable). Use this to
  PIN the bug classes this repo has actually been burned by, so a single reviewer's grading cannot
  bury them behind a louder blocker. The tool already floors runtime/security consequences at
  should-fix. These rules make that a guarantee for your hot classes, not just a tendency.
-->
- performance findings on hot paths (`*/api/*`, `*/handlers/*`) -> blocker
- missing input validation on a request/handler path (`*/api/*`, `*/handlers/*`, `*/routes/*`) -> blocker
- missing input validation anywhere in production source -> should-fix (minimum)
- unguarded division / array or string index from caller-supplied values -> should-fix (minimum)
- missing test for a new public function -> should-fix (minimum)

## Do not flag
<!-- Accepted patterns / known false positives to suppress (also stop recurring noise). -->
- Direct `console.*` in `scripts/` and `*.dev.ts`.
- The bespoke `retryWithBackoff` wrapper: intentional, not a "thin wrapper".

## Risk areas
<!--
  Code where a defect has high impact. A diff that touches one gets at least the standard tier, and
  each facet lowers its reporting threshold on those paths. test-case-design uses the same list to
  set test priority. Draft it with /risk-areas. Format: agent-toolbelt/shared/contracts/references/risk-areas.md
-->
- **Access control**: A defect can show one clinic's records to another clinic.
  - Paths: `src/auth/**`, `src/roles/**`
- **Data export**: A defect can send personal data to the wrong recipient.
  - Paths: `src/export/**`

## Minimum tier
<!-- Floor for auto-tiering: light | standard | deep. Auto-selection never drops below it. -->
- standard
