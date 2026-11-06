# Current-state gap review

Use when the user asks whether a product ask or requirement matches the current
system, what gaps exist, or what questions have not been asked. This is a
read-only discovery report, not a brief-approval or implementation step.

1. Restate the requested outcomes and scope without adding new requirements.
   If the ask is a document or ticket, treat its wording as the request, not as
   proof that the system behaves that way.
2. Trace the relevant user path through entry points, permissions, data/model,
   business logic, integrations, UI/API, configuration, tests, and operational
   behavior as applicable. Inspect code and docs; use safe runtime checks only
   when available and useful. Distinguish code behavior from documentation and
   tests, which may be stale or incomplete.
3. Map each outcome to **covered**, **partial**, **missing**, or **unknown**.
   Attach exact file paths, symbols, tests, or observed outputs. A failed search
   alone is not proof of absence; say what was searched and mark uncertainty.
4. Identify contradictions and cross-cutting gaps that the ask may omit:
   actor/authorization boundaries, empty and error states, existing data and
   migrations, backward compatibility, accessibility, observability, rollout,
   rollback, and verification. Include only those supported by the product
   context or system evidence; do not produce a generic checklist.
5. Separate **findings** (supported by evidence), **inferences** (reasoned but
   not verified), and **decisions needed** (product or policy choices the repo
   cannot settle). Prioritize questions by their effect on scope, risk, or PR
   boundaries. Suggest a recommended default when the evidence supports one.

Report concisely in this order: requested outcome; current behavior and
evidence; gap/status; consequence; prioritized unanswered questions; confidence
and inspection limits. A small comparison table is useful for several outcomes.
Do not draft a phase plan, open a PR, edit files, or demand approval to complete
this review. If the user subsequently wants delivery, carry these findings into
interactive shaping when product decisions remain open, or pass already-approved
scope directly to `$phased-delivery`.
