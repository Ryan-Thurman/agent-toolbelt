---
description: Tiered multi-agent PR/code review (light/standard/deep) — bugs, security, perf, tests, maintainability, standards
argument-hint: "[target] [--tier=light|standard|deep] [--intent=path|url] [--focus=performance,…] [--focus-note=\"area to inspect\"] [--comment] [--benchmark]"
---

# /pr-review

Use `/pr-review` for a full code review of a PR, branch, or local diff.
For PR-open readiness, use `/pr-ready-check`.
For traceability against features, tickets, or documents, use the project's traceability review when it provides one.

**Arguments:** `$ARGUMENTS`

- **target** — a PR URL or number, a branch name, or empty for local working changes.
- **`--tier=light|standard|deep`** — the review depth. Omit it to auto-select from the diff.
- **`--intent=<path|url>`** — the requirements source. The default is the PR body and its linked issues.
- **`--focus=<facet[,facet]>`** — run these facets with more attention.
- **`--focus-note="<free text>"`** — an area to inspect first. It is not a filter.
- **`--comment`** — post findings as inline PR comments. Confirm before posting.
- **`--benchmark`** — print the token-usage footer.

Follow the `pr-review` skill (`skills/pr-review/SKILL.md`).
