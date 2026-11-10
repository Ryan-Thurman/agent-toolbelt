#!/usr/bin/env bash
# DESC: conditional React Native and Expo guidance with 36 upstream rules
pack_vercel_react_native_skills() {
  shared_contract references/human-readable-output.md
  skill_tree vercel-react-native-skills
  shared_contract references/typescript-react-baseline.md
  shared_contract scripts/react-rule-scan.py
  shared_contract references/react-acceptance.md
}
