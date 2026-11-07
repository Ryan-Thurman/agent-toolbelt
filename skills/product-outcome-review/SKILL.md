---
name: product-outcome-review
description: Review whether an experiment or released change improved its original customer problem. Compare hypotheses, baselines, populations, guardrails, and uncertainty; use ship-it for immediate release health.
---

# Product outcome review

Before writing for the user, read `shared/contracts/references/human-readable-output.md`.
Read `shared/contracts/references/evidence-quality.md` and `shared/contracts/references/product-measurement.md` before interpreting results.

Review supplied measurements and permitted research against the original product hypothesis.
Default to report-only; a requested report does not authorize deployment, tracker updates, or external publication.

Paths beginning `templates/` or `shared/` refer to the Toolbelt root. Compatibility installers rewrite them under the target’s `.atb/`.

## Procedure

1. Identify the original problem, audience, hypothesis, intervention, exposure dates, and decision to make.
   Preserve agreed success criteria and identify missing definitions.
2. Establish the measurement contract from the shared product-measurement reference.
   Record baseline and outcome periods, calculation, population, data quality, and guardrail results.
3. Compare results and inspect counterevidence.
   Separate observed change from evidence about its cause.
   If populations or event definitions changed, state which comparisons remain valid.
4. Assess uncertainty and practical customer consequences.
   Combine quantitative findings with traceable qualitative evidence when available.
   An inconclusive result remains a valid result.
5. Use `templates/product-outcome-review.md` to recommend `Continue`, `Revise`, `Stop`, or `Gather evidence`.
   Name the next decision owner and observable evidence needed.
   Route immediate release failures to `ship-it` or `bug-to-fix` when available.

## Completion

Report the original hypothesis, metric definitions, baseline, outcome, population, period, guardrails, uncertainty, and decision rationale.
Mark unsupported conclusions as insufficient evidence.
Do not require a release or ticket when reviewing an experiment.
