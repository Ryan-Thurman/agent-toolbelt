# Root Cause Analysis: <short title>

- Bug / ticket:
- Severity:                 # SEV1 | SEV2 | SEV3 | SEV4
- Investigation file:       # path to the durable bug-investigation file
- Status:                   # Draft | Confirmed | Fixed | Verified
- Author / date:

## Summary

2-3 sentences: what was broken, who was affected, and the confirmed root cause.

## Impact

- Users / scope affected:
- Duration (first observed → resolved):
- Workaround (if any):

## Reproduction

- How it is reproduced (manual steps or automated command):
- Reproduction status:      # confirmed-manual | automated-red

## Root cause

State the **original trigger**, not the surface symptom.

### Contributing factors

1. Immediate cause:         # the direct trigger
2. Underlying cause:        # why that trigger was possible
3. Systemic cause:          # the process/design gap that allowed it

### 5 Whys

1. Why did <symptom> happen? →
2. Why? →
3. Why? →
4. Why? →
5. Why? →   # the root/systemic issue

## Evidence

The specific observations, logs, or test that prove the cause (not reasoning alone).

## Fix direction

The smallest change that addresses the cause. (The full fix contract lives in
`templates/bug-agent-brief.md`; the diff is produced in `/fix-plan`.)

## Prevention / follow-ups

The 3–5 changes that would have prevented or caught this — including an automated regression test
when the bug was reproduced manually only. Not a 50-item wishlist.

| Action | Owner | Priority | Status |
|---|---|---|---|
|  |  |  |  |
