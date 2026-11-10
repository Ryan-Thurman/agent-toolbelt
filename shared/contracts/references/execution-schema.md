# Execution record schema

Use this reference only when a caller produces or validates CONTEXT or RESULT JSON.
Read [execution.md](execution.md) for ownership, status meaning, and evidence rules.

## Assignment record

Use UTF-8 JSON with these version 1 fields:

| Field | Required content |
| --- | --- |
| `contract_version` | Use `1`. |
| `task_id`, `run_id` | Use the stable task ID and a unique ID for this worker attempt. |
| `operation` | Use `implement`, `fix`, `review`, `design`, or `handoff`. |
| `goal` | State the assigned outcome. |
| `source_refs` | List source paths or URLs with their inspected revision or content hash. |
| `workspace` | Record `repository`, `worktree`, `branch`, `base_revision`, `head_revision`, and `worktree_fingerprint`. |
| `scope` | List `allowed_paths` and `excluded_paths` relative to the assigned worktree. |
| `acceptance` | List unique `id`, `criterion`, and `verification` values for the assignment. |
| `required_checks` | List unique check IDs. Include their commands or methods in the referenced task record. |
| `authority` | List `worker_actions` and name the `external_action_owner`. |
| `attempt` | Record `number` and `limit` from durable caller state. |
| `next_action` | Record `action`, `owner`, and `reason`. |

Use `source_refs` entries with `location` and `revision` strings.
Use exact paths or directory prefixes ending in `/` for scope; glob patterns are unsupported.
An excluded path takes precedence over an allowed path.
Use an empty allowed list for an assignment that cannot change source files.
Name any report destination separately from the source-change scope.
Worker action IDs are `inspect`, `edit`, `check`, `commit`, `push`, `publish`, `merge`, and `deploy`.

The worktree fingerprint must cover relevant staged, unstaged, and untracked content.
A HEAD revision alone cannot identify a dirty worktree.
The caller must retain the immutable input and its SHA-256 digest.
Create a new run ID and input when scope, source, authority, or relevant workspace state changes.

## Result record

| Field | Required content |
| --- | --- |
| `contract_version`, `task_id`, `run_id` | Match the assignment. |
| `context_digest` | Use the SHA-256 digest of the exact assignment file bytes. |
| `status` | Use `completed`, `partial`, `failed`, or `blocked`. |
| `summary` | Describe the observed result. |
| `changed_paths` | List changed source paths, including new untracked source files. |
| `actions_used` | List the worker action IDs used within its authority. |
| `checks` | List unique `id`, `outcome`, and `evidence` values. Outcomes are `passed`, `failed`, or `not_run`. |
| `acceptance` | List unique `id`, `outcome`, and `evidence` values for the assigned criteria. |
| `blockers` | List unresolved blockers; a `blocked` result needs at least one. |
| `next_action` | Record `action`, `owner`, and `reason`. |

Acceptance outcomes are `verified`, `failed`, or `not_verified`.

## Validation boundary

Run `python3 shared/contracts/scripts/validate-execution.py CONTEXT.json RESULT.json` for machine exchange.
The checker validates structure, input identity, declared scope, declared authority, and completion consistency.
It reads files only and returns `0` for valid records or `1` for a rejected record.
Invalid command-line arguments return `2`.
It does not inspect Git, execute checks, verify evidence contents, or authorize a transition.
