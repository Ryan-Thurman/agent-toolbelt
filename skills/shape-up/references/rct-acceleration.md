# Accelerate with rct (optional)

This skill works by reading the repo and docs directly — that is the **default and always applies**.
**If** the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt) MCP tools happen to be
available in this session (a graph of this repo has been indexed and served over MCP), prefer them
for the retrieval-heavy steps below: they return bounded, ranked, source-backed evidence at a
fraction of the tokens, and the graph sees call/dependency edges a `grep` can't. **Nothing here is
required** — if those tools aren't present, ignore this file and use the normal approach.

You can tell rct is available when tools like `scope_feature`, `build_context_pack`, `why`, or
`get_constraints` are in the session's tool list.

## Step → rct tool (when available)

This is a near-perfect fit for shape-up's **"resolve from the repo before asking the human"** rule —
the graph answers most "how does it work today / what would this touch" questions for free.

| shape-up step | rct tool |
|---|---|
| Resolve the request from the repo first (scope, current behavior) | `scope_feature({description})`, `build_context_pack({query})` |
| Recover *why* something exists before reshaping it | `why({symbol})` |
| Rules the change must respect | `get_constraints({area})` |
| Cross-check a claim against the code (contradiction-hunting) | `get_definition`, `trace`, `graph_query` |
| Search prose/docs | `search_corpus` |

## Caveats

- The graph supplies *what exists and what depends on what*; you still supply the judgment (the
  grill, the contradiction calls, the brief). rct does not replace the interrogation — it makes the
  repo-first half cheap.
- Verify against the actual file for any detail the graph elides, and if rct flags a stale/edited
  index for a result, read that file directly.
