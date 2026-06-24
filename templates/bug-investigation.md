---
status: gathering   # gathering | investigating | fixing | verifying | awaiting_human_verify | resolved
trigger: ""          # the bug report, verbatim
severity: ""         # SEV1 | SEV2 | SEV3 | SEV4 (see skills/bug-to-fix/references/severity.md)
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Bug Investigation: <short title>

<!--
THE FILE IS THE DEBUGGING BRAIN. Update it BEFORE each action, not after — if the
session resets mid-action, this file must show what was about to happen.
Section update rules:
  Symptoms            IMMUTABLE after intake (the bug never changes; only our understanding does)
  Current Focus       OVERWRITE before every action
  Eliminated          APPEND only (never re-investigate a disproven hypothesis)
  Evidence            APPEND only
  Reasoning checkpoint GATE — fill all 5 fields with concrete answers before any fix
  Resolution          OVERWRITE as understanding evolves
-->

## Symptoms
<!-- IMMUTABLE after intake. -->

- Expected:
- Actual:
- Errors / stack traces:
- Reproduction (manual steps or automated command):
- Reproduction status:        # confirmed-manual | automated-red | not-yet-reproduced
- Reproduced by:              # who confirmed it (QA / reporter / dev), if manual
- First observed / since:
- Affected area / users:

## Current Focus
<!-- OVERWRITE before every action. next_action must be concrete. -->

- Hypothesis under test:
- Test / probe:
- Expecting:
- next_action:                # e.g. "Add logging at line 47 of auth.js before jwt.verify()" — never "continue investigating"

## Eliminated
<!-- APPEND only. -->

| Hypothesis | Evidence it's wrong | When |
|---|---|---|
|  |  |  |

## Evidence
<!-- APPEND only. -->

| When | Checked | Found | Implication |
|---|---|---|---|
|  |  |  |  |

## Reasoning checkpoint
<!-- GATE before any fix. If you cannot fill all five with specific, concrete answers,
     you do NOT have a confirmed root cause yet — keep investigating. -->

- hypothesis:
- confirming_evidence:        # list — the specific observations that support it
- falsification_test:         # the experiment that would have disproven it (and didn't)
- fix_rationale:              # why the planned change addresses the cause, not the symptom
- blind_spots:                # what you're still unsure about

## Resolution
<!-- OVERWRITE as it firms up. -->

- root_cause:
- fix:
- verification:               # automated revert→must-fail proof, or documented manual QA verification
- files_changed:
- prevention / follow-ups:    # incl. "automated regression test" when repro was manual-only
