# Product, QA, development, PR, and evidence skills review — 2026-11-02

> Inventory update: The 2026-11-03 cleanup leaves 29 standard skills.
> See [the ownership and migration guide](project-workflow-boundary.md).
> Counts and check results below describe the November 2 review.

**Follow-up scope:** the user has put product-skill development on hold. The
active follow-up is the [lookup and information-verification deep dive](knowledge-verification-deep-dive-2026-11-02.md).
Product recommendations below remain historical proposals, not current work.

The collection has substantial development and PR coverage. The next investment
should strengthen **customer evidence, product outcomes, functional QA, knowledge
lookup, and claim verification**. Three existing instruction gaps also deserve
correction before adding more review machinery: acceptance checks depend on PR
review tier, test falsification can change the assertion, and release thresholds
are presented without requiring project-specific justification.

These are source-based recommendations, not measured skill effectiveness.
This pass saved a review and source record; implementation items below remain
open. Existing uncommitted work was preserved.

## Scope and evidence limits

- Inventoried the **30 canonical skills**, their catalog classifications, and
  all **34 watched reference clones**. Read the relevant product, development,
  QA, review, and release procedures and references in depth.
- Compared with the [October 18 review](upstream-deep-dive-2026-10-18.md),
  including recommendations that have not become canonical skills.
- Attempted to fetch all 34 clones. **All 34 failed because shell DNS could not
  resolve github.com; no clone HEAD changed.** This is an environment failure,
  not evidence that 34 repositories disappeared or have no updates.
- Browser access succeeded for selected primary-source pages. Those reads are
  dated November 2 and use mutable `main` URLs; no new full repository SHA was
  resolved. They support the capability recommendations, not a complete
  upstream delta audit. Retained clone SHAs are historical evidence.
- The [source record](upstream-refresh-2026-11-02.json) separates failed fetches,
  retained revisions, local comparisons, successful browser reads, and failed
  guessed paths. Scratch inventories and fetch logs are in
  `.atb-work/focus-review-2026-11-02/`.

## Coverage against the requested focus

The catalog contains seven Review & Quality skills, five Codebase Improvement,
five Discovery & Planning, four Feature Delivery, three Testing & Verification,
three Agent Operations, two Security & Risk, and one Debugging & Repair.
Categories describe ownership, not quality or actual use. In particular,
“Discovery & Planning” includes technical assessment and contribution guides;
it should not be counted as five dedicated product skills. “Testing &
Verification” currently covers software behavior, not general factual claims.

| Focus | Current owners and evidence | Assessment and next investment |
| --- | --- | --- |
| Product problems and scope | [product-discovery](../skills/product-discovery/SKILL.md), [shape-up](../skills/shape-up/SKILL.md), its [current-state comparison](../skills/shape-up/references/current-state-gap.md) | Good initial decision boundaries. Add traceable research synthesis, comparison of opportunities, and outcome review after delivery. |
| QA and test design | [test-case-design](../skills/test-case-design/SKILL.md), [cover](../skills/cover/SKILL.md), [webapp-testing](../skills/webapp-testing/SKILL.md) | Case design, test authoring, and browser execution have separate owners. Functional API/CLI/job exploration and focused accessibility review lack equivalent execution/review procedures. |
| Development | [phased-delivery](../skills/phased-delivery/SKILL.md), [bug-to-fix](../skills/bug-to-fix/SKILL.md), [ticket-discovery](../skills/ticket-discovery/SKILL.md), assessment, retrofit, simplify | Broad coverage already exists. Improve version-delta decisions, behavior evidence, and data-rollout planning within these owners. |
| PR work | [pr-review](../skills/pr-review/SKILL.md), pr-improve, pr-review-reply, phase-gate, review-on-open, review-queue | Rich coverage. Prioritize intent alignment and calibrated findings; another reviewer/router/queue is low priority. |
| Knowledge lookup | Repo lookup occurs inside shaping, assessment, debugging, and ticket discovery | No general owner for a question spanning repository evidence, official documentation, and connected knowledge sources. Propose `knowledge-lookup`. |
| Information verification | Individual skills require evidence; review critics falsify code findings | No general owner for checking a set of factual claims, source entailment, versions, dates, and conflicting evidence. Propose `information-verification`. |
| Product results after release | Discovery defines success thresholds; [ship-it](../skills/ship-it/SKILL.md) monitors release health and business metrics | Release safety is covered more concretely than the decision “did this solve the customer problem?” Propose a focused outcome-review capability. |

## Findings in existing skills

### 1. Intent alignment is not automatically selected for standard PR review

The [standard facet selector](../skills/pr-review/references/fan-out.md) selects
correctness, tests, standards, and maintainability, then adds security and
performance by change signal. Automatic linked-spec selection is described for
deep review; the [spec facet](../skills/pr-review/facets/spec-alignment.md) also
labels itself deep-only. A caller can force the facet today, and
[phased-delivery review](../skills/phased-delivery/references/review-rules.md)
already checks every acceptance clause. The gap is ordinary standalone review.

**Consequence:** a standard review of a well-written implementation can miss an
explicit product requirement because intent alignment was not selected.

**Recommended correction:** whenever supplied intent contains checkable
acceptance criteria, assess those criteria at every tier. A light review can
use one compact table; standard can select the existing facet. Depth should
control investigation cost, not whether stated requirements count. Preserve
uncertainty when intent is unavailable or ambiguous.

**Acceptance:** a standard-review case with a linked ticket and one omitted
requirement reports the omission. A case without a source requirement invents
none. Phase review and standalone review use compatible coverage states.

### 2. Test falsification can prove the assertion changed instead of the behavior

The [authoring reference](../skills/cover/references/authoring.md), under
“Falsify the test,” permits mutating the expected value to obtain a red run.
Changing `expect(total).toBe(10)` to `toBe(11)` establishes that an assertion
runs, but does not establish that it detects the intended regression. The same
reference calls for temporarily breaking behavior while the
[skill boundary](../skills/cover/SKILL.md) says tests only; the permitted
isolation and restoration procedure needs clarification.

**Recommended correction:** preserve the intended assertion. Prefer a recorded
pre-fix revision or an isolated, bounded mutation of the actual behavior. Verify
that the mutation landed, that failure came from the intended symptom, and that
restoration succeeded. Keep test-authoring permissions explicit; inability to
run a safe mutation is an unverified limit, not proof of a useless test.

**Acceptance:** an expected-value-only edit cannot satisfy regression evidence;
an ineffective mutation and a setup-error failure cannot satisfy it either.
Existing user changes survive the experiment.

### 3. Release thresholds are universal where they need local evidence

The [rollout reference](../skills/ship-it/references/rollout-and-rollback.md)
gives fixed percentage thresholds, staged observation windows, and an
“immediately” rollback instruction. It does not require those numbers to be
derived from a project's baseline, traffic, SLOs, or metric definition.

**Consequence:** a small sample or a zero-error baseline can produce misleading
release advice, and a movement in a business metric can be mistaken for a
release-caused effect. Deployment authority remains governed by the existing
skill; this finding concerns decision quality.

**Recommended correction:** identify examples as examples. Require a named
deployment/baseline, metric definition and denominator, comparable observation
window, available sample, agreed triggers, and missing-evidence handling.
Distinguish release-health checks from longer-term product outcome analysis.

**Acceptance:** a low-traffic or zero-baseline case reports insufficient evidence
where appropriate; a high-traffic case uses the supplied project policy.
An observational business-metric change alone does not establish causation.

### 4. Structural checks do not yet establish skill behavior or routing quality

The shape, mirror, and catalog checks pass. The
[style fixture checker](../scripts/check-pr-review-style-fixtures.sh) checks
that fixture vocabulary exists; its result is an inventory check. The existing
[review benchmark ledger](../skills/pr-review/benchmarks/results.md) includes
historical and explicitly confounded comparisons. Neither proves the proposed
new skills will route correctly or improve outcomes today.

**Recommended correction:** implement the October evaluation recommendation
alongside the first focused changes. Use positive, adjacent-negative, and
failure cases; inspect actual invocation and resulting behavior in supported
hosts. Keep lexical checks labeled approximations and incomplete executions
unscored. Addy's [evaluation design](https://raw.githubusercontent.com/addyosmani/agent-skills/main/evals/README.md)
provides useful distinctions between structural, routing, and behavioral evidence.

## Prioritized implementation backlog

Priority follows the requested focus and the specificity of each gap. This is
an ordered backlog, not an instruction to install six new skills together.
Each new entry point must demonstrate an independent trigger and useful output;
otherwise keep the capability in an existing owner or a conditional reference.

| Order | Work item and owner | Checkable result |
| --- | --- | --- |
| 1 | Correct linked-intent selection in `pr-review` and falsification in `cover` | The omitted-requirement and ineffective-mutation cases above expose the intended failure without inventing scope or disturbing user changes. |
| 2 | Add `knowledge-lookup` | Answer a bounded question with exact supporting locations, source scope, retrieval/version context, and visible search/access gaps. Prefer the relevant connected source or repository; use official external sources for current technical facts. |
| 3 | Add `information-verification` | Produce a claim ledger: supported, contradicted, mixed, or insufficient evidence; each row has the actual evidence, applicable date/version, and reason. Search for disconfirming evidence. Repeated copies of one source do not become independent confirmation. |
| 4 | Add `user-research-synthesis`; strengthen `product-discovery` handoff | A theme traces to supplied interview/ticket/survey IDs and exact supporting passages; observations, interpretations, counterexamples, sample limitations, and decision implications stay distinct. Discovery consumes the synthesis to choose an experiment or opportunity. |
| 5 | Add behavioral and routing evaluation cases for items 1–4 | Record expected owner, observed invocation, artifact expectations, source snapshot, host/model, failures, and unresolved cases. Compare with existing behavior before claiming improvement. |
| 6 | Add `functional-qa` for API, CLI, webhook, worker, and job behavior | A scoped charter, controlled fixture/data state, commands/inputs, expected and observed output, side-effect evidence, cleanup, and tested/failed/blocked coverage. Use existing runners; hand browser work to `webapp-testing` and fixes to development. |
| 7 | Correct `ship-it` baseline/threshold guidance and add `product-outcome-review` | A product review names the original hypothesis, metric/denominator, baseline, population/cohort, period, data quality, guardrails, uncertainty, and next decision. Release health stays in `ship-it`; insufficient data is a valid result. |
| 8 | Add `ui-accessibility-review` as proposed in October | Source findings identify the affected interaction and user consequence; static, browser, and assistive-technology evidence remain distinct. Browser execution reuses `webapp-testing`. |
| 9 | Extend `test-case-design` and `cover` with property/contract techniques | Choose a real invariant or interface contract, use existing tooling, replay counterexamples, and prove a meaningful behavioral regression is caught. Avoid blanket test requirements. |
| 10 | Extend assessment/delivery references for upgrades and database rollouts; narrow Vercel reference selection | Official source/target deltas intersect actual project usage; data rollout accounts for mixed-version compatibility and recovery; performance runs load applicable rules. No second general delivery framework. |

Lookup and verification have different completion conditions: lookup finds an
answer; verification tests whether an asserted answer holds. They can share a
small evidence reference. Simple lookups should not require a separate audit,
and verification should reuse fetched evidence when it is still applicable.

Product prioritization, interview preparation, and competitive analysis can
start as conditional `product-discovery` references. Compare opportunities using
customer impact, evidence, strategic fit, dependencies, and cost of delay;
avoid fabricated precision. Keep feature specifications in shaping/delivery.
Research synthesis earns a separate entry because summarizing supplied research
can be useful without deciding what to build. Outcome review answers a separate
question after an experiment or release.

## What to extract from upstream

Treat these sources as research material. Adapt the method using local wording,
verify licenses before copying, and preserve local scope and authorization.
No upstream runtime, telemetry, connector configuration, or publishing step was
executed during this review.

| Source inspected | Useful extraction | Qualification |
| --- | --- | --- |
| [Anthropic research synthesis](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/design/skills/research-synthesis/SKILL.md) | Evidence-linked themes, observations versus interpretation, research limitations | New watch candidate. Use real sample denominators and counterexamples; do not invent segments, quotes, or prevalence. Publishing mentioned upstream does not become a default local step. |
| [Anthropic metrics review](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/product-management/skills/metrics-review/SKILL.md) | Baseline/target comparison, segments, trends, action decisions | New watch candidate. Distinguish association from causation; specify denominator and comparable populations. |
| [Anthropic search strategy](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/enterprise-search/skills/search-strategy/SKILL.md) | Query decomposition, intent-specific source selection, explicit unavailable-source fallbacks | Search relevant connected sources; avoid copying fixed ranking weights or indiscriminately searching every tool. |
| [Anthropic knowledge synthesis](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/enterprise-search/skills/knowledge-synthesis/SKILL.md) | Attribution, deduplication, visible contradictions | Authority and applicability depend on the claim. A recent draft does not automatically supersede an approved policy; fixed age buckets do not establish truth. |
| [Matt Pocock research](https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/research/SKILL.md) | Follow claims to primary sources and retain cited findings | Concise starting point, not a full verification procedure. Its background-agent requirement is not needed for ordinary lookup; use available authorized execution. |
| [Wondelai continuous discovery](https://raw.githubusercontent.com/wondelai/skills/main/continuous-discovery/SKILL.md) | Opportunity-to-experiment linkage and past-behavior research | Extract relevant methods into discovery; leave universal cadence requirements and arbitrary practice scores behind. |
| [gstack QA](https://raw.githubusercontent.com/garrytan/gstack/main/qa-only/SKILL.md) and [exploration reference](https://raw.githubusercontent.com/garrytan/gstack/main/qa-only/sections/exploratory.md) | Surface-specific functional exploration, charters, reproducible evidence, limits | Useful beyond browser checks. Local runners and evidence paths suffice; its host preamble and runtime are separate dependencies. |
| [Addy evaluations](https://raw.githubusercontent.com/addyosmani/agent-skills/main/evals/README.md) | Separate shape, selection, and behavioral evidence; test adjacent negatives | Lexical ranking is an approximation. Host/model-specific results do not automatically transfer here. |
| Trail of Bits variant/property testing at the retained October revision | Known-seed calibration, invariants, counterexamples | Still useful, but no November delta verified. Keep bug-variant search behind the newly requested product/evidence gaps in priority. |
| Kodus and PR-Agent at retained October revisions | Finding falsification, immutable review inputs, incomplete-coverage handling | Much is already represented locally. Require a demonstrated gap before adding another review stage. |

Anthropic's [product README](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/product-management/README.md)
advertises additional planning capabilities, but its listed
`user-research-synthesis` and `metrics-tracking` names did not resolve at the
initially guessed paths. The actual `design/research-synthesis` and
`product-management/metrics-review` files above were read instead. A catalog
listing is discovery evidence; inspect the implementation before recommending
adoption.

## Watch-source priorities

Keep existing clones and history. Concentrate future deep reads on a demonstrated
capability gap; perform a lightweight inventory pass elsewhere. This changes the
recommended allocation of review effort, not the runtime catalog.

| Review effort | Existing watched repositories | Next question |
| --- | --- | --- |
| Primary: product, QA, evidence, and development | `wondelai-skills`, `skills-mattpocock`, `gstack`, `agent-skills-addyosmani`, `trailofbits-skills`, `superpowers`, `vercel-agent-skills` | Which bounded product/evidence/QA task becomes more reliable, and which current owner should receive the method? |
| Targeted PR correctness | `kodus-ai`, `pr-agent`, `open-code-review-alibaba`, `gentle-pi` | Does a change address a real local false positive, missed requirement, stale input, or missing coverage report? |
| Discovery catalogs; inspect named candidates only | `agency-agents`, `awesome-claude-code-subagents`, `awesome-claude-skills`, `claude-plugins-official`, `claude-skills-jeffallan`, `cursor-plugins` | Is there a specific capability missing here, beyond a role/persona name? |
| Development/runtime references; targeted checks | `gsd-core`, `scoville-code-anti-ai-slop`, `scoville-suite`, `claude-code-best-practice`, `supi`, `pi-simplify`, `visual-explainer` | Can the useful procedure be adapted without adopting another host runtime or duplicating current workflow owners? |
| PR/host integration maintenance | `ai-pr-review`, `open-code-review`, `pi-extensions`, `pi-extensions-dreki`, `pi-extensions-haphazard`, `pi-packages` | Is there a concrete provider, diff-acquisition, or interaction defect relevant to our current skills? |
| Specialized scanner references | `codeql`, `semgrep` | Is an actual security/test task asking for engine-specific help? Keep engines optional. |
| Low relevance or historical | `pi-code-preview`, `scoville-scribe-anti-ai-slop` | Preview is a display widget. Scribe was unavailable in October; this run's DNS failure cannot establish its current availability. |

**Add one focused source candidate:**
[anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins),
limited initially to product-management, design research, enterprise-search,
and relevant engineering test guidance. This is distinct from the already
watched `anthropics/claude-plugins-official`. The new source was browser-reviewed
but was not cloned, installed, or added to the existing PR-only repo list.

The 34 clone inventory and `repos/repos.txt` currently differ in scope: that
file lists PR sources, while the refresh helper discovers clones under both
research directories. A future executable watch policy needs one explicit
inventory with source URL, tracked branch, focus areas, depth, last successful
fetch, and disposition. Keep that maintenance work behind the capability fixes.

## Evaluation cases to require during implementation

These are proposed scenarios, not live-host test results from this review.

| Case | Expected observation |
| --- | --- |
| A stale decision document conflicts with a newer draft | Lookup presents the conflict and approval/version context instead of declaring “latest wins.” |
| Several pages repeat the same unsupported claim | Verification traces their common origin and does not count them as independent evidence. |
| Git/network lookup fails, as it did in this review | Report unavailable current evidence; retained SHAs and cached pages remain labeled. |
| Interviews contain three supporting accounts and two counterexamples | Synthesis preserves both and reports the actual supplied sample. |
| A standard PR omits one linked acceptance clause | The omission appears despite clean code and green implementation tests. |
| A test is made red by changing only its expected literal | This does not satisfy behavioral falsification. |
| An API smoke test passes while queued processing fails | Functional QA reports partial coverage/failure with separate response and side-effect evidence. |
| An accessibility scan passes but a dialog traps keyboard focus | Report the interaction failure; a clean scan does not establish complete coverage. |
| Activation rises with a changed signup population | Outcome review checks cohort comparability and avoids an unsupported causal claim. |
| An unrelated formatting request arrives | Knowledge, product, and QA skills stay quiet unless their work is actually needed. |

## Validation performed

Passed `scripts/check-skill-shape.sh`, `scripts/check-skill-sync.sh`,
`scripts/check-catalog.sh`, and `scripts/check-pr-review-style-fixtures.sh`.
These establish the existing structural baseline, not behavioral success.
Final documentation/source-record checks are recorded with this review's
completion: JSON parsing, local link resolution, 34 unchanged clone HEADs,
watch-table inventory parity, and whitespace validation.

The October Vercel narrowing and bug-variant proposals remain useful. This pass
places product evidence and general evidence handling ahead of them in response
to the requested focus. Broad persona imports, more queues, and replacement
delivery frameworks remain low priority.
