# Rule routing

Read the individual rule only when the changed component or API matches its
condition. Repository policy and evidence remain authoritative.

## Component architecture

- Boolean flags select materially different component structures:
  [`architecture-avoid-boolean-props.md`](rules/architecture-avoid-boolean-props.md)
- A complex component needs independently composable pieces:
  [`architecture-compound-components.md`](rules/architecture-compound-components.md)

## State management

- UI should not know how shared state is stored:
  [`state-decouple-implementation.md`](rules/state-decouple-implementation.md)
- A context/provider boundary needs a state/actions/meta contract:
  [`state-context-interface.md`](rules/state-context-interface.md)
- Sibling components need shared state currently trapped in one component:
  [`state-lift-state.md`](rules/state-lift-state.md)

## Implementation patterns

- A boolean mode creates explicit, stable variants:
  [`patterns-explicit-variants.md`](rules/patterns-explicit-variants.md)
- A render prop only exists to place child content:
  [`patterns-children-over-render-props.md`](rules/patterns-children-over-render-props.md)

## React 19 only

- The repository runs React 19 and the changed API uses the affected ref or
  context behavior:
  [`react19-no-forwardref.md`](rules/react19-no-forwardref.md)
