# Product, design, and technical health implementation — 2026-11-06

Release `1.1.0` adds four standard skills and five compatibility commands.
The native plugin contains 33 standard skills.
The portal contains six workflow guides and six task shortcuts.

| Capability | Entry point | Result |
| --- | --- | --- |
| Research synthesis | `user-research-synthesis` | Themes link to supplied evidence, counterexamples, and sample limits. |
| Product outcome review | `product-outcome-review` | Results are assessed against the original hypothesis, comparable populations, and guardrails. |
| Technical debt discovery | `tech-debt-discovery` | A scoped register records consequences, priorities, confidence, and completion conditions. |
| System design | `system-design` | A design document links to a threat review, security requirements, and verification methods. |
| Plan readiness | `/plan-review`, owned by `phased-delivery` | Report-only review checks coverage, decisions, dependencies, connections, and verification before execution. |

Each new skill has metadata, a template, a compatibility command, and an installer.
The selected system-design installer includes its threat-model dependency.
Native host invocation remains skill-based.
Compatibility commands remain outside default native plugin command discovery.

Existing discovery now supports opportunity comparison, neutral interview preparation, experiment design, and product measurement definitions.
Technical assessment includes official source-to-target version analysis against actual code usage.
Shaping and delivery preserve agreed decisions, delegated choices, exclusions, and requirement coverage.
Execution checks evidence freshness before reusing completion records.

PR review checks supplied acceptance criteria at every depth.
Test falsification preserves the intended assertion and requires a meaningful behavioral failure.
Release guidance uses project baselines and identifies illustrative rollout numbers as examples.
Security review distinguishes local static analysis, external advisory queries, source uploads, and active target testing.
Threat and audit outputs connect design revisions, required controls, owners, and verification evidence.

Reusable workflows remain in Toolbelt.
Discover retains its project records, internal registers, document format, approvals, and release requirements.
This implementation changes no Discover files and installs no skills into that workspace.

| Verification | Result | Evidence and limit |
| --- | --- | --- |
| Cross-host package and selected installs | Passed. | Six manifests and marketplace versions agree. New selected packs install commands, shared references, templates, and the required threat dependency. |
| Catalog and generated audit | Passed. | The catalog contains 33 skills and six workflows. Negative validation cases remain active. |
| Portal build and browser flows | Passed. | Eight Playwright cases cover desktop and mobile in both themes, including new shortcuts and workflow navigation. |
| Accessibility scans and screenshots | Passed within automated scope. | Existing scans reported no violations for the tested states. Desktop-light and mobile-dark home screenshots were visually reviewed. |
| Canonical shape and synchronization | Passed. | Skill structure checks pass and the complete phased-delivery mirror matches its canonical tree. |
| Independent skill behavior | Passed after focused corrections. | Five fixture cases and their limits are recorded in the [evaluation ledger](../evals/results-2026-11-06.md). |
| Additional skill-creator Python validator | Unavailable. | The system Python lacks PyYAML. An isolated dependency request failed DNS. Repository skill and package validators passed. |

The browser checks used `PLAYWRIGHT_SINGLE_PROCESS=1` because ordinary Chromium startup failed in this environment.
Automatic skill routing across supported hosts and production effectiveness were not measured.
Functional QA, accessibility review skills, and independent knowledge lookup and claim verification remain separate future work.

The [research record](skill-packaging-research-2026-11-06.md) explains the selected scope and source methods.
