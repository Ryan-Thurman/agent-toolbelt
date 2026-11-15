# Accelerate with rct (optional)

This skill works by reading the repo directly. That is the **default and always applies**. **If**
the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt) MCP tools happen to be available in
this session (a graph of this repo has been indexed and served over MCP), prefer them for the
localization and blast-radius steps below: they anchor an error string to a symbol and prove a call
path at a fraction of the tokens of reading files top-to-bottom. **Nothing here is required.** If
those tools are not present, ignore this file and use the normal approach.

You can tell rct is available when tools like `search_text`, `context_for`, `trace`, or `impact_of`
are in the session's tool list.

## Step -> rct tool (when available)

Mostly relevant to `/rca` (localize the cause) and `/fix-plan` (bound the fix).

| bug-to-fix step | rct tool |
|---|---|
| Anchor an error / log string to its enclosing symbol | `search_text({query})` |
| A suspect's source + callers/callees (where bad input arrives) | `context_for({symbol})` |
| Confirm the call path symptom -> suspect | `trace({from, to})` |
| Invariants the bug can violate | `get_constraints({area})` |
| Blast radius of the fix: who must be updated | `impact_of({symbol})`, `blast_radius` |
| Post-fix signature/scope check | `verify_change({symbol})`, `affected({staged: true})` |
| Persist the confirmed root cause across sessions | `memory_add` (recall with `memory_retrieve`) |

## Caveats

- **rct localizes the cause. It does not reproduce the bug.** Reproduction stays manual/QA per
  `/reproduce`. The graph helps you find *where*, not confirm *that it is fixed*. Verification still
  needs the repro (an automated test observed red before repair and green after, or documented manual QA).
- `trace` returning "no path" means the call is dynamic, so widen with `search_text` rather than
  assuming the suspect is unreachable.
- The durable investigation file remains the source of truth, and `memory_add` is a convenience for
  cross-session recall, not a replacement for it. Verify against the file for elided detail.
