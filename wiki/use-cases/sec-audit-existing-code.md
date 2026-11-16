# Audit the auth area of existing code

This page is for a developer or security engineer who must audit code that already runs, such as the login and token code of a service. You get a read-only report of evidence-backed findings, the risk that remains, and a statement of what the audit did not check. You can also ask for a list of the controls that work.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer or security engineer | [`security-audit`](../../skills/security-audit/SKILL.md) (`/security-audit`) | No levels. The skill has no depth setting. | A local clone of the repository, and a path or system name to audit. No database, network, or running API. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Audit the area: `/agent-toolbelt:security-audit <path> and the middleware that it uses. List the controls that work.` In the sample, the path is `src/app/routes/auth`. With no report path in the request, the skill saves the report to `.atb-work/security-audit/<scope-slug>.md` and prints the path. To choose a path, add `Save the report to <report-folder>/security-audit.md.` and use a folder that git ignores or a folder outside the repository.
3. When the skill asks its three scope questions, answer them: the scope, the data sensitivity, and the allowed evidence sources. Read "Scope, evidence, and limitations" first. Then read each finding with its Reachability and Confidence cells.
4. Check each item that says `Not verified` outside the code: the deployed environment variables and an online dependency audit.
5. Run `git status --short`. It must print nothing. If it lists `.atb-work/`, add `.atb-work/.gitignore` with the line `*`. Then give each finding to its owner with the Remediation and Verification cells.

You get a read-only report with findings and the residual risk and next actions. The "Controls observed" section is not in the skill's template. This run added it, and your request can ask for it.

Stop here: if you have only a design and no code, use `/threat-model`. If you have one diff, use `/pr-review`.

The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). It is the public repository `gothinkster/node-express-realworld-example-app` on GitHub. The commands that name commit 30b68e1 on this page are examples. Replace the commit and the path with your own.

You own the auth area. It has the registration, login, "current user", and "update user" routes in `src/app/routes/auth`. Two pieces of middleware serve it: the token check in `auth.ts` and the global middleware in `src/main.ts`. Nobody has audited it. You must find what an attacker can use, state how sure you are, and name what you did not check.

The skill's first step asks for the scope, the data sensitivity, and the allowed evidence sources. No person answered in this run, so the run took the scope from the request. It set the sensitivity from the database schema: email addresses, password hashes, and session tokens. It used the default evidence sources, which are code, configuration, manifests and lockfiles, and CI definitions. If a person answers these questions in your run, give the real values.

The page shows a rerun on the Toolbelt at commit 8ac3e11, with the sample at 30b68e1. The page checks each claim about the skill against that revision. Check the current `SKILL.md` before you rely on a detail.

## Why this path

The obvious alternative is a review of one diff with `pr-review`. It has a security facet. A facet is one angle of a review, such as correctness or security. The `security-audit` description names that split: use `pr-review` for the security facet of one diff. The cost here is that a diff review reads changed lines. The auth area has no diff, and the worst problem in the sample sits in `auth.ts` and `token.utils.ts`, which the latest commit (30b68e1) does not touch. See [Self-review before a pull request](dev-self-review-before-a-pr.md) for the diff path.

The second alternative is [`threat-model`](../../skills/threat-model/SKILL.md) (`/threat-model`). Its description says it is for a design before the change is built, and it names `security-audit` for implemented code. The cost of using it here is that it models attacker paths from a design, and no design document exists for this area. The page [Threat-model a design](sec-threat-model-a-design.md) shows that path. The two skills connect: if a threat report exists, the audit reconciles each requirement against the code and marks it `Verified`, `Failed`, or `Not verified`.

The procedure has this order because each step limits the next one. The skill fixes the scope first. It reads the audit boundaries before any tool runs or any data leaves the machine. Then it walks the code against a checklist, checks dependencies offline, and searches for secrets. It writes findings last, so that each one carries evidence from an earlier step. It stops before active testing, which needs written authorization.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all security-audit /path/to/project`. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:security-audit` (plugin) or `/security-audit` (installed copy) in the list. |
| 2 | Open the repository at the revision that you audit. Write down the commit: `git log --format='%h %s' -1`. | The report records the inspected revision. A finding without a revision cannot be rechecked. | You can name the commit. In the sample it is 30b68e1. |
| 3 | Run `/agent-toolbelt:security-audit <path> and the middleware that it uses. List the controls that work. Save the report to <report-folder>/security-audit.md.` (Use `/security-audit` for an installed copy.) In the sample, the path is `src/app/routes/auth`. Answer the three scope questions that the skill asks. | The command argument is `<path-or-system>`. Naming the middleware puts `auth.ts` and `main.ts` in scope. With no path from you, the skill saves the report to `.atb-work/security-audit/<scope-slug>.md` and prints the path. In the rerun the slug was `src-app-routes-auth`. The sample repository did not ignore `.atb-work`, so `git status --short` showed `?? .atb-work/` until the run added `.atb-work/.gitignore` with the line `*`. SKILL.md now tells you to make that file before you write, as `shared/contracts/references/execution.md` says. The skill says to keep repository files unchanged, so a path that you name must be a folder that git ignores or a folder outside the repository, such as `../audit-notes`. | The report exists, and `git status --short` prints nothing. |
| 4 | Read "Scope, evidence, and limitations". | It lists what was in scope, what was out of scope, and what the run did not do. A finding means little without these limits. | You can say which routes, files, and evidence the audit covered, and which it did not. |
| 5 | Read each row in "Findings". Check the Reachability and exploitability cell, the Evidence cell, and the Confidence cell. | The skill records reachability, exploitability, and confidence for each finding. It drops a finding only when the path is shown to be unreachable. In this run, the Confidence cell also says if the claim comes from code or from a run. The skill requires only a confidence field. | Each finding has a file and line, a remediation, and a verification. You know which findings rest on reading code only. |
| 6 | Read "Dependency and secret exposure notes". | The skill reads manifests and lockfiles, runs an audit command only when it works without network access, and searches the working tree and Git history for secrets. It records the location and type of a secret, never the value. The history search uses forms that print no value: `git log --all -G<pattern> --format='%h %s'` and `git log --all --diff-filter=A --name-only`. The skill forbids `git log -p`, because it prints removed lines. The rerun used the allowed forms, and its saved output has commit IDs and file names only. | Each dependency and secret check has a result or a `Not verified` reason. |
| 7 | Check each `Not verified` item against the real system. Read the environment variables of each deployment. For dependencies, run an online audit yourself if your policy allows it, for example `npm audit` with network access. You set the policy. If your policy forbids it, record the item as accepted risk and skip this step. | The skill queries an advisory source only with network authority, and it records the package names that it sent. The offline audit gives no advisory data. | Each item has a recorded result with its source and date. |
| 8 | Read "Residual risk and next actions", and "Controls observed" if you asked for it. Give each finding to its owner. | The next actions have an order. The controls list, which this run added, shows the work in place, so the team does not rebuild it. | Each finding has an owner and a fix or an accepted-risk note. |
| 9 | After a fix, run the Verification cell of that finding. | The skill states how to prove each fix. | The test or check from the cell passes. |

Optional step for a reader who wants to know what the existing tests cover: `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest src/tests/services/auth.service.test.ts`. This is not a step of the skill. The command needs the installed dependencies (`npm ci --ignore-scripts`) and a generated Prisma client (`npx prisma generate`). The rerun started no database. 7 of 12 tests failed with `PrismaClientInitializationError`, and 5 passed (`grep -c '✕'` and `grep -c '✓'` on the saved output). The test file imports `auth.service` before the Prisma mock, so the failing calls reach the real client. The run did not check that the tests pass with a database. If your run fails the same way, record it and do not count those tests as coverage.

## Decision points

- Skip step 7 when your policy forbids network audits. Record the item as accepted risk. Skip the optional jest command when you have no test setup.
- If the target is a design and no code exists, stop. Use `/threat-model`.
- If you want a security review of one pull request or branch, choose `/pr-review` (see [Self-review before a pull request](dev-self-review-before-a-pr.md)). Use `security-audit` when you audit a whole area.
- If the report says `Not verified` for a dependency check, do not read it as clean. Run an online audit with network authority and record the source. The skill allows an advisory query only with that authority.
- If you hold a written authorization for active testing, pass it as `--active-scope <written-authorization>`. It must name the target systems, the permitted techniques, the time window, and the stop conditions. If one item is missing, the audit stays read-only and the report names the missing item. Even with a full scope, the skill asks you to confirm before each active action. This run had no authorization and did no active testing.
- If a finding rests on code reading only and the fix is costly, run the Verification check in a test environment before you plan the fix.
- If the report says a finding needs an owner decision (for example, `PUT /user` without the current password), ask the owner. Do not treat the behavior of the code as intended.
- Stop when each finding has an owner and each `Not verified` item has a check or an accepted-risk note. The residual risk section must match what your team accepts. The skill claims no full coverage and no compliance. Do not add that claim.
- Choose [Run a production readiness review](sre-run-a-production-readiness-review.md) when the question is whether the service is ready to run, not whether the code is safe.

## What you get

The rerun was headless: no person answered the skill's questions, and no subagents ran. The skill has no reviewer step, so no result is labeled Self-review. The report has the sections of the skill's template. These are the scope, evidence, and limitations section, the findings, the dependency and secret exposure notes, and the residual risk and next actions. The run also added a "Controls observed" section, which the skill does not require. Its status line says what the audit did.

Excerpt from the rerun on the Conduit sample API at commit 30b68e1, Toolbelt 8ac3e11. Lines are wrapped, and `...` marks skipped text.

```markdown
Status: Read-only. No authorized active scope was given.

...

- Reachability and exploitability below come from reading code, not from running the API. Each finding says so in its Confidence cell.
- Impact levels (`Critical`, `High`, `Medium`, `Low`, `Info`) come from the template. The template now defines each level in one line. Apply them by the asset that each finding affects.
```

The run chose the IDs `SA-1` to `SA-10`, one for each finding, in the order of the report. The template has an ID column and no ID format. The Impact cell starts with the level.

The first finding is the one that the audit ranks highest. Excerpt from the rerun on the Conduit sample API at commit 30b68e1, Toolbelt 8ac3e11. Condensed from the run report: the Reachability and exploitability, Impact (the cell starts with `High`), CWE / OWASP, and Verification columns are left out. The Evidence header is the report's own text. The text of the columns that remain is verbatim. CWE is the Common Weakness Enumeration, a public list of weakness types. OWASP is the Open Web Application Security Project, which publishes a ranked list of web risks.

| ID | Asset / entry point / precondition | Evidence (file:line, revision `30b68e1`) | Remediation | Confidence |
|---|---|---|---|---|
| SA-1 | Asset: every user account. Entry point: any route that uses `auth.required` or `auth.optional`. Precondition: the deployment has `JWT_SECRET` unset or set to an empty string. | `src/app/routes/auth/auth.ts:16` and `:21` (verification). `src/app/routes/auth/token.utils.ts:4` (signing). `README.md:29`. `Dockerfile` has no `JWT_SECRET`. Introduced in commit `e40aeb9`. | Remove the fallback. Read `JWT_SECRET` once at startup in one module, and stop the process when it is missing or shorter than the project minimum. Use the same value for signing and verifying from that one module. | High that the code allows it. Not verified: whether any deployment runs without the variable. |

The omitted Reachability cell says that the code falls back to the literal `'superSecret'`, which is public in the repository, and that an empty value also takes the fallback. The finding is a code fact: the code falls back to a fixed string when the variable is unset. It becomes an attack only if a deployment runs without the variable. The Confidence cell separates these two. The run did not forge a token to prove the attack, because no authorization for active testing existed. Check the deployed environment yourself.

The dependency check is the second place to read with care. The run took this audit on 2026-11-15. Excerpt from the rerun on the Conduit sample API at commit 30b68e1, Toolbelt 8ac3e11. The line is wrapped.

```markdown
- The lockfile audit did not give usable evidence. `npm audit --offline` (npm 11.16.0) ran,
  exited with code 0, and printed "found 0 vulnerabilities" for 773 packages. With `--offline`
  the command has no advisory data, so the zero is not a result. Treat dependency advisories as
  Not verified (SA-10).
```

The JSON output of the same command (`--json`) had a total of 0 for 773 packages (`grep -F '"total"' npm-audit-offline-json.txt`), while the lockfile lists Express 4.18.2 and `path-to-regexp` 0.1.7. The result is a snapshot with no advisory data. The run did not use the zero as evidence, named no advisory, and checked no private advisory or reachability.

The run also listed the controls that work, so you know what not to rebuild. The skill's template has no such section, so ask for it. HS256 is a signing method for JSON Web Tokens (JWT), the signed tokens that the API uses to identify a user. Excerpt from the rerun on the Conduit sample API at commit 30b68e1, Toolbelt 8ac3e11. Lines are wrapped, and `...` marks skipped text.

```markdown
- `auth.ts:18` and `:24` pin `algorithms: ['HS256']`. This blocks the `none` algorithm and key-type confusion.

...

- The controller sets `demo: false` after the body spread (`auth.controller.ts:16`), so a caller cannot register as a demo user.
```

The rerun found 10 items: 1 High, 4 Medium, 3 Low, 1 Info, and 1 `Not verified` for dependencies (`grep -c '^| SA-'` on the report gives the 10). The rerun reused the findings of the first run after it re-read the cited lines. The four Medium items are token lifetime and revocation (SA-2), a password change with no current password (SA-3), no rate limit on login (SA-4), and raw error messages in 500 responses (SA-5).

What you must check in the output:

- Each finding names a file and a line at one revision. Open the line and read it.
- Each finding says how sure the run is, and which part is not verified. Do not drop the part that says `Not verified`.
- The dependency section does not call the offline audit clean.
- The report secret notes name locations and types only. No real secret value appears. The rerun's report quotes the public fallback default `superSecret` in SA-1, which is not a real secret. Search the report text for secret values by hand.
- The report states what was out of scope. In the sample, the article, profile, and tag controllers were out of scope, and they rely on the identity that SA-1 shows can be forged.

## Not exercised

The rerun read code and ran local checks only. A reader must not take these items as verified.

- Exploitability of SA-1: no token was forged and no request was sent. It becomes Verified when you send a token signed with the fallback to a test deployment that has no `JWT_SECRET`, and the API accepts it. This needs written authorization.
- Dependency advisories: the offline audit gave no advisory data. They become Verified when an online audit with network authority lists the result with its source and date.
- Findings that need a database (the unique-constraint path in SA-5, and SA-6): read from code only. They become Verified when a test with a real database shows the behavior.
- The deployed environment: the run did not read any deployment. `JWT_SECRET` is Verified when you read it in each deployment.
- Timing, CORS headers, and the running error handler: no process was started.

## Common mistakes

- You read "found 0 vulnerabilities" from an offline audit as a clean result. The command has no advisory data. Record the dependency check as `Not verified` and run an online audit with network authority.
- You treat a finding that comes from code reading as a proven attack. The report separates the two in the Confidence cell. Confirm the precondition in the real environment, such as the `JWT_SECRET` value of each deployment.
- You read the Impact levels as a defined scale. The template lists `Critical` to `Info` but defines none of them. Two runs can rank the same finding differently. Agree on a scale with your team before you rank work by it.
- You leave the report in the default folder and `git status --short` lists `.atb-work/`. Add `.atb-work/.gitignore` with the line `*`.
- You leave the middleware out of the request. The auth routes depend on `auth.ts` and on the error handler in `src/main.ts`. Five of the findings in the sample (SA-1, SA-2, SA-4, SA-5, and SA-9) sit in `auth.ts` or `main.ts`. Name the middleware in the request.
- You expect the skill to fix the code or to write tests. It reports findings and keeps repository files unchanged. Fixes go through your normal change process.
- You ask for a secret search and paste the matched line into a ticket. The skill records the location and type, not the value. Keep to that in your own notes.
- You count the existing auth unit tests as a control. They cover the service only, and they use a mocked data layer. In the rerun 7 of 12 failed. No test covers the token check, the token utility, or the error handler.
- You run the audit and skip the owner questions. Findings like SA-3 need the owner to say if the behavior is intended.

## Next

- [Threat-model a design](sec-threat-model-a-design.md): when you design the next change to this area. A threat report also lets the audit verify each requirement.
- [Self-review before a pull request](dev-self-review-before-a-pr.md): when you review the fix for a finding before you open the pull request.
- [Plan tests for a small pull request](qa-plan-tests-for-a-small-pr.md): when you need test cases for the fix.
- [Modernize a legacy area](journey-modernize-a-legacy-area.md): when the area needs more than a security fix.
- [Use-case index](README.md): the full list of use-case pages.
