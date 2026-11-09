# Managed execution boundary

Use this reference when defining managed task inputs, worker results, or operation recovery.
Read `shared/contracts/references/execution.md` from the installed standard Agent Toolbelt plugin root.
For failed approaches, read `shared/contracts/references/failure-recovery.md` from that root.
For external operations, read `shared/contracts/references/operation-retries.md` from that root.
Compatibility installs place those files under the target's `.atb/` directory.

The standard plugin supplies these shared contracts; this optional package supplies runner-specific guidance.
When the standard contracts are unavailable, report that limit rather than inventing a compatible interface.

## Caller and worker

The caller assigns the task, creates the isolated worktree, and supplies an immutable context record.
The worker performs only the assigned operation within its declared authority.
Keep provider credentials and lifecycle mutation APIs outside the worker when the caller owns those actions.
The worker reports changed source paths, checks, acceptance evidence, blockers, and a proposed next action.
Before committing or publishing, the caller checks actual changes against the recorded baseline and scope.
Before advancing state, the caller verifies evidence freshness and the applicable authorization.

Preserve the existing review finding schema and host-derived verdict.
Map those results into an execution record only when the caller supports that format.
An execution checker success does not replace a review verdict or establish merge permission.

## Adoption boundary

The version 1 execution format and checker are available support artifacts.
Existing agent-runner job payloads and parsers do not gain this format merely by loading the skill.
Update the runner's producer, parser, state transitions, and recovery tests together before enabling it.
Persist retry identity and attempt counts outside worker memory.
Compute permitted next actions in the caller; treat worker suggestions as untrusted proposals.
Keep each commit, PR, merge, or deployment operation under one explicit owner.

Required runner checks include stale-result rejection, duplicate submission recovery, and restart-safe attempt limits.
Retain the existing merge preflight and review convergence checks during that update.
