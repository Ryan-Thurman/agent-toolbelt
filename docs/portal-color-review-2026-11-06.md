# Portal color and grouping review — 2026-11-06

Use neutral surfaces for content, named category markers for classification, and amber for actions and selection.
Group the six shortcuts by the kind of work before assigning visual emphasis.
Release `1.1.1` applies this review to the existing portal.

The prior page repeated category colors across task tiles, card headers, results, filters, and workflow panels.
Its task shortcuts did not name their categories.
Three planning tasks shared a color but appeared in different rows.
Workflow panels inherited the first skill's category color even when their later stages covered other categories.
These observations describe the rendered page and source rules, not measured user behavior.

Nine web screens were inspected through Mobbin MCP across three searches.
The following screens supplied the relevant comparisons.

| Reference | Observed pattern | Application here |
| --- | --- | --- |
| [Zapier template gallery](https://mobbin.com/screens/4c8806cf-2115-429e-b3de-105c19224b5c) | Template cards use neutral surfaces. Category navigation appears separately above the cards. | Separate classification from card emphasis and retain a stable browse structure. |
| [Linear project overview](https://mobbin.com/screens/89651fe9-ecb6-4f0d-884f-8520d82cbfe6) | Small color markers sit beside named status and priority properties within a neutral page. | Keep category color beside the label it explains. Use explicit text for meaning. |
| [Notion resource gallery](https://mobbin.com/screens/44453ef6-a197-4976-97ef-dbd753bb7559) | Named featured collections appear above the complete template catalog. Template previews carry their own content colors. | Give starting choices a named grouping before the full library. Do not treat preview artwork as a category-color system. |

These are observations of the selected screens, not claims about every screen in those products.
No reference image or proprietary interface asset was copied into the portal.

| Color or surface role | Result |
| --- | --- |
| Neutral surfaces | Task tiles, skill cards, result summaries, and workflow panels use neutral backgrounds. |
| Category markers | Icons and adjacent labels retain a consistent category color across shortcuts, filters, cards, and details. |
| Amber | Actions, selected filters, and existing branding use amber. Technical improvement uses green markers to separate its identity from actions. |
| Selection | Filled filters retain text, borders, and pressed-state semantics. Color is not their only indicator. |

The first task group contains customer research, feature planning, and system design.
The second group contains debugging, debt discovery, and review.
All six shortcuts retain their existing skill destinations and dialog focus behavior.
Six workflow choices now occupy three desktop columns instead of an uneven five-column row.
Skill content, category ownership, and native host invocation remain unchanged.

Existing browser flows cover the six shortcuts, search, filtering, workflow navigation, dialog focus, themes, and overflow.
Automated accessibility scans cover the tested catalog, filtered results, and detail states.
The local run uses the documented single-process Chromium option.
The final package and browser results are recorded in `.atb-work/portal-color-review-2026-11-06/package-check.log`.
Screenshots are available under `.atb-work/portal/screenshots/`.
The prior home views were preserved under `.atb-work/portal-color-review-2026-11-06/before/`.

The final package check passed, including selected installs, generated-file freshness, catalog validation, and Claude plugin validation.
All eight browser cases passed across the two viewport sizes and both themes.
Automated scans reported no violations in their tested states.
Home, filtered results, and workflow screenshots were reviewed for the changed visual hierarchy.

This review does not establish improved task-completion time or full accessibility conformance.
Those conclusions require separate user and accessibility testing.
