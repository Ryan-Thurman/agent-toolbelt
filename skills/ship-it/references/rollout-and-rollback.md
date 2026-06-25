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

```
1. DEPLOY with flag OFF   → code is in production but inactive
2. ENABLE for team/beta   → internal testing in the production environment
3. GRADUAL ROLLOUT        → 5% → 25% → 50% → 100%
4. MONITOR at each stage  → error rate, latency, client errors, business metrics
5. CLEAN UP               → remove the flag and the dead path after full rollout
```

Rules: every flag has an owner and an expiry; clean up within ~2 weeks of full rollout; test both
flag states in CI; don't nest flags.

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

| Metric | Advance (green) | Hold + investigate (yellow) | Roll back (red) |
|---|---|---|---|
| Error rate | within 10% of baseline | 10–100% above | > 2× baseline |
| P95 latency | within 20% of baseline | 20–50% above | > 50% above |
| Client JS errors | no new error types | new errors < 0.1% of sessions | new errors > 0.1% of sessions |
| Business metric | neutral/positive | decline < 5% (may be noise) | decline > 5% |

**Roll back immediately** if: error rate > 2× baseline, P95 latency > 50% up, user reports spike,
data-integrity issue, or a security vulnerability is discovered.

## What to monitor

- **Application:** error rate (total + by endpoint), response time (p50/p95/p99), request volume,
  active users, key business metrics.
- **Infrastructure:** CPU/memory, DB connection-pool usage, disk, queue depth.
- **Client (UI):** Core Web Vitals (LCP/INP/CLS), JS errors, client-side API error rates.

When an external pipeline owns the deploy, you won't drive these stages — but the same table is the
**watch-list** to hand off: "here's what to watch and the thresholds that mean roll back."
