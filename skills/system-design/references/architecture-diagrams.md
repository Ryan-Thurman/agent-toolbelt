# Architecture diagrams

Choose diagrams that answer the scoped architecture question.
Reuse the project's notation and diagram source when suitable.
Prefer Mermaid for repository-native diagrams when the destination supports it.
Use an optional HTML explanation only when requested and supported by the available tools.

## Choose the view

The C4 model separates architecture into context, container, component, and code views.
Use only the levels that clarify the decision.
A C4 container means an application or data store; it does not imply a Docker container.

| View | Show | Use when |
| --- | --- | --- |
| System context | People, the scoped system, and directly related external systems. | Readers need the system's purpose, users, and external relationships. |
| Applications and data stores | Major software units, responsibilities, technologies, and connections. | Readers need the system's overall structure. |
| Components | Important internal responsibilities and interfaces within one software unit. | A boundary, dependency, or internal design needs further explanation. |
| Request or event sequence | Ordered interactions, messages, outcomes, and important failure paths. | Timing, retries, asynchronous work, or ownership changes the answer. |
| Deployment | Runtime locations, environment boundaries, and relevant infrastructure. | Placement, replication, isolation, or failover affects the design. |
| Data or state | Data ownership and relationships, or state transitions and their conditions. | Consistency, lifecycle, permissions, or recovery needs a dedicated view. |

Keep structural views separate from deployment placement when their meanings differ.
Avoid class-level diagrams unless the decision needs that detail.

## Make the relationships reviewable

State the scope and source or design revision beside each diagram.
Label each relationship with its direction and meaning, such as calls, publishes, reads, writes, or depends on.
Use the same names and interface meanings as the written design and source records.
Keep unobserved connections and proposed changes visibly identified.
Show relevant trust boundaries, asynchronous connections, and data ownership.
Include a legend when shape or line style carries meaning.
Use labels and structure alongside color.

For alternative designs, identify the connections, responsibilities, and failure behavior each option changes.
Explain the mechanism a reader needs to understand rather than drawing unlabeled technology boxes.
For a critical flow, connect input, processing, durable changes, and the caller's observable result.
Cross-check that flow against the written success and failure scenarios.

## Verify and maintain

Check current-state paths and relationships against source evidence.
Check proposed views against the requirements, decision records, and design narrative.
Render with an available project renderer and inspect layout, labels, syntax, and edge direction.
If rendering is unavailable, report that limit and retain the diagram source.
Recheck affected views when responsibilities, interfaces, deployment, data ownership, or trust boundaries change.
Do not claim a diagram proves runtime behavior.

Sources: [C4 diagram guidance](https://c4model.com/diagrams), [C4 container views](https://c4model.com/diagrams/container), and
[Visual Explainer](https://github.com/nicobailon/visual-explainer/blob/main/plugins/visual-explainer/SKILL.md).
