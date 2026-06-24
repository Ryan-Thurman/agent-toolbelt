# Accelerate with rct (optional)

This skill works by reading the diff and files directly — that is the **default and always applies**.
**If** the [rct](https://github.com/Ryan-Thurman/RyansContextToolbelt) MCP tools happen to be
available in this session (a graph of this repo has been indexed and served over MCP), prefer them
for the retrieval-heavy steps below: the graph sees the caller/dependency edges that decide whether
a wrapper is really unused, at a fraction of the tokens of reading files. **Nothing here is
required** — if those tools aren't present, ignore this file and use the normal approach.

You can tell rct is available when tools like `impact_of`, `build_context_pack`, `why`, or
`verify_change` are in the session's tool list.

## Step → rct tool (when available)

| simplify step | rct tool |
|---|---|
| Find an existing helper a reuse candidate duplicates | `build_context_pack({query})`, `search_text`, `find_files` |
| Confirm a thin wrapper / "dead" code has **no other callers** before inlining or deleting | `impact_of({symbol})`, `blast_radius` |
| Chesterton's fence — why does this exist? | `why({symbol})`, `get_constraints({area})` |
| Confirm the cleanup touched only the intended scope | `affected({staged: true})`, `verify_change({symbol})` |

## Caveats

- `impact_of` makes the Chesterton's-fence and behavior-preserving checks much stronger: a graph
  caller list catches dynamic/aliased references a text search misses. Still run `search_text` for
  string/reflective references the graph can't see, and the tests after each change.
- The graph supplies *who depends on what*; you still supply the `rootIssue → consequence → benefit`
  judgment and the apply discipline. Verify against the file for any detail the graph elides.
