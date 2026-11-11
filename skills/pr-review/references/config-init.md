# Generating `.pr-review.md` (`/pr-review-init`)

`templates/pr-review.md` gives a repo the *structure* of a review config; the *content* has to come
from the repo itself. This recipe drafts a `.pr-review.md` by mining the codebase for evidence, so a
team's first config starts from what has actually hurt them instead of a generic sample. Section
semantics and how each is applied live in `repo-config.md` — this file only covers producing one.

**Output is a draft for human review.** Write it to `.pr-review.md` at the repo root (or print it
with `--print`) and tell the user to prune and commit. Never commit it yourself: the config only
takes effect once it exists on the base branch, and that promotion is a policy decision.

## Mining pass (evidence → section)

Work through the sources in order; each feeds a specific section. **If a source yields nothing,
leave that section out** — the config is purely additive, and a sparse, true config beats a padded
generic one.

1. **What is this system?** → `## Context`
   README, `docs/`, architecture notes, `CLAUDE.md`/`AGENTS.md`. Extract the domain, the scale/shape
   of load, and what "good" means here (e.g. "normalizes external CLI output into typed read models —
   correctness of normalization outranks perf; not a high-QPS service"). One short paragraph the
   facet agents can act on; no marketing copy.
2. **Which defect class hurts here?** → `## Always run` / `## Emphasis`
   Derive from the domain: high-QPS or latency-sensitive service → `performance`; parses/normalizes
   untrusted or external data, renders external content, handles auth → `security`; correctness of
   derived data is the product → emphasize `correctness`. Redundancy check: `correctness`, `tests`,
   `standards`, and `maintainability` are already the base facet set on every run (`fan-out.md`) —
   listing them under Always-run is a no-op; use `## Emphasis` for those instead.
3. **Concrete bars already written down somewhere** → `## Budgets`
   Latency/SLO targets in docs, contract-sync rules ("RPC changes must update `docs/rpc.md`"),
   invariants in module headers, strictness encoded in lint/CI config. Rewrite each as one testable
   line the facet agents can cite. A good budget names repo-specific evidence (files, payload shapes,
   real failure modes) — if you can only produce a platitude ("code should be fast"), drop it.
4. **What has this repo been burned by?** → `## Severity overrides`
   `git log --oneline --grep -iE 'revert|hotfix|regression'` plus fix-after-release patterns; if
   `gh`/`az` is available (`providers.md`), scan merged-PR review threads for recurring reviewer
   push-back. Pin each recurring class with a path-scoped rule, as in the `## Severity overrides`
   sample in `templates/pr-review.md`. A host-side re-rate fires even when one facet agent under-grades.
   The most common class is missing input validation on request paths.
   Keep rules specific — path globs plus a named condition — so they re-rate the real class, not every
   defensive nit. Pair such rules with a `## Minimum tier: standard` floor.
5. **What noise keeps getting rejected?** → `## Do not flag`
   The rejection memory (`.git/pr-review-rejections.jsonl`, `rejection-memory.md`) — entries refuted
   2+ times are suppression candidates. Also established bespoke patterns a generic reviewer would
   flag (named helpers, documented process rules). Every suppression must name the exact helper,
   path, or condition; never emit a blanket suppression ("ignore style issues").
6. **Tier floor** → `## Minimum tier`
   Mostly production logic, hot paths, or a security-sensitive surface → `standard`. A docs/config
   repo may not need a floor at all.

## Rules

- **Evidence or leave it out.** Every line must trace to something observed in the repo — a file, a
  commit, a review thread, a rejection-memory entry. Annotate non-obvious lines with a brief HTML
  comment naming the evidence (`<!-- from: docs/rpc.md; PR #41 revert -->`) so the human pruning the
  draft can judge each line; comments are cheap to delete on commit.
- **Don't duplicate `CLAUDE.md`/`AGENTS.md`.** Those are loaded on every review regardless
  (`repo-config.md`); the config is the review-specific layer on top. Restating agent instructions
  here just doubles the noise.
- **Refresh mode (config already exists).** Never overwrite: re-run the mining pass and propose
  additions/removals as a diff against the current file — typically new rejection-memory entries →
  Do-not-flag candidates, or a new burn (revert/hotfix) → a severity-override candidate. The human
  applies what they accept.
- **Skeleton and tone**: follow `templates/pr-review.md` — same headings, lenient markdown, every
  section optional.
