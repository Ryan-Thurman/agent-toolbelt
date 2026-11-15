# Question strategy

Read this in step 5 of `story-refinement`, and for live rounds.
The goal is the fewest questions and the fewest rounds that settle every item that changes the result.

## Order

1. **Investigate first.** Settle facts and mechanical items from the repository before you ask.
   A fact search must not stop the other questions. Run it in a subagent when you can.
2. **Lead with assumptions.** Show a table of your assumptions before any question.
   Give each one its evidence, the consequence if it is wrong, and a confidence of
   `Confident`, `Likely`, or `Unclear`. The person corrects only the wrong rows.
3. **Ask in rounds.** A round holds up to five open decisions whose prerequisites are settled.
   Put the rest in the next round. Hold a question that depends on another open question for a later round.
   Put the question that blocks the most work first.
4. **Accept defaults in a batch.** One "yes" can accept a group of defaults.
   Each decision and each challenge needs its own answer. "Use your recommendations" does not settle a decision.
5. **Send questions to owners.** When the owner is not in the session, group the open decisions by owner
   in `templates/refinement-questions.md`.
6. **Stop on a rule.** Stop when no open item can change the scope, the plan, or the acceptance criteria.

## Question format

Number each question. Give one idea in each question.
Give a recommended answer, and word the question so that "yes" accepts it.
Offer choices when the options are known.
Cite the code or document that raised the question.
Add a reason only when the question can be misread.
Put the questions at the end of the message.

## Owner packets

Write one packet for each owner. Put the most important question first, because the owner can read it only once.
Give an answer line under each question. Accept "I do not know" as an answer, and record it as an open item.
End with one open question for anything that the packet missed.

## When no person is present

Ask no questions. Record each open decision as a row in the Open questions table, with its owner.
Record each default as an `Assumption:` line. Run every check.

## Mistakes to avoid

- Reading the scan tables to a person as a checklist.
- Asking a question that the repository can answer.
- Asking one question per message for a story that is almost ready.
  Use single questions only for an early idea in `shape-up`.
- Asking again about a suggestion that a `Decision:` line declined, unless new evidence changes its basis.
- A default that the spec does not state.
