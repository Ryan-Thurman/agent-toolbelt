---
description: Tiered multi-agent PR/code review (light/standard/deep) — bugs, security, perf, tests, maintainability, standards
argument-hint: "[target] [--tier=light|standard|deep] [--focus=performance,…] [--comment]"
---

# /pr-review

Run the **pr-review** skill on the requested target.

**Arguments:** `$ARGUMENTS`

Parse them as:
- a **target** — PR URL, PR number, branch name, or empty (= review local working changes).
- an optional **`--tier=light|standard|deep`**. **If omitted, auto-select from the diff**
  (`skills/pr-review/references/auto-tier.md`): trivial/low-risk → light, hot-path/large → deep, else
  standard. An explicit `--tier` always wins; the token guardrail warns before spending deep on a
  trivial diff.
- an optional **`--focus=<facet[,facet]>`** — bias the run toward those facets (force them on, review
  them harder, surface first), orthogonal to tier (`skills/pr-review/references/repo-config.md`).
- an optional **`--comment`** — post findings as inline PR review comments (PR targets only;
  `skills/pr-review/references/posting.md`). Works on **GitHub (`gh`)** or **Azure Repos (`az`)** —
  detect the host first (`skills/pr-review/references/providers.md`); degrade to report-only if neither
  CLI is available. Outward-facing — confirm before posting unless clearly asked.

Before reviewing, load the target repo's **`.pr-review.md`** if present (from the base branch) for
per-project priorities — domain/scale context, always-run facets, budgets, severity overrides,
do-not-flag, minimum tier (`skills/pr-review/references/repo-config.md`).

Then follow the `pr-review` skill:
1. Resolve the target and acquire the diff (`skills/pr-review/references/targets-and-diff.md`).
2. Read the repo's `CLAUDE.md` / `AGENTS.md` for project standards.
3. Review the changed lines across all six facets per the rubric
   (`skills/pr-review/references/review-rubric.md`), applying the anti-noise rules.
4. Derive the verdict and print the markdown report
   (`skills/pr-review/references/output-format.md`).

For `--tier=standard`, run the multi-agent fan-out (`skills/pr-review/references/fan-out.md`): spawn
one facet sub-agent per dimension in parallel, aggregate + dedup, self-reflect critic, verdict + report.

For `--tier=deep`, run the deep orchestration (`skills/pr-review/references/deep-tier.md`): standard
fan-out + blast-radius + thermo-nuclear maintainability + spec-alignment + dual-judge verification
+ requirements coverage.

All multi-agent tiers consult the per-repo **rejection memory**
(`skills/pr-review/references/rejection-memory.md`): findings a prior run's judge refuted are
downranked and tagged `⟲ previously rejected`, never hidden.

This is a **review** — do not modify code unless explicitly asked afterward. Every run ends with the
token-usage footer (`skills/pr-review/references/output-format.md`).
