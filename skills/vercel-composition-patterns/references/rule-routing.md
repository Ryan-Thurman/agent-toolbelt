# Rule routing

<!-- Generated from rule-index.json by scripts/build-react-rule-routing.py. Do not edit. -->

Read the individual rule only when the changed component or API matches its condition. Repository policy and evidence remain authoritative.

To review a change, follow the "React rule scan" section in
`shared/contracts/references/typescript-react-baseline.md`. This table is for lookup.

## Component architecture

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component adds a boolean prop, such as isThread or isEditing, that changes the structure it renders. | [`architecture-avoid-boolean-props.md`](rules/architecture-avoid-boolean-props.md) | Don't add boolean props to customize behavior; use composition | CRITICAL | scan |
| A complex component takes many render or show props to configure its parts instead of exposing subcomponents. | [`architecture-compound-components.md`](rules/architecture-compound-components.md) | Structure complex components with shared context | HIGH | scan |

## State management

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| Code creates a context or provider whose value has no clear state, actions, and meta contract. | [`state-context-interface.md`](rules/state-context-interface.md) | Define generic interface with state, actions, meta for dependency injection | HIGH | scan |
| A child syncs its state up through an effect or callback, or a parent reads child state through a ref. | [`state-lift-state.md`](rules/state-lift-state.md) | Move state into provider components for sibling access | HIGH | scan |
| A UI component calls a store or sync hook directly instead of a provider-supplied context interface. | [`state-decouple-implementation.md`](rules/state-decouple-implementation.md) | Provider is the only place that knows how state is managed | MEDIUM | scan |

## Implementation patterns

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| A component takes a renderX prop that only places static child content and passes no data back. | [`patterns-children-over-render-props.md`](rules/patterns-children-over-render-props.md) | Use children for composition instead of renderX props | MEDIUM | scan |
| A call site sets several boolean mode props on one component to select a variant. | [`patterns-explicit-variants.md`](rules/patterns-explicit-variants.md) | Create explicit variant components instead of boolean modes | MEDIUM | scan |

## React 19 only

| When | Rule | Fix | Impact | Found by |
| --- | --- | --- | --- | --- |
| React 19+ code uses forwardRef to pass a ref, or useContext to read a context. | [`react19-no-forwardref.md`](rules/react19-no-forwardref.md) | Don't use `forwardRef`; use `use()` instead of `useContext()` | MEDIUM | scan |
