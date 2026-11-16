---
name: product-outcome-review
description: Review whether an experiment or released change improved its original customer problem. Compare hypotheses, baselines, populations, guardrails, and uncertainty; use ship-it for immediate release health.
---

# Product outcome review

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` and `shared/contracts/references/product-measurement.md` before interpreting results.

Review supplied measurements and permitted research against the original product hypothesis.
Default to report-only.

## Procedure

1. Identify the original problem, audience, hypothesis, intervention, exposure dates, and decision to make.
   Preserve agreed success criteria and identify missing definitions.
2. Apply the product-measurement rules to each metric and guardrail. For each metric,
   record the numerator, denominator, source, and owner.
   Use a checked statistics library for each calculation. When no checked library is installed,
   use the Python standard library. Compute a two-proportion z-test for rates, with `math.erf`
   for the normal distribution. Save the inputs and output with the report, and label the result
   as a standard-library calculation. Report any other measure as `Not verified` when no checked library is installed.
3. Compare results and inspect counterevidence.
   Separate observed change from evidence about its cause.
   If populations or event definitions changed, state which comparisons remain valid.
   Compare complete periods only. A partial week, or a week in which a staged rollout changed
   the exposed share, is reported with its exact dates. Do not compare it with a complete week
   unless the populations match. Name the missing days in the data limits.
4. Assess uncertainty and practical customer consequences.
   Combine quantitative findings with traceable qualitative evidence when available.
   An inconclusive result remains a valid result.
5. Recommend `Continue`, `Revise`, `Stop`, or `Gather evidence` by the rules in "Choose the decision".
   Use `templates/product-outcome-review.md` when the user asks for a durable record.
   When the user names no path for that record, write it to `.atb-work/product-outcome-review/<scope-slug>.md`
   and print the path. Read `shared/contracts/references/execution.md#Durable report location`.
   Name the next decision owner and observable evidence needed.

## Choose the decision

- Choose `Stop` when a guardrail fails or a failure condition in the agreed criteria is met.
- Choose `Continue` when the primary metric meets the agreed success criteria and no guardrail fails.
- Choose `Revise` when the change misses the agreed criteria and the evidence points to a part
  of the change that can change.
- Choose `Gather evidence` when the result is inconclusive or the data cannot support the requested conclusion.
  Keep the change live during this choice only when no guardrail fails and the owner names the date
  when the observation ends.
- When the agreed criteria are missing, record each criterion as `Not set`. Do not pick a threshold
  to make the choice. Choose `Gather evidence` and name the missing criterion.

## Completion

Report the original hypothesis, the fields that the product-measurement rules require, uncertainty, and decision rationale.
Mark unsupported conclusions as insufficient evidence.
An experiment review needs no release or ticket.
