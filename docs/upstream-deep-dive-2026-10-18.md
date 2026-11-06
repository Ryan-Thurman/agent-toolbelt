# Watched-repository deep dive — 2026-10-18

The best next additions are a focused **UI accessibility review** and a
**known-bug variant search**. Most other useful upstream ideas belong inside
existing skills: upgrade assessment, property-based testing, database rollout
planning, and skill evaluation. The Vercel performance group can be narrowed
into four explicit reference profiles while retaining its existing entry point
and rule copies. Keep the eight-rule composition skill together.

These are recommendations based on source inspection and local capability
overlap, not measured team usage. This pass refreshed research clones and saved
the assessment; it did not install skills or change runtime workflows.

## Evidence and freshness

Compared all **34 watched clones** with the [October 6 baseline](upstream-delta-2026-10.md).
**22 fast-forwarded, 10 were current, one diverged, and one was unavailable.**
All 33 accessible upstreams were fetched. The diverged
`claude-code-best-practice` clone stayed at its local revision; its fetched
`origin/main` tree was inspected separately. Scribe still returns Repository
not found; its retained tree is historical evidence only.

The [refresh record](upstream-refresh-2026-10-18.json) records full baseline,
local and fetched revisions, inspected revision, status, and changed-path
counts. Commit counts are omitted because shallow boundaries and rewritten
history can make them misleading. Scratch inventories, logs, license records,
and path diffs are in `.atb-work/deep-dive-2026-10-18/`.

Every source received a repository/readme and endpoint-change inventory pass.
Selected skills and implementation paths received deeper inspection where
they could fill a local gap. This is not an audit of every changed implementation
in the scanner engines, review products, or large catalogs. The source table
below distinguishes the depth. Unchanged sources were considered for useful
capabilities too; a candidate does not have to be new upstream to be new here.

The local comparison used the 30 canonical skills, their relevant references,
the catalog, shared TypeScript/React baseline, installer composition, and
current review facets. Existing uncommitted work was preserved.

## Ranked extraction decisions

Priority reflects the distinctness of the local gap, specificity of the trigger,
integration cost, and availability of checkable evidence. It is not an ROI score.

| Priority | Candidate | Decision and local owner | Reason |
| --- | --- | --- | --- |
| 1 | Narrow Vercel performance scopes | Improve the existing skill with four reference profiles | Requested directly; no extra skill descriptions or rule copies needed. |
| 1 | UI accessibility and interaction review | Add `ui-accessibility-review` | Existing browser/test/release skills mention accessibility, but do not own a focused source-review procedure. |
| 1 | Skill trigger and behavior evaluation | Add an authoring workflow and fixtures, initially without a runtime skill | Shape/install checks cannot establish that narrower descriptions select the right process. |
| 2 | Search for variants of a known bug | Add `bug-variant-analysis` | Distinct question and deliverable after RCA; existing bug lane targets the smallest verified repair. |
| 2 | Framework/runtime upgrade deltas | Extend `tech-backlog-assessment`; hand accepted sweeps to `retrofit` | Assessment already owns package/upgrade decisions; another general upgrade skill would collide. |
| 2 | Properties and generators for tests | Extend `test-case-design` and `cover` | Existing owners already separate case design from test authoring; add technique-specific references. |
| 2 | Safe database rollout plans | Extend assessment, phased delivery, and release references | `retrofit` explicitly excludes database migrations; current SQL checks do not supply the whole rollout plan. |
| 3 | Domain vocabulary and decisions | Pilot a shaping reference; consider `domain-modeling` only with repeated standalone demand | Shaping already challenges terms against code/glossaries. A full new skill needs evidence of independent use. |
| 3 | Project instruction cleanup | Optional authoring/maintenance workflow | Useful for this repo's instruction surface, but not a standing task on every code change. |
| 3 | Production performance/cost audit | Optional Vercel integration | Requires project access, production metrics, CLI/runtime support; separate from React code review. |
| Defer | Broad frontend, API architect, SRE, and persona packs | Extract narrow references as needed | Large overlap with current owners and no supplied team demand for an additional broad role. |
| Defer | New all-purpose planning/review/ship framework | Keep current workflow owners | Would replace established gates, artifacts, and mutation boundaries without evidence of benefit. |

## Vercel: a practical narrowing design

### Current behavior and constraint

The two local skills already use progressive disclosure:
[performance](../skills/vercel-react-best-practices/SKILL.md) and
[composition](../skills/vercel-composition-patterns/SKILL.md) point to exact
rules through their routing references. The performance skill has 70 rules
across eight upstream prefixes; composition has eight rules. Both remain at
upstream commit `063bee94c3f4df8453406c830b0a7df0f2860278`, with no upstream
delta this time.

All 78 local rule files match upstream after removing trailing whitespace.
63 are byte-identical; 15 differ only in trailing whitespace. The copied rule
text is already separate from local policy and attribution. Preserve that
separation when adding qualifications.

The problem is the width of the selection contract: a component change,
Next server action, bundle regression, and a loop optimization all reach the
same performance entry point. Files on disk do not by themselves establish
excess runtime context; the relevant improvement is selecting fewer applicable
rules and avoiding contradictory advice.

### Four profiles, one existing performance entry point

Use these as reference branches first. The counts describe each profile's
available inventory, not files to read on every invocation. Select individual
rules only after the profile and runtime conditions match.

| Profile | Exact inventory | Enter when | Leave outside this profile | Required evidence |
| --- | --- | --- | --- | --- |
| Request and data | 16: six `async-*` and ten `server-*` | Async dependencies, slow server rendering/API work, request caching, streaming, or RSC payloads change | Bundle-only work, component API design, Vercel billing | Dependency graph or affected request path; cache identity/lifetime; actual server/SSR/RSC boundary where relevant |
| Client delivery | 9: six `bundle-*`, `client-swr-dedup`, `rendering-resource-hints`, `rendering-script-defer-async` | Initial client payload, heavy imports, lazy features, request deduplication, or resource scheduling changes | Ordinary state/effect refactors, component architecture, production account spend | Build/import trace, network behavior, duplicate requests, or a bounded loading consequence |
| React runtime | 31: fifteen `rerender-*`, nine remaining `rendering-*`, four `advanced-*`, three remaining `client-*` | State loss/remounts, input responsiveness, render/effect work, hydration, listeners, or storage behavior changes | Request caches, bundle-only changes, architecture without a runtime consequence | Reproduction, render/effect trace, lifecycle consequence, or bounded repeated work; React/compiler/runtime support |
| JavaScript hot paths | 14: `js-*` | Profiling or input scale identifies costly loops, lookups, computation, storage, or DOM work | Routine small collections and style-only rewrites | Representative measurement or a concrete complexity/scale bound |

The [complete proposed rule map](vercel-rule-scope-2026-10-18.json) assigns
every one of the 78 rules exactly one primary profile and records important
qualifications. `component-api` is the existing composition skill's eight-rule
group, separate from the four performance profiles.

This mapping deliberately crosses filename prefixes: resource hints and script
scheduling belong with delivery, while browser listeners and storage belong
with runtime behavior. Generic async rules remain usable in browser or
non-Next code; their primary profile is navigation, not a server-only ban.
Shared `js-*` rules can be consulted from another profile when the hot-path
gate is satisfied, using the same canonical file.

Each invocation should record the selected profile/rules, runtime/version
evidence, relevant observation, and unverified items. A change spanning multiple
profiles selects those profiles explicitly and emits one deduplicated report.
An ordinary React edit need not invoke all performance branches.

Proposed performance description: “Investigate React or Next.js performance
regressions or assess changes to async dependencies, client delivery, or render
work. Select the matching reference profile and verify runtime/version support.”
Keep component API design in composition. Pure cosmetic edits do not satisfy
this trigger merely because they touch a component.

### Keep composition together

Its eight rules share a coherent job: component API variants and state ownership.
Splitting context, compound components, and boolean props into separate skills
would add selection overhead while repeatedly reaching the same decisions.
Keep its three architectural subgroups as references and treat React 19 API
guidance as an optional compatibility branch. Performance investigations can
refer to composition when a public API decision is actually involved.

### Qualifications to add before broadening use

These are local interpretation notes to add alongside the copied rules, not
reasons to rewrite upstream examples silently.

| Rule or family | Qualification | Evidence |
| --- | --- | --- |
| `react19-no-forwardref` | React 19 permits ref-as-prop; `useContext` remains supported. Do not classify existing `useContext` or every `forwardRef` as a defect. Check downstream React support before changing a library's API. | [Copied rule](../skills/vercel-composition-patterns/references/rules/react19-no-forwardref.md), [React useContext](https://react.dev/reference/react/useContext), [React forwardRef](https://react.dev/reference/react/forwardRef) |
| Memoization rules | Check whether React Compiler is enabled and covers the code before recommending manual memoization. Require an actual cost or identity consequence. | [React memo and compiler guidance](https://react.dev/reference/react/memo) |
| `server-auth-actions`, `server-no-shared-module-state` | Route security/correctness consequences to those review facets too. A performance measurement is not a prerequisite for reporting unauthorized access or request-data leakage. | [Authentication rule](../skills/vercel-react-best-practices/references/rules/server-auth-actions.md), [request state rule](../skills/vercel-react-best-practices/references/rules/server-no-shared-module-state.md) |
| `server-cache-lru`, `js-cache-*` | Verify identity keys, user/tenant separation, invalidation, staleness, process lifetime, and bounds before adding a cache. | [Local preservation contract](../skills/vercel-react-best-practices/SKILL.md) applied to the copied cache examples |
| `server-hoist-static-io` | Hoist immutable request-independent inputs only; preserve the request scope of user-dependent data. | [Static I/O rule](../skills/vercel-react-best-practices/references/rules/server-hoist-static-io.md) and request-state rule |
| `client-passive-event-listeners` | Preserve cancellation where interaction behavior requires `preventDefault`; passive is conditional. | [Copied listener rule](../skills/vercel-react-best-practices/references/rules/client-passive-event-listeners.md) |
| SWR, subscription, and `better-all` examples | Apply the mechanism using the project's existing equivalent where possible; a reference example is not authorization to add a dependency. | [TypeScript/React baseline](../shared/contracts/references/typescript-react-baseline.md) |
| `server-after-nonblocking` | Verify completion/retry semantics before deferring work; essential writes and durable audit requirements need an appropriate execution mechanism. | [Copied after rule](../skills/vercel-react-best-practices/references/rules/server-after-nonblocking.md), applied under the local behavior-preservation contract |

### When separate installable skills would earn their cost

Start with explicit profile references and evaluate realistic requests. Promote
a profile only if independent invocation or selective installation is useful
and tests show a clearer boundary. Plausible future names are
`request-data-performance`, `client-delivery-performance`, and
`react-runtime-performance`. Keep hot-path rules conditional reference material.

Do not create eight skills simply because upstream has eight prefixes. Keep one
canonical rule copy and preserve the existing `vercel-react-best-practices`
entry point for current consumers. A future entry-point split also needs changes
to shared specialist routing, review facets, installer dependencies, catalog,
agent metadata, packaging, and attribution checks. The current
[React install check](../scripts/check-react-quality-install.sh) explicitly
expects the 70/8 rule inventories, standalone installs, and `react-quality`
composition; moving trees requires updating that contract deliberately.

## Two additions with distinct jobs

### UI accessibility review

**Proposed trigger:** review a named interface/component for accessible names,
keyboard operation, focus behavior, forms/errors, semantic controls, responsive
content, and reduced motion. Default to a report; remediation follows a user's
implementation request through the existing development lane.

**Sources:** Vercel's [web-design skill](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines/SKILL.md)
and its separately maintained [interface rules](https://github.com/vercel-labs/web-interface-guidelines/blob/4ecfb9fb8d1d3b7009674869b3aaee2f904042e1/command.md).
The latter was resolved and pinned separately because the skill fetches mutable
guidelines. Validate accessibility interpretation against [WAI's ARIA guidance](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
and relevant interaction patterns such as [buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

**Local gap:** `test-case-design` identifies accessibility risks,
`webapp-testing` executes user flows, and `ship-it` has short accessibility
readiness rows. These are useful starting points, but no current source-review
owner selects and assesses accessible interaction patterns in depth.

**Boundary:** source inspection produces findings and a verification plan;
`webapp-testing` owns browser execution and artifacts. React performance and
composition remain separate owners. Design-system preferences govern cosmetic
advice; they are not accessibility violations.

**Adaptation:** omit blanket typography/brand preferences, arbitrary list-size
thresholds, and universal URL-state mandates. Evaluate keyboard behavior rather
than demanding explicit handlers on native controls. Avoid claiming full WCAG
conformance from static inspection or a clean automated scan. Fetching current
guidance should record the revision and report unavailable coverage; it should
not silently substitute unversioned instructions.

**Completion:** each finding identifies the affected control/flow, source
location, observable consequence, proposed correction, and check needed.
Record static, browser-tested, and assistive-technology-tested coverage separately.

### Known-bug variant analysis

**Proposed trigger:** after one root cause is established, find other occurrences
of that same failure mechanism across an explicitly scoped codebase.

**Source:** Trail of Bits [variant analysis](https://github.com/trailofbits/skills/blob/5c99c03fb8a9/plugins/variant-analysis/skills/variant-analysis/SKILL.md).
Its useful method is calibrating a search on the known occurrence, generalizing
one dimension at a time, and adjudicating look-alikes against the root cause.
Use independent local wording; do not port its workflow runtime or prompt pack.

**Local gap:** `bug-to-fix` proves and repairs a reported defect with a minimal
diff; `retrofit` applies an already defined transformation. Neither entry point
explicitly owns the report answering “where else does this known bug occur?”

**Boundary:** report-only by default. Initial diagnosis stays in `bug-to-fix`;
scanner execution follows existing security-audit boundaries; accepted repairs
go to bug delivery or an explicitly defined retrofit. No automatic repo-wide fix.

**Completion:** give the seed evidence, search scope, patterns attempted,
confirmed variants, rejected look-alikes with reasons, and excluded/unread areas.
No findings after a bounded search means no confirmed variants in that scope,
not proof that the whole repository is free of the bug.

## Extensions to existing owners

| Existing owner | Specific addition | Upstream evidence | Checkable result |
| --- | --- | --- | --- |
| `tech-backlog-assessment` | A version-delta branch intersecting official source→target changes with APIs/configuration actually used here | Anthropic [version-delta analyst](https://github.com/anthropics/claude-plugins-official/blob/ea10b213686c/plugins/code-modernization/agents/version-delta-analyst.md) | Version pair, affected file/symbol, behavioral risk, tool status as present/runnable/actually run, characterization tests, recommendation; accepted repetitive work routes to `retrofit`. |
| `test-case-design` → `cover` | Property selection, input generators, counterexample replay, and vacuity checks | Trail of Bits [property-based testing](https://github.com/trailofbits/skills/blob/5c99c03fb8a9/plugins/property-based-testing/skills/property-based-testing/SKILL.md) | A useful invariant/oracle, domain constraints, seed/shrunk counterexample, and proof the test detects a real behavioral change. Keep existing framework policy. |
| Assessment → phased delivery → `ship-it` | Database expansion, compatibility, backfill, read cutover, and later contraction as separate release decisions | Addy [deprecation/migration](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005/skills/deprecation-and-migration/SKILL.md) | Mixed old/new-version compatibility, bounded restartable backfill, cutover evidence, cleanup criterion, and recovery approach for each stage. |
| Skill authoring/checks | Positive, adjacent-negative, and behavior cases for descriptions and references | Addy [evals](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005/evals/README.md), Kodus [production-path evals](https://github.com/kodustech/kodus-ai/blob/266466b47841/evals/README.md) | A case names its expected owner and observable result; real-host traces demonstrate selection; static vocabulary checks remain labeled approximations. |
| `cover` and bug verification | Verify the intended temporary mutation actually landed before treating a red run as falsification | Matt [diagnosing-bugs update](https://github.com/mattpocock/skills/commit/f3fc563) | Mutation visible in the scoped diff, expected test fails for the intended reason, restoration verified even on failure. |
| `pr-review` | Keep config/context/diff reads bound to immutable revisions; expose budget/overflow stops in coverage | PR-Agent [GitHub provider](https://github.com/The-PR-Agent/pr-agent/blob/33fc4b4a7c41/pr_agent/git_providers/github_provider.py), Alibaba [overflow regression cases](https://github.com/alibaba/open-code-review/blob/ca1065a29806/internal/scan/prompt_budget_test.go) | One recorded input snapshot; changed head invalidates reuse; a budget stop preserves completed findings and reports unfinished required scope. |
| Project instruction maintenance | Preserve instruction meaning, ownership, and exceptions while removing proven duplication | Scoville [context cleanup](https://github.com/benjaminstelzer/scoville-suite/blob/fdd5892ec7df/packages/scoville-project-context-cleanup/scoville-project-context-cleanup/SKILL.md) | Scoped before/after diff with preserved gates and owners; no claim of behavioral improvement based only on shorter text. |
| `ship-it` | Tie post-deploy observations to a named baseline/deployment and an explicit comparison window | gstack [canary](https://github.com/garrytan/gstack/blob/2d42e4ece834/canary/SKILL.md) | Baseline, deployed revision, sampled flows/metrics, observation window and agreed rollback conditions; no automatic deployment/rollback authority. |

Two qualifications matter when adapting these:

- Database recovery cannot be reduced to “every change has a down migration.”
  Record when data recovery needs a forward repair, restore, or backup procedure;
  avoid promising reversibility for destructive data changes. The Addy recipe
  is a source of sequencing ideas, not a database-independent guarantee.
- Review snapshotting and incomplete-scope handling already exist locally.
  Add regression cases or a missing instruction only after a concrete gap is
  demonstrated; do not duplicate the October 6 adoption under a new name.

## Evaluation cases for the proposed boundaries

Use these as planned fixtures, not claimed test results. For each case record
host/model/version, loaded plugin revision, selected skill/profile, rule files
read, actions, findings, and gaps. Repeat ambiguous real-host cases and report
per-case observations; do not infer routing quality from description similarity.

| Request or fixture | Expected owner | Must distinguish |
| --- | --- | --- |
| “This App Router page waits for three independent fetches.” | Request/data profile | Follow actual dependencies; no bundle or memoization checklist. |
| “Our Vite build now includes Monaco in the initial payload.” | Client-delivery profile | Use supported Vite/React mechanisms; do not prescribe `next/dynamic`. |
| “Typing remounts this field and clears its value.” | React-runtime profile | Component identity and state loss, not an automatic compound-component redesign. |
| “Can we combine these two maps over five items?” | Ordinary review/direct answer | Hot-path optimization advice requires evidence of worthwhile cost. |
| “This React 18 package exposes a ref.” | Component API compatibility branch | No React 19-only API rewrite. |
| React 19 code uses `useContext` correctly | Composition qualification | No finding solely for a supported API. |
| React Compiler is enabled around an expensive component | Runtime/compiler gate | No blanket instruction to add `memo`. |
| Server Action changes protected data without checking the caller | Security/correctness review, with the request/data reference | Report a security consequence even with no performance measurement. |
| “Review this checkout form's keyboard and error behavior.” | Proposed UI accessibility review | Report source findings; route runtime checks to `webapp-testing`. |
| “The browser checkout smoke test fails.” | `webapp-testing` / `bug-to-fix` | Do not replace failure investigation with a general design audit. |
| “We proved this tenant filter is missing. Where else is this pattern?” | Proposed bug-variant analysis | Match root cause, reject safe look-alikes, report scope. |
| “Why is tenant data leaking?” | `bug-to-fix` / security review | Establish a cause before variant searching. |
| “Should we move from library X to Y?” | `tech-backlog-assessment` | Assess options before an approved `retrofit`. |
| “Upgrade this selected library at all call sites.” | `retrofit` | Apply the agreed transformation; do not reopen an unrelated design process. |
| Failed tool, unread required files, or exhausted budget with zero findings | Existing review coverage contract | Incomplete evidence cannot produce an unqualified approval. |

The highest-value initial evaluation pair is a realistic positive request plus
an adjacent request that should stay with another owner. Addy's lexical routing
checks are useful cheap diagnostics; its own documentation distinguishes them
from actual host behavior. Its newer behavioral fixtures also distinguish
execution traces from dialogue-only artifacts. These ideas fit the current
shape, catalog, install, and package checks without replacing them.

## Vercel capabilities to keep optional

- [Vercel Optimize](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/vercel-optimize/SKILL.md)
  investigates deployed projects from production signals. It has CLI, runtime,
  account, framework, and observability prerequisites plus bundled scripts.
  Reuse the official integration when relevant rather than transplanting its
  collector into a generic React rule skill.
- React Native guidelines need a confirmed native/Expo team use case.
- View transitions deserve their own feature task and version/runtime support
  check; animation implementation is not a universal performance review step.
- Vercel writing guidance is organization-specific; preserve this team's
  existing documentation and style owners.
- Deploy/token helpers concern platform access and release operations; they
  do not belong inside `react-quality`.

## Delivery order and acceptance

These are proposed reviewable slices, not work started by this research pass.

1. **Narrow Vercel selection.** Add four profile references and applicability
   notes, preserving current rule locations, names, attribution and callers.
   Validate all 70 performance rules have a primary profile and all eight
   composition rules remain reachable. Exercise the boundary cases above and
   run the existing React install/package checks if runtime files change.
2. **Add UI accessibility review.** Supply its procedure, conditional pattern
   references, output contract, agent metadata and installer/catalog entries.
   Check static findings against one accessible fixture and one fixture with
   known control/focus defects; separately verify browser handoff behavior.
3. **Add bug-variant analysis.** Use a seed defect, a genuine variant, a safe
   look-alike, and an intentionally excluded directory. Require correct
   adjudication and honest coverage without edits.
4. **Extend current owners.** Add version deltas, property testing, database
   rollout and mutation-proof guidance one owner at a time, each with a
   representative scenario rather than a large imported pack.
5. **Reassess optional splits.** Promote Vercel profiles, domain modeling, or
   production optimization only when actual use warrants independent entry
   points. Carry trigger/behavior fixtures with any promotion.

## Source-level disposition

“Deep” means selected skill bodies/references or implementation evidence were
read. “Targeted” means selected delta/source inspection. “Inventory” means
readme, revision, changed paths and capability triage, not a full code audit.
Exact inspected commits and refresh exceptions are in the linked JSON record.

| Source at inspected revision | Refresh | Depth | Decision |
| --- | --- | --- | --- |
| [ai-pr-review](https://github.com/snarktank/ai-pr-review/tree/93e07cf60bc0b3a19d3b7c3595935d3f03c5bc3d) | current | Inventory | Current; workflow/reviewer integration already represented. |
| [codeql](https://github.com/github/codeql/tree/ff3231c5ac4779befd8c8690bb04f447fc6a8d13) | updated | Inventory | Scanner/query source; no new mandatory engine or scan gate. |
| [gentle-pi](https://github.com/Gentleman-Programming/gentle-pi/tree/145485c855d1c6d12dd655ef54b946887b095778) | updated | Inventory | Review-risk and session-ownership deltas; host runtime remains optional. |
| [kodus-ai](https://github.com/kodustech/kodus-ai/tree/266466b4784185342262ff61673f807e40c51827) | updated | Deep | Production-path and paired evaluation design; extend authoring/review checks. |
| [open-code-review](https://github.com/spencermarx/open-code-review/tree/fee6905939eaa804dfd90d815cecbcb26f600d32) | current | Inventory | Current; no additional review framework needed. |
| [open-code-review-alibaba](https://github.com/alibaba/open-code-review/tree/ca1065a298062a9c75432794e5a22c1ccfba86e2) | updated | Targeted | Overflow/budget coverage regression cases; strengthen existing review evidence. |
| [pi-code-preview](https://github.com/rezamonangg/pi-code-preview/tree/bf65e96cf459b11d40563a719e28f1a137303890) | current | Inventory | Current terminal widget; no skill gap. |
| [pi-extensions](https://github.com/MattDevy/pi-extensions/tree/86cbbbb1d65eeca88ce2f820dd958301625e394c) | current | Inventory | Current host extensions; no new portable procedure selected. |
| [pi-extensions-dreki](https://github.com/dreki-gg/pi-extensions/tree/b75b356784fe9ef2cedca0d209fd82503b6d9ab0) | current | Inventory | Current host extensions; retain reference only. |
| [pi-extensions-haphazard](https://github.com/HaphazardDev/pi-extensions/tree/1ebd3cc5abbe4ecca450111d086a2cb8b033b9ed) | updated | Inventory | Runtime/schema/dependency updates; no new portable workflow selected. |
| [pi-packages](https://github.com/nielpattin/pi-packages/tree/c01be3e021bf73bff60a2023bc10aaf6b5f4d101) | current | Inventory | Current package examples; no new skill selected. |
| [pi-simplify](https://github.com/geminixiang/pi-simplify/tree/42aedb33866069ad5b9110315e8904ad1018594a) | current | Inventory | Current; local simplify already owns behavior-preserving cleanup. |
| [pr-agent](https://github.com/The-PR-Agent/pr-agent/tree/33fc4b4a7c418819371b7fbef82bbab156022d31) | updated | Targeted | Immutable settings/file snapshots; extend existing review tests if a gap is found. |
| [semgrep](https://github.com/semgrep/semgrep/tree/51602ad27f09ef9342a5620601de5ef8f572fbc6) | updated | Inventory | Scanner engine updates; no new mandatory dependency. |
| [supi](https://github.com/mrclrchtr/supi/tree/38ca1919576b1d1dc302ce485a6b64842157056f) | updated | Inventory | Bounded code navigation and session delegation; runtime-specific, defer port. |
| [visual-explainer](https://github.com/nicobailon/visual-explainer/tree/5f378868e0ea745a6284b51e710c390f0c76f72c) | updated | Inventory | State-machine replay/comparison artifacts; optional prototype aid, defer runtime. |
| [agency-agents](https://github.com/msitarzewski/agency-agents/tree/652b2692f8d8ec2b1f1a38e559073e287dfdc469) | updated | Inventory | Persona catalog; extract only with a demonstrated team task. |
| [agent-skills-addyosmani](https://github.com/addyosmani/agent-skills/tree/aeac41d4d005999432bb7312f7ff06383a91d59d) | updated | Deep | Evaluation design, UI references, migration sequencing; extend current owners. |
| [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/408d3c9eee2d0c75c12a3abb5de29e53c2ca6b9e) | updated | Inventory | Role/installer catalog; no additional persona pack selected. |
| [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/be2a406907dbc61b73e6827ded415c96139d13a2) | current | Inventory | Current broad catalog; testing and authoring capabilities already represented. |
| [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice/tree/b82aa273c6069ebb308a29f6f4bc274bb43d6c64) | diverged-preserved | Inventory | Diverged local branch preserved; inspected fetched tree for reference deltas. |
| [claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/ea10b213686c90bb1984b2016937310e05336cf3) | updated | Deep | Version-delta analyst supplies a focused assessment branch. |
| [claude-skills-jeffallan](https://github.com/Jeffallan/claude-skills/tree/36f3fe8052da7c57083783268c6ea3265d075265) | updated | Inventory | Domain/upgrade/API descriptions overlap existing owners; no broad pack import. |
| [cursor-plugins](https://github.com/cursor/plugins/tree/6b78e9f4e46c75d1697d837e51f07c2692e60b24) | updated | Inventory | Large plugin/principle catalog; no blanket process or new reviewer imported. |
| [gsd-core](https://github.com/open-gsd/gsd-core/tree/1683183675c125a369fc0ffa4b67b2ec22454b74) | updated | Inventory | Gate/evaluation runtime deltas; durable phases and coverage already have local owners. |
| [gstack](https://github.com/garrytan/gstack/tree/2d42e4ece834a7fa2c16edda87ec136af6db4c26) | updated | Deep | Canary baseline comparison fits ship-it; defer browser/release runtime. |
| [scoville-code-anti-ai-slop](https://github.com/benjaminstelzer/scoville-code/tree/1d027699470e608559063e3e1779f8ef1fd61ec3) | updated | Inventory | Code-quality package overlaps simplify/review; no second anti-slop policy. |
| [scoville-scribe-anti-ai-slop](https://github.com/benjaminstelzer/scoville-scribe-anti-ai-slop/tree/0ec79a89a75682dc84858be345cd444e42481596) | unavailable | Historical only | Remote unavailable; retained snapshot is not current upstream evidence. |
| [scoville-suite](https://github.com/benjaminstelzer/scoville-suite/tree/fdd5892ec7dfe93685feb029638c7daf65cc52a5) | updated | Deep | Context cleanup ownership/meaning preservation; optional authoring workflow. |
| [skills-mattpocock](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336) | updated | Deep | Mutation proof, glossary/ADR scope, prototype/research boundaries; selective adaptation. |
| [superpowers](https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3) | updated | Deep | Rebuilt brainstorming and redacted diagnostics; preserve local proportional shaping. |
| [trailofbits-skills](https://github.com/trailofbits/skills/tree/5c99c03fb8a9ea568432ecbcba5d86e9f4ac2bf0) | updated | Deep | Variant search, property testing, dependency audit and skill-loop boundaries. |
| [vercel-agent-skills](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278) | current | Deep | All 78 copied rules mapped; optional UI source and platform skills inspected. |
| [wondelai-skills](https://github.com/wondelai/skills/tree/c172996495bed0fcd26896a9416b2093fd7073f0) | current | Inventory | Current broad principles/business catalog; no additional general-purpose pack selected. |

## Provenance and limits

No upstream code or prompt prose was copied into runtime assets. The new rule
map contains local routing judgments and existing rule identifiers. Existing
Vercel attribution remains in place. Addy, Matt, Superpowers, gstack and inspected
Scoville package license files identify MIT; the inspected Anthropic
code-modernization package identifies Apache-2.0. Trail of Bits identifies
CC BY-SA 4.0 and Kodus documents AGPL/commercial licensing, so these remain
concept sources here. Verify the exact selected artifact's license before a
future import; repository catalogs can contain components under different terms.

The available session also exposes separate Vercel platform skills. Their
presence is not evidence that every teammate has them installed. The proposed
toolbelt boundaries should remain explicit in a standalone install and defer
to an available official platform skill for platform operations.

Validation for this pass covers evidence records, rule inventory/assignment,
source-file comparisons, local document links, and diff hygiene. It does not
establish live routing accuracy, token savings, accessibility conformance, or
production performance gains. No host/model evaluation or production audit was
run as part of the research.

Completed checks: all 34 recorded local HEADs match the refresh record; 32
fast-forwarded/current clones match their fetched tracking revision, and the
diverged source's inspected revision matches its fetched tree. All reference
worktrees are clean. All 78 rules are uniquely assigned, profile totals agree,
and copied content matches upstream except for trailing whitespace. Local
document links and 12 pinned source-file links in the watched clones resolve.
`scripts/check-skill-shape.sh` and `git diff --check` pass. New research files
also pass explicit whitespace and JSON checks because ordinary Git diffs omit
untracked files.
