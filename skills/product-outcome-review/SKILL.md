---
name: product-outcome-review
description: Review whether an experiment or released change improved its original customer problem. Compare hypotheses, baselines, populations, guardrails, and uncertainty; use ship-it for immediate release health.
---

# Product outcome review

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.
Read `shared/contracts/references/evidence-quality.md` and `shared/contracts/references/product-measurement.md` before interpreting results.

Review supplied measurements and permitted research against the original product hypothesis.
Default to report-only.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root.

## Procedure

1. Identify the original problem, audience, hypothesis, intervention, exposure dates, and decision to make.
   Preserve agreed success criteria and identify missing definitions.
2. Apply the product-measurement rules to each metric and guardrail.
3. Compare results and inspect counterevidence.
   Separate observed change from evidence about its cause.
   If populations or event definitions changed, state which comparisons remain valid.
4. Assess uncertainty and practical customer consequences.
   Combine quantitative findings with traceable qualitative evidence when available.
   An inconclusive result remains a valid result.
5. Use `templates/product-outcome-review.md` to recommend `Continue`, `Revise`, `Stop`, or `Gather evidence`.
   Name the next decision owner and observable evidence needed.

## Completion

Report the original hypothesis, the fields that the product-measurement rules require, uncertainty, and decision rationale.
Mark unsupported conclusions as insufficient evidence.
An experiment review needs no release or ticket.
