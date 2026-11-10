# Fix contract

Read this file after `/rca` completes the reasoning checkpoint, when you write the fix contract
(the `/fix-plan` step). This step plans and bounds the fix. It does not do a broad code review.

## Preconditions

- The durable file's **reasoning checkpoint** has 5 concrete fields.
  If the root cause is not confirmed, stop and run `/rca`.
- Use `templates/bug-agent-brief.md` for the fix contract.

## Minimal-change rules

- Validate only at real boundaries, such as user input and external APIs. Trust internal invariants.
- Extract a helper only on the third occurrence of the same logic.
- Make each diff line justify itself. Ask the user instead of assuming the bigger interpretation.
- Record worthwhile out-of-scope changes as follow-ups. Do not add them to the fix.

## Steps

1. **Write the fix brief** from `templates/bug-agent-brief.md`: current and desired behavior, the
   approach that addresses the root cause, key interfaces, acceptance criteria, and an explicit
   **out of scope** fence. Use names, not line numbers, and describe behavior.
2. **Bound the blast radius.** Complete the **Scope self-check**: files touched and why, lines you
   will not add, cases you will not defend, abstractions rejected, diff size, whether it can be
   smaller, and follow-ups not done. For a live incident, keep the applied mitigation separate
   from the real fix.
3. **Define verification** with `shared/contracts/references/test-driven-development.md`:
   - **If automation is feasible:** plan a regression test for the confirmed symptom.
     During implementation, run it before repair and record the expected failure.
     Then verify that it passes after repair.
     If the fix already exists, check the unfixed revision in an isolated workspace.
     Do not overwrite user edits.
   - **If automation is unavailable:** write the manual re-test steps for QA.
     Record "add an automated regression test" as a Should-Fix follow-up. `/cover` can close it later.
   - In both cases, verify that the original issue is gone and that you know why the fix works.
     Verify that related behavior is intact. Assume that the fix is wrong until evidence proves it.
4. **Update the durable file.** Set `status: fixing`, then `verifying` or `awaiting_human_verify`.
   Write the fix and verification plan into **Resolution**.
5. **Hand off.** `/implementation-plan` plans a larger fix; `/dev-implement-task` implements it.
   Review the change with `/pr-review` or `/dev-pr-review`.
   Push authority follows `shared/contracts/references/execution.md`.

## Output

A fix brief with the scope self-check and verification plan complete, the durable file updated
(status and Resolution), and the next command. For a manual-only reproduction, list the
automated-regression-test follow-up as Should-Fix.
