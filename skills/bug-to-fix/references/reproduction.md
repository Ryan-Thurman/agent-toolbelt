# Reproduction

Read this file to establish reproduction (the `/reproduce` step), after intake and before `/rca`.
Do not root-cause here.

## Gate

Proceed to `/rca` when **either** condition is true:

- **Confirmed manual reproduction.** A person (QA, the reporter, or you) reproduced the bug.
  The steps, expected and actual behavior, and the person who confirmed it are recorded.
- **Automated red-capable repro.** A command or test fails on the exact symptom.

If neither condition is true, the bug is not reproduced. Gather more data. Do not guess.

## Step 1 — Ask first

Ask the user: **"Did you or QA reproduce this yourself before dev?"**

- **Yes:** record the manual reproduction.
- **No or not sure:** reproduce the bug yourself.

When you reproduce it yourself, compare your failure with the reported failure.
A different failure is a different bug.

## Step 2 — Choose the path

Use automated reproduction when a harness exists; otherwise confirm a manual reproduction.

### Manual path

1. Record the exact steps, expected and actual behavior, and who confirmed it in the
   durable file's **Reproduction** section.
2. Set `Reproduction status: confirmed-manual` and `Reproduced by: <QA/reporter/you>`.
3. Add this follow-up to **Resolution → prevention / follow-ups**:
   "Add an automated regression test when a harness exists."

### Automated path

Capture a **red-capable** repro. Try these in order, and stop at the first that works:

1. a failing unit or integration test · 2. a curl or HTTP script · 3. a CLI invocation ·
4. a headless browser script · 5. a replay of a captured trace · 6. a throwaway harness ·
7. a property or fuzz loop · 8. a bisection harness · 9. a differential loop ·
10. a hand-run bash script (last resort).

Then tighten the loop. Make it faster, make the signal sharper, and make it deterministic:
pin time, seed RNG, isolate the filesystem, and freeze the network.
For async behavior, wait on the actual condition, not a fixed sleep.
For a flaky bug, raise the reproduction rate. A 50% repro is debuggable; a 1% repro is not.

**Automated completion gate:** the repro is red-capable, asserts the user's exact symptom,
and is deterministic, fast, and agent-runnable. Set `Reproduction status: automated-red`.

## Output

The durable file with **Reproduction** completed and `Reproduction status` set
(`confirmed-manual` or `automated-red`), any automated-test gap recorded as a follow-up,
and the next command: `/rca`.
