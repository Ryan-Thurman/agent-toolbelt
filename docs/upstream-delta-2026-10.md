# Upstream refresh — 2026-10-06

## Scope and refresh result

Refreshed the reference clones used for skill and review research, then selected
changes against the current working skills rather than replacing them with
upstream packs. Existing uncommitted toolbelt work was preserved. No global
skill installation, external posting, commit, or publication was performed.

The original refresh covered 31 clones: **19 fast-forwarded, 11 were current,
and one remote was unavailable**. CodeQL and Semgrep were present in
`repos/repos.txt` but missing locally; both now have fresh shallow reference
clones. Scoville Suite was added as an active related source after investigating
the unavailable Scribe repository. There are now **34 local reference clones,
33 checked against available upstreams**, with no dirty reference worktrees.

`scoville-scribe-anti-ai-slop` returned `Repository not found`; its last local
revision was retained. The author's current repository listing and Scoville
Suite do not expose a Scribe package, so the suite is not described as a direct
Scribe replacement. `scoville-code-anti-ai-slop` redirects to `scoville-code`;
its origin URL now names the current repository, while its local directory is
unchanged. GSD's watched branch remains `next`, as before this refresh.

The [machine-readable refresh record](upstream-refresh-2026-10-06.json) contains
full before/after commits, source URLs, branches, statuses, and exceptions.
Local research logs remain in `.atb-work/upstream-refresh-2026-10-06.log` and
`.atb-work/upstream-diffs-2026-10-06/`; clones and scratch are gitignored.

## Adopted changes

| Source and inspected evidence | Local correction | Completion criterion |
| --- | --- | --- |
| [Superpowers writing-plans at 8ca22db](https://github.com/obra/superpowers/blob/8ca22db/skills/writing-plans/SKILL.md) now distinguishes decisions needed for implementation from writing the implementation in advance. | `phased-delivery`, its implementation reference, and the plan template ask for owners, interfaces, fixed source values, and checkable results; routine code bodies stay in execution. | Existing phase/PR approval and ticket boundaries are preserved; plans can be concise without losing decisions. |
| [Matt Pocock handoff at 6fd9479](https://github.com/mattpocock/skills/blob/6fd9479/skills/productivity/handoff/SKILL.md) resolves the OS temporary directory explicitly. | `handoff` specifies a unique temporary file, OS path resolution, and reporting the saved path; phase-owned handoffs keep their existing path. | A new session receives the actual path, and ordinary handoffs cannot overwrite each other by using one shared filename. |
| [Kodus review-warnings at c2ac14f4d095](https://github.com/kodustech/kodus-ai/blob/c2ac14f4d095/libs/code-review/infrastructure/agents/engine/review-warnings.ts), [Trail of Bits scan workflow at 82fe822](https://github.com/trailofbits/skills/blob/82fe822/plugins/static-analysis/skills/semgrep/workflows/scan-workflow.md), and [GSD gate evidence at 82f7acdfa](https://github.com/open-gsd/gsd-core/blob/82f7acdfa/docs/features/gate-evidence-and-exit-status.md) distinguish completed work from unread, skipped, or unavailable evidence. | `pr-review` records coverage and limits, retains completed findings after a stage failure, and uses `NEEDS DISCUSSION` for unresolved required scope when no blocker exists. Posting summaries carry the limits too. | An empty result from a failed or missing stage cannot produce a clean approval; intentional exclusions and optional tooling failures remain proportionate. |
| [PR-Agent config security at 75a70d8d](https://github.com/The-PR-Agent/pr-agent/blob/75a70d8d/pr_agent/config_security.py) keeps provider auth and TLS settings host-owned. | The per-repo review-config reference distinguishes review preferences from credentials, provider endpoints, TLS, tool permissions, and posting authority. | Even a base-branch review config cannot grant host capabilities or external authorization. |
| [Gentle Pi validator-evidence change at 69c9b5ae](https://github.com/Gentleman-Programming/gentle-pi/commit/69c9b5ae265a60ffaf1dc9e0efc1afdac966f300) preserves rejection diagnostics. | Rejection-memory records retain the falsifying observation and code reference, and date the actual rejection rather than using the source commit's date. | New records explain why a finding was rejected; old records remain readable without fabricated evidence. |
| Local routing review, informed by [Scoville's proportional validation](https://github.com/benjaminstelzer/scoville-suite/blob/6ad3e20fd1d8/packages/scoville-code/scoville-code/references/validation.md). | `/workflow-router` checks task-relevant project requirements rather than metadata presence alone. Raw ideas route to discovery/shaping; formal feature records are selected when traceability is required. The minimal Cursor router also allows direct bounded implementation. | A clear personal change or raw idea does not acquire a formal feature lifecycle merely because work documents or skills are available. |

All adaptations use local wording. Kodus is an AGPL source and Trail of Bits is
CC BY-SA 4.0: these were inspected for concepts, with no source code or prompt
prose copied. The copied Vercel MIT rule packs are unchanged at
`063bee94c3f4df8453406c830b0a7df0f2860278`; their source trees have no new delta.

## Considered without adding to the core

- **Matt Pocock implement-spec:** useful task-frontier and context-pointer ideas,
  but its integration-branch/fan-out contract differs from this toolbelt's
  human-reviewed phase PRs. Keep it as a candidate for a separately chosen
  personal workflow. Its new PR and merge-conflict skills also deserve a future
  fit review rather than automatic installation.
- **Addy's mutation-based review checks:** the local `cover` lane already
  falsifies new tests. A report-only review should stay read-only; running
  mutation experiments there would need an isolated, authorized branch. No
  standing mutation requirement was added.
- **Repeated findings and human dismissals:** Kodus and PR-Agent improve repeat
  suggestion handling. Local posting already uses stable markers. Human
  dismissal still differs from an adjudicated false positive; the existing
  judge-only rejection-memory boundary is preserved.
- **Gentle Pi session profiles:** session-local selection is a useful isolation
  pattern for the [work/personal proposal](work-personal-workflows.md). Its
  runtime model-routing implementation was not ported into markdown skills.
- **GSD gate/runtime consolidation, gstack release and scanner machinery,
  browser/video presentation, persona catalogs, and host-specific packaging:**
  inventoried for fit, without importing their runtime, blanket process, model
  preferences, or infrastructure.
- **CodeQL and Semgrep:** restored as research sources. Running or integrating
  scanners is outside this skill refresh; no new dependency or scan gate was
  introduced.

The review inventoried commit ranges and changed-path summaries across refreshed
sources, then inspected content for the changes above. It is selective skill
maintenance, not a complete audit of every upstream implementation. Several
upstreams have hundreds of commits since the local baseline.

## Validation

Baseline skill-shape, canonical-copy sync, and catalog checks passed before
editing. Final checks passed:

- `scripts/check-skill-shape.sh` and `scripts/check-skill-sync.sh`.
- `scripts/check-plugin-package.sh`, including cross-host manifests, real
  package/install checks, catalog and generated-audit checks, offline portal
  build and browser smoke, and Claude's strict plugin validator.
- `scripts/check-code-quality-gate-install.sh`, including dependency expansion
  and the independence of the phase pack from optional quality gates.
- A temporary all-harness install of the three changed skill packs: installed
  trees match canonical files with the expected path rewriting; Cursor/Claude
  command entrypoints, shared Cursor/Codex discovery, phase template, and
  minimal Cursor router are present. An initial check incorrectly expected
  `.claude/skills`; it was corrected to the installer's compatibility-command
  surface before rerunning successfully.
- All 34 recorded revisions match local HEADs; the 33 accessible clones match
  their fetched upstreams. All reference worktrees are clean, and the new local
  documentation links resolve.
- `git diff --check`.

Static scenario review covers clean complete scope -> `APPROVE`, empty findings
with a failed selected facet -> `NEEDS DISCUSSION`, and a blocker plus scope gaps
-> `REQUEST CHANGES`. These are instruction checks, not independent live-host
behavior evaluations. The work/personal profile proposal remains uninstalled.

## Source revisions

The following table summarizes the full refresh record.

| Source | Branch | Before | After / retained | Result |
| --- | --- | --- | --- | --- |
| [snarktank/ai-pr-review](https://github.com/snarktank/ai-pr-review) | `main` | `93e07cf60bc0` | `93e07cf60bc0` | current |
| [github/codeql](https://github.com/github/codeql) | `main` | new clone | `36994cdec4ff` | cloned |
| [Gentleman-Programming/gentle-pi](https://github.com/Gentleman-Programming/gentle-pi) | `main` | `8035114a57b8` | `ed536d4f35ca` | updated |
| [kodustech/kodus-ai](https://github.com/kodustech/kodus-ai) | `main` | `9d35bc3e2c04` | `c2ac14f4d095` | updated |
| [spencermarx/open-code-review](https://github.com/spencermarx/open-code-review) | `main` | `fee6905939ea` | `fee6905939ea` | current |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | `main` | `486022daaf14` | `182898cf522d` | updated |
| [rezamonangg/pi-code-preview](https://github.com/rezamonangg/pi-code-preview) | `main` | `bf65e96cf459` | `bf65e96cf459` | current |
| [MattDevy/pi-extensions](https://github.com/MattDevy/pi-extensions) | `main` | `86cbbbb1d65e` | `86cbbbb1d65e` | current |
| [dreki-gg/pi-extensions](https://github.com/dreki-gg/pi-extensions) | `main` | `b75b356784fe` | `b75b356784fe` | current |
| [HaphazardDev/pi-extensions](https://github.com/HaphazardDev/pi-extensions) | `main` | `812d65d8bdeb` | `812d65d8bdeb` | current |
| [nielpattin/pi-packages](https://github.com/nielpattin/pi-packages) | `main` | `c01be3e021bf` | `c01be3e021bf` | current |
| [geminixiang/pi-simplify](https://github.com/geminixiang/pi-simplify) | `main` | `42aedb338660` | `42aedb338660` | current |
| [The-PR-Agent/pr-agent](https://github.com/The-PR-Agent/pr-agent) | `main` | `02718aeec223` | `99b72f62abb4` | updated |
| [semgrep/semgrep](https://github.com/semgrep/semgrep) | `develop` | new clone | `57cfaa2f3d5e` | cloned |
| [mrclrchtr/supi](https://github.com/mrclrchtr/supi) | `main` | `0a93e0674524` | `f53309bd7356` | updated |
| [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) | `main` | `7163c3e10660` | `0cc6f15452c4` | updated |
| [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | `main` | `053ddbbf392a` | `5baafd5f1452` | updated |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `main` | `bcab6a1b8503` | `1401c8b8030e` | updated |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | `main` | `82b73821baa7` | `721e9734670b` | updated |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | `master` | `be2a406907db` | `be2a406907db` | current |
| [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) | `main` | `36d47e764577` | `c8602b2a2ca0` | updated |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | `main` | `ad30d62cd52a` | `d4226d062928` | updated |
| [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | `main` | `882ef55e377d` | `1be15d8064f8` | updated |
| [cursor/plugins](https://github.com/cursor/plugins) | `main` | `fadd23794c00` | `9f451cf875ad` | updated |
| [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) | `next` | `f4b6abb48e78` | `82f7acdfa7f6` | updated |
| [garrytan/gstack](https://github.com/garrytan/gstack) | `main` | `730a1017d1a1` | `7697fb298173` | updated |
| [benjaminstelzer/scoville-code](https://github.com/benjaminstelzer/scoville-code) | `main` | `465b04942253` | `254ff39cec46` | updated |
| [benjaminstelzer/scoville-scribe-anti-ai-slop](https://github.com/benjaminstelzer/scoville-scribe-anti-ai-slop) | `main` | `0ec79a89a756` | `0ec79a89a756` | unavailable |
| [benjaminstelzer/scoville-suite](https://github.com/benjaminstelzer/scoville-suite) | `main` | new clone | `6ad3e20fd1d8` | cloned |
| [mattpocock/skills](https://github.com/mattpocock/skills) | `main` | `c55ee46073ed` | `6fd947921b93` | updated |
| [obra/superpowers](https://github.com/obra/superpowers) | `main` | `5bf4e7801107` | `8ca22dba9a94` | updated |
| [trailofbits/skills](https://github.com/trailofbits/skills) | `main` | `0cc1c73a5e96` | `82fe82262526` | updated |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `main` | `063bee94c3f4` | `063bee94c3f4` | current |
| [wondelai/skills](https://github.com/wondelai/skills) | `main` | `c172996495be` | `c172996495be` | current |
