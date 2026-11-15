# Platform notes

Read this for platform features that support a control or a verification method.
These are pointers. Read the current official documentation before you name a setting or a limit.

| Platform | Reliability features to check | Fault injection for staging |
| --- | --- | --- |
| AWS | Multiple Availability Zones, Auto Scaling, Route 53 health checks, backups and point-in-time recovery, the reliability pillar of the AWS Well-Architected Framework, AWS Resilience Hub. | AWS Fault Injection Service (FIS). |
| Azure | Availability zones, zone-redundant services, autoscale, Azure Backup, the reliability pillar of the Azure Well-Architected Framework. | Azure Chaos Studio. |
| Kubernetes | Liveness, readiness, and startup probes. PodDisruptionBudget. Topology spread constraints. Resource requests and limits. HorizontalPodAutoscaler. | Chaos Mesh, LitmusChaos. |
| OpenTelemetry | SLIs from span and metric data. Trace context propagation across services and queues. Semantic conventions for HTTP, database, and messaging spans. | Not applicable. It gives the steady-state signal for experiments. |
| Any stack | Service mesh retries, timeouts, and fault injection, if a mesh is in use. | Toxiproxy for network faults in tests. |

Do not write an experiment or a manifest that targets production.
Use `failure-scenario-design` to plan experiments.
