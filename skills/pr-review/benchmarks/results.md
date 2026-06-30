# Benchmark results

Append one row per tier run. Method + metrics: `../references/benchmarking.md`.
Token figures are Task-tool sub-agent sums (review work only; orchestrator overhead not included).

## Runs

### tcg-scraper-web — uncommitted backfill changes (2026-06-18)

⚠️ **Confounded comparison — target was not frozen.** A coding agent was actively fixing this code
between runs: the **standard** run reviewed the pre-fix version (v1), the **light** run reviewed the
post-fix version (v2). So this is *not* clean apples-to-apples; treat token costs as valid but
finding-yield as version-dependent. (This is exactly why `benchmarking.md` says freeze the target.)

| tier | sub-agents | review tokens | findings (blocker/should-fix/nit) | questions | verdict | code version |
|---|---|---|---|---|---|---|
| **light** | 1 | **46,607** | 0 / 2 / 1 | 0 | REQUEST CHANGES | v2 (post-fix) |
| **standard** | 6 | **224,033** | 0 / 8 / 6 (raw, pre-dedup 16) | 2 | NEEDS DISCUSSION | v1 (pre-fix) |
| deep | — | — | — | — | — | not run |

Standard per-facet tokens: correctness 47,074 · security 34,128 · performance 33,419 ·
tests 36,374 · maintainability 34,839 · standards 38,199. Critic ran inline (0 extra sub-agent).

**Cost ratio:** standard ≈ **4.8×** light tokens.

**What the (confounded) run still tells us:**
- **Cross-tier agreement = high-confidence signal.** Both tiers independently flagged the
  *unauthenticated backfill endpoint* (security/high) — that finding is real and persists across
  versions. Cross-tier agreement is worth more than within-tier agreement.
- **Standard found the v1 bugs that got fixed.** Its csv-import cluster (unconditional `raw_card`
  fallback, dead validation branch, duplicated type-knowledge) accurately described v1; the coding
  agent then fixed exactly those. Evidence the fan-out surfaces real issues.
- **Light caught something standard didn't.** A `complete-date` UPSERT that never refreshes
  `cursor_value` (correctness/medium) — standard's attention was spent on the csv-import cluster.
  Suggests breadth ≠ strictly superset; facet focus can both help and tunnel.
- **Performance correctly returned empty** in standard (and noted the batching is an improvement) —
  good "don't manufacture findings" signal.

**Tokens/finding (rough):** light ≈ 15.5k/finding; standard ≈ 14k/raw-finding but ~25k per
*distinct* finding after dedup. Standard buys breadth (6 dimensions) at ~5× cost with dedup overhead.

**Bugs this benchmark caught in the tool itself (now fixed):**
1. Diff wasn't frozen — sub-agents each ran their own `git diff`/file reads, so a live-editing tree
   gave different agents different inputs → `fan-out.md` now mandates a single frozen snapshot.
2. Critic only reasoned — didn't re-read cited code, so stale findings survived → `fan-out.md` critic
   now must re-read each `file:line` and drop stale findings.

**TODO for a clean comparison:** freeze the current working tree (snapshot the diff to a file), then
run light + standard + deep against that frozen snapshot in fresh sessions. → DONE below.

---

### tcg-scraper-web — FROZEN re-run, all three tiers (2026-06-18)

✅ **Clean comparison.** Same diff frozen to `/tmp/pr-review-bench/` at base sha `dbb5f41` (476-line
diff + 2 new files, 6 code files); working tree verified unchanged across all runs; every sub-agent
reviewed the identical snapshot. No external SAST tool integrated → deep ran LLM-only security.
No spec → spec-alignment no-op.

| tier | sub-agents | review tokens | raw findings | final (after verify) | blockers | verdict | tokens/finding |
|---|---|---|---|---|---|---|---|
| **light**    | 1 | **40,683**  | 5  | 5 (no verify pass) | 1* | REQUEST CHANGES | ~8.1k |
| **standard** | 6 | **233,055** | 16 | ~12 distinct (inline critic) | 1* | REQUEST CHANGES | ~14.6k/raw |
| **deep**     | 6 + 2 judges | **334,698** | 16 | 16 verified (0 blk / 11 should-fix / 5 nit) | 0 | NEEDS DISCUSSION | ~20.9k |

Deep breakdown: 6 facets 259,366 (corr 52,249 · sec 35,397 · perf 34,914 · tests 38,473 ·
maint-deep 46,706 · std 51,627) + dual-judge 75,332 (judge A 37,908 · judge B 37,424).
Standard facets: corr 40,899 · sec 37,348 · perf 32,373 · tests 37,792 · maint 33,925 · std 50,718.

**Cost:** standard ≈ **5.7×** light · deep ≈ **8.2×** light (≈1.4× standard). Dual-judge alone is
~22% of deep's cost.

**What each increment buys (the actual answer to "how much more impactful?"):**
- **light → standard (+193k):** buys **breadth**. 5 → 16 findings. Light hit the headlines (unauth
  endpoint, CSV escaping, taxonomy dup) but missed the test-coverage gaps (3), the standards
  deviations (relative import, `@ts-ignore`/any, User-Agent, inline SQL), and maintainability detail.
  Worth it when completeness matters.
- **standard → deep (+102k, of which 75k is dual-judge):** buys **precision/calibration, NOT more
  findings** (same ~16). The thermo-nuclear maintainability agent first *escalated* the taxonomy
  issue to blocker and pinned the exact contradiction; then the **dual-judge corrected 3 severities**
  — downgraded that false blocker to should-fix, and two over-stated findings to nits. Net: deep's
  verdict (NEEDS DISCUSSION, 0 blockers) is the *calibrated* one; light/standard would have shipped
  a blocker that two independent judges rejected. Worth it for high-stakes merges; wasteful for
  routine review.
- **\*severity calibration diverges by tier:** light and a standard agent both marked the unauthenticated
  backfill endpoint a **blocker/critical**; deep's two blind judges both rated it **should-fix/high**
  (real, but consistent with the repo's all-unauthenticated convention → an intent question, not an
  auto-block). At the time of this benchmark, light/standard severities went mostly unchecked; later
  tuning added severity floors to light/standard and a bounded reachability sketch to standard. Deep's
  dual-judge is still the stronger calibration path for anything that gates a merge.
- **cross-tier agreement = highest-confidence signal:** all three tiers independently flagged the
  unauth endpoint and the CSV-escaping issue — those are the safe bets regardless of tier.

**Recommendation from the data:** use **light** for docs/tests/config or tiny mechanical gut-checks,
**standard** for normal production PRs (breadth at ~5× is the sweet spot), and **deep** when a
wrong/missed blocker is expensive (security-sensitive or pre-release), since its extra spend buys the
strongest calibration rather than broad coverage.

**Tool behavior validated this run:** frozen diff fix worked (no stale-version disagreement this
time); dual-judge re-read code and corrected 3 severities + noted line-number drift (cited
`~131-135` vs real `227-228`) without dropping real findings — both bug-fixes from the prior run
are working.
