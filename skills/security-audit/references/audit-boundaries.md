# Security Audit Boundaries

Default evidence sources are repository code, configuration, dependency manifests
and lockfiles, CI definitions, and supplied logs or architecture artifacts.
Local static analyzers may run within the authorized source-review scope when they only read local inputs and write bounded report artifacts.
Inspect their configuration for scripts, downloads, uploads, or other side effects before treating a tool as local analysis.
Do not install or update tools solely because a scanner is suggested.
External advisory queries need applicable network authority; record the queried package identifiers and data sent.
Source uploads need explicit authorization for that disclosure.
Before probes, fuzzing against targets, exploit attempts, or credential checks, obtain written target and technique authorization.
That authorization must identify the time window and stop conditions immediately before the active action.

For each finding, establish affected asset, entry point, precondition, reachability,
exploitability, impact, evidence, remediation, verification, and confidence. Redact
tokens, keys, passwords, and private identifiers; describe their location and type
instead. Specialized fuzzing, crypto, and sanitizer techniques require a concrete
stack or risk reason and are outside this core audit.
