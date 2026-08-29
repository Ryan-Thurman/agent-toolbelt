# Security Audit Boundaries

Default evidence sources are repository code, configuration, dependency manifests
and lockfiles, CI definitions, and supplied logs or architecture artifacts. Do not
run scanners, probes, fuzzers, exploit attempts, credential checks, or network
actions unless written authorization immediately before the action identifies the
target, permitted techniques, time window, and stop conditions.

For each finding, establish affected asset, entry point, precondition, reachability,
exploitability, impact, evidence, remediation, verification, and confidence. Redact
tokens, keys, passwords, and private identifiers; describe their location and type
instead. Specialized fuzzing, crypto, and sanitizer techniques require a concrete
stack or risk reason and are outside this core audit.
