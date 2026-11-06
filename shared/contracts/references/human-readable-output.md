# Human-readable output

Give the answer or recommendation first. Make the comparison, decision, or next
action clear. Use the format that the user requests. Keep required data formats valid.

## ASD-STE100 language

Use ASD-STE100 Issue 9 for text that you write for the user.
This includes replies, progress reports, documents, table cells, and diagram labels.

| Item | Writing rule |
| --- | --- |
| Instructions | Use active commands. Give one instruction in each sentence. Use a maximum of 20 words per sentence. |
| Descriptions | Give one topic per sentence. Use a maximum of 25 words per sentence. |
| Conditions | Put a necessary condition before the action. |
| Vocabulary | Use approved words with their approved meanings and parts of speech. Use each technical term consistently. |
| Grammar | Use simple verb forms. Avoid contractions and idioms. Keep the words needed for a complete sentence. |

Explain unfamiliar technical terms at first use. Keep code, commands, paths,
identifiers, exact status values, and direct quotations unchanged.
Use complete sentences in table cells when they contain instructions or explanations.
Short labels can remain phrases.

Use the [official standard](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)
for its full rules and word-count method.
Use the [official terminology guidance](https://asd-ste100.org/STE_faq.html)
for technical nouns and verbs.
These local rules do not replace the standard or its dictionary.
Claim full conformance only after a rule and vocabulary review.

## Choose the format

| Information | Default format | Make clear |
| --- | --- | --- |
| Findings, claims, comparisons, status, or other structured data | Table | What each row means, its result, evidence, and important limits. |
| Dependencies, flows, states, architecture, or cause and effect | Diagram | Direction, labels, boundaries, and which relationships are assumptions. |
| A plan or sequence of actions | Numbered steps or a step table | What to do, why it matters, and when it is complete. |
| Measurements over time or across many observations | Chart, with accessible values or a compact data table | Units, period, population, baseline, and uncertainty. |
| A simple fact or short explanation | Direct sentence or short paragraph | The answer and any qualification needed to interpret it. |

Use a table when readers need to compare entries; use a diagram when they need
to follow relationships. Combine them only when each answers a distinct
question. For example, a dependency diagram can accompany a table of decisions.

## Tables people can review

- Give each row one item. Use clear column names. Aim for three to five columns.
  Divide wide tables by topic. Use stable IDs when rows need references.
- Put the decision or status near its item. Use explicit labels such as
  `Supported`, `Contradicted`, `Unknown`, or `Not run`, according to the owning
  workflow's vocabulary. Color and icons may supplement those labels.
- Put an exact source or evidence link next to the finding it supports.
  Keep the version, date, units, scope, and uncertainty when they affect the meaning.
  A blank cell must not imply a successful check.
- Rank by the user's decision needs. For long results, group related rows and
  highlight important decisions first. Retain every scoped item in the report
  or a clearly linked continuation; presentation limits do not reduce coverage.

## Diagrams people can follow

Use a small labeled diagram for an actual relationship or sequence. For a
compact static engineering diagram, prefer Mermaid when the destination
supports it. Provide a numbered path or edge table when it does not. Distinguish
observed behavior from proposals and unknown relationships. Choose a chart
when numerical scale, rather than connectivity, is the question.

## Plans people can execute

Give each step one action, its reason, and a completion condition that the reader can verify.
Name the owner or dependency when it is not clear. Identify the first action and any problem that prevents it.
The agent must complete work that the user has already authorized.

For a small plan, use `1. Action — why; done when ...`. For a reviewable plan,
use this layout, retaining the owning workflow's required scope and approvals:

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Read the installed package version. | Use the correct API documentation. | The manifest or lockfile gives the version. |
| 2 | Read the official documentation for that version. | Find the parameter's meaning. | A source passage answers the question for that version. |

Give a reason related to the task's result. Reasons such as “improve quality” do not explain the need for a step.
Give an estimate only when evidence supports it and it helps a decision.

## Finish with a reviewable result

Show which work is complete, failed, or not verified. Keep important conditions and required evidence when you shorten the text.
Give a next action only when work remains.
