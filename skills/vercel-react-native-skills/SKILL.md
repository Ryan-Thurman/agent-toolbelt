---
name: vercel-react-native-skills
description: Review or improve React Native and Expo code when lists, animations, navigation, images, native UI, or monorepo native dependencies change; verify the React Native, Expo, and library versions first.
---

# React Native and Expo

If you have not read `shared/contracts/references/human-readable-output.md` in this session,
read it before you write for the user.

Toolbelt paths: a path that starts with `shared/`, `skills/`, `templates/`, or `workflows/` is relative to the Toolbelt root, `${CLAUDE_PLUGIN_ROOT}`. If that variable is not replaced, use the nearest folder above this file that contains `shared/contracts/`.

Use this as a conditional reference for React Native and Expo changes.
Repository policy, measured budgets, enforced configuration, and local patterns
win over upstream guidance.

Before you apply a rule:

1. Inspect the React Native, Expo, and library versions, and the React Compiler setting.
2. Follow the "React rule scan" section in
   `shared/contracts/references/typescript-react-baseline.md`. Do not load the full rule set.
   To find a rule without a scan, use [`references/rule-routing.md`](references/rule-routing.md).
3. Apply a library-specific rule (FlashList, Reanimated, expo-image, Galeria)
   only when the repository uses that library or the task adds it.

Keep behavior the same, including platform differences between iOS and Android.

The copied rules and license record are in
[`references/rules/`](references/rules/) and
[`references/upstream-attribution.md`](references/upstream-attribution.md).
