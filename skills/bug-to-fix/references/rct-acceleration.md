# Accelerate with rct (optional)

This skill works by reading the repo directly — that is the **default and always applies**. **If**
the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt) MCP tools happen to be available in
this session (a graph of this repo has been indexed and served over MCP), prefer them for the
localization and blast-radius steps below: they anchor an error string to a symbol and prove a call
path at a fraction of the tokens of reading files top-to-bottom. **Nothing here is required** — if
those tools aren't present, ignore this file and use the normal approach.

You can tell rct is available when tools like `search_text`, `context_for`, `trace`, or `impact_of`
are in the session's tool list.

## Step → rct tool (when available)

Mostly relevant to `/rca` (localize the cause) and `/fix-plan` (bound the fix).

| bug-to-fix step | rct tool |
|---|---|
| Anchor an error / log string to its enclosing symbol | `search_text({query})` |
| A suspect's source + callers/callees (where bad input arrives) | `context_for({symbol})` |
| Confirm the call path symptom → suspect | `trace({from, to})` |
| Invariants the bug may be violating | `get_constraints({area})` |
| Blast radius of the fix — who must be updated | `impact_of({symbol})`, `blast_radius` |
| Post-fix signature/scope check | `verify_change({symbol})`, `affected({staged: true})` |
| Persist the confirmed root cause across sessions | `memory_add` (recall with `memory_retrieve`) |

## Caveats

- **rct localizes the cause; it does not reproduce the bug.** Reproduction stays manual/QA per
  `/reproduce` — the graph helps you find *where*, not confirm *that it's fixed*. Verification still
  needs the repro (automated revert→fail or documented manual QA).
- `trace` returning "no path" means the call is dynamic — widen with `search_text` rather than
  assuming the suspect is unreachable.
- The durable investigation file remains the source of truth; `memory_add` is a convenience for
  cross-session recall, not a replacement for it. Verify against the file for elided detail.
