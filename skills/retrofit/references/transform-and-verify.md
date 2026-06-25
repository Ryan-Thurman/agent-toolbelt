# Transform and verify

The second and third phases: apply the defined change to every site safely, keep the build working
throughout, and prove it's complete.

## Keep the tree working — coexistence strategies

A retrofit can touch hundreds of sites; the tree must not be broken between them. Pick a strategy so
old and new coexist until the sweep finishes:

- **Strangler** — run old and new in parallel, move sites from old to new incrementally; remove the
  old path only when it handles nothing. The default for large sweeps.
- **Adapter** — wrap the new implementation behind the old interface so unconverted consumers keep
  working while you migrate the backend, then migrate consumers off the adapter.
- **Feature flag** — switch consumers old→new one at a time behind a flag; flip fully, then remove
  the flag and the old path.

For a small, fast sweep you can do in one pass, a single atomic change is fine — but still verify
each unit.

## Isolate parallel work

When transforming many units concurrently, give each its own **git worktree** so parallel edits
don't collide. Detect existing isolation first (don't nest worktrees); prefer a native worktree tool
or `Workflow`'s `isolation: 'worktree'` over hand-rolled `git worktree` so the harness can manage
cleanup. A worktree that ends up unchanged is discarded. Sequential, one-unit-at-a-time work needs no
worktree.

## Transform each site

For each unit: apply the defined change (codemod output for the mechanical bulk, hand edits for the
judgment sites), then **self-verify before moving on** — compile/type-check and run the unit's tests.
A site that needs a test edited to pass means behavior changed: stop and treat it as a judgment site,
don't paper over it. Update the site's status in the plan.

## Verify the whole

After the sweep:
- **Full test suite + build/type-check** green across the tree.
- **Adversarial pass on the risky sites** — re-check every site marked `judgment`/`needs-review`:
  did the behavior difference get handled (moment mutate→dayjs immutable), the capability set up (the
  plugin registered), the edge case covered? Try to disprove "this site is correct."
- **Zero-usage gate before removal** — before deleting the old library/API/pattern, confirm there
  are no remaining references (fresh grep + `rct affected`/`impact_of` if available). Remove the old
  code, its tests, config, and docs only once usage is provably zero.

## No silent truncation

The contract is *exhaustive*. If any sites were deferred or skipped (a class that needs manual
redesign, a generated file, an out-of-scope package), the final report must **list them explicitly
with the reason** and mark the retrofit partial. A report that implies "done" when sites remain is
worse than no retrofit. The `templates/retrofit-plan.md` status column is the source of truth —
every site ends `done` or `skipped (reason)`.

## Final report

Summarize: sites transformed, codemod vs. hand-edited, judgment sites and how each was handled, the
coexistence strategy used and whether the old path was removed (or what blocks removal), and the
explicit skipped/deferred list. Keep the plan file as the durable record so a partial retrofit can
resume.
