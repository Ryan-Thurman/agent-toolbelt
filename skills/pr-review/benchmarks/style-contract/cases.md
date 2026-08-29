# Style and Anti-Slop Evaluation Cases

Use these hand-checkable cases when changing standards or maintainability review
guidance. A reviewer must cite the stated consequence and never call code AI-generated.

| Case | Diff cue | Expected result |
|---|---|---|
| misleading behavior | `getSession()` also persists a refreshed token | should-fix or blocker only when callers can rely on read-only semantics |
| synonym drift | new `projectId` names an established `workspaceId` concept | should-fix with neighboring vocabulary evidence |
| units | `timeout = 30` crosses an API expecting milliseconds | should-fix or blocker with demonstrated unit consequence |
| boolean | `enabled` actually means the request can retry | should-fix when it leads to incorrect use; otherwise no finding |
| ID/object | `user` contains an ID while nearby code uses loaded users | should-fix when identity confusion crosses a boundary |
| tiny scope | `item` in a three-line `items.map` callback | no finding |
| established exception | a repo consistently uses `legacyId` for a real external protocol field | no finding |
| narration comment | `// Increment count` before `count += 1` | nit only when it adds noise; never should-fix alone |
| speculative helper | a one-call wrapper adds no policy or boundary | maintainability finding only with indirection/consequence evidence |
| clean diff | clear domain names, explicit units, behavior tests | no naming/anti-slop finding |

For every positive case, verify the changed line, surrounding code, and base-branch
style evidence. For every negative control, return no finding.
