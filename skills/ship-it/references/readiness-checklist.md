# Pre-launch readiness checklist

Run before declaring a change ready to release. **Scope it to the change** — a backend-only fix
skips the accessibility/Web-Vitals rows; a docs change skips most of this. The output is a
**go / no-go** verdict with any blocking gaps named.

## Code quality (always)

- [ ] Tests pass (unit, integration, e2e as applicable).
- [ ] Build succeeds; lint and type-checking pass with no new warnings.
- [ ] Reviewed/approved; no debug remnants (`console.log`, `debugger`) or unresolved launch-blocking
      TODOs in production code.
- [ ] Error handling covers the expected failure modes of the change.

## Security

- [ ] No secrets in code or version control.
- [ ] Dependency audit clean of critical/high vulns (`npm audit` / equivalent).
- [ ] Input validation and authz checks on any new user-facing surface.
- [ ] CORS / security headers / rate limits unchanged or correctly updated.

## Performance (if it touches hot paths or the client)

- [ ] No N+1 queries or unindexed queries added on a critical path.
- [ ] Bundle size within budget; assets optimized; caching intact.
- [ ] Core Web Vitals within "Good" thresholds (user-facing UI).

## Accessibility (user-facing UI only)

- [ ] Keyboard navigation and focus management work for new interactive elements.
- [ ] Color contrast meets WCAG 2.1 AA; errors are descriptive and associated with their fields.
- [ ] No new axe-core / Lighthouse accessibility violations.

## Infrastructure

- [ ] Environment variables / config set for the target environment.
- [ ] Database migrations applied or ready to apply (and reversible — see rollback).
- [ ] Health-check endpoint responds; logging and error reporting are wired.

## Documentation (blocking gate — not just a checkbox)

If the change altered **behavior, an API/endpoint, a flag/config, the data model, or notable
performance**, the docs that describe that thing must be updated **in the same change** — README /
setup / module header / architecture notes / API docs, whichever applies. "I'll do it later" or a
bare "flagged" is a **NO-GO**, not a pass. The only pass without a doc edit is an explicit, recorded
"not doc-impacting" judgment with a reason (e.g. internal refactor with no observable change).

- [ ] Changelog / release notes drafted (`templates/release-notes.md`).
- [ ] Docs describing anything the change alters are updated in this change — or "not doc-impacting"
      is explicitly recorded with a reason.
- [ ] ADR written for any notable architectural decision.

## Verdict

- **GO** — no blocking gaps; proceed to the rollback plan and rollout.
- **NO-GO** — list each blocking gap and what's needed to clear it. Do not proceed past a NO-GO. A
  behavior / API / flag-config / data-model / perf change with no matching doc update (and no
  recorded "not doc-impacting" reason) is a NO-GO.
