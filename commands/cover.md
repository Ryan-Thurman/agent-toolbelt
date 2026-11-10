---
description: Author or strengthen tests for a diff, a module, or a bug reproduction — behavior-pinning tests applied on opt-in. For a bug repro, write the test that fails before the fix and passes after (a red→green regression lock). Detects the test framework first; never edits production code.
argument-hint: "[target] (default: working diff; or a module path / bug-investigation file)"
---

# /cover

**Arguments:** `$ARGUMENTS`

Use this command to write tests; use `/cover-gaps` to find missing coverage without writing tests.
Follow the `cover` skill in `/cover` mode for `$ARGUMENTS`.
