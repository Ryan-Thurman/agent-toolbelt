# Changelog

## Unreleased

### Added

- Added three UI use-case pages from real runs on the public RealWorld React front end (`realworld-react-fsd`, React 19): verify a user flow in the browser, clean up React effects, and review a page for accessibility and interface quality. Added the `/web-interface-review` command.
- Added use-case pages in `wiki/use-cases/` for QA, developers, product, architecture and SRE, security, tech leads, platform operators, and writers, plus end-to-end journeys. Each page has a quick path, the reasons for the path, decision points, and excerpts from a real run on the RealWorld Conduit sample API. The portal lists the pages in a Use cases section with role filters, and each skill detail links to the pages that use it.
- Added the `idea-to-release` workflow. It takes one feature through seven gated stages, from define to close, with a `Ready`, `Ready with risks`, or `Blocked` gate after each stage. Agents draft and check, and people own each decision. It defines two delivery modes (human team and agent pod), keeps early stages cheap, puts QA test cases before development, and makes code follow the ticket and its approved plan.
- Added the `papercuts` skill and `/papercuts` command. The skill reports the codebase friction that slowed a session, such as stale docs, misleading names, duplicate config, and failing commands. The report is a ranked table with a fix file and a stable key for each row. `--feature` covers one feature across sessions from phase plans, handoffs, review threads, CI runs, and commits. `--post` adds the report to a shared Markdown file, a GitHub issue, or an Azure Boards work item after a preview, and marks rows that repeat an earlier entry.
- Added the shared check `right-sizing.md`. It links each moving part of a design or a plan to a requirement, an observed failure, or a constraint. A part without a link is removed, merged, or deferred with a measurable trigger, and the safeguards stay. `system-design` runs it before the coverage sweep of a full proposal. The design review Architecture lens checks it. Phased Delivery plan readiness reports it as a warning row.
- Added a rails mode to `style-guide-init` (`--rails`). It sets up one canonical quality command and connects local use, CI, and release to it with the tools that the repository already has. It does not change application code or fix findings. A new check that finds problems in existing code stays out of the required CI path and is listed as pending adoption.
- Added an exact-text assertion rule to the shared TDD contract and `test-case-design`. An exact text assertion is for text that is the contract, such as a protocol, generated file, command output, or user-visible copy. `cover` gap scans mark tests that match source text or private names as weak.

### Changed

- Breaking: right-sized `code-quality-gate`. Consumers that compare `scope_fingerprint` or read the round fields must update. Removed flags: `--rounds`, `--scope`, `--disposition-json`. Removed header fields: `scope_fingerprint`, `round_bound`, `rounds_completed`. The fingerprint script no longer prints `scope_fingerprint`, and `head_fingerprint` is the one staleness check. The `--allowed-paths-file` argument is optional, and the gate still writes `allowed-paths.nul`. `coverage` is always `final`. `--mode=apply` no longer runs its own repair loop. It hands the accepted findings to `/pr-improve`, which owns scope, rounds, and its ledger, then runs the gate again in report mode. Status `CAPPED` stays and means that `/pr-improve` reported `capped-not-converged`. Step 2 is now one `/pr-review --tier=standard --show-nits` call. It replaces the style packet and the separate `/simplify` pass. The `--focus` flag is gone. The pre-existing failure rule now defines the same failure as the same failing test names, or the same lint rule IDs and paths. The gate pack no longer installs the style contracts and `simplify`, because `pr-review` brings the contracts it needs.
- `install.sh ... all` no longer installs the `cursor-hooks` pack. The pack is opt-in (`# OPT_IN: true`), as the docs said. Name `cursor-hooks` in the pack list to install it. A dry run now prints its counts, and a sweep prints each child folder that it skips.
- Skills that write a report and get no path from the user now write to `.atb-work/<skill>/<scope-slug>.md` and print the path. The rule is in `shared/contracts/references/execution.md`.
- A caller flag counts as posting consent only when the pack names it as its posting flag (`shared/contracts/references/posting.md`). Each outward action has a report-only or dry-run path, and a first trial uses it.

### Fixed

- Fixed the gaps that regression reruns of ten use cases found after the skill fixes. The `bdd-scenarios` first-run advice now uses a tags filter or `missingSteps: 'skip-scenario'`, and `--setup` records a smoke run. The `code-quality-gate` same-failure rule compares failure counts per test and per lint rule and path, and a base run with a missing install is `BLOCKED`. `review-queue` rejects an unknown verdict or a non-numeric findings count. `install.sh --force` reports same, changed, and new files, counts a path that two packs write once, and names a repository below a folder that is not a repository. `product-discovery` uses the four evidence verdicts of `evidence-quality.md`. The `security-audit` template defines its impact levels. The ten use-case pages now show excerpts from the reruns.
- Fixed the UI skill gaps that these runs and two private React app runs found. `webapp-testing` has a mocked-backend verdict, a folder for its scripts and evidence, a fresh-server check, a required red run, and rules for a sign-in that needs an identity provider or an install that needs a private registry. `vercel-web-interface-guidelines` reviews existing pages with no diff, hands browser-only checks to `webapp-testing`, and records conflicts. The React rule scan works on a folder that is not a git repository, separates test files, ranks rules by impact, skips framework rules that do not apply, and drops two noisy signals. `vercel-react-best-practices` and `use-effect-killer` have a whole-codebase audit procedure and rules for side effects in render, polling with no in-flight guard, and async effects with no cancel flag.
- Fixed 84 skill gaps that the second batch of use-case runs found. The high-severity fixes:
  - `review-on-open` restores the root instruction files and the `.agents/` and `.claude/` folders from the base ref before the CI reviewer starts, so a pull request cannot change the rules or the reviewer that judge it.
  - `/review-queue-worker --report-only` reviews the queue with no post and no job change. `/enqueue-review` takes the default `--sha` from the target branch, not from `HEAD`.
  - `security-audit` searches Git history with forms that print commit IDs and file names, not secret values. A dependency check with no advisory data is `Not verified`, not clean.
  - `code-quality-gate` reports a required check that also fails on the base commit as a pre-existing failure, apart from new failures, and states the `FAIL` and `BLOCKED` rules.
  - `papercuts` has one consent rule for writes, which matches the shared posting rules.
- The shared contracts now carry the lessons from the runs: a stub before the red test in typed languages and a test counts only when it was seen to fail for the expected reason, test stand-ins that answer like the real boundary, a `Decision needed` result when a skill sets no threshold, a list of checks that a setup or audit did not exercise, numbers from saved output, and dated snapshots for registry and audit data. `depth-levels.md` states which rule wins when a named level is below a signal, and the `system-design` template has a Right size section.
- `idea-to-release` has a gate report template (`templates/idea-to-release-gate-report.md`) and a table that maps skill results to gate verdicts.
- Fixed 20 skill gaps that real use-case runs found. `story-refinement` names its output files, has a depth line in the template, a Self-review fallback for the builder check, a warning state for reliability check 7, and a rule that the spec holds every criterion as a scenario. `bdd-scenarios` maps `--review` and `--setup` to its modes, proposes a default runner and continues when the repository has none (including Jest-only TypeScript APIs), and its template has a runner plan and a "waits on a question" state. `test-case-design` names change mode, supports commit ranges, defines `High`, `Medium`, and `Low` priority, names its output file, runs or flags existing tests, and treats a risk-area draft as an assumption. `risk-area-mapping` defines its coverage exclusions and states that it sets no coverage threshold. `pr-review` auto-tier states that a route path with a risk keyword is a hot path. `check-writing-rules.py --files` accepts files outside the repository.
- The installer no longer replaces a `CLAUDE.md` -> `AGENTS.md` symlink with a regular file when it updates the Toolbelt block. It also keeps the file mode of `AGENTS.md` and `CLAUDE.md`. Before this fix, a reinstall changed both files to mode `0600`.

## v1.3.0 - 2026-11-14

### Added

- Added the `production-readiness` workflow (`reliability-review` readiness mode, `failure-scenario-design` staging plans, `ship-it`) and the `incident-follow-up` workflow (`bug-to-fix`, `reliability-review`, `failure-scenario-design`, `test-case-design`, `cover`).
- Added `story-refinement`, `bdd-scenarios`, `reliability-review`, and `risk-area-mapping` to the common matches of the Cursor routing rule.
- Added the `story-refinement` skill and `/story-refinement` command. The skill finds ambiguity in a ticket, settles facts from the repository, asks the open decisions in batched rounds with defaults, writes Given/When/Then criteria with failure paths, and gives a readiness verdict from product, developer, QA, and SRE reviewer subagents.
- Added the `bdd-scenarios` skill and `/bdd-scenarios` command. The skill writes Gherkin feature files from acceptance criteria, maps steps to existing step definitions, traces each criterion to a scenario or a unit test, reviews feature files, and plans a `playwright-bdd`, `pytest-bdd`, or Cucumber-JVM runner.
- Added an acceptance loop to the shared TDD contract. A phase with BDD scenarios runs them red before the implementation and green after it, with unit TDD cycles inside. `phased-delivery` plans, plan readiness, implementation, and review now use it.
- Added the `reliability-review` skill and `/reliability-review` command. The skill reviews a design for failure modes, SLOs, dependencies, recovery, capacity, and observability, and writes testable reliability requirements. Its readiness mode checks a built service against them. `system-design` runs it next to `threat-model`.
- Added the `failure-scenario-design` skill and `/failure-scenario-design` command. The skill turns testable reliability risks into scenario cards with a Given/When/Then form, a test-first case, and a staging experiment plan with abort and no-go conditions. It writes plans only.
- Added a `pr-review` reliability facet. It runs when the diff changes clients, timeouts, retries, consumers, jobs, migrations, probes, infrastructure, or telemetry.
- Added a system-failure case reference to `test-case-design` and a reliability section to the `ship-it` readiness checklist.
- Added a change mode to `test-case-design`. It plans focused cases from a pull request, a branch, or a diff. It finds the affected callers, matches declared risk areas, and checks the existing tests.
- Added a calibration step to `test-case-design`. A set of more than ten cases starts with the five to ten cases with the highest priority, and the user's feedback applies to the rest.
- Added the shared reference `risk-areas.md` and a `## Risk areas` section for `.pr-review.md`. A team declares its high-impact paths once. `test-case-design` gives cases there high impact, and `pr-review` raises a diff that touches one to at least the standard tier. `/risk-areas` drafts the section from repo evidence.
- Added the `risk-area-mapping` skill, the `/risk-areas` command, and the `risk-based-testing` workflow. The skill drafts risk areas from code, history, ownership, and an optional workspace map (`--atlas`) into a review file. `--sweep <dir>` covers each repo under a folder with one subagent for each repo, in parallel. `--apply <file>` writes only the entries that a person approved. The signals include personal and health data, access control, data rights, exports, pipelines, ownership, defect history, and hotspots. `/pr-review-init` points to `/risk-areas` for that section.
- `test-case-design` change mode uses the workspace map to find consumers in other repositories.
- Added depth levels (Light, Standard, Deep) in the shared `depth-levels.md`. `system-design`, `story-refinement`, `reliability-review`, and `failure-scenario-design` choose a level from the risk of the change, state it, and accept `--light`, `--standard`, or `--deep`. Deep work, such as the design review and staging experiment plans, runs only at the Deep level. Required checks run at every level.
- Added `system-design` references for interface contracts, data design, domain language, distributed workflows, estimation, and an optional multi-lens design review. Each one loads only when its trigger applies.
- Added the weakest point, a coverage sweep, the test for decisions that a design must fix, and structure checks for coding agents to the `system-design` method. The template gets a "Solves / Makes worse / Change it when" decision table and depth, weakest-point, and glossary lines. An ADR is now needed only when a choice is hard to reverse, surprising, and a real trade-off.
- Added the `feature-refinement` workflow and `story-refinement` and `bdd-scenarios` stages in `feature-delivery`.
- Added the shared references `negative-testing.md`, `test-levels.md`, and `reliability-checklist.md`. `story-refinement`, `test-case-design`, and plan readiness use them. Their gaps are warnings.

### Changed

- `check-plugin-package.sh` runs its checks in parallel and prints the time of each step. A full run takes about 40 seconds instead of about 100. Set `ATB_CHECK_SERIAL=1` to run the steps one at a time.
- Renamed the `security-sensitive-change` workflow to "System design, security, and reliability" and added `reliability-review` and `failure-scenario-design` stages.
- Changed `shape-up` to ask open decisions in numbered rounds instead of one question for each message. Added non-functional requirements and an open-questions table to the brief template, and Given/When/Then criteria and a "Must not change" section to the ticket template.
- Added negative-family, boundary, and test-level steps to `test-case-design` and its template.
- Added Test levels, Negative cases, and Reliability rows to `phased-delivery` plan readiness.
- Replaced the portal's amber accent with green. Recolored the brand icon and favicons to match.
- Moved portal surfaces to a neutral slate scale in light mode and neutral grays in dark mode.
- Limited green to the hero headline, the active filter, focus rings, and the workflow start buttons.
- Made the hero follow the page theme. The light theme no longer has a black hero.
- Showed category colors only on category icons. Category labels are now gray sentence case.
- Set heading weights to 600, set card corners to 8 pixels, and removed the hover lift from task cards.
- Added an install terminal with Cursor, Claude Code, and Codex tabs and a Copy button to the hero. Phones do not show it.
- Showed the setup commands as terminal blocks with a Copy button.

### Fixed

- `pr-review` reviews a named branch with `git diff <base>...<branch>`, so the branch does not need to be checked out. It skips `git fetch` when the repository has no remote. Tier signals use the same diff range.
- `pr-review` auto-tier treats only a contract that code outside the repository or package depends on as a public-contract hot path. A changed export that only the same application imports now gets the standard tier, not deep.

## v1.2.0 - 2026-11-10

### Changed

- Reviewed every skill, workflow, command, and shared contract for size, clarity, and coverage.
- Moved procedures that existed only in commands into skills. Commands now point to their skill.
- Removed repeated rules. Each rule now has one owner file.
- Generated the stage tables in the product-learning, tech-debt, and system-design workflows from the catalog with `scripts/build-workflow-stages.js`. `check-catalog.sh` fails when a table does not match.
- Moved the review trigger invariants to `pr-review` `references/triggers.md`. `review-on-open`, `review-queue`, and `phase-gate` now point to it.
- Fixed contradictions in bug-to-fix, cover, simplify, ship-it, retrofit, phase-context-workflow, and phase-gate.
- Made `pr-review` write a head-commit marker in the posted summary. `review-on-open` and `review-queue` use it to stop duplicate posts.
- Added `--intent` to `pr-review` and `phase-gate` for an acceptance coverage table.
- Made the `pr-review` token footer opt-in with `--benchmark`.
- Made `phase-gate` solo mode merge only on `APPROVE`, re-review after each fix commit, and fix through `pr-improve`.
- Made `crap-analysis` load config from the base branch and include committed and untracked changes.
- Added a `crap-analysis` `review` operation with fixed verdicts, and `verify --changed`.
- Made `code-quality-gate` run `crap-analysis` when the base commit has `.crap-analysis.json`.
- Split the execution JSON schema into `execution-schema.md`, loaded only for JSON exchange.
- Added the shared `security-checklist.md` contract for `security-audit` and `pr-review`.
- Made `ticket-sync` keep unmapped ticket fields in the issue body.
- Added missing rows to `/workflow-router` and the README indexes.
- Added the `use-effect-killer` skill (MIT, from victor36max/use-effect-killer) to `react-quality`.
- Added the React rule scan (`shared/contracts/scripts/react-rule-scan.py`). It lists the specialist rules that changed lines trigger.
- Made `pr-review`, `code-quality-gate`, `simplify`, and `phased-delivery` run the React rule scan and record each listed rule.
- Generated each Vercel skill's `rule-routing.md` from a new `rule-index.json`, with one trigger line per rule.
- Added the Next.js Server Action authentication rule to `security-checklist.md`.
- Added the `react-acceptance.md` contract. It sets React finding severity and maps hooks lint rules for ESLint, Biome, and Oxlint.
- Added the upstream fix summary to each Vercel rule in `rule-routing.md`, ordered by upstream priority.
- Added `vercel-react-native-skills` (36 rules) and `vercel-react-view-transitions` from Vercel Labs at `1a2c79d`. `react-quality` now includes view transitions.
- Added `vercel-web-interface-guidelines` with the guideline list pinned at `434b7f9`, so reviews work offline. `react-quality` includes it, and the React rule scan now also reads `.css` and `.scss` files.
- Added `docs-writing.md`, adapted from the Vercel Labs Writing Guidelines with ASD-STE100 precedence, and AI-writing patterns in `human-readable-output.md`. `pr-review` checks documentation changes against it.
- Added the `simple-english` skill (MIT, AminBlg/SimpleEnglish 2.1.2 at `300432a`) as the base for all ASD-STE100 output. A Toolbelt override keeps bold for quick emphasis in replies. Every pack that installs the output contract now depends on it.
- Added the `writing-whip` skill and the tropes.fyi trope catalog (CC BY 4.0, Ossama Chaib). `simple-english` depends on it.
- Added one "Writing precedence" section to `human-readable-output.md` with the order between writing sources and each known conflict. `scripts/check-writing-rules.py` pins the imported writing text and lints the Toolbelt's own writing files.
- Added `pr-review --repost`, so `phase-gate --rereview` can post a second review on the same head commit. `pr-review --show-nits` for `code-quality-gate`.
- Defined one posting confirmation rule: a `--comment` flag from a caller skill, CI job, worker, or poller counts as confirmed.
- Made the `pr-review` security facet label unknown reachability instead of dropping the finding.
- Made `phase-gate` solo mode count fix rounds across the whole loop, with a total of 2 by default.
- Defined `security-audit --active-scope`. Made `bug-to-fix --diagnose` allow writes only to the investigation file. Made `bug-to-fix` the owner of the bug regression test.
- Made `/implementation-plan` an alias for `/dev-plan`, and stated the difference between `/dev-phase-review` and `/dev-pr-review`.
- Made the React rule scan print `judgment_rules`, so agents no longer read every `rule-routing.md`. `typescript-react-baseline.md` owns the scan procedure.
- Moved the long `vercel-react-view-transitions` pattern sections into references, and added a short review checklist for scan hits.
- Made skills read `human-readable-output.md` once per session. The writing precedence now states that writing rules never limit tool calls, tests, or verification.
- Made `human-readable-output.md` the complete everyday writing rule set: the ASD-STE100 reply and document rules, a short AI-trope table, and the format rules, with each known conflict settled. Agents read `simple-english` and `writing-whip` only for Strict mode, STE checks, rewrite patterns, and full trope reviews. This removes about 2,000 words from each session.
- Made each writing pack install only its own skill. A `writing-whip`-only install is valid because the output contract no longer needs `simple-english`.
- Added a "Toolbelt paths" line to each SKILL.md. In a Claude Code plugin, `${CLAUDE_PLUGIN_ROOT}` resolves `shared/`, `skills/`, `templates/`, and `workflows/` paths. On other plugin hosts, the agent uses the nearest folder that contains `shared/contracts/`. The `.atb/` installer removes the line, and `check-skill-shape.sh` requires it.
- Removed duplicate skill lists from `README.md`, `commands/README.md`, and the wiki. Thinned the `crap-analysis`, `role-review`, and `auto-agent-plan` commands.

## v1.1.9 - 2026-11-08

### Changed

- Replaced workflow stage cards with a numbered vertical timeline.
- Moved small step numbers to the far left on a connecting line.
- Placed each skill output and example prompt beside its stage description.
- Showed handoff links only for branches and exits that the timeline does not already show.

## v1.1.8 - 2026-11-08

### Changed

- Moved workflow step numbers to the left of each stage card's category marker.
- Gave the skill-detail close button a neutral border, centered symbol, and one focus ring.
- Gave example-prompt Copy buttons a visible amber border.

## v1.1.7 - 2026-11-06

### Changed

- Reduced workflow number circles to 32 pixels and their text to 16 pixels, with proportional white borders.

## v1.1.6 - 2026-11-06

### Changed

- Changed workflow number badges to circles with centered numbers and thicker white borders.

## v1.1.5 - 2026-11-06

### Changed

- Enlarged workflow step numbers and badges, with stronger text and border contrast.
- Removed leading zeros from workflow step numbers.

## v1.1.4 - 2026-11-06

### Changed

- Rebuilt workflow guides as numbered stage cards with named category markers and visible skill outputs.
- Added a first-skill action, clearer possible handoffs, and expandable example prompts.
- Used wider responsive stage layouts and retained the approved neutral dark palette.
- Added browser coverage for workflow entry, handoff navigation, prompt expansion, and accessible stage lists.

## v1.1.3 - 2026-11-06

### Changed

- Darkened task cards to charcoal gray and used soft black for the navigation header and hero.
- Changed the dark-theme library background, raised surfaces, and borders to neutral grays.

### Fixed

- Restored the `/workflow-router` table header so that the new routing rows render.
- Aligned the deep PR review coverage step with the orchestrator-owned acceptance-criteria table.
- Added the product learning workflow to the selected research synthesis and outcome review installs.
- Updated the installation guide to 33 skills.

## v1.1.2 - 2026-11-06

### Changed

- Raised dark-theme task cards onto a lighter neutral gray surface with clearer borders and a distinct hover state.
- Kept light-theme task surfaces white and retained the existing category markers and action colors.

## v1.1.1 - 2026-11-06

### Changed

- Grouped task shortcuts into exploration/planning and improvement/verification rows.
- Replaced broad category-colored surfaces with neutral cards and explicit category labels.
- Reserved amber for actions, selection, and branding. Technical improvement now uses green category markers.
- Balanced workflow choices into three desktop columns and reduced repeated card emphasis.
- Recorded a Mobbin reference comparison and checked both themes at desktop and mobile sizes.

## v1.1.0 - 2026-11-06

### Added

- Added research synthesis, product outcome review, technical debt discovery, and system design skills. The standard plugin now contains 33 skills.
- Added five compatibility commands, including `/plan-review`, with templates and installer support.
- Added shared evidence and product measurement rules, plus product learning, technical health, design-security, and retrospective workflow guides.
- Added behavioral evaluation fixtures for research, outcomes, design, planning, and debt discovery.

### Changed

- Added plan-readiness review, decision capture, requirement coverage, integration checks, and evidence freshness to existing delivery workflows.
- Connected system design, threat requirements, control status, and implementation verification.
- Updated the portal with six workflow guides, new task shortcuts, and the four new skills.

### Fixed

- Corrected technical assessment discovery text to describe one supplied item.
- Required supplied acceptance criteria at every PR review depth.
- Preserved intended assertions during regression falsification and required meaningful behavioral failure evidence.
- Replaced universal release thresholds with project baselines, observation limits, and agreed response criteria.
- Distinguished local static source analysis from active security testing and source uploads.

## v1.0.1 - 2026-11-06

### Fixed

- Fixed catalog validation in fresh checkouts. Local Cursor rules and ignored maintainer research directories are optional.
- Added checks for absent and present optional paths. Required repository files must still exist.

## v1.0.0 - 2026-11-06

### Added

- Added GitHub Pages publication after stable version increases on `main`. Package and browser checks must pass before publication.
- Replaced the portal's AT initials with the command buckle brand icon. Added SVG and 16, 32, and 48-pixel PNG favicons.
- Added native skills plugins for Cursor, Claude Code, and Codex, with 29 shared skills and a separate optional Auto Agent package.
- Added an offline portal with search, category guidance, task shortcuts, expected results, workflows, and host setup instructions.
- Added desktop and mobile browser checks, automated accessibility scans, and deterministic catalog and portal builds.
- Added repository contribution guidance with evidence checkpoints and checks for changed conventions.

### Changed

- Replaced the `dev-lite-workflow` skill with `phased-delivery`. Each supplied ticket maps to one phase and one pull request.
- Expanded `shape-up` to compare product requests with current behavior before shaping implementation work.
- Updated review, testing, security, and handoff guidance. Added shared output rules and refreshed upstream provenance records.
- Applied the selected portal design with a charcoal header, slate surfaces, distinct category icons, highlighted results, and amber actions.

### Breaking changes

- Removed the duplicate project lifecycle pack. Target repositories own their delivery forms, approval gates, and controlled records.
- Retired the `ai-feature-delivery` pack selector and `--rules full` mode. Both return migration guidance before writing files.
- Native plugins expose skills by default. Commands, rules, hooks, and unattended Auto Agent skills require their applicable optional installation paths.

### Upgrade notes

- Read the migration guide before updating an existing project. Installed legacy files are not removed automatically.
- Use `phased-delivery` for new delivery work. The `dev-lite-workflow` installer selector remains a compatibility alias.
- Preview project installation changes with `--dry-run`. Preserve project-owned command adapters and instruction files.
- All six plugin manifests and the Claude marketplace entries use version `1.0.0`.

## v0.2.0 - 2026-07-07

New CRAP-analysis pack, a `/pr-review-init` config generator, and Claude Code
`CLAUDE.md` pointer support in the installer.

### Added

- Added the `crap-analysis` pack: a skill plus `/do-crap-analysis`,
  `/crap-config`, and `/crap-refactor` commands for wizard-driven config,
  deterministic complexity/coverage scoring, review, and opt-in refactors,
  with a config template and reference docs.
- Added the `/pr-review-init` command to the `pr-review` pack: drafts a
  `.pr-review.md` repo config from repository evidence instead of starting
  from a blank template.
- Added a `CLAUDE.md` pointer block to `claude`-harness installs so Claude Code
  picks up the installed toolbelt the same way `AGENTS.md` serves other
  harnesses.

### Changed

- Tuned `pr-review` auto-tier selection and `phase-gate` mode guidance for
  phase-sized PRs, and added an output footer that nudges toward
  `/pr-review-init` when a repo has no review config.
- Updated README, wiki (Installation, Code-Review, new Utilities page), and
  tutorial docs to cover the new pack, command, and install behavior.

### Upgrade / deploy notes

- No migrations or runtime services are required.
- Rerun `./install.sh --harness <cursor|claude|codex|all> <pack ...|all>
  <target-folder>` in target projects to pick up the new pack and the
  `CLAUDE.md` pointer block.

### Rollback

- Revert the release commit and retag from the prior known-good commit if the
  changelog or release metadata is wrong.
- For installed target projects, rerun the installer from `v0.1.0` with
  `--force` if release files were already copied out.

## v0.1.0 - 2026-07-02

First public release of `agent-toolbelt`: reusable commands, skills, workflows,
templates, and installer packs for AI-assisted software delivery.

### Added

- Added the unified `install.sh` entry point with explicit harness selection for
  Cursor, Claude Code, Codex-style skills, or all harnesses.
- Added installable packs for feature delivery, bug diagnosis, PR review,
  review triggers, test coverage, simplification, release readiness, handoff,
  worktree isolation, ticket sync, and backlog assessment.
- Added hidden `.atb/` shared artifact layout so installed templates, workflows,
  examples, skills, and shared contracts avoid top-level project clutter.
- Added Cursor rule modes, `AGENTS.md` workflow pointers, polyrepo `--sweep`
  installs, and private Cursor plugin build support.
- Added user-facing docs for installation, workflows, code review utilities,
  tutorial usage, command mapping, release versioning, and installer safety.

### Changed

- Reworked earlier per-pack installers into the current single installer model.
- Clarified README entry points and wiki navigation around install paths, packs,
  and when to use each workflow.
- Namespaced shared contracts under `.atb/` for installed projects.

### Fixed

- Hardened installer behavior around harness gating, pack reachability, AGENTS.md
  regeneration, and doc/update guardrails.
- Improved skill metadata and packaging consistency so hosts can discover
  installed skills more predictably.

### Security

- Added project safety guidance to keep private notes, credentials, customer
  data, cloned repositories, and scratch files out of the public toolbelt repo.

### Upgrade / deploy notes

- No migrations or runtime services are required.
- Install by running `./install.sh --harness <cursor|claude|codex|all> <pack ...|all> <target-folder>`.
- Use `./install.sh --list` to confirm available packs before installing.

### Rollback

- Revert the release commit and retag from the prior known-good commit if the
  changelog or release metadata is wrong.
- For installed target projects, rerun the installer from the prior known-good
  repository revision with `--force` if release files were already copied out.
