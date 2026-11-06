# Toolbelt cleanup — 2026-11-03

The active Toolbelt package now contains shared workflows and skills.
The duplicate project lifecycle layer is removed.
No version, commit, tag, or Discover installation changed during this cleanup.

| Item | Result | Reason |
| --- | --- | --- |
| Standard skill package | 29 skills remain. | The project lifecycle skill is removed from the shared package. |
| Optional execution package | Two Auto Agent skills remain in Toolbelt. | Reusable execution belongs in this repository. |
| Lifecycle sources | One skill tree, one installer, 15 commands, 21 templates, and two workflows are retired. | Discover already maintains its project delivery sources. |
| Generic command helpers | Six helpers remain under shared planning, test, and review packs. | Their methods apply across projects. |
| Shared delivery inputs | Approved project tickets remain supported. | Project scope and required evidence must survive the shared implementation process. |
| Install compatibility | The retired pack and full rule mode fail with migration guidance. | An old selector must not silently install another process. |
| Local delivery commands | Repository Cursor commands match their canonical sources. | Local entry points must use the current shared workflow. |
| Knowledge and verification | Designs remain unimplemented. | Research documents do not establish a working capability. |
| Product skills | No new capability was added. | Product work remains on hold. |

Read [the migration guide](project-workflow-boundary.md) before updating an existing project.
The installer does not delete installed legacy files.
Preserve project-owned skills, rules, and command adapters.

## Verification

| Check | Result | Evidence or limit |
| --- | --- | --- |
| Skill structure and canonical copies | Passed | Frontmatter, metadata, references, shared contracts, and local delivery copies agree. |
| Catalog and failure cases | Passed | The catalog has 29 skills and five workflows. Restored lifecycle paths fail validation. |
| Native package and compatibility installs | Passed | Package manifests, Cursor build, legacy alias, and optional package checks pass. |
| Ownership regression checks | Passed | Fresh installs omit retired files. Default updates preserve project-owned files and same-name adapters. |
| Retired install options | Passed | Both options fail before creating the target folder. |
| Standalone installs | Passed | All 29 skills install with shared output rules for all selected hosts. |
| Quality gate and React specialist installs | Passed | Dependency selection, path rewriting, and composed installs pass. |
| Portal structure and application checks | Passed | The portal has 29 skill entries. Search, filters, references, and invocation helpers pass. |
| Portal browser check | Failed | Chrome does not expose its DevTools page. A direct startup attempt exits with signal 6 and no diagnostic text. |
| Full package check | Failed | The browser startup failure stops the complete check. This is not a successful release verification. |
| Documentation links and shell syntax | Passed | The 14 checked documentation files have no broken local links. Installer scripts parse successfully. |
| Discover source preservation | Passed | All 86 checked project delivery source files retain their hashes. The Git status inventory matches the saved baseline. |
| Version preservation | Passed | All six plugin manifests remain at `0.2.0`. |

Local command logs and the cleanup backup are in `.atb-work/toolbelt-cleanup-2026-11-03/`.
This directory is ignored by Git.

## Before a release

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Run the portal browser check in a working Chrome environment. | Verify the generated portal in a browser. | The required browser check passes. |
| 2 | Review the complete pending release scope. | Earlier plugin and portal changes are also uncommitted. | The release candidate has a defined file set and migration record. |
| 3 | Select the release version under the repository policy. | This cleanup removes existing install surfaces. | Version metadata and release notes agree on the compatibility changes. |
| 4 | Preview an import into the selected Discover Git root. | Preserve its project delivery process and local adaptations. | Each affected file has a reviewed owner and update decision. |
