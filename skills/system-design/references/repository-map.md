# Current repository map

Use this procedure to create or maintain a map of implemented architecture.
Reuse the project's existing architecture index, repository cards, and diagrams.
An architecture map describes current structure; proposed design remains separately labeled.

## Establish scope

Identify the repository, branch, source revision, and relevant local changes.
Read its instruction files, package boundaries, architecture records, and build or test entry points.
Use targeted file searches or symbol navigation to locate the requested flow.
When a search repeatedly fails, revise the assumed entry point or terminology.
Avoid scanning unrelated modules merely to make a map look complete.

## Trace and record

For each scoped module, record its purpose, key source paths, public entry points, and direct dependencies.
Trace important entry points through calls, messages, or data access to their observable output.
Support dependency edges with imports, calls, configuration, or observed execution.
Label inferred and dynamic relationships when their resolution is unavailable.
Use arrows consistently: `A --> B` means A depends on B.
Keep reverse dependency lists only when they can be maintained consistently from the same evidence.

Record source revision and verification method with each mapped area.
Keep unknown paths and omitted modules visible in the coverage table.
File existence alone cannot verify an execution chain.

## Maintain the map

When a module, entry point, dependency, or public interface changes, inspect the affected map entries and edges.
Use the changed source paths and revisions to select revalidation work.
Elapsed time alone does not invalidate an unchanged source-backed entry.
Correct stale references and preserve unrelated authored explanations.
Ask for a project decision only when ownership or intended behavior is unresolved.

## Completion

Deliver the requested map or update with a source revision, dependency diagram, flow references, coverage, and remaining unknowns.
Verify the recorded paths and symbols against the inspected source.
Keep design proposals distinct from observations.
When the request also changes architecture or trust boundaries, use the design procedure and linked threat review.
