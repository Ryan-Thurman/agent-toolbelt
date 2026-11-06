# Shared workflows and project ownership

Agent Toolbelt owns reusable skills and workflows.
Each target repository owns its delivery process and project requirements.

Release `1.1.0` contains 33 standard skills and two optional Auto Agent skills.
The 2026-11-03 cleanup established the shared and project ownership boundary.
Release `1.0.0` includes this cleanup and its installation changes.
Earlier cleanup work kept plugin versions at `0.2.0`.

| Capability | Owner | Result |
| --- | --- | --- |
| Planning and implementation | Toolbelt | `phased-delivery` accepts raw requirements, existing plans, and approved project tickets. |
| QA and tests | Toolbelt | Test design, test authoring, coverage review, and browser testing remain available. |
| Development and PR review | Toolbelt | Debugging, code review, bounded fixes, refactoring, and release preparation remain available. |
| Output format | Toolbelt | Shared rules specify tables, diagrams, action plans, and ASD-STE100 language. |
| Optional Auto Agent execution | Toolbelt | Both optional skills remain in the separate package within this repository. |
| Forms, approval gates, and controlled records | Target project | The project defines required records, reviewers, evidence, and release policy. |
| Discover delivery process | Discover repository | The existing Discover package owns its lifecycle skills, commands, templates, and workflows. |
| Product research and outcomes | Toolbelt | Research synthesis, discovery, measurement, and outcome review supply reusable methods. |
| System design and technical health | Toolbelt | Design documents, threat review, debt discovery, and selected assessment remain independent of project records. |
| Knowledge lookup and information verification | Proposed Toolbelt work | The designs and evaluation cases exist. These skills are not implemented. |

Read [the shared output rules](../shared/contracts/references/human-readable-output.md) for communication requirements.

## Removed project lifecycle layer

The Discover repository already has its project delivery sources.
This cleanup removes the duplicate lifecycle layer from Toolbelt.
It does not change Discover files or installed project files.

| Former Toolbelt surface | Current owner or replacement |
| --- | --- |
| `ai-feature-delivery` skill and installer | Use the target project's delivery package. Toolbelt rejects this retired pack selector. |
| Feature intake, steward review, SDD, and refinement commands | Use the project's process and source records. |
| Document impact, traceability, QA handoff, and release-manifest commands | Use the project's evidence and approval requirements. |
| Formal lifecycle templates and workflow documents | Use the templates and procedures maintained by the target project. |
| Detailed process rules from `--rules full` | Use project-owned rules. Toolbelt rejects the retired mode. |
| Minimal shared Cursor router | Toolbelt still installs this rule for the selected skills and commands. |

Approved project tickets remain valid inputs to `phased-delivery`.
Each supplied ticket maps to one phase and one PR.
The shared workflow preserves supplied scope, references, tests, and evidence requirements.
It does not define new project approval gates.

## Retained generic command helpers

These helpers remain optional compatibility commands.
Native plugin entry points remain the shared skills.

| Command | Installing pack | Purpose |
| --- | --- | --- |
| `/workflow-router` | `phased-delivery` | Select the smallest suitable installed workflow. |
| `/implementation-plan` | `phased-delivery` | Plan supplied requirements or approved tickets. |
| `/write-tests` | `cover` | Use shared test design or test authoring methods. |
| `/review-diff` | `pr-review` | Review the current diff with the shared review method. |
| `/pr-ready-check` | `pr-review` | Check scope, verification, documentation, and PR handoff. |
| `/role-review` | `pr-review` | Review a change from a selected professional perspective. |

A project can have a command with the same name.
Check its owner and content before replacing it.

## Update an existing project

The installer adds selected files. It does not remove files from earlier installations.
An install cannot prove that an existing file belongs to Toolbelt.
The default install preserves existing files.

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Identify the target Git root and its instruction files. | Apply changes to the correct workspace. | The target path and project requirements are recorded. |
| 2 | Preview selected shared packs with `--dry-run`. | Find existing files and command-name collisions. | Every affected path has a known owner. |
| 3 | Compare existing files with the selected Toolbelt source. | Preserve project adaptations and requirements. | Each difference has an explicit keep, merge, or replace decision. |
| 4 | Update the selected shared files. | Import reusable methods without replacing the project process. | Installed content matches the reviewed decisions. |
| 5 | Review old lifecycle copies and rules separately. | Avoid duplicate routing and requirements. | Each retired copy has known provenance before removal. |
| 6 | Verify project discovery and checks. | Confirm that the host can use the intended skills. | Skill entries, file ownership, and required project checks agree. |

Do not run a blanket forced install over project-owned commands or skills.
Do not delete a project's `ai-feature-delivery` skill because Toolbelt retired its own copy.
For Discover, preserve its delivery package and project command adapters.
Review old `dev-lite-workflow` copies separately because an install does not remove them.

## Related design records

- [Knowledge and verification design](knowledge-verification-deep-dive-2026-11-02.md)
- [Readable output design](readable-output-design-2026-11-02.md)
- [Release versioning](release-versioning.md)

Dated research documents retain their original inventories.
Use the current catalog and this guide for the cleaned package.
