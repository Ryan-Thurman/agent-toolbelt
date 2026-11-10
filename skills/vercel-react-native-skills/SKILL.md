---
name: vercel-react-native-skills
description: Review or improve React Native and Expo code when lists, animations, navigation, images, native UI, or monorepo native dependencies change; verify the React Native, Expo, and library versions first.
---

# React Native and Expo

Before you write a response for the user, read
`shared/contracts/references/human-readable-output.md`.

Use this as a conditional reference for React Native and Expo changes.
Repository policy, measured budgets, enforced configuration, and local patterns
win over upstream guidance.

Before you apply a rule:

1. Read `shared/contracts/references/typescript-react-baseline.md`. Inspect the
   React Native, Expo, and library versions, and the React Compiler setting.
2. Run the React rule scan from that baseline. Read every rule it lists for
   this skill, and record each as `Applied` or `Not applicable` with a reason.
   Then use [`references/rule-routing.md`](references/rule-routing.md) to find
   the rules the scan cannot detect. Do not load the full rule set.
3. Apply a library-specific rule (FlashList, Reanimated, expo-image, Galeria)
   only when the repository uses that library or the task adds it.
4. Set finding severity with `shared/contracts/references/react-acceptance.md`.

Keep behavior the same, including platform differences between iOS and Android.

The copied rules and license record are in
[`references/rules/`](references/rules/) and
[`references/upstream-attribution.md`](references/upstream-attribution.md).
