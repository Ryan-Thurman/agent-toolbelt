# Regression test brief

A one-screen brief for a single regression lock — turning a bug reproduction into a committed test.
Fill it before writing the test; keep it with the bug investigation. One brief per locked symptom.

- **Bug / reference:** <id, link, or path to the bug-investigation file>
- **Symptom (user-visible):** <the exact wrong behavior, as a user/caller observes it>
- **Reproduction source:** <confirmed-manual | automated-red | steps + who confirmed>

## The test

- **Behavior pinned:** <the observable behavior this test asserts becomes/stays correct>
- **Risk guarded:** <the regression that slips through if this test does not exist>
- **Test file / name:** <path and test name, matching repo conventions>
- **Framework / runner:** <detected framework + the run command>

## Red → green

- **Red command:** <the single command that runs just this test>
- **Confirmed red on the bug:** <yes/no — failed for the right reason (the symptom), not a setup error>
- **Confirmed green after fix:** <yes/no — fix lives in the dev/bug-to-fix lane, not here>
- **Falsified:** <yes/no — re-breaking the behavior turns it red again>

## Determinism

- **Hazards handled:** <time / RNG / network / filesystem / async — how each is pinned or stubbed>
- **Residual nondeterminism:** <none, or what remains and why it's acceptable / called out>

## Notes

- <anything a reviewer needs: assumptions, related gaps from `/cover-gaps`, follow-ups>
