---
title: Defect density (quality metric)
type: reference / external article
source: Graphite guide (uses Graphite Insights as the tooling example)
use: optional quality-metric context; relevant if our tool ever reports/benchmarks quality, not core to per-PR review
---

# Defect density

Defect density measures the number of defects in software relative to its size, typically **defects per thousand lines of code (KLOC)**. It serves as a quality benchmark and gives insight into the testing process and overall health of a project.

## Industry standards

The "industry standard" varies by software type and environment — critical software (aviation, healthcare) has stricter benchmarks than consumer-grade apps:

- **Critical software:** less than 0.1 defects per KLOC.
- **High-quality enterprise systems:** ~1 to 3 defects per KLOC.
- **Typical business applications:** up to 10 defects per KLOC.
- **Consumer software:** varies widely; generally accepts higher defect density due to shorter timelines and competitive pressure.

## In agile environments

Agile emphasizes continuous testing and iteration, which shapes how defect density is measured:

- Agile teams often target **lower** defect densities as a sign of process maturity and effective CI/CD.
- No one-size-fits-all number, but mature agile teams may strive for **less than 1 defect per KLOC**.

## Calculation

```
Defect Density = (Total Defects / Total KLOC) × 1000
```

- **Total defects reported** — over a specific period.
- **Total KLOC reviewed** — over the same period.

(Graphite frames measurement around Graphite Insights — correlating PRs merged with defects reported over time. The formula and benchmarks are the reusable part.)
