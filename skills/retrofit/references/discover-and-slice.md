# Discover and slice

The first phase of a retrofit is done **inline before any fan-out**, because you need the full work-list and
the transform defined before you can apply it everywhere. Record the result in the report, or in
`templates/retrofit-plan.md` when the user asks for a durable plan.

## 1. Define the transform

Write down the exact change, with a before->after example, *before* discovering sites. retrofit
applies a *defined* transform. If you cannot write the rule and an example, it is not defined yet.
Shape it first (`/shape-up`). Note the known sharp edges up front (e.g. for moment->dayjs: mutability,
per-feature plugins. For an API rename: overloads, re-exports, dynamic references).

## 2. Enumerate every site

Find *all* of them. A missed site is the failure mode:
- **Grep / ripgrep** for the import, symbol, or pattern (and its aliases, re-exports, and string/
  dynamic references).
- **AST** when the pattern is structural (a call shape, a JSX element) rather than textual. Name the AST tool and its version
  for the count, such as ts-morph or jscodeshift. When no AST tool is installed, record the AST count as `Not run`.
- Search the non-source sites too: package manifests, lockfiles, build and bundler config, CI config, images or other
  generated assets that name the symbol, and docs. Record each one as a site.
- Cross-check counts two ways (grep vs. AST). A mismatch means hidden sites. When the AST count is `Not run`,
  the claim that the sweep is complete is `Not verified`.

Record every site in the plan with a status (`pending`/`done`/`skipped`/`needs-review`).

## 3. Classify mechanical vs. judgment

Mark each site:
- **Mechanical**: changes the same way as the others (scriptable). The bulk.
- **Judgment**: a sharp edge that a blind transform breaks: a behavior difference (moment's mutate-
  in-place vs. dayjs's immutable return), a missing capability needing setup (a dayjs plugin to
  register), an overloaded/ambiguous call, a consumer doing something unusual. These get human/agent
  attention, not the codemod.

## 4. Codemod-vs-hand-edit decision

- **Mechanical + more than ~30 sites -> write a codemod** (jscodeshift / ts-morph / an AST
  transform) and apply it. Review its diff.
- **Few sites, or heavy per-site judgment -> hand-edit** each (still in the loop, still verified).
- A codemod handles the mechanical bulk. Retrofit's real value is then catching the **judgment**
  sites the codemod cannot.

## 5. Slice into independent units

Break the work so sites can be transformed and verified independently and in parallel:
- For a **library/API swap**, the unit is usually a file or module (all its sites change together).
- For a **hybrid** change (e.g. Redux->Zustand), the unit is the thing being redesigned (a store/
  slice) plus its consumers. Design the unit first, then sweep its consumers.
- Order units so the tree stays working: shared/foundation pieces first, then dependents. Note any
  cross-unit dependency in the plan.

The output is a discovered, classified, sliced work-list: the input the Transform phase fans out
over.
