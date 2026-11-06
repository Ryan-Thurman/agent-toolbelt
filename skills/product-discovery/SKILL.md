---
name: product-discovery
description: Frame a product opportunity with evidence, assumptions, risks, experiments, and success thresholds before shape-up. Use when deciding what to build, not when a brief is already approved.
---

# product-discovery

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` when assessing product evidence.

Decide whether a candidate is sufficiently evidenced to shape. This skill is
discovery, not a replacement for the approved implementation brief.

## Steps

1. Separate known evidence from assumptions. Inspect supplied research, product
   data, support reports, and repository context; never invent customer research.
2. When comparing opportunities, preparing interviews, or selecting an experiment, read `references/discovery-decisions.md`.
   Reuse available research synthesis without treating interpretations as customer facts.
   Define the desired outcome, affected audience, problem, opportunity, and the
   candidate feature's evidence trail using `templates/product-discovery.md`.
3. Identify value, usability, feasibility, and viability risks. Name the riskiest
   assumptions and the cheapest experiment likely to change a decision.
4. Read `shared/contracts/references/product-measurement.md` when defining experiment or outcome measures.
   Define success and failure conditions with a supported baseline and explicit data limits.
   Use `templates/product-measurement-plan.md` when a separate measurement record is useful.
5. Hand a sufficiently evidenced candidate to `/shape-up`; otherwise report what
   evidence or decision is still missing.
   An experiment can go directly to an available `product-outcome-review` without creating implementation work.

## Completion

Finish with a lean traceable artifact and an explicit decision state: ready to
shape, needs evidence, or intentionally deferred. Do not design implementation.
