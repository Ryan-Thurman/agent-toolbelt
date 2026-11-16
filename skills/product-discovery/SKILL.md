---
name: product-discovery
description: Frame a product opportunity with evidence, assumptions, risks, experiments, and success thresholds before shape-up. Use when deciding what to build, not when a brief is already approved.
---

# product-discovery

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.
Read `shared/contracts/references/evidence-quality.md` when assessing product evidence.

Decide whether a candidate is sufficiently evidenced to shape. This skill is
discovery, not a replacement for the approved implementation brief.

## Steps

Default to report-only. Create external tickets only when the requested next action needs them.

1. Separate known evidence from assumptions. Inspect supplied research, product
   data, and support reports. Never invent customer research.
   Reuse available research synthesis without treating interpretations as customer facts.
   Discovery does not scan the repository. Read a file only when the user names it.
2. Define the desired outcome, affected audience, problem, opportunity, and the
   candidate feature's evidence trail. Include the current experience as an option.
   When you compare opportunities or prepare interviews, read `references/discovery-decisions.md`.
3. Identify value, usability, feasibility, and viability risks. Name the riskiest
   assumptions and the cheapest experiment likely to change a decision.
   When you select an experiment, read `references/discovery-decisions.md`.
4. Read `shared/contracts/references/product-measurement.md` when defining experiment or outcome measures.
   Define success and failure conditions with a supported baseline and explicit data limits.
   If no supported baseline exists, record the threshold as `Not set`, and name the missing
   baseline as the open question. Do not invent a baseline. Read
   `shared/contracts/references/evidence-quality.md#Thresholds and defaults`.
   Use `templates/product-measurement-plan.md` when a separate measurement record is useful.
5. Hand a sufficiently evidenced candidate to `shape-up`. Otherwise report what
   evidence or decision is still missing.

Use `templates/product-discovery.md` when the user asks for a durable artifact.
When the user names no path for that artifact, write it to `.atb-work/product-discovery/<scope-slug>.md`
and print the path. Read `shared/contracts/references/execution.md#Durable report location`.

## Completion

Finish with a traceable result and an explicit decision state: ready to
shape, needs evidence, or deferred. Give each claim a verdict: `Supported`,
`Contradicted`, `Mixed`, or `Insufficient evidence`, with a reason. `shared/contracts/references/evidence-quality.md`
wins if the lists differ. Leave implementation design to later stages.
