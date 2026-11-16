# Retrofit plan: <the change, e.g. moment -> dayjs>

The durable, resumable record of a retrofit. The site table is the source of truth: every site
ends `done` or `skipped (reason)`.

## Transform

- **Rule:** <what changes, precisely>
- **Before -> after:**

  ```
  // before
  // after
  ```

- **Known sharp edges:** <behavior differences, capabilities needing setup, ambiguous cases>
- **Coexistence strategy:** strangler | adapter | feature-flag | single-pass
- **Old path removal:** <what gets deleted once usage is zero>

## Discovery

- **How sites were found:** grep/AST/`rct impact_of` (and the queries used)
- **Cross-check:** <count via method A vs. method B, which must match>
- **Codemod:** yes/no: <script/tool, or why hand-edited>

## Sites

| # | Site (file / module / unit) | Class | Code status | Dependency status | Notes |
|---|---|---|---|---|---|
| 1 |  | mechanical / judgment | pending / done / skipped / needs-review | old kept / old removed / new added |  |
| 2 |  |  |  |  |  |

Code status tracks each site. Dependency status tracks the package that the site uses, in the manifest and the lockfile.

## Slices / order

Independent units and the order to do them (foundation first, dependents after), with any
cross-unit dependencies.

## Verification

- [ ] Each site self-verified (compile/test the unit)
- [ ] Full test suite + build/type-check green
- [ ] Judgment sites adversarially re-checked
- [ ] Zero remaining references to the old path (before removal)
- [ ] Old code/tests/config/docs removed (or blockers noted)

## Result

- Transformed: <n> (<codemod> / <hand-edited>)
- Skipped / deferred (explicit): <list with reasons>, or "none"
- Status: complete | partial
