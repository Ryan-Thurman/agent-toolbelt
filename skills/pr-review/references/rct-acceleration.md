# Accelerate with rct (optional)

This skill reviews the diff by reading the changed files and their context directly — that is the
**default and always applies**. **If** the
[rct](https://github.com/Ryan-Thurman/RyansContextToolbelt) MCP tools happen to be available in this
session (a graph of this repo has been indexed and served over MCP), prefer them for the structural
grounding below: the graph tells you what the diff *actually* puts at risk and which callers it
forgot to update, anchored to real edges rather than a `grep`. **Nothing here is required** — if
those tools aren't present, ignore this file and review from the diff as usual.

You can tell rct is available when tools like `affected`, `impact_of`, `blast_radius`, or
`verify_change` are in the session's tool list.

## Step → rct tool (when available)

Use these to *ground* the facet review (especially correctness and the blast-radius/maintainability
lenses) — they don't replace reading the diff, they sharpen what to flag.

| review step | rct tool |
|---|---|
| What the diff puts at risk: changed functions + dependents, risk-scored | `affected({base})` or `affected({staged: true})` |
| Blast radius of a specific changed symbol | `impact_of({symbol})`, `blast_radius` |
| Did the diff update every caller of a changed signature? | `impact_of({symbol, depth})` |
| A constraint/invariant the change may break | `get_constraints({area})` |
| Signature drift introduced by the change | `verify_change({symbol})` |

## Caveats

- This complements, not replaces, the facet sub-agents: rct supplies the dependency structure;
  the facets still judge correctness, security, tests, etc. Anchor every finding to a `file:line`
  the way the rest of the skill requires.
- An unupdated depth-1 caller from `impact_of` is a strong **blocker** signal; transitive/low-
  confidence reach is "worth a look." Verify against the file before flagging — and if rct reports a
  stale index for a result, read that file directly.
