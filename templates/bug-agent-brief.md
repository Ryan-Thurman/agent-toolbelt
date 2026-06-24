# Fix Brief: <short title>

The contract for the fix. Keep it **durable** (no file paths or line numbers — they go stale) and
**behavioral** (describe *what* should happen, not *how* to code it). This brief is what an
implementer works from.

- **Category:** bug fix
- **Severity:**            # SEV1 | SEV2 | SEV3 | SEV4
- **Investigation file:**  # path to the durable bug-investigation file
- **Confirmed root cause:**  # one line, from the RCA

## Current behavior

What happens now (the bug), in observable terms.

## Desired behavior

What should happen after the fix, in observable terms.

## Fix approach

The smallest change that addresses the **root cause** (not the symptom). If a live incident needed
mitigation first (rollback / flag / failover), note it separately from the real fix.

## Key interfaces

Types, signatures, config shapes, or contracts the fix must respect. (Names, not line numbers.)

## Acceptance criteria

Each independently verifiable.

- [ ] The original reproduction no longer fails.
- [ ] <behavioral criterion>
- [ ] No regression in <related behavior>.

## Out of scope

What this fix must **not** do — explicitly fence out refactors, unrelated cleanup, and
"while I'm here" changes so the diff stays minimal.

## Scope self-check

- Files I touched (and why each is required):
- Lines I was tempted to add but won't:
- Hypothetical cases I am NOT defending against:
- Abstractions I considered and rejected:
- Diff size (lines / files):
- Could it be smaller?
- Follow-ups I did NOT do (surfaced, not smuggled in):

## Verification

- **Reproduction status:**  # confirmed-manual | automated-red
- **If automated:** regression test written; proven by revert → test fails → restore → test passes.
- **If manual only:** documented manual re-test steps for QA; **flag "add automated regression
  test" as a Should-Fix follow-up** (do not silently skip the test).
- [ ] Root cause addressed, not just the symptom.
- [ ] Existing tests pass / build succeeds.
- [ ] Original bug scenario verified end-to-end.
