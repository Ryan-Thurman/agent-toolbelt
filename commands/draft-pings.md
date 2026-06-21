---
description: Draft stakeholder follow-up messages from clarification queue and pending actions
argument-hint: "<path-to-master-record-or-feature-folder>"
---

# /draft-pings

Use the `ai-feature-delivery` skill to draft human-approved stakeholder pings.

**Arguments:** `$ARGUMENTS`

Steps:
1. Read the Feature Master Record, clarification queue, pending actions, and
   latest gate/steward review if present.
2. Group open items by owner and owner role.
3. Draft concise messages that include feature ID, target release, why the input
   is needed, exact question/action, due date if known, and whether it blocks a
   gate.
4. Do not claim anything was sent. Output drafts for human review.
5. Flag missing owners separately instead of inventing recipients.
