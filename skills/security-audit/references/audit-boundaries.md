# Security Audit Boundaries

Read this file before you run a tool, send data to a network service, or start active testing.

## Local tools

Run a local static analyzer only within the authorized source-review scope.
The analyzer must read only local inputs and write only bounded report artifacts.
Before you run a tool, inspect its configuration for scripts, downloads, uploads, or other side effects.
Do not install or update tools only because a scanner is suggested.

## Network and disclosure

Query an external advisory source only with applicable network authority.
Record the package identifiers that you queried and the data that you sent.
Upload source code only with explicit authorization for that disclosure.

## Active testing

Active testing includes probes, fuzzing against targets, exploit attempts, and credential checks.
Before active testing, get written authorization for the target and the techniques.
The authorization must give the time window and the stop conditions.
Get it immediately before the active action.
Specialized fuzzing, cryptography, and sanitizer techniques need a concrete stack or risk reason.
These techniques are outside this core audit.
