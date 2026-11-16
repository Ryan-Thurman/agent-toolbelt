# Review a page for accessibility and interface quality

This page is for a designer, front-end developer, or QA engineer who must review a page or a UI change. You get a list of findings. Each finding has a file, a line, a severity, and a fix. No code changes.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Designer, front-end developer, QA engineer | [`vercel-web-interface-guidelines`](../../skills/vercel-web-interface-guidelines/SKILL.md) (`/web-interface-review`) | No levels | A UI repository, the files of the page, and a browser run if you want to check behavior |

## Quick path

1. Start Claude Code in the app repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`.
2. Ask: `Use the vercel-web-interface-guidelines skill to review <page-file> and <page-file>. Do not change code. Report each finding with file and line.` The command `/web-interface-review <file-or-folder>` runs the same skill. In plugin mode you can also type `/agent-toolbelt:vercel-web-interface-guidelines <file-or-folder>`. An installed copy (`./install.sh --harness all vercel-web-interface-guidelines <project>`) uses `/vercel-web-interface-guidelines`.
3. Fix the `should-fix` lines first. Run the same prompt again on the same files.

You get findings grouped by file in the form `file:line - [severity] problem. Fix.`
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the RealWorld "Conduit" front end in React 19 and TypeScript (`yurisldk/realworld-react-fsd`, commit 969709a). You must review the sign-in page (`src/pages/login/login.ui.tsx`) and the article page (`src/pages/article/article.ui.tsx`). No design system, copy policy, or accessibility policy file exists in this repository.

Terms: a finding is one problem at one line. Severity comes from `shared/contracts/references/react-acceptance.md`. `should-fix` means a user can be blocked. `nit` means polish. The React rule scan is a script that lists rules which changed code triggers.

## Why this path

The alternative is `/pr-review` (see [dev-self-review-before-a-pr.md](dev-self-review-before-a-pr.md)). It reviews a diff or PR in three tiers (light, standard, deep). It reviews the changed lines only, so a page with no diff gets no interface review. It also costs more, because the standard and deep tiers split the review across several reviewers. The guidelines skill reads every UI file that you name against every guideline section.

The skill order is: read the guidelines, read the repository policy (it wins), read each file, report in scope, set severity, then tag each finding `[read]` or `[observed]`. Policy comes before the read, so a repository rule is never reported as a defect.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Name the page files in the prompt (Quick path step 2). | Without an argument the skill reviews files changed since the default branch. With no diff it reviews the app in "Existing code" mode (read at most 15 files, shared files first). Naming the files keeps the set exact. | The agent lists the files it will read. |
| 2 | Optional: ask the agent to run the React rule scan on the named files: `python3 shared/contracts/scripts/react-rule-scan.py <files>`. Run it from the Toolbelt folder with `--repo <app-folder>` if the app has no copy of the script. | The scan finds the common anti-patterns fast. | You see the scan result. It is a start, not the review. |
| 3 | Let the agent read each file and the CSS and layout that it uses. | The skill orders a full read of components, styles, and layout files. It finds what a pattern cannot find, such as a missing label. | Every guideline section has a result: finding or pass. |
| 4 | Optional, skip it for a first pass: run the app and check behavior (see [ui-verify-a-browser-flow.md](ui-verify-a-browser-flow.md)). The skill hands these checks to `webapp-testing`. | Focus after submit, announcements, and reduced motion show only in a browser. | Each finding says `[observed]` or `[read]`. |
| 5 | Read the output. Fix `should-fix` lines, then `nit` lines. | The order follows user impact. | A second run lists no `should-fix`. |

## Decision points

- If the repository has a design system, copy style, or accessibility policy, tell the agent. The skill says it wins over the guidelines.
- If the page uses shared layout or CSS files, add them to the prompt. The skill reports findings in shared layout, style, and HTML files that your files use, and marks them `shared`. The run predates this rule and named the shared files by choice.
- If a finding depends on behavior, not code, run the page in a browser before you rate it.
- If a guideline conflicts with your copy style (Title Case, for example), the skill lists it once under `Conflicts` and does not report it as a finding.
- Stop when a second run on the same files lists no `should-fix`.
- Choose [dev-self-review-before-a-pr.md](dev-self-review-before-a-pr.md) when you review a diff for bugs. Choose [ui-clean-up-react-effects.md](ui-clean-up-react-effects.md) when the problem is effects, not interface rules.

## What you get

The run predates the `[read]` and `[observed]` tags in the skill format, the severity rule below, and the `Conflicts` section. Excerpt from a run on the RealWorld React sample (realworld-react-fsd) at commit 969709a, with mock API data (page text says MOCK). Cut to three of the 21 lines. The `[observed: ...]` tags are the run's own notation. Full file: the run's saved report, not in this repository.

```text
src/pages/login/login.ui.tsx:26 - [should-fix] email input has no label and no aria-label. Its only name is the placeholder [observed: `labels: 0`]. Add a `<label htmlFor>` (visually hidden if the design needs it).
src/pages/login/login.ui.tsx:24 - [should-fix] `<fieldset disabled>` drops focus to `<body>` when the request starts, and focus stays there after the error appears [observed: active element BODY during and after submit]. Do not disable the focused control. Focus the first error after a failed submit.
src/pages/article/article.ui.tsx:225 - [nit] "Delete Article" sends `DELETE /api/articles/mock-article` at once [observed: no dialog, request seen]. The comment delete at line 301 does the same. Add a confirmation or an undo window. The contract then rated this a nit. The contract now rates a destructive action with no confirmation as should-fix.
```

The run had 8 `should-fix` and 13 `nit` lines. Count them in your own report with `grep -c '\[should-fix\]' <report-file>` and `grep -c '\[nit\]' <report-file>`. The scan flagged one of the 21 findings (image sizes, lines 91, 275, and 344). The rest came from the full read and the browser run. The quick path gives only `[read]` findings. The `[observed]` tags come from a Playwright run that used mocks: `/api` answered from `openapi.yaml`, with the text MOCK on the page. The overflow finding (line 46) used a constructed 340-character word, not real data.

What to check: each line has a file, a line number, a severity, and a fix. Open the line and confirm the problem. Treat `[read]` lines as code reading only.

## Not exercised

- The run followed `SKILL.md` step by step. It did not type the slash command, and `/web-interface-review` did not exist then. Confirm in your host that `/` lists it.
- The run did not check color contrast outside the guidelines, screen reader output on a real device, or the pages signed in through a real API.
- The run did not apply any fix. A second run after fixes is not shown.

## Common mistakes

- Reviewing only the page files. Layout, CSS, and `index.html` hold the landmark, focus, and motion problems. The skill now reads them and marks findings there `shared`.
- Reading the scan result as the review. In this run it flagged one of 21 findings.
- Rating by the run's tie-breaker. The contract at the time of the run was unclear, so the run rated a `:focus` ring on a click and a decorative icon without `aria-hidden` as `nit`. The contract now rates every Accessibility, Focus States, and Forms rule as `should-fix`. It allows a `nit` only with stated evidence of no user effect.
- Copying the sample paths into your prompt. Use your own page files.

## Next

- [ui-verify-a-browser-flow.md](ui-verify-a-browser-flow.md): check the fixed page in a browser.
- [ui-clean-up-react-effects.md](ui-clean-up-react-effects.md): clean up effects that the review points to.
- [dev-self-review-before-a-pr.md](dev-self-review-before-a-pr.md): review the same change for bugs before the PR.
- [README.md](README.md): all use-case pages.
