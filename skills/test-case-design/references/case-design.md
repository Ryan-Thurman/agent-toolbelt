# Case Design Reference

Use the least complex technique that exposes the risk. Equivalence partitions and
boundaries suit input rules; decision tables suit interacting conditions; state
transitions suit lifecycle behavior. Add retry, concurrency, idempotency,
authorization, or abuse cases only when a real interface or failure mode supports
them. A UI case should state the relevant state rather than mechanically listing
every visual category.

Each case must have an ID, requirement/risk, preconditions and data, steps,
expected result, test level, automation candidate, and priority. Priority reflects
impact and likelihood, not an arbitrary numeric score. Record assumptions and
uncovered risks rather than fabricating expected behavior.
