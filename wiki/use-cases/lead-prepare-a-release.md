# Prepare a release and decide go or no-go

This page is for a tech lead who must decide go or no-go for a release after a change is merged. You get a release package with a GO or NO-GO verdict and its blocking gaps, a rollback plan, a release-notes draft, and a rollout and monitor plan. Use it after the merge. For a change before the pull request, use the pre-PR gate ([`/pr-ready-check`](ops-enforce-a-pre-pr-gate.md)). For a new service, use the [production readiness review](sre-run-a-production-readiness-review.md).

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Tech lead | [`ship-it`](../../skills/ship-it/SKILL.md) (`/ship-it`) | No levels. The skill has one procedure. | A merged or approved change, the repository, and the project's release policy if it has one. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Prepare the package: `/agent-toolbelt:ship-it <commit | tag range | change description>`. Example: `/agent-toolbelt:ship-it token fix 30b68e1`. If the repository has no tag, name the base commit in the input.
3. Read the verdict first, then the table of blocking gaps. Answer the questions about the deploy owner and the rollback trigger. Run each check that the report marks `Not run` before you trust the verdict.
4. Release only when the verdict is GO. On NO-GO, clear or accept each gap, then run the command again. If the report says a pipeline owns the deploy, hand the package to that pipeline and stop. The skill does not deploy by itself.

You get a GO or NO-GO verdict with its blockers, a rollback plan, release notes, and a watch-list for the rollout.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). You must decide if the token fix, commit 30b68e1, can go to production. The commit message is "fix: missing user id". It adds `id: true` to one `select` in `getCurrentUser`, so the token from `GET /api/user` carries the user ID. The commands on this page that name commit 30b68e1 are examples. Replace the commit with your own change.

The repository has no tag, no CI or CD file, and no release policy. The README gives one manual deploy line and a `Dockerfile` exists. The `package.json` version is `0.0.0`.

Your questions are these. Can you roll back, and what is the signal to do it? Which checks pass? What do clients see after the release? You decide before anyone deploys.

## Why this path

The obvious alternative is to run the test suite, look at the diff, and deploy. This costs you three answers. A green suite does not name a rollback signal. It does not run an audit or a build, and it does not check the documentation. It does not tell you what happens to the tokens that clients already hold. In this run the suite was not green, because 7 tests need a database that the sample does not have.

`ship-it` has a cost too. For this one-line change, the run executed about five checks and ended NO-GO with four gaps that need an owner decision.

The sibling command for an earlier moment is `/pr-ready-check`. It checks that a change has the evidence to open a pull request. `ship-it` starts after the merge or approval and prepares the release. Its command file points to `/pr-ready-check` and `/dev-pr-review` for the earlier moment.

For a new service or a launch that adds a hard dependency, use the production readiness review. The page [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md) shows it. It checks reliability evidence in depth. `ship-it` is smaller. It scopes a checklist to one change.

The procedure has this order because each step limits the next one. The readiness check lists gaps. The rollback plan comes next, because a missing trigger makes the verdict NO-GO. The release notes confirm the documentation gate.

The verdict then reads all three. The rollout plan comes last, because its rules depend on the project's policy.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all ship-it /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:ship-it` (plugin) or `/ship-it` (installed copy). |
| 2 | Open the repository at the commit that you want to release. List the range: `git log --format='%h %s' <last-tag>..HEAD`. If no tag exists, name the base commit yourself. In the sample, the range is `88b258c..30b68e1`. | You see the exact changes that the release holds. | You can name the base and the head commits. |
| 3 | Run `/agent-toolbelt:ship-it <input>`. Use a commit, a range, or a sentence. In the sample, run `/agent-toolbelt:ship-it token fix 30b68e1`. | The skill follows one procedure from readiness to rollout. | The report names the deploy owner and gives a verdict with blockers. |
| 4 | Check the deploy owner. The skill infers it from the repository, and asks when it is unsure. A CI or CD file that deploys on merge means the pipeline owns it. No file and a manual deploy script means you own it. | The owner decides if the skill proposes commands or only hands off a package. | The package says who owns the deploy and gives the evidence. |
| 5 | Read the readiness check. Run the checks that the report marks `Not run` yourself: tests, build, lint, `npm audit`. | The skill scopes the checklist to the change. You confirm each result in your environment. | Each row has a result you can name, or a reason. |
| 6 | Read the rollback plan. Give the rollback trigger, a concrete signal that means "roll back now". | A project with no trigger gets a NO-GO verdict. The skill does not invent a threshold. | The plan names how to revert and the trigger. |
| 7 | Read the release-notes draft and the documentation gate. Choose the version. | The notes tell users what changed. The gate makes sure that docs change with behavior. | The notes have a version. Each doc change is done, or "not doc-impacting" has a reason. |
| 8 | Read the verdict and each blocking gap. Clear each gap or accept it in writing. Run the command again. | A verdict is only as good as its gaps. | The verdict is GO, or you hold the release with each gap owned. |
| 9 | On GO, read the rollout and monitor plan. Fill each advance, hold, and recover rule from the project's policy. Then deploy with the proposed commands. | The skill proposes each deploy, tag, and push command. It runs one only after your confirmation. | Each stage has a watch period and rules. Each rule cell has an owner. |

## Decision points

- If the report says the pipeline owns the deploy, take the package (verdict, rollback plan, release notes, rollout plan) and stop. The Quick path ends at the package in this case. Do not run deploy commands. The skill frames the rollout plan as the watch-list for the pipeline.
- If the project has no rollback trigger, the verdict is NO-GO. Define the trigger with the owner. Do not copy a threshold from another project. For a first launch with no earlier release, name how to remove this release, such as flag-off or taking the deployment down. Without that, the verdict is NO-GO.
- If a blocking gap exists before the change and the change does not cause it, record it as `Pre-existing`, with its owner and the audit date. The checklist now says that it blocks the release only when the release policy makes it a gate, or when the change makes it reachable. This run predates that rule and treated the audit findings as blocking.
- If the change alters behavior, an endpoint, a flag, or the data model, update the docs in the same change. A later promise is a NO-GO. If it alters none of these, record "not doc-impacting" with a reason.
- If the change is a documentation change, expect most of the checklist to be skipped.
- Stop when the verdict is NO-GO and each gap has an owner, or when the verdict is GO and the rollout plan has rules.
- Choose [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md) when the release adds a service, a hard dependency, or a data store.
- Choose [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md) when the open question is which code has no tests.
- Choose [Review product outcomes after a release](product-review-outcomes-after-release.md) after the release, when the question is whether the change worked for customers.

## What you get

The run was headless, so no person answered the skill's questions. The run used a default for each question: it inferred that you own the deploy, it found no rollback trigger, and it assumed that commit 88b258c is the deployed state. You must answer these three questions in a real run. The skill did not run a deploy, a tag, or a push. It ran no subagents, because the procedure has no review lenses.

The verdict comes first. With a rollback trigger from the owner, B1 clears and the verdict depends on B2 to B4. The run executed `npx jest src/tests`, `npx nx build api`, `npx tsc`, `npx eslint` on both commits, and `npm audit --omit=dev`. The gap IDs (B1 and so on) are the report's own labels.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the first line and the start of the second line are quoted. The report continues the second line with "The ship-it rollback step makes the verdict NO-GO in that case." and adds a sentence that three more checks fail or did not run. The table leaves out the Evidence column and row B4. The text of the cells that remain is verbatim.

```text
NO-GO. Release range: `88b258c..30b68e1` (one commit, one line changed).
The project has no rollback trigger, no release policy, and no SLO.
```

| ID | Blocking gap | What clears it |
| --- | --- | --- |
| B1 | No rollback trigger. | The owner states one concrete signal that means "roll back now". |
| B2 | Dependency audit is not clean. | Upgrade the packages, or the owner accepts each finding in writing. |
| B3 | The tests that cover the change did not run. | Run the suite against a test database, or record that the owner accepts the gap. |

The report has a fourth gap, B4. The code uses `process.env.JWT_SECRET || 'superSecret'`, so a production server without `JWT_SECRET` signs tokens with a public string. The report says that B2 to B4 exist before the commit and that the run treated them as blocking. The run predates the `Pre-existing` rule in the checklist, so the skill now blocks on them only under the conditions in "Decision points".

Next, the rollback plan. The report gives the revert and the effect on tokens that clients already hold.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are the two raw lines of the token check that the run executed. The first line is a token signed with no ID, which is the code before the fix. The second line is a token for ID 123. The fields `iat` and `exp` are the issue and expiry times.

```text
{"user":{},"iat":1794786026,"exp":1799970026}
{"user":{"id":123},"iat":1794786026,"exp":1799970026}
```

The tokens last 60 days (`expiresIn: '60d'`). A client that holds a token from before the fix must call `GET /api/user` again, or log in again, to get a token with an ID. The fix does not repair old tokens. The report puts this sentence in the upgrade notes.

Last, the rollout plan. The skill does not invent rules, so the run left each rule cell for the owner.

Excerpt from a run on the Conduit sample API at commit 30b68e1. The table is verbatim.

| Stage | Metrics to watch | Window | Advance | Hold | Recover |
| --- | --- | --- | --- | --- | --- |
| Full deploy | 401 and 500 rate on `GET /api/user`, `POST /api/articles`, and `GET /api/profiles/:username`. Login success rate. | Needs owner. | Needs owner. | Needs owner. | Needs owner. |

The run chose a big-bang rollout (deploy to all users at once) with a watch period. The reason is that the repository has no feature flag system, no staging environment, and no traffic split. The skill allows big-bang for a low-risk change that you own. The change reaches 16 places that read the user ID from the token, so you must confirm that "low risk" holds. `Needs owner` is the run's label, not a label that the skill prescribes.

What you must check in the output:

- The verdict has a gap for each failed or missing check, not one. In this run, four gaps stand behind NO-GO.
- Each result says if the run executed it or read it. The auth test file did not run (7 of 12 tests failed, no database). Do not read that as a pass.
- Lint had 33 errors on 30b68e1 and 33 on its parent. The change adds none.
- On NO-GO, the skill now omits the deploy and tag commands. This run predates that rule. The run listed the deploy and tag commands under "not run, held until the verdict is GO". That section is the run's choice, not a skill rule. The listed commands are not a go-ahead.
- The release-notes draft has a rollback section that mirrors the plan. The suggested version `v0.0.1` is the run's suggestion. The repository has no tag.

## Common mistakes

- You read "build passes" as GO. The verdict also needs a rollback trigger. A project with no trigger gets NO-GO whatever the build says.
- You invent a rollback threshold to clear B1. The skill takes the trigger from the project's policy. A number that nobody owns fails at the first incident.
- You skip the old-token note. Tokens that clients got before the fix still have no user ID, and a revert or a release does not change them. Tell clients to call `GET /api/user` or to log in again.
- You treat the audit result as proof that the fix is unsafe. The findings exist before the commit. The question for you is who owns them, and the checklist does not answer it.
- You expect the skill to deploy. It prepares the package by default. When you own the deploy, it proposes each command and runs one only after you confirm. When a pipeline owns the deploy, it stops after the package.
- You run `ship-it` before the merge. Use `/pr-ready-check` for the moment before a pull request opens.

## Next

- [Run a production readiness review before a launch](sre-run-a-production-readiness-review.md): when the release adds a service, a hard dependency, or a data store.
- [Find coverage gaps before a release](qa-find-coverage-gaps-before-release.md): when the report shows a test that did not run, or a path with no test.
- [Plan tests for a small authentication pull request](qa-plan-tests-for-a-small-pr.md): the same commit 30b68e1, planned before the merge.
- [Review product outcomes after a release](product-review-outcomes-after-release.md): after the release, to judge the customer result.
- [Run a retrospective with papercuts](lead-run-a-retrospective-with-papercuts.md): after the release, to review the delivery process. The skill recommends `workflows/delivery-retrospective-workflow.md` for this ([delivery retrospective](../../workflows/delivery-retrospective-workflow.md)).
- [From idea to release](journey-idea-to-release.md): the full path that ends with this page.
- [Use-case index](README.md): the full list of use-case pages.
