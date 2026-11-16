# Review the threats of a design before it is built

This page is for a security-minded engineer who must review a design before anyone builds it. You get a threat model: the assets, the attack paths, a testable security requirement for each accepted fix, and the risk that remains.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Security engineer, tech lead, or developer who reviews a design | [`threat-model`](../../skills/threat-model/SKILL.md) (`/threat-model`) | No levels. The skill has no depth setting, and [`system-design`](../../skills/system-design/SKILL.md) runs it for every design proposal, including Light ones. | A design document, an architecture note, or a refined story. Read access to the repository that the design changes. |

## Quick path

1. Start Claude Code in the repository that the design changes, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. List the open questions in the design and say which defaults you accept. Then run the skill and name the output file: `/agent-toolbelt:threat-model "<path-to-design>" and save the model to "<path-to-threat-model>"`.
3. Read the abuse-case table and "Residual risk and decisions needed". Write an owner next to each important threat, or leave it `unassigned`.
4. Turn the requirements into cases: `/agent-toolbelt:test-case-design <path-to-threat-model>`.

Skip this page and use [`security-audit`](../../skills/security-audit/SKILL.md) when the code exists. Use [`system-design`](../../skills/system-design/SKILL.md) when no design is written. Stop when each threat has a disposition.

You get one threat model with stable threat IDs, requirement IDs, and a verification method for each requirement.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The team plans story CON-12: a signed-in reader bookmarks articles and opens a private list of them. The refined story is the design. It names three new endpoints, a new bookmark table with a saved date, cascade deletes, and a `bookmarked` field in every article response. [Refine a vague story](qa-refine-a-vague-story.md) shows how that story came about.

No bookmark code exists. You must find the attack paths now, while a fix costs a line in a design and not a rework. The story has the verdict "Not ready" and nine open questions. The run modeled the design with the recommended answer to each question.

Terms that this page uses:

- Trust boundary: a place where data moves between parts that trust each other less, such as a client and an API.
- Attack path: an entry point, a precondition, an action, and its impact.
- Residual risk: the risk that remains after the planned fixes.
- Prisma: the library that builds the database queries in this repository.

## Why this path

The obvious alternative is [`security-audit`](../../skills/security-audit/SKILL.md) (`/security-audit`). It reads implemented code, configuration, dependencies, and secrets, and it is read-only by default. Here no bookmark code exists, so the audit reads only the current API. That is how it can reach the three existing defects (E-1 to E-3 below). It cannot find that the design lacks a guard, or that a proposed log line copies private data. Use `security-audit` after the code exists.

The second alternative is [`system-design`](../../skills/system-design/SKILL.md). For a design proposal it drafts the design and then runs `threat-model` on that draft. Step 4 of `system-design` runs `threat-model` on that draft. This team has no design document, so that path adds a design to write first. If you must write the design first, start there.

The skill states no reason for its order, so this reason is practice. Scope and assets come before paths, so a path has a target. Paths come before controls, because step 4 keeps proposed controls apart from observed ones. Requirements come last, because each needs a threat to answer.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all threat-model /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:threat-model` (plugin) or `/threat-model` (installed copy). |
| 2 | Pick the design source and note its revision. For a file in git, run `git rev-parse HEAD`. For a file outside git, run `shasum -a 256 <file> \| cut -c1-12`. | The skill records the design source and the reviewed revision. A later reader can then tell which design the threats belong to. | You can name the source file and its revision. |
| 3 | List the open questions in the source. Decide which defaults you accept for this review. This is practice, not a skill rule. | The model must say what it assumed. An unanswered question can change an attack path. | Each open question has an accepted default or sits on your list of open questions. |
| 4 | Run `/agent-toolbelt:threat-model "<path-to-design>" and save the model to "<path-to-threat-model>"`. In the sample: `/agent-toolbelt:threat-model "CON-12-refined.md" and save the model to "threat-model/CON-12-threat-model.md"`. | The skill names no output file, so you name one. It fills `templates/threat-model.md`. | The file has the sections Scope and assumptions, Assets and actors, Flows and trust boundaries, Abuse cases and attack paths, Mitigations and testable requirements, and Residual risk and decisions needed. |
| 5 | Read "Scope and assumptions". Check the design source, the revision, the unavailable inputs, and the review limits. | A missing input limits what the model can claim. | Each missing input has a stated effect. |
| 6 | Read the abuse-case table from the highest impact down. For each path, find its evidence label: `Verified`, `Read`, or `Not verified`. | The skill reads [`evidence-quality.md`](../../shared/contracts/references/evidence-quality.md) for the evidence. That file defines `Verified` and `Not verified`. `Read` is this run's label for a claim from the text of the code. The labels separate a path that a check supports from a path that only the text suggests. | Each High-impact path has a label and a source. |
| 7 | Optional, and the run's own practice. The skill says it "does not perform active testing" and must not "run active probes". It does not write or run checks. In the run, a local mock test on a copy of the code was the run's choice. Never aim a check at a live service. First write the check yourself, or point to a test that the repository has. The sample probe `outputs/scratch-auth-probe.test.ts` is a run artifact, not part of the skill. From the repository root, run `npm ci --ignore-scripts` and `npx prisma generate`. A unit test with the Prisma mock needs no database: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest <your-test-file>`. A check that needs Postgres stays `Not verified` until a database runs. | The model must not claim behavior that no check showed. | Each path has a result, or the model says which input is missing. |
| 8 | Read "Mitigations and testable requirements". Check that each requirement names a test, review, configuration check, or operational control. Check the control status of each row. | A requirement without a verification method cannot reach a test plan. | Each requirement has a verification method. |
| 9 | Read "Residual risk and decisions needed". Put an owner on each row, or keep it `unassigned`. | The skill asks for a disposition and an owner or `unassigned` status for each important threat. | Each important threat has an owner or the word `unassigned`. |
| 10 | Hand the requirements on: `/agent-toolbelt:test-case-design <path-to-threat-model>` for cases, or `/agent-toolbelt:phased-delivery` to plan the work. | The skill hands its requirements to `phased-delivery`, `test-case-design`, or `shape-up`. | Each requirement ID appears in a case or a phase ticket. |

## Decision points

- If the change stays inside existing boundaries and touches nothing sensitive, skip this skill. The skill description limits it to a security-sensitive change. A bookmark list is personal data under the story's default answer (Q-9), so it qualified.
- If the story has the verdict "Not ready", model it with defaults and label the open questions, or refine it first. If the design is not written yet, run [`system-design`](../../skills/system-design/SKILL.md) first. It runs `threat-model` on its draft.
- If the model lists a defect in existing code, do not fix it inside the model. Record it and run `security-audit` on that code. In the sample, three such defects came up (E-1 to E-3).
- If an owner has not decided, keep the disposition as a proposal. The skill asks for an owner or `unassigned` status. The template asks for accepted risks with the actual owner decisions, so an agent cannot accept a risk for a person.
- If the design changes later in architecture, identity, data sensitivity, tenant boundaries, or deployment, rerun the model for the changed parts. The skill lists these triggers in step 7.
- Stop when each important threat has a disposition, an owner or `unassigned`, and a verification method for each requirement. The skill does not claim compliance, and neither must you.
- Choose [`security-audit`](../../skills/security-audit/SKILL.md) when the code exists and you need a review of that code. See [Audit existing code](sec-audit-existing-code.md).
- Choose [`story-refinement`](../../skills/story-refinement/SKILL.md) when the story is too vague to model. See [Refine a vague story](qa-refine-a-vague-story.md).

## What you get

The run was headless. No person answered, so no owner is named, and every disposition is a proposal. The run started no subagents, because `SKILL.md` defines no subagent or reviewer step. It used the skill as it stands after PR #58. The skill asks no question. The open questions came from the story.

The labels `T-n` (attack path), `SR-n` (security requirement), and `E-n` (defect in existing code) are the run's scheme. The skill asks for stable IDs and gives no format. The IDs `Q-n`, `F-n`, `AC-n`, and story assumptions come from the refined story: `Q-n` is an open question, `F-n` is a fact about the code, and `AC-8` is its rule that no reader sees another reader's bookmarks. The model has its own asset IDs `A-n`: A-1 is a reader's bookmark list, A-2 is a reader's identity, and A-4 is the integrity of bookmark rows. The one `A-4` at the end of the T-3 row is story assumption A-4 (the favorite naming).

The story has nine open questions. The run used the recommended answer to each: Q-1 yes, a bookmark is private and separate from favorites. Q-2 yes, newest first. Q-3 no maximum, record the risk. Q-4 use the main list's visibility rule. Q-5 a separate client ticket. Q-6 no feature flag. Q-7 count requests and errors with the existing logging style. Q-8 a 422 error for a negative paging value. Q-9 yes, a personal-data list that is deleted with the account. See [Refine a vague story](qa-refine-a-vague-story.md).

First, three of the eleven attack paths.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: rows T-2 and T-5 to T-11 are left out. The text of the rows that remain is verbatim.

| ID | Entry point and precondition | Path | Impact | Exploitability and uncertainty |
| --- | --- | --- | --- | --- |
| T-1 | `GET /api/articles/bookmarks`. The caller holds a signed token with no `user.id`. | `auth.required` accepts the token (Verified, see `outputs/auth-probe.txt`). `req.auth.user.id` is undefined. A query that filters by `userId: undefined` can drop the filter, and the list can return the bookmarks of every reader. | High. It breaks AC-8, the privacy rule of the story. | Medium. The probe verified the token step. The Prisma step is Not verified (no database). Id-less tokens came from `getCurrentUser` before commit 30b68e1 and live up to 60 days. Whether such tokens exist now is Unknown. |
| T-3 | Any article response. A developer copies the favorite response code. | `favoriteArticle` spreads the Prisma result into the response, including the `favoritedBy` rows (Verified with mock data, `outputs/mapper-passthrough-probe.txt`). A bookmark response built the same way returns the readers who bookmarked an article. This reveals each private list and the user rows (email, password hash) of those readers. | High. It breaks A-1 and A-2 for many readers at once. | Medium. The pattern exists in two functions today (F-13). Whether Prisma returns the password column for `include: { favoritedBy: true }` is Not verified here. The design says to copy the favorite naming (A-4). |
| T-4 | Any signed-in route. `JWT_SECRET` is unset in the deployment. | The code falls back to the secret `superSecret`. An attacker signs a token for any reader id and reads that reader's list (Verified: a token signed with the default secret passed `auth.required` when the variable was unset, `outputs/auth-probe.txt`). | High. Full access to every reader's list. | Unknown. The README lists `JWT_SECRET=` as a setting, the Dockerfile does not set it, and the real deployment configuration is not in the repository. |

The `Verified` labels rest on a check that the run wrote. The skill did not write it. The check is a short Jest test that calls the real `auth.required` function. Its output follows. A JSON Web Token (JWT) is the signed sign-in token.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from `outputs/auth-probe.txt`: the console labels and the passing-test lines are left out. The text of the lines that remain is verbatim.

```text
## JWT_SECRET=x
no-id token -> {"auth":{"user":{},"iat":1794785550,"exp":1799969550}}
JWT_SECRET=x default-secret token -> {"err":"UnauthorizedError"}
## JWT_SECRET unset
no-id token -> {"auth":{"user":{},"iat":1794785551,"exp":1799969551}}
JWT_SECRET=(unset) default-secret token -> {"auth":{"user":{"id":1},"iat":1794785551,"exp":1794789151}}
```

Read the lines in pairs. A valid signature with an empty `user` object passes the sign-in check, with and without a secret. A token that uses the default secret passes only when the variable is unset. That fits T-4.

The mock for T-3 supplied the `password` field itself. The check shows that the code forwards whatever the include returns. It does not show what Prisma returns, so T-3 keeps its `Not verified` part.

Next, two requirements and their verification.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the "Mitigation and control status" column and the rows for T-3 and T-5 to T-11 are left out. The text of the cells that remain is verbatim.

| Path ID and owner | Requirement ID | Verification and evidence | Disposition |
| --- | --- | --- | --- |
| T-1, T-2. Owner unassigned (backend lead suggested) | SR-1: Each bookmark route returns 401 for a signed token with no numeric `user.id`, and changes no row. SR-2: Each query that reads or deletes bookmarks includes the reader id as a required value. | SR-1: unit test with the mocked data layer and an id-less token (needs no database). SR-2: code review of each query, plus an integration test with two readers that checks that reader B cannot see or remove the bookmarks of reader A. Not verified. | Mitigate |
| T-4. Owner unassigned (backend lead suggested) | SR-3: The process refuses to start without `JWT_SECRET`, and no code path signs or verifies with a literal secret. | Unit test of the start check, plus a configuration check in the deployment. Not verified. | Decide. The change reaches existing behavior, so the backend lead must accept it. |

Last, the decisions that the model leaves for people. The run had no owner to ask, so each row stays open for you.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: the rows for T-5, T-6, and E-1 are left out. The text of the rows that remain is verbatim.

| Item | Decision needed | Suggested owner | Remaining risk if no change |
| --- | --- | --- | --- |
| E-2, SR-3 | Fail at start when the secret is unset. | Backend lead | A deployment without the variable lets anyone sign in as any reader (T-4). |
| T-1, T-2 | Confirm that old id-less tokens can still reach production. | Backend lead | If SR-1 is skipped, a reader with an old token can see or remove other readers' bookmarks. |
| T-7, Q-3 | A page-size maximum and a bookmark maximum. | Product owner | One account can load the database with large lists. |
| T-9, Q-7 | The log format for the three endpoints. | Backend lead | A log store holds a second copy of private reading data. |

What you must check in the output:

- Each High path has an evidence label and a source. A path with only `Read` is a claim from the text of the code.
- Each requirement has a verification method and the status `Not verified` until that method runs. In this run, all nine requirements were `Not verified`.
- The model keeps a table of paths that it considered and dismissed. It lists SQL injection, mass assignment, request forgery, and duplicate rows, each with its reason.
- The model says what did not run: no database, no dependency audit, no deployment configuration.

## Common mistakes

- You read `Verified` as proof of the whole path. In the sample, T-1 had a verified token step and an unverified database step. Read the sentence next to the label.
- You write a name in the owner column for a person who has not agreed. The skill asks for an actual owner decision. Use `unassigned` until the person answers.
- You fix the existing defects inside this model. The model records E-1 to E-3 and sends them to a code audit. A fix there changes behavior that the story does not cover.
- You skip the "considered, no new path" rows. A reader who sees only threats cannot tell which attack classes the run checked.
- You expect the skill to write the design or the tests. It writes the model and its requirements. Use `system-design` for the design and `test-case-design` for the cases.
- You keep the model after the design changes. The skill lists the changes that need another review: architecture, identity, data sensitivity, tenant boundaries, and deployment.

## Next

- [Audit existing code](sec-audit-existing-code.md): when the code exists, or when the model lists a defect in existing code.
- [Design a new capability](arch-design-a-new-capability.md): when the design is not written yet.
- [Refine a vague story](qa-refine-a-vague-story.md): when the story is too vague to model.
- [Plan staging failure tests](qa-plan-staging-failure-tests.md): when the open risks are about failure and load, not attack.
- [Turn test cases into tests](qa-turn-test-cases-into-tests.md): when the cases for the requirements exist.
- [Deliver a ticket as phased PRs](dev-deliver-a-ticket-as-phased-prs.md): when the requirements go into a phase plan.
- [Idea to release](journey-idea-to-release.md): the whole path, from an idea to a release.
- [Use-case index](README.md): the full list of use-case pages.
