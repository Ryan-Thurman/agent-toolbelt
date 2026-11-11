---
description: Index of the Agent Toolbelt commands and guidance for choosing an entry point.
---

# commands/

These slash commands are for the `install.sh` compatibility path.
Native plugin installs do not load them.
Each command file gives its argument syntax and names the skill to follow.
That skill's `SKILL.md` owns the behavior.
Each command's `description` field states its purpose.
The [offline portal](../portal/generated/index.html) lists all commands and skills.

If the next command is not clear, start with `/workflow-router`.

## Choose between similar commands

Each row separates commands that can match the same request.

| Commands | Skill | Choose by |
|---|---|---|
| `/product-discovery` · `/shape-up` · `/user-research-synthesis` | `product-discovery` · `shape-up` · `user-research-synthesis` | Decide whether to build · shape a selected ask or compare it with current behavior · understand supplied research. |
| `/shape-up` · `/to-issues` | `shape-up` | Gap review or shaping · slice an approved brief into tickets. |
| `/shape-up` · `/dev-intake` | `shape-up` · `phased-delivery` | Shape a vague ask into an approved brief · clarify a raw requirement that enters Phased Delivery. |
| `/tech-assess` · `/ticket-discover` · `/tech-debt-discovery` | `tech-backlog-assessment` · `ticket-discovery` · `tech-debt-discovery` | Decide one item · adapt a named precedent · find candidates across a repository. |
| `/product-outcome-review` · `/ship-it` | `product-outcome-review` · `ship-it` | Customer outcome after an experiment or release · immediate release readiness and health. |
| `/system-design` · `/dev-plan` | `system-design` · `phased-delivery` | Architecture questions, designs, decision records, repository maps · phase and PR map. `/implementation-plan` is an alias for `/dev-plan`. |
| `/threat-model` · `/security-audit` | `threat-model` · `security-audit` | A design before it is built · implemented code. |
| `/test-case-design` · `/cover` (`/write-tests`) · `/cover-gaps` · `/webapp-test` | `test-case-design` · `cover` · `webapp-testing` | Design cases only · write tests · find coverage gaps only · verify a browser flow. |
| `/pr-review` · `/review-diff` | `pr-review` | A pull request · a local diff. |
| `/pr-review` · `/code-quality-gate` · `/pr-ready-check` · `/dev-pr-review` | `pr-review` · `code-quality-gate` · none · `phased-delivery` | Code findings · policy gate with recorded evidence · readiness to open a PR · one Phased Delivery PR against its acceptance criteria. |
| `/pr-improve` · `/pr-review-reply` | `pr-improve` · `pr-review-reply` | Fix accepted findings · answer a human reviewer's threads. |
| `/phase-gate` · `/review-on-open` · `/enqueue-review` + `/review-queue-worker` | `phase-gate` · `review-on-open` · `review-queue` | Review at a phase boundary · review when a PR opens or updates · review from a local queue. |
| `/simplify` · `/code-smell` · `/retrofit` · `/crap-refactor` | `simplify` · `retrofit` · `crap-analysis` | Apply small cleanups · detect smells only · apply one defined change at every site · refactor after a CRAP verdict. |
| `/phase-close` · `/handoff` | `phase-context-workflow` · `handoff` | Close a phase file · hand off any other work. |
| `/bug-intake` → `/reproduce` → `/rca` → `/fix-plan` | `bug-to-fix` | Use in this order. `/rca --diagnose` does not edit files. |
| `/to-issues` or `/bug-intake` → `/ticket-sync` | `ticket-sync` | Publish the written ticket files to the tracker. |
