# Severity and intake schema

Read this file to triage a new bug report (the `/bug-intake` step). Severity sets urgency and how
much process the bug warrants. The intake schema is the minimum information needed before reproduction.

## Intake steps

1. Capture the intake schema below. Mark a missing field `TBD`, and record it as a question.
2. Classify severity with the criteria and auto-upgrade triggers below.
   For a live SEV1/SEV2 production incident, recommend mitigation before the full investigation.
3. Dedup against prior bugs (see below). If this bug or a decision about it exists, report it and stop.
4. Seed the durable file from `templates/bug-investigation.md`. Fill **Symptoms**, which become
   immutable. Set `severity`, the redacted `trigger`, and `status: gathering`.
   Choose a descriptive `<slug>`.
5. Point `Current Focus.next_action` at reproduction.

Do not start root-cause analysis or a fix during intake.
Output the durable file, a one-line triage summary (severity, scope, and missing information),
and the next command: `/reproduce`, or mitigation first for a live incident.

## Severity (SEV1–SEV4)

| Sev | Criteria | Target response |
|---|---|---|
| **SEV1 Critical** | full outage, data loss/corruption risk, security breach, or active exploitation | immediate, all-hands |
| **SEV2 Major** | key feature down or degraded for a large share of users; no good workaround | same day |
| **SEV3 Moderate** | a minor feature is broken but a workaround exists | next few days |
| **SEV4 Low** | cosmetic, no real user impact, tech-debt trigger | backlog / next sprint |

### Auto-upgrade triggers

- Impact scope doubles → upgrade one level.
- Reported by a paying/production customer → **minimum SEV2**.
- Any data-integrity or security concern → **SEV1** immediately.
- Severity should track real impact, not gut feeling — anchor it to who/what is affected.

For a live incident (SEV1/SEV2 in production), mitigation comes before root cause: stop the bleeding
(rollback, feature-flag, failover), verify recovery with metrics, *then* run the full RCA. The
durable file still gets created so the post-incident RCA has a spine.

## Intake schema (capture before reproducing)

- **Symptoms** — expected vs. actual behavior, in the reporter's terms.
- **Errors** — error messages / stack traces with credentials and sensitive user data redacted.
- **Environment** — where it happens (prod/staging/local), version/build, browser/OS/device, and
  relevant configuration names or non-sensitive values.
- **Recent changes** — deploys, migrations, config flips, or commits around when it started.
- **Reproduction steps** — exactly what the reporter did; whether they/QA could reproduce it.
- **Impact scope** — who and how many are affected; is there a workaround.

## Dedup before investigating

Check the knowledge base (`bug-knowledge-base.md`, see `durable-state.md`) and any out-of-scope /
"won't fix" record by **concept**, not keyword ("night theme" matches "dark mode"). If this bug
(or a decision about it) already exists, surface that instead of re-litigating.
