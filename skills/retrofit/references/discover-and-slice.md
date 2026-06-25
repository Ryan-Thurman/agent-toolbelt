# Discover and slice

The first phase of a retrofit, done **inline before any fan-out** — you need the full work-list and
the transform defined before you can apply it everywhere. Capture the result in
`templates/retrofit-plan.md` (durable + resumable).

## 1. Define the transform

Write down the exact change, with a before→after example, *before* discovering sites. retrofit
applies a *defined* transform; if you can't write the rule and an example, it isn't defined yet —
shape it first (`/shape-up`). Note the known sharp edges up front (e.g. for moment→dayjs: mutability,
per-feature plugins; for an API rename: overloads, re-exports, dynamic references).

## 2. Enumerate every site

Find *all* of them — a missed site is the failure mode:
- **Grep / ripgrep** for the import, symbol, or pattern (and its aliases, re-exports, and string/
  dynamic references).
- **AST** when the pattern is structural (a call shape, a JSX element) rather than textual.
- **`rct impact_of` / `affected`** when the rct graph is available — it surfaces callers a grep
  misses (dynamic/aliased). See the `rct-acceleration` note in the review skills for the pattern.
- Cross-check counts two ways (grep vs. graph/AST); a mismatch means hidden sites.

Record every site in the plan with a status (`pending`/`done`/`skipped`/`needs-review`).

## 3. Classify mechanical vs. judgment

Mark each site:
- **Mechanical** — changes the same way as the others (scriptable). The bulk.
- **Judgment** — a sharp edge that a blind transform breaks: a behavior difference (moment's mutate-
  in-place vs. dayjs's immutable return), a missing capability needing setup (a dayjs plugin to
  register), an overloaded/ambiguous call, a consumer doing something unusual. These get human/agent
  attention, not the codemod.

## 4. Codemod-vs-hand-edit decision

- **Mechanical + more than ~a few dozen sites → write a codemod** (jscodeshift / ts-morph / an AST
  transform) and apply it; review its diff. (The "Rule of 500": large mechanical changes belong in a
  script, not N hand-edits — same rule `simplify` uses.)
- **Few sites, or heavy per-site judgment → hand-edit** each (still in the loop, still verified).
- A codemod handles the mechanical bulk; retrofit's real value is then catching the **judgment**
  sites the codemod can't.

## 5. Slice into independent units

Break the work so sites can be transformed and verified independently and in parallel:
- For a **library/API swap**, the unit is usually a file or module (all its sites change together).
- For a **hybrid** change (e.g. Redux→Zustand), the unit is the thing being redesigned (a store/
  slice) plus its consumers — design the unit first, then sweep its consumers.
- Order units so the tree stays working: shared/foundation pieces first, then dependents. Note any
  cross-unit dependency in the plan.

The output is a discovered, classified, sliced work-list — the input the Transform phase fans out
over.
