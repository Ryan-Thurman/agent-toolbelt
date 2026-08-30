# Threat Modeling Method

Model only the stated system and adjacent trust boundaries necessary to understand
it. Assets include data, privileges, availability, and business actions. Actors
include legitimate users, services, operators, and credible attackers with stated
capabilities. Trace data and control flows across trust boundaries, then describe
an attack path as entry point, precondition, action, impact, and mitigation.

Use common weakness or OWASP labels only when the described path supports the
mapping. Rank qualitatively from impact and exploitability; record uncertainty.
Every chosen mitigation should become a requirement that can be verified by a
test, review, configuration check, or operational control.
