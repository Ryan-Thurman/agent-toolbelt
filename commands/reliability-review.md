---
description: Review a design or plan for failure modes, SLOs, dependencies, recovery, capacity, and observability, or run a production readiness review
argument-hint: "<design-plan-story-or-service> [--readiness] [--light | --standard | --deep]"
---

# /reliability-review

**Arguments:** `$ARGUMENTS`: a design document, a feature plan, a story, or a built service. `--readiness` checks a built service against its reliability requirements.

Use this next to `/threat-model` before a design is built. It runs no tools against any environment.

The agent chooses the depth from the risk of the change and states it. A flag overrides it.

Follow the `reliability-review` skill.
