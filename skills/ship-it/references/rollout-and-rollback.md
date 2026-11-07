# Rollout and rollback

How to release incrementally and how to undo it. The rollback plan is mandatory; the rollout plan
scales to the risk of the change.

## Rollback plan (required before release)

State both:
- **How to revert** — the cheapest safe mechanism for this change: flag-off (if behind a feature
  flag), `git revert` + redeploy, roll back to the prior release/tag, or run the migration's
  down-step. Note any irreversible step (a destructive migration, a data backfill) explicitly — it
  changes the plan.
- **The trigger** — the concrete signal that means "roll back now" (see the threshold table). Don't
  leave it to in-the-moment judgment.

## Feature-flag lifecycle (decouple deploy from release)

The percentages, durations, and cleanup interval below are examples.
Select actual stages and observation windows from project policy, traffic, and risk.

```
1. DEPLOY with flag OFF   → code is in production but inactive
2. ENABLE for team/beta   → internal testing in the production environment
3. GRADUAL ROLLOUT        → 5% → 25% → 50% → 100%
4. MONITOR at each stage  → error rate, latency, client errors, business metrics
5. CLEAN UP               → remove the flag and the dead path after full rollout
```

Give each flag an owner and a project-appropriate expiry.
Test supported flag states and record cleanup criteria.
Treat the example cleanup interval as illustrative.

## Staged rollout sequence

```
1. Staging        → full test suite + manual smoke test of critical flows
2. Production, flag OFF → verify deploy succeeded (health check), no new errors
3. Team/internal (flag ON) → ~24h window
4. Canary 5%      → compare canary vs. baseline; 24–48h window; advance only if thresholds pass
5. Gradual 25% → 50% → 100% → same monitoring at each step; can step back at any point
6. Full rollout   → monitor ~1 week, then clean up the flag
```

For a low-risk change you own, big-bang + watch is fine — but still have the rollback plan.

## Advance / hold / roll-back thresholds

Use the project's agreed release policy and baseline for the named deployment.
Record metric definitions, denominators, comparison windows, traffic or sample limits, and authorized response owners.

| Decision | Required basis |
|---|---|
| Advance | Required flows and checks pass within the project's observation and error limits. |
| Hold | Evidence is insufficient, populations differ, or a material anomaly needs investigation. |
| Recover | An agreed trigger fires and the authorized owner selects the applicable recovery procedure. |

A zero-error baseline or a small sample cannot support an unqualified relative-rate threshold.
Keep data-integrity and security response consistent with the project's incident policy.
Record missing triggers instead of inventing universal percentages or observation periods.
A business metric change alone does not establish release causation.
Use an available `product-outcome-review` for the longer-term customer decision.
These checks do not expand deployment or rollback authority.

## What to monitor

- **Application:** error rate (total + by endpoint), response time (p50/p95/p99), request volume,
  active users, key business metrics.
- **Infrastructure:** CPU/memory, DB connection-pool usage, disk, queue depth.
- **Client (UI):** Core Web Vitals (LCP/INP/CLS), JS errors, client-side API error rates.

When an external pipeline owns the deploy, you won't drive these stages — but the same table is the
**watch-list** to hand off: "here's what to watch and the thresholds that mean roll back."
