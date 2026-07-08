# Refactor target

- Function: `processOrder`
- Location: `packages/api/src/orders.ts:88`
- CRAP: 42.5 (threshold 16)
- Complexity: 14
- Coverage: 25.0%

## Recommended actions

1. Add tests for uncovered paths (priority lines: 102, 115, 128).
2. Reduce branching: extract helpers for control-flow blocks at lines 102, 115.

## Complexity drivers

| Line | Kind |
|------|------|
| 102 | if-branch |
| 115 | catch |
| 128 | case-branch |

## Verify

npm run crap:analyze -- --target api --coverage
