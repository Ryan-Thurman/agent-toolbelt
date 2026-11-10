# Rule routing

<!-- Generated from rule-index.json by scripts/build-react-rule-routing.py. Do not edit. -->

Read the individual rule only when the changed React Native code matches its condition. A rule's priority is a triage hint, not permission to ignore repository policy.

The React rule scan in `shared/contracts/references/typescript-react-baseline.md`
lists the `scan` rules that changed lines trigger. Check each `judgment` rule
against the change yourself. Severity comes from
`shared/contracts/references/react-acceptance.md`, not from the impact column.

## Core rendering

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| JSX renders {value && <Element />} where the value can be an empty string or 0 (React Native crash). | [`rendering-no-falsy-and.md`](rules/rendering-no-falsy-and.md) | Avoid falsy && for conditional rendering | CRITICAL | scan |
| JSX places a string directly inside a View, Pressable, or other non-Text element (React Native crash). | [`rendering-text-in-text-component.md`](rules/rendering-text-in-text-component.md) | Wrap text in Text components | CRITICAL | scan |

## List performance

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Code maps or filters an array in render, then passes the new array to a FlatList, FlashList, or LegendList. | [`list-performance-function-references.md`](rules/list-performance-function-references.md) | Extract functions outside render | CRITICAL | scan |
| A list item renders a remote image from its full-size URL instead of a resized thumbnail URL. | [`list-performance-images.md`](rules/list-performance-images.md) | Optimize images in lists | HIGH | scan |
| A renderItem callback passes a new inline object or style object as a prop to the list item. | [`list-performance-inline-objects.md`](rules/list-performance-inline-objects.md) | Avoid inline style objects | HIGH | scan |
| A virtualized list item component runs a query, reads several contexts, or does expensive computation. | [`list-performance-item-expensive.md`](rules/list-performance-item-expensive.md) | Move expensive work outside items | HIGH | judgment |
| A renderItem passes the whole item object to a memoized row component instead of primitive fields. | [`list-performance-item-memo.md`](rules/list-performance-item-memo.md) | Memoize list item components | HIGH | scan |
| A virtualized list renders different item layouts from one item component and does not set getItemType. | [`list-performance-item-types.md`](rules/list-performance-item-types.md) | Use item types for heterogeneous lists | HIGH | scan |
| A ScrollView renders an array with .map() instead of a FlashList or LegendList virtualizer. | [`list-performance-virtualize.md`](rules/list-performance-virtualize.md) | Use FlashList for large lists | HIGH | scan |
| A list renderItem creates a new callback for each item, such as () => handlePress(item.id). | [`list-performance-callbacks.md`](rules/list-performance-callbacks.md) | Stabilize callback references | MEDIUM | scan |

## Animation

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| An animated style animates width, height, top, left, margin, or padding instead of transform or opacity. | [`animation-gpu-properties.md`](rules/animation-gpu-properties.md) | Animate only transform and opacity | HIGH | scan |
| A Reanimated useAnimatedReaction callback writes a shared value that it derives from another shared value. | [`animation-derived-value.md`](rules/animation-derived-value.md) | Use useDerivedValue for computed animations | MEDIUM | scan |
| A Pressable onPressIn or onPressOut handler animates a Reanimated shared value for press feedback. | [`animation-gesture-detector-press.md`](rules/animation-gesture-detector-press.md) | Use Gesture.Tap instead of Pressable | MEDIUM | scan |

## Scroll performance

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| An onScroll handler stores the scroll offset in useState and re-renders on each scroll event. | [`scroll-position-no-state.md`](rules/scroll-position-no-state.md) | Track scroll position in a Reanimated shared value or a ref, not useState | HIGH | scan |

## Navigation

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Code imports a JS stack or bottom-tab navigator, expo-router Tabs, or sets a custom header component. | [`navigation-native-navigators.md`](rules/navigation-native-navigators.md) | Use native stack and native tabs over JS navigators | HIGH | scan |

## React state

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A setter calculates the next state from the current state variable, such as setCount(count + 1). | [`react-state-dispatcher.md`](rules/react-state-dispatcher.md) | Use dispatcher pattern for callbacks | MEDIUM | scan |
| useState copies a prop or server value as its initial state and does not follow later changes to it. | [`react-state-fallback.md`](rules/react-state-fallback.md) | Show fallback on first render | MEDIUM | scan |
| A component stores a value in state that it can calculate from other state or props. | [`react-state-minimize.md`](rules/react-state-minimize.md) | Minimize state subscriptions | MEDIUM | scan |

## State architecture

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A useState or Reanimated shared value stores a visual output, such as scale or opacity, not the underlying state. | [`state-ground-truth.md`](rules/state-ground-truth.md) | Store ground-truth state and derive visual values from it | HIGH | scan |

## React Compiler

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| With React Compiler enabled, a component calls a function by dotting into props, such as props.onSave(). | [`react-compiler-destructure-functions.md`](rules/react-compiler-destructure-functions.md) | Destructure for React Compiler | HIGH | scan |
| With React Compiler enabled, code reads or writes a Reanimated shared value through .value, not .get() or .set(). | [`react-compiler-reanimated-shared-values.md`](rules/react-compiler-reanimated-shared-values.md) | Handle shared values with compiler | LOW | scan |

## User interface

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Code imports Image from react-native instead of expo-image. | [`ui-expo-image.md`](rules/ui-expo-image.md) | Use expo-image for all images | HIGH | scan |
| Code builds a dropdown or context menu from Pressable, state, and an absolute View instead of native menus. | [`ui-menus.md`](rules/ui-menus.md) | Use native context menus | HIGH | scan |
| Code renders a JS bottom sheet or modal library, such as @gorhom/bottom-sheet, instead of a native Modal. | [`ui-native-modals.md`](rules/ui-native-modals.md) | Use native modals when possible | HIGH | scan |
| Code adds an image lightbox with a Modal, a full-screen Image, or a JS image viewer library. | [`ui-image-gallery.md`](rules/ui-image-gallery.md) | Use Galeria for image lightboxes | MEDIUM | scan |
| Code calls measure() or measureInWindow() on a view ref to get its size. | [`ui-measure-views.md`](rules/ui-measure-views.md) | Use onLayout, not measure() | MEDIUM | scan |
| A screen wraps a ScrollView in SafeAreaView or pads it with safe area insets. | [`ui-safe-area-scroll.md`](rules/ui-safe-area-scroll.md) | Handle safe areas in ScrollViews | MEDIUM | scan |
| A style uses legacy shadow props or elevation, or code uses a gradient library instead of boxShadow and backgroundImage. | [`ui-styling.md`](rules/ui-styling.md) | Use StyleSheet.create or Nativewind | MEDIUM | scan |
| Code imports or renders TouchableOpacity or TouchableHighlight instead of Pressable. | [`ui-pressable.md`](rules/ui-pressable.md) | Use Pressable over TouchableOpacity | LOW | scan |
| A ScrollView adds dynamic top or bottom padding in contentContainerStyle for a keyboard, toolbar, or header. | [`ui-scrollview-content-inset.md`](rules/ui-scrollview-content-inset.md) | Use contentInset for headers | LOW | scan |

## Design system

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component accepts string or node children and checks typeof children to wrap the string in Text. | [`design-system-compound-components.md`](rules/design-system-compound-components.md) | Use compound components, such as Button and ButtonText, instead of polymorphic string children | MEDIUM | scan |

## Monorepo

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A monorepo shared package adds a native dependency that the app package.json does not also list. | [`monorepo-native-deps-in-app.md`](rules/monorepo-native-deps-in-app.md) | Keep native dependencies in app package | CRITICAL | judgment |
| Monorepo packages declare different versions or version ranges of the same dependency in package.json. | [`monorepo-single-dependency-versions.md`](rules/monorepo-single-dependency-versions.md) | Use single versions across packages | MEDIUM | judgment |

## Third-party dependencies

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| App code imports UI primitives directly from react-native or a UI package instead of a design system folder. | [`imports-design-system-folder.md`](rules/imports-design-system-folder.md) | Organize design system imports | LOW | judgment |

## JavaScript

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component, hook, or loop creates an Intl.NumberFormat, DateTimeFormat, or RelativeTimeFormat on each call. | [`js-hoist-intl.md`](rules/js-hoist-intl.md) | Hoist Intl object creation | LOW-MEDIUM | scan |

## Fonts

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Expo code loads custom fonts at runtime with useFonts or Font.loadAsync instead of the expo-font config plugin. | [`fonts-config-plugin.md`](rules/fonts-config-plugin.md) | Use config plugins for custom fonts | LOW | scan |
