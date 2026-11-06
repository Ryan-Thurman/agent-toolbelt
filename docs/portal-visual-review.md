# Portal screenshots and visual review

Use Playwright to capture the portal and check its behavior in a browser.
The portal itself remains an offline HTML page. The browser tools are development dependencies.
The current design uses task shortcuts, category colors, and highlighted result summaries.
The dated records below describe each design revision.

## Install and run

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Run `npm ci`. | Install the locked development tools. | The installation finishes successfully. |
| 2 | Run `npx playwright install chromium`. | Install the browser version required by Playwright. | Chromium is available to the runner. |
| 3 | Run `npm run portal:screenshots`. | Build the portal, check its flows, and capture the views. | All eight tests pass and screenshots are saved. |
| 4 | Run `npm run portal:report`. | Review the browser results and attached images. | The HTML report opens with the current results. |

`npm run portal:test` runs the same checks and captures.
The complete `scripts/check-plugin-package.sh` check also runs this browser suite.
A missing browser or development dependency fails the check. It does not silently skip browser verification.

The tests open `portal/generated/index.html` through `file://`.
They require no local server, remote service, or application account.

## Review the evidence

| Project | Viewport | Theme |
| --- | --- | --- |
| `desktop-light` | 1440 × 1000 | Light |
| `desktop-dark` | 1440 × 1000 | Dark |
| `mobile-light` | 390 × 844 | Light |
| `mobile-dark` | 390 × 844 | Dark |

Each project saves `home.png`, `finder.png`, `results.png`, `skill-details.png`, and `workflows.png`.
Find these images under `.atb-work/portal/screenshots/<project>/`.
The HTML report is at `.atb-work/portal/playwright-report/index.html`.
Failure screenshots and traces are under `.atb-work/portal/test-results/`.
These generated artifacts are ignored by Git.
Each successful run replaces images with the same names. Check the current report before using saved images as evidence.

The suite checks the catalog, category expansion, combined filters, empty results, detail dialogs, focus return, theme persistence, and horizontal overflow.
It also checks search visibility, mobile navigation, filter reset, filter focus, and the search keyboard shortcut.
The main catalog flow also checks all three task shortcuts and their keyboard focus return.
It also checks for page errors and remote requests in the main flow.
Automated axe scans cover the catalog, selected filters, and the open skill dialog in each project.
These scans include text contrast. They do not establish full accessibility conformance.

The images are review evidence. They are not approved pixel comparison baselines.
Review the screenshots before accepting a theme change.

## Local Chromium startup problem

Some local macOS sessions cannot register Chromium's helper process.
The browser log reports `bootstrap_check_in` and `MachPortRendezvousServer` before the page opens.
For local screenshots of this offline portal, use:

```sh
PLAYWRIGHT_SINGLE_PROCESS=1 npm run portal:screenshots
```

This option uses Chromium's single-process mode for the local run.
It does not change the normal Playwright configuration or the portal runtime.
It is not a substitute for standard browser coverage.
Run the normal suite in an environment that supports Chromium's standard process model before release.

## Theme changes — 2026-11-05

| Area | Change | Purpose |
| --- | --- | --- |
| Light theme | White cards, neutral backgrounds, navy text, and blue accents. | Separate content and controls clearly. |
| Dark theme | Dark navy surfaces, light text, and pale blue controls. | Keep labels and links readable. |
| Small text | Larger labels, descriptions, and metadata. | Reduce the effort needed to read supporting information. |
| Primary actions | Theme-specific foreground colors. | Keep button text readable in both themes. |
| Selected filters | Filled controls with distinct borders. | Show selection without relying on a small color change. |
| Keyboard focus | Visible focus outlines and larger controls. | Make the current action easier to identify. |

Source theme rules are in `portal/src/styles.css`.
Rebuild generated files with `npm run portal:build`.
No plugin version changes are required for local review.

## Recorded review — 2026-11-05

| Check | Result | Limit |
| --- | --- | --- |
| Browser tests | All eight tests passed. | The run used the local single-process option. |
| Automated accessibility scans | All 12 scans passed. | The scanned states do not establish full accessibility conformance. |
| Screenshots | Twenty images were captured and the key desktop and mobile views were inspected. | These images are review evidence, not approved regression baselines. |
| Complete package check | Passed with `PLAYWRIGHT_SINGLE_PROCESS=1`. | Standard Chromium process mode remains unverified in this environment. |
| Plugin versions | All six manifests remain at `0.2.0`. | No release was published. |

| CSS color pair | Previous contrast | Current contrast |
| --- | --- | --- |
| Supporting text on the light card surface | 3.14:1 | 5.93:1 |
| Primary button text in the dark theme | 2.06:1 | 8.24:1 |

These ratios compare the specified foreground and background color tokens.
The browser scans check rendered text in the tested states.
Local before images and command logs are in `.atb-work/portal-theme-2026-11-05/`.

Implementation references: [Playwright screenshots](https://playwright.dev/docs/screenshots),
[test configuration](https://playwright.dev/docs/test-configuration), and
[automated accessibility checks](https://playwright.dev/docs/accessibility-testing).

## Library redesign with Mobbin — 2026-11-05

The portal now shows search before workflow and setup instructions.
The design uses patterns from catalog screens inspected through the Mobbin MCP connection.

| Reference | Observed pattern | Application |
| --- | --- | --- |
| [Vercel marketplace](https://mobbin.com/screens/7919ab35-9297-4062-ad5e-d8100878ee66) | Categories sit beside a grid of catalog cards. | Category controls sit beside the skill catalog on desktop. |
| [Kit apps](https://mobbin.com/screens/428cb12b-0e79-46b5-8d39-672af35804e8) | Compact cards show a name, description, and action. | Skill cards give priority to purpose, use conditions, and details. |

These references support the layout choice. They do not establish usability improvements for this portal.
No reference images or external assets are required by the portal.

| Area | Change | Result |
| --- | --- | --- |
| Entry page | A shorter introduction precedes the catalog. | Search is visible without scrolling at both tested viewport sizes. |
| Categories | Desktop controls show a count for each category. | Users can compare available skill counts before selecting a category. |
| Category guide | A disclosure control opens category explanations. | The guide remains available without placing all explanations before search. |
| Mobile controls | Categories use a horizontal row. Tags wrap onto separate lines. | Filters fit the mobile viewport, and the reset control remains visible. |
| Skill cards | Repeated host names are removed from individual cards. | The host list appears once beside the catalog and in setup instructions. |
| Keyboard controls | `Ctrl+K` and `Cmd+K` focus search. Filter controls retain focus after selection. | Users can reach search and continue through filters with the keyboard. |
| Library counts | Counts come from the generated catalog. | The overview and category controls use the same skill data. |

The following measurements use vertical pixel positions from the initial document top.
The category guide is closed, and all filters are clear.

| Viewport | Element | Before, px | After, px |
| --- | --- | --- | --- |
| Desktop, 1440 × 1000 | Search input top | 2800 | 480 |
| Desktop, 1440 × 1000 | First skill card top | 3060 | 638 |
| Mobile, 390 × 844 | Search input top | 5303 | 464 |
| Mobile, 390 × 844 | First skill card top | 5897 | 783 |

Local source copies and measurement values are in `.atb-work/portal-mobbin-2026-11-05/`.
The standard screenshot paths above contain the revised design.

| Check | Result | Limit |
| --- | --- | --- |
| Focused portal check | `PLAYWRIGHT_SINGLE_PROCESS=1 ./scripts/check-portal.sh` passed. | This check covers the portal and its catalog references. The complete package check was not rerun for this redesign. |
| Browser behavior | All eight tests passed across desktop, mobile, light, and dark projects. | The local run uses Chromium single-process mode. |
| Automated accessibility | All 12 scans passed in the tested states. | Manual assistive technology testing and full conformance review were not performed. |
| Offline operation | The main flow made no remote requests. Generated output matched the source build. | External repository links still require a connection when opened. |
| Visual review | Desktop and mobile screenshots were inspected in both themes. | No user study or approved image comparison baseline is available. |

## Warm neutral theme — 2026-11-05

The user found the blue and white theme overwhelming.
The revised theme uses warm stone backgrounds, ivory cards, charcoal text, and muted brown accents.
Dark mode uses charcoal surfaces and warm gray text.

| Mobbin reference | Observed color use | Application |
| --- | --- | --- |
| [Claude home](https://mobbin.com/screens/33b8745d-b1f7-405b-aa9c-a50c06e44ab4?utm_source=codex&utm_medium=ai-assistant&utm_source_platform=mcp) | Warm backgrounds and dark text dominate. Orange appears in small marks and controls. | Use warm surfaces and limit accent colors. |
| [Copilot projects](https://mobbin.com/screens/3cd757a1-69da-49fd-83cf-0cff38cc4d88?utm_source=codex&utm_medium=ai-assistant&utm_source_platform=mcp) | A warm background surrounds dark text and a charcoal action button. | Use a neutral brand mark and dark card actions. |

These are visual references. The portal palette is an adaptation, not an exact color sample from either screen.

| Role | Light theme | Dark theme |
| --- | --- | --- |
| Page background | Warm stone, `#e9e5dd` | Charcoal, `#1f211e` |
| Cards and header | Ivory, `#f5f2ec` | Raised charcoal, `#292b27` |
| Main text | Charcoal, `#292722` | Warm ivory, `#eeeae1` |
| Secondary text | Brown gray, `#555149` | Warm gray, `#cbc5ba` |
| Accent controls | Muted brown, `#72513e` | Sand, `#c4b69a` |
| Selected surfaces | Taupe, `#e5ddd1` | Olive gray, `#393b32` |

Category labels, card actions, and the brand mark now use neutral colors.
Focus outlines retain a distinct color.

`PLAYWRIGHT_SINGLE_PROCESS=1 ./scripts/check-portal.sh` passed after the color change.
All eight browser tests and 12 automated accessibility scans passed.
Desktop and mobile images were inspected in both themes.
These checks do not establish full accessibility conformance or user acceptance of the palette.

The standard screenshot paths contain the new theme.
The previous theme and its desktop images are saved under `.atb-work/portal-neutral-2026-11-05/before/`.

## Category colors and visual hierarchy — 2026-11-05

The neutral theme did not give tasks, categories, and key details enough visual distinction.
This revision changes the content hierarchy as well as the colors.

### Mobbin comparison

Screens were inspected through Mobbin MCP before implementation.

| Reference | Observed variation | Portal decision |
| --- | --- | --- |
| [Semrush app center](https://mobbin.com/screens/d7286d8b-636b-48d9-b258-2ac5141047c8?utm_source=codex&utm_medium=ai-assistant&utm_source_platform=mcp) | Distinct app icons sit within neutral cards. A tinted section separates a featured group. | Give each category a distinct icon and color. Keep descriptions on neutral surfaces. |
| [Lyssna template library](https://mobbin.com/screens/1859693e-e780-4dc1-a3bc-8b0d1893db30?utm_source=codex&utm_medium=ai-assistant&utm_source_platform=mcp) | Colored preview panels distinguish tasks. Titles and small labels explain each template. | Use colored task shortcuts and category bands. Show a concise result summary on each skill card. |
| [Relevance AI marketplace](https://mobbin.com/screens/975475ae-fbc2-4a44-86ca-1e5c74093f8b?utm_source=codex&utm_medium=ai-assistant&utm_source_platform=mcp) | Group headings, spacing, and individual icons separate tools by purpose. | Keep category navigation separate from the catalog. Use one icon consistently for each category. |

These references informed the design. They do not establish user acceptance or measured usability improvements.

### Reading order

| Priority | Element | Information |
| --- | --- | --- |
| 1 | Task shortcuts or search | Choose planning, bug fixing, or review. Search supports other tasks. |
| 2 | Category band and icon | Identify the type of skill before reading its description. |
| 3 | Skill name and purpose | See what the skill does. |
| 4 | Highlighted result | See one expected result from the canonical catalog. |
| 5 | Details button | Open use conditions, all expected outputs, example prompts, and host commands. |

The three task shortcuts open existing skill dialogs. They do not run a skill.
Each result summary shows the final entry in that skill's `expected_outputs` list.
All outputs remain available in the detail dialog.
Technical skill IDs appear below the result summary.
Repeated tags and use-condition paragraphs were removed from catalog cards to reduce competing text.
The detail dialog retains the tags and use conditions.

### Category identity

| Category | Color family | Icon |
| --- | --- | --- |
| Discovery & Planning | Violet | Light bulb |
| Feature Delivery | Blue | Code brackets |
| Debugging & Repair | Orange | Bug |
| Review & Quality | Indigo | Check mark |
| Security & Risk | Rose | Shield |
| Codebase Improvement | Amber | Layers |
| Testing & Verification | Cyan | Test flask |
| Agent Operations | Slate violet | Terminal |

Category labels and icons supplement color in filters, skill cards, and the category guide.
Task shortcuts use the category of their destination skill.
Workflow cards use the category of their first skill.
Dark mode uses separate foreground, background, and border values for each category.
The primary action color remains consistent across skill cards.

### Verification

`PLAYWRIGHT_SINGLE_PROCESS=1 ./scripts/check-portal.sh` passed.
All eight browser tests passed, including the three task shortcut checks in each viewport and theme.
All 12 automated accessibility scans passed in the tested states.
The build, offline references, catalog data, app helpers, and generated file freshness checks passed.
These checks do not establish full accessibility conformance.

The standard screenshot paths contain this revision.
Previous source files and entry-page images are saved under `.atb-work/portal-hierarchy-2026-11-05/before/`.

## Neutral backgrounds and plum actions — 2026-11-05

The user rejected the green backgrounds and accents.
Light mode now uses warm neutral backgrounds, charcoal text, and plum primary actions.
Dark mode uses neutral charcoal surfaces and pale plum actions.
The review category uses indigo in place of teal.
The category icons, other category colors, task shortcuts, and result summaries remain in use.

`PLAYWRIGHT_SINGLE_PROCESS=1 ./scripts/check-portal.sh` passed after this change.
All eight browser tests and 12 automated accessibility scans passed in the tested states.
The standard screenshot paths contain this revision.
Previous theme files and desktop images are saved under `.atb-work/portal-plum-2026-11-05/before/`.

## Selected direction A with slate fills — 2026-11-05

The user selected direction A and rejected the brown fills shown in the supplied screenshot.
The portal now uses the dark header and amber actions from A.
Both themes use cool neutral surfaces.
Selected filters, hover states, debugging headers, codebase improvement headers, and result panels use slate fills in place of brown.
Category icons and labels retain their distinct colors.
Amber remains on primary actions and small highlights.

| Area | Light theme | Dark theme |
| --- | --- | --- |
| Header | Charcoal, `#1d2026` | Charcoal, `#242831` |
| Page background | Neutral gray, `#f2f3f5` | Charcoal, `#191c22` |
| Filter highlights | Pale slate, `#e8edf3` | Slate, `#303947` |
| Debugging headers | Pale slate, `#edf1f6` | Slate, `#303b48` |
| Codebase improvement headers | Pale slate, `#e9eef5` | Slate, `#303c49` |
| Primary actions | Amber, `#f0b84c` | Amber, `#efc372` |

The reading order, category icons, task shortcuts, and result summaries remain in use.
The previous main theme is saved under `.atb-work/portal-ink-slate-2026-11-05/before/`.

`PLAYWRIGHT_SINGLE_PROCESS=1 ./scripts/check-portal.sh` passed.
All eight browser tests and 12 automated accessibility scans passed in the tested states.
The selected A preview also contains this revision.
The extra image `.atb-work/portal/screenshots/desktop-dark/catalog.png` shows the corrected fills and a hovered debugging filter.
Rendered fill values are recorded in `.atb-work/portal-ink-slate-2026-11-05/rendered-fills.json`.
