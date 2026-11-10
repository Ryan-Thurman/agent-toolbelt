# View transition review checklist

Use this checklist when you review a change that adds or edits `<ViewTransition>`,
`addTransitionType`, or view transition CSS. Record each item as `Applied` with the
finding, or `Not applicable` with a reason. Set severity with
`shared/contracts/references/react-acceptance.md`.
Do not ask for transitions that the change did not add.

| Check | Problem to report | Source |
| --- | --- | --- |
| Version | The app does not use the Next.js App Router or React 19.3 or newer. A Next.js app installs `react@canary`. | `SKILL.md` Availability |
| Placement | A DOM node wraps the `<ViewTransition>`, so enter and exit do not run. | `SKILL.md` Critical Placement Rule |
| Trigger | The update uses a plain `setState`, not `startTransition`, `useDeferredValue`, or `Suspense`. Code calls `document.startViewTransition` directly. | `SKILL.md` Animation Triggers |
| `default="none"` | A named or type-keyed boundary has no `default="none"`, so it cross-fades on every update. A list item or a moved sibling has `default="none"`, so its `update` morph stops. | `types-and-composition.md` |
| Shared element names | Two mounted boundaries can have the same `name`. A named boundary sits in a component that a modal and a page both render. | `types-and-composition.md` |
| Shared element pair | `default="none"` without a `share` prop, or a type-keyed `share` on a navigation that adds no type. The morph does not run. | `types-and-composition.md` |
| Types | A typed animation depends on `router.back()` or the browser back button, which add no type. A type map in TypeScript has no `default` key. | `types-and-composition.md` |
| Suspense | A changed `key` on a boundary that wraps `<Suspense>` remounts it and fetches again. | `types-and-composition.md` |
| Motion meaning | A directional slide is used for lateral navigation, such as tab to tab. A page with a shared morph uses a fade-out exit. | `SKILL.md` When to Animate |
| Reduced motion | The global stylesheet does not have the reduced motion CSS. | `css-recipes.md#reduced-motion` |
| Navigation and focus | The transition blocks a link, the back button, or keyboard focus. | `react-acceptance.md` should-fix list |

For a symptom that the table does not cover, read `troubleshooting.md`.
