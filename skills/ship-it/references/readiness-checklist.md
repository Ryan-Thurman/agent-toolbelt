# Pre-launch readiness checklist

Run before declaring a change ready to release. **Scope it to the change**: a backend-only fix
skips the accessibility/Web-Vitals rows. A docs change skips most of this.

## Code quality (always)

- [ ] Tests pass (unit, integration, e2e as applicable).
- [ ] Build succeeds. Lint and type-checking pass with no new warnings.
- [ ] Reviewed/approved. No debug remnants (`console.log`, `debugger`) or unresolved launch-blocking
      TODOs in production code.
- [ ] Error handling covers the expected failure modes of the change.

## Security

- [ ] No secrets in code or version control.
- [ ] Dependency audit clean of critical/high vulns (`npm audit` / equivalent).
- [ ] Input validation and authz checks on any new user-facing surface.
- [ ] CORS / security headers / rate limits unchanged or correctly updated.

A finding that this change does not introduce is `Pre-existing`. Record it with its owner and the date of the
advisory or audit. It blocks the release only when the project release policy makes it a gate, or when this change makes it reachable.

## Performance (if it touches hot paths or the client)

- [ ] No N+1 queries or unindexed queries added on a critical path.
- [ ] Bundle size within budget. Assets optimized. Caching intact.
- [ ] Core Web Vitals within "Good" thresholds (user-facing UI).

## Accessibility (user-facing UI only)

- [ ] Keyboard navigation and focus management work for new interactive elements.
- [ ] Color contrast meets WCAG 2.1 AA. Errors are descriptive and associated with their fields.
- [ ] No new axe-core / Lighthouse accessibility violations.

## Reliability (new services, new hard dependencies, or data changes)

- [ ] Each affected journey has an SLO and a burn-rate alert, or the gap is recorded with an owner.
- [ ] Each paging alert has a runbook.
- [ ] Each reliability requirement from `reliability-review` is `Verified`, or its gap is accepted by its owner.
- [ ] The failure scenarios for each new hard dependency ran in staging or at a lower level, with a recorded result.
- [ ] Backups exist and a restore was tested for each new data store.

## Infrastructure

- [ ] Environment variables / config set for the target environment.
- [ ] Database migrations applied or ready to apply (and reversible: see rollback).
- [ ] Health-check endpoint responds. Logging and error reporting are wired.

## Documentation (blocking gate: not just a checkbox)

If the change alters behavior, an API or endpoint, a flag or config, the data model, or notable
performance, update the docs that describe it in the same change. A later promise or a bare
"flagged" note is a NO-GO.

- [ ] Changelog / release notes drafted (`templates/release-notes.md`).
- [ ] Docs describing anything the change alters are updated in this change, or "not doc-impacting"
      is explicitly recorded with a reason.
- [ ] ADR written for any notable architectural decision.

## Verdict

- **GO**: no blocking gaps. Proceed to the rollout.
- **NO-GO**: list each blocking gap and what is needed to clear it. On NO-GO, deliver the package with the blockers. Do not run or hand off a deploy, and do not propose deploy or tag commands. This rule wins over the Output rule in `SKILL.md`.
