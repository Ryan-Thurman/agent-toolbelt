# Threat model: <system>

## Scope and assumptions

Record the design source and reviewed revision, evidence sources, unavailable inputs, and review limits.

## IDs and vocabularies

- Threat IDs: `T-1`, `T-2`. Requirement IDs: `SR-1`, `SR-2`. Keep each ID stable when the model changes.
- Impact and exploitability: `High`, `Medium`, or `Low`. Use `Unknown` for exploitability that the evidence does not settle.
- Control status: `Proposed` (no code), `Observed` (code or configuration exists), or `Verified` (a check ran).
- Verification: `Verified`, `Mock-verified` (a check used a stand-in for an external system), or `Not verified`.
- Disposition: `Mitigate`, `Accept`, `Transfer`, `Avoid`, or `Open question`.

## Assets and actors

## Flows and trust boundaries

## Abuse cases and attack paths

| ID | Entry point / precondition | Path | Impact | Exploitability / uncertainty |
|---|---|---|---|---|

## Mitigations and testable requirements

| Path ID and owner | Mitigation and control status | Security requirement ID | Verification and evidence | Disposition |
|---|---|---|---|---|

Distinguish proposed controls, observed implementation, and verified behavior.
A `Mock-verified` check proves what the code asks the stand-in for, not what the real system returns.
A defect in existing code goes to `security-audit`.

## Residual risk and decisions needed

Record accepted risks with their actual owner decisions and architecture changes that require another review.
