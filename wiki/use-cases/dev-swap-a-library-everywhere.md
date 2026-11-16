# Swap a library at every call site

This page is for a developer who must replace one library or API at every call site and keep the build working. You get a site list that two searches confirm, a plan in slices, and the first slice applied with tests.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Developer | [`retrofit`](../../skills/retrofit/SKILL.md) (`/retrofit`) | No levels. The skill has three mutation tiers (Discover, Apply, Fan out), not depth levels. | The change written as `<old-library> -> <new-library>`, the repository, and a way to run its tests and build. |

## Quick path

1. Start Claude Code in the root folder of the repository that you change, with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Stop here in two cases. If you cannot write the rule and one example, use `/shape-up`. If the change migrates stored data, retrofit does not apply.
3. On a new branch, run the type check, the tests, and the build. Write down the counts. This is your baseline.
4. Find the sites and slice the work. This step edits no source file: `/agent-toolbelt:retrofit "<old-library> -> <new-library>. State the rule, one before and after example, and the sharp edges. Discover only. Search with grep and an AST scan. Include the manifest, lockfile, build files, and container files. Save the plan to retrofit-plan.md."`
5. Read the plan. Then apply the first slice: `Apply slice 1 only. Run the tests of its module on the old code first. If they do not run or cannot fail, write a test first that records today's behavior and does not name the library. Then add <new-library> next to <old-library> and move the first module.`
6. Run the type check, the tests, and the build again. The results must match the baseline. Your new tests must also pass.
7. Apply each next slice with `Apply slice <n> only.` and check as in step 6. Mark a slice that you cannot run, such as a Dockerfile slice without Docker, as pending and not done. Remove `<old-library>` only when a fresh search finds zero uses.

You get a plan where every site is `done` or `skipped (reason)`. The tree builds after each slice. The report lists what you did not run.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" API in TypeScript (Express, Prisma, Jest). The commands on this page that name `bcryptjs` and commit 30b68e1 are examples. Replace them with your own libraries.

The swap in this run is `bcryptjs` (a password hashing library written in JavaScript) to `bcrypt` (a native add-on with the same call shape). The run chose it for these reasons, which are the run's choice and not a rule of the skill:

- It has call sites in source and in tests, and it has a type package, a lockfile entry, and a build and Docker angle.
- The users' password hashes already sit in the database. A wrong swap locks every user out, so the swap has real sharp edges.
- The call shape stays the same, so the sites are easy to read and the judgment sites stand out.
- The other candidates are smaller. `jsonwebtoken` and `express-jwt` have one site each. `axios` appears only in the end-to-end tests, which need a running API.

You must replace the library everywhere, keep logins working, and not leave a broken tree between steps.

## Why this path

The obvious alternative is a global find-and-replace of the package name, then `npm install bcrypt`, then the full test suite. That costs you three things here. First, grep finds the 7 source and test lines, plus 2 in `package.json`, and nothing in the `Dockerfile`. The image still installs production dependencies on `node:lts-alpine`, where a native add-on can need a build step. Second, the suite reads red before you start: 7 tests in `auth.service.test.ts` fail on the unchanged code. A red result before and after the swap tells you nothing about login. Third, a replace never asks whether the stored hashes still verify.

The `retrofit` command points to two siblings. Use [`shape-up`](../../skills/shape-up/SKILL.md) (`/shape-up`) when you cannot yet write the rule and a before and after example. Retrofit applies a defined change and does not decide it. Use [`simplify`](../../skills/simplify/SKILL.md) (`/simplify`) for cleanup of one diff. The skill also excludes database migrations. In practice, a switch to another hash scheme, such as argon2, changes stored data, so it falls under that exclusion. This sample keeps the scheme, so retrofit applies.

The procedure has this order because the skill requires it. You need the full work-list and the defined change before you apply it everywhere. Shared pieces go first and dependents after, so the tree keeps working. The old path goes last, when usage is zero.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt in Claude Code: `claude --plugin-dir /path/to/agent-toolbelt`. Or install the skill into the project: `./install.sh --harness all retrofit /path/to/project`. Start in the repository root. | The skill must be available in your session. | You type `/` and see `/agent-toolbelt:retrofit` (plugin) or `/retrofit` (installed copy). |
| 2 | Record the baseline on a branch. In the sample, install with `npm ci --ignore-scripts`, run `DATABASE_URL=postgresql://u:p@localhost:5432/db npx prisma generate`, then run `DATABASE_URL=postgresql://u:p@localhost:5432/db JWT_SECRET=x npx jest`. No database is running, so only tests that use the Prisma mock can pass. The run used a prepared copy with dependencies already installed. For the new package, run `npm install <new-library>` without `--ignore-scripts`, because a native add-on needs its install script. The run did not install from a registry. | A later result means something only against a baseline. | You have the test counts and the type check result before any edit. |
| 3 | Run `/agent-toolbelt:retrofit "bcryptjs -> bcrypt. Discover only. ..."`. State the rule, one before and after example, and the sharp edges that you know. | The skill defines the transform before it looks for sites. A change that you cannot write down is not defined. | The report has a rule, an example, and a list of sharp edges. |
| 4 | Read the site list. The skill finds sites with grep and with an AST scan (a parse of the code, not text). It compares the counts. | A mismatch between the two counts means hidden sites. | Both counts match, or you know the reason for each difference. |
| 5 | Add the sites that no search finds: the manifest, the lockfile, build configuration, container files, and documentation. Read your build configuration and container files for install or bundle steps that a grep for the import cannot find. The sample has `project.json` and a `Dockerfile`. | A grep for the import cannot find a native build step. | Each non-source site has a row in the plan with a class. |
| 6 | Check the class of each site. Mechanical sites change like the others. Judgment sites have a sharp edge that a blind change breaks. Choose a hand edit when the sites are few. | The skill writes a codemod (a script that edits code) for more than about 30 mechanical sites. | Each site has a class. You chose a codemod or a hand edit. |
| 7 | Slice the work: dependency first, then one module at a time, then the old path last. Save the plan from `templates/retrofit-plan.md` at `retrofit-plan.md` (or another path that you choose). | Each slice must leave the tree working. | The plan has numbered slices and a status for every site. |
| 8 | Run the unit's tests on the old code. If they do not run or cannot fail, write a characterization test. It records today's behavior and does not name the library. | The skill says to compile and test each unit before the next. A characterization test (a test that records today's behavior) is the run's choice. The skill gives no rule for a unit with no usable tests. | The new test is green on the old library. |
| 9 | Run `Apply slice 1 only. ...`. The agent adds the new package, updates the lockfile, and changes the first module. | Old and new then coexist. The skill calls this the strangler strategy (old and new run side by side until the sweep ends). | The diff holds only the slice, and the old library is still installed. |
| 10 | Run the type check, the tests, and the build. Then break the new code on purpose and make sure that the test fails. | The skill requires a compile and a test of each unit before the next slice, and an adversarial re-check of judgment sites at the end. The mutation check is the run's choice. A test that cannot fail proves nothing. | The results match the baseline plus your new tests, and the broken copy turns a test red. |
| 11 | Update the plan statuses. List every deferred site and what you did not run. | A half-done retrofit that reads as complete is the failure mode that the skill names. | Every site is `done`, `skipped (reason)`, or `pending` with a slice number. |

## Decision points

- If a pass of discovery finds a new site, add it to the plan and slice it. Repeat until a pass finds none. The skill calls this loop until dry.
- If the grep count and the AST count differ, find each missing site before you apply anything.
- If the transform is not yet defined, stop and use `/shape-up`. The skill applies a defined change only.
- If the change moves stored data, stop. The skill excludes database migrations.
- If the unit's tests do not run or cannot fail, write a characterization test first. If a test needs an edit to pass, the skill says to treat the site as a judgment site. Do not paper over it. The skill gives no rule for a test that cannot run because of its own defect. In this run, the existing auth tests did not run for that reason, and the run left their slice pending.
- If you ask only for a report, the skill stays in the Discover tier and edits nothing. It writes the plan file only when you ask. The skill applies a change only when you ask for it.
- If you want parallel agents, ask for them. The skill then uses the `Workflow` tool and many tokens. Without that tool it walks the plan in order, one slice at a time. This sample has 12 sites, so the run used one agent.
- If a site stays unfinished, mark the retrofit partial and name the site. Do not report it as complete.
- Stop when every site is `done` or `skipped (reason)` and the full suite and the build pass. The old path must be removed, or its blockers written down.
- Choose [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md) when the work adds a new feature instead of replacing an old one.
- Choose [Refactor a risky function](dev-refactor-a-risky-function.md) when one function needs a redesign and not a sweep.

## What you get

The run was headless. No person answered a question, and the skill asks none in its procedure. It stopped after slice 1, as the request said. No subagent ran. The adversarial check of the slice was a mutation check (a check that breaks the code on purpose) by the runner. It is a Self-review.

First, the AST scan. It matches the grep count: 2 import lines and 5 call lines in source and tests.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is the full output of the scan script that the run wrote.

```text
import  src/app/routes/auth/auth.service.ts:1  import * as bcrypt from 'bcryptjs';
use     src/app/routes/auth/auth.service.ts:58  bcrypt.hash(password, 10)
use     src/app/routes/auth/auth.service.ts:111  bcrypt.compare(password, user.password)
use     src/app/routes/auth/auth.service.ts:156  bcrypt.hash(password, 10)
import  src/tests/services/auth.service.test.ts:1  import * as bcrypt from 'bcryptjs';
use     src/tests/services/auth.service.test.ts:114  bcrypt.hash(user.password, 10)
use     src/tests/services/auth.service.test.ts:180  bcrypt.hash('4321', 10)
TOTAL imports=2 uses=5 files-scanned=39
```

The plan holds more than these 7 rows. The `Dockerfile` and the build output have no `bcryptjs` text, so no search finds them. The next excerpt shows five rows of the plan. The plan IDs are row numbers. A row has a class (mechanical or judgment) and a status.

Excerpt from a run on the Conduit sample API at commit 30b68e1. Condensed from the run report: rows 1, 2, 5, 11, and 12 of 13 are shown, and the text of each cell is verbatim.

| # | Site (file / module / unit) | Class | Status | Notes |
|---|---|---|---|---|
| 1 | `src/app/routes/auth/auth.service.ts:1` import | mechanical | done (slice 1) | |
| 2 | `src/app/routes/auth/auth.service.ts:58` `hash` in `createUser` | mechanical | done (slice 1) | |
| 5 | `src/tests/services/auth.service.test.ts:1` import | mechanical | pending | Slice 2 |
| 11 | `Dockerfile` install step | judgment | pending | Slice 3. Needs Docker to prove. |
| 12 | Build output `generatePackageJson` | judgment | needs-review | `nx build api` passed after slice 1. The generated `package.json` lists `bcrypt` 5.1.1 (`slice1-build-package-deps.txt`). Re-check at slice 4, when `bcryptjs` must leave the list. |

The main sharp edge is the stored hash. The old library writes `$2a$` hashes and the new one writes `$2b$`. The run checked both directions before it changed any code.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is the full output of the check.

```text
bcryptjs 2.4.3 hash prefix: $2a$10$ length 60
bcrypt 5.1.1 hash prefix:   $2b$10$ length 60
bcrypt verifies the bcryptjs hash: true
bcryptjs verifies the bcrypt hash: true
bcrypt rejects a wrong password on the bcryptjs hash: true
72-byte truncation: bcrypt verifies an 80-char password hashed by bcryptjs: true ; with only the first 72 chars: true
```

The existing auth tests give no such proof. Here is the suite before and after slice 1. The same 7 tests fail in both runs, and the 6 new tests are the added passes.

Excerpt from a run on the Conduit sample API at commit 30b68e1. These are the `Tests` lines of two full-suite runs, before the change and after slice 1.

```text
Tests:       7 failed, 1 todo, 19 passed, 27 total
Tests:       7 failed, 1 todo, 25 passed, 33 total
```

The characterization test passed on `bcryptjs` before the swap and on `bcrypt` after it. To show that the test can fail, the run broke the password check in `login` and ran the tests again. The run notes do not record the exact edit.

Excerpt from a run on the Conduit sample API at commit 30b68e1. This is the full output of the mutation check on the changed code.

```text
    ✓ login accepts a hash that is already stored (4 ms)
    ✕ login rejects a wrong password (2 ms)
    ✓ createUser stores a cost-10 bcrypt hash, not the password (64 ms)
    ✓ a hash from createUser lets the same user log in (60 ms)
    ✓ updateUser stores a hash that lets the user log in with the new password (60 ms)
    ✓ updateUser without a password does not write a password (2 ms)
Tests:       1 failed, 5 passed, 6 total
```

What the run executed after slice 1:

- The type check passes for the app and for the test configuration.
- The 6 characterization tests pass on both libraries.
- The build `nx build api` passes. The generated `package.json` of the build lists `bcrypt` 5.1.1.
- Lint on `auth.service.ts` reports 2 errors, both `no-explicit-any` on lines that the slice did not change.

What the run did not execute:

- The Docker build on `node:lts-alpine`. It is not known whether the image gets a prebuilt `bcrypt` binary or needs build tools.
- Any test against a real database. A login with a real stored `$2a$` row is not proven. The characterization test uses a fixed `$2a$` hash and the Prisma mock.
- The end-to-end project, which needs a running API.
- Slices 2 to 4, including the zero-usage search and the removal of `bcryptjs`. The retrofit is partial.

What you must check in the output:

- Each non-source site has a row. If the plan lists only the files that grep found, ask for the manifest, the build files, and the container files.
- Every `mechanical` site has the same change. Every `judgment` site names its sharp edge.
- The test results after the slice match the baseline, except for your new tests. Read the failing test names, not only the totals.
- The old library is still installed after slice 1. Removal waits for the last slice.
- The slice changes only the slice. In the sample, the production change is one line, `import * as bcrypt from 'bcrypt';`, because the call shape is the same.

## Common mistakes

- You trust a green or red total. In the sample, 7 tests fail on the unchanged code because `auth.service.test.ts` imports the service before the mock module. The mock registers too late, so the service reaches the real Prisma client. A copy of that file with the two imports in the other order passed 12 of 12 in the run. The run did not edit the original file. Read why each baseline failure happens.
- You count the existing tests as proof of a login. Even when they run, they use a mocked data layer. Test with a stored hash that the old library wrote.
- You expect the lockfile to change only by the new package. In the sample, `npm install --package-lock-only` added the `bcrypt` packages and also removed two optional entries (`babel-plugin-macros`, `cosmiconfig`). Read the lockfile diff.
- You remove the old library before a fresh search finds zero uses. A test fixture can still use it. In the sample, the test file imports `bcryptjs` until slice 2, so an early removal breaks it.
- You report "done" with sites pending. Write the deferred sites and the reason. The skill treats a report that implies completion as worse than no retrofit.
- You treat the sample values as the general prompt. The module name, the library names, and the test command are examples. Replace them.

## Next

- [Copy a pattern to a new area](dev-copy-a-pattern-to-a-new-area.md): when the work adds a feature that follows an existing one.
- [Refactor a risky function](dev-refactor-a-risky-function.md): when one function needs a redesign, not a sweep.
- [Clean up after a feature](dev-clean-up-after-a-feature.md): when the leftover work is cleanup of one diff.
- [Run agents in parallel](dev-run-agents-in-parallel.md): when you ask retrofit to fan out over many units.
- [Self-review before a pull request](dev-self-review-before-a-pr.md): when the slices are done and you want a review before you open the pull request.
