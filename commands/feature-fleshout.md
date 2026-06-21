---
description: Flesh out a raw feature into stakeholder questions, risks, assumptions, and Gate 1 readiness
argument-hint: "<path-to-master-record-or-feature-description>"
---

# /feature-fleshout

Use the `ai-feature-delivery` skill to deepen a feature definition.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the feature description or Feature Master Record.
2. Grill the request before expanding it:
   - What user/business problem is actually being solved?
   - What outcome would make the feature successful?
   - What is explicitly in scope and out of scope?
   - Which requirement, user flow, or release claim is still unsupported?
   - What decision would block design, dev, QA, security, or release?
3. Fill or update feature summary, user/business problem, scope, requirements,
   UX notes, security/cyber notes, medical affairs notes, QA strategy, SRE
   notes, architecture notes, impacted systems, and related documents.
4. Add assumptions, risks, missing information, clarification queue items, and
   pending actions with owners where possible.
5. Identify required stakeholder reviews and whether each is blocking. Use
   `/role-review` when a focused product, engineering, design, QA, security, or
   release gate is needed.
6. End with Gate 1 readiness: `READY`, `READY_WITH_RISKS`, or `BLOCKED`.
