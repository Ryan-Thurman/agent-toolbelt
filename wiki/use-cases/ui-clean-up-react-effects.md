# Clean up React effects and re-render problems

This page is for a front-end developer whose React components have effects that run too often or state that re-renders too much. You get a scan report that lists each effect and each rule that applies, and one safe fix with a test that fails before the fix and passes after it.

| Roles | Skills and commands | Depth | You need |
| --- | --- | --- | --- |
| Front-end developer | [`vercel-react-best-practices`](../../skills/vercel-react-best-practices/SKILL.md) (`/agent-toolbelt:vercel-react-best-practices`) and [`use-effect-killer`](../../skills/use-effect-killer/SKILL.md) (`/agent-toolbelt:use-effect-killer`). Neither skill has a command file. | No levels. | A React repository with its dependencies installed, a folder to scan, and the commands for your tests and type check. |

## Quick path

1. Start Claude Code in the repository with the Toolbelt loaded: `claude --plugin-dir <toolbelt-folder>`. Run `<test-command>` and `<type-check-command>` first and keep the output.
2. Scan, with no edits: `/agent-toolbelt:vercel-react-best-practices Scan <folder> in report mode. Do not edit files. Record each rule that the scan lists as Applied or Not applicable, with the severity.`
3. Audit the effects: `/agent-toolbelt:use-effect-killer <folder>`. Every effect gets one class.
4. Pick one finding with a clear consequence. Ask for a test that fails first: `Write a test that shows the problem of <finding>. Run it on the current code. Then apply the fix and run it again.`
5. Run `<test-command>` and `<type-check-command>` again and compare with step 1.

You get a rule record, a list of effects with their classes, and one fix with its test.
The sections below explain each step, when to stop, and what the output looks like.

## Situation

The sample is the React 19 front end of the RealWorld "Conduit" app (`yurisldk/realworld-react-fsd`, MIT license, commit 969709a). It uses TypeScript, webpack, Jest, and React Router. You must find effect and render problems and fix one of them without a change in behavior.

The scan covers 16 React files in `src`. Run it yourself from your project folder: `python3 <toolbelt-folder>/shared/contracts/scripts/react-rule-scan.py --skills-dir <toolbelt-folder>/skills src`. Or let the skill run it.

Severity words on this page come from [`react-acceptance.md`](../../shared/contracts/references/react-acceptance.md). A `should-fix` is a finding with a concrete consequence in your code. A `nit` is a note with no proven consequence. A `blocker` stops a merge.

## Why this path

The first alternative is your linter. The sample enables `react-hooks/exhaustive-deps` through `airbnb/hooks`. The rule printed nothing for the file that the run fixed, so the lint cannot find this problem. The linter also does not classify effects or know the rendering rules.

The second alternative is [`simplify`](../../skills/simplify/SKILL.md) with `/code-smell` (see [Clean up a feature](dev-clean-up-after-a-feature.md)). It finds code smells in any language. It has no React rules and no effect catalog. Use it when the mess is not React specific.

The order has a reason that the skill states. It tells you to read the installed React version, and to give each performance finding a concrete consequence tied to the code, before you apply a rule. The scan comes first because it lists the rules that your code triggers, so you do not read all of them.

## Steps

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Load the Toolbelt: `claude --plugin-dir /path/to/agent-toolbelt`, or install: `./install.sh --harness claude react-quality /path/to/project`. | The skills must exist in your session. | You type `/` and see both skill names. |
| 2 | Run the baseline: `<test-command>` and `<type-check-command>`. In the sample: `npx jest` and `npx tsc --noEmit --skipLibCheck -p tsconfig.json`. | You compare the same commands after the fix. | You have a result for each. See the first decision point if one fails. |
| 3 | Run the scan prompt from the quick path. "Report mode" is the run's wording for "do not edit". The run predates a fix: the skill now names a default report path (`.atb-work/vercel-react-best-practices/<scope-slug>.md`) and a rule table in the React rule scan section. | A report first means no code changes before you read the findings. | The reply lists every rule from the scan with Applied or Not applicable and a severity. A listed rule with no record is unfinished work. |
| 4 | Check each Not applicable reason against the code. Open the cited lines. | The scan matches text patterns, so it lists rules that do not fit. | You read the lines for each rule. |
| 5 | Run `/agent-toolbelt:use-effect-killer <folder>`. | The skill requires one class for every effect, and a list of the legitimate ones. | The effect count in the table equals the count from `grep -rnE "use(Layout|Insertion)?Effect\(" <folder>`. |
| 6 | Pick one finding. Ask for a test that fails on the current code, then apply the fix. | A test that never failed proves nothing. | The test fails with the assertion that you expect, then passes. |
| 7 | Run the baseline commands again, and the linter on the changed folder. | `use-effect-killer` requires the focused tests after each fix. | Results match the baseline, plus your new tests. |

## Decision points

- If the baseline fails, record the failures by name and compare the same set later. In the sample, `tsc` failed at first. The generated API code is ignored by git (run `npx orval` and `npx ts-node convert-zod-mini.ts` in your copy), and the library typings need `--skipLibCheck`. Both were setup choices of the run.
- If the repository has no test for the code, write the test before the fix, as step 6 says.
- If a finding has no concrete consequence, report it as a `nit` and do not fix it. The acceptance contract sets this for medium and lower rules. The run left the localStorage nit, the `parseTags` nit, and the image, ellipsis, and motion findings open.
- If the scan lists a bundle rule, measure with a production build (`npm run build:prod` in the sample) before you act. In the sample, the vendor chunk held 6 icon definitions (counted with `grep -o 'viewBox:"0 0 512 512"'`) and the source imports 6 distinct icons, so the barrel import rule did not apply.
- Stop when each rule has a record and the one fix is green. Fix more only when you ask for it.
- Choose [`vercel-web-interface-guidelines`](../../skills/vercel-web-interface-guidelines/SKILL.md) when the problem is accessibility or motion, and [`webapp-testing`](../../skills/webapp-testing/SKILL.md) when you must see the behavior in a browser.

## What you get

Excerpt from a run on the RealWorld React sample (realworld-react-fsd) at commit 969709a. The file `scan-summary.txt`, made from the scan output:

```text
react_files: 16 rules: 10 judgment_rules: 11 missing: 0
async-dependencies | CRITICAL | 8 hits
bundle-barrel-imports | CRITICAL | 4 hits
...
rerender-split-combined-hooks | MEDIUM | 1 hits
...
architecture-avoid-boolean-props | CRITICAL | 4 hits
...
```

The run cut the other lines and marked each cut with `...`.

The scan listed 10 rules. The run recorded 5 as Not applicable, 4 as Applied (3 nits and the motion should-fix), and the effect rule as Legitimate. Re-count it with the command that makes `scan.json`: `react-rule-scan.py --skills-dir skills src`. The impact word is the rule's own label, not a severity. A CRITICAL rule can be Not applicable.

The one effect in the app had two jobs with different dependencies: it ran the interval and the finish timer in one effect. A change of `animationDuration` during an animation reset the progress. No caller changes that value, so the severity is a nit. The fix splits the effect in two and removes the ref.

Excerpt from a run on the RealWorld React sample (realworld-react-fsd) at commit 969709a. The new test file on the base code (`test-base.txt`) and after the fix (`test-fixed.txt`). The run kept only the failing line and the summary lines:

```text
    ✕ keeps the progress when only animationDuration changes during an animation (2 ms)
Tests:       1 failed, 5 passed, 6 total
...
Tests:       6 passed, 6 total
```

The failing check is the last line of that test: after the dependency change, `progress` must stay close to its value before it. After the fix, the full run gave 8 passing tests (2 old and 6 new) and `tsc` exit 0. The old tests did not cover the hook, so the new file is the only proof. The test proves the timer behavior with fake timers. It does not prove how the bar looks in a browser.

Excerpt from a run on the RealWorld React sample (realworld-react-fsd) at commit 969709a. Mutation checks (`mutations.txt`), where each line is a change to the fixed hook:

```text
## remove clearTimeout in cleanup
Tests:       5 passed, 5 total
...
## round 2: sixth test added
    ✕ cancels the pending finish when a new animation starts (2 ms)
```

The `...` marks three mutation blocks that the page cuts. The run file does not name the mutation under "round 2". The page reads it as the `clearTimeout` mutation run again with the sixth test.

The first mutation survived the first five tests, so the run added a sixth test. Removing `clearInterval`, changing `setProgress(1)`, and adding the dependency back each made at least one test fail.

## Not exercised

- The progress bar in a browser. The run did not start the dev server or mock the API.
- A re-scan that proves the fix. The scan still lists `rerender-split-combined-hooks` on the fixed file, because its signal is any effect dependency array with three or more items. The record closes the rule.
- The motion should-fix, the localStorage nit, the `parseTags` nit, and the image size nit. They are reported and not fixed.

## Common mistakes

- Treating the hit count as the finding count. In the run, 5 of 10 listed rules did not apply. Give each a reason.
- Fixing a `CRITICAL` rule because of its label. Check the code and measure first.
- Adding a test that never failed. The first five tests passed on the base code too. Only one showed the problem, and a mutation showed a gap.
- Missing a finding that the scan does not list. The progress bar has an inline `transition` and no `prefers-reduced-motion` rule. A grep found it, and the scan did not.

## Next

- [`vercel-web-interface-guidelines`](../../skills/vercel-web-interface-guidelines/SKILL.md) for the motion, image, and focus findings.
- [`dev-self-review-before-a-pr`](dev-self-review-before-a-pr.md) before you open the pull request.
- [`webapp-testing`](../../skills/webapp-testing/SKILL.md) to see the fixed bar in a browser.
