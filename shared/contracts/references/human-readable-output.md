# Human-readable output

Give the answer or recommendation first. Make the comparison, decision, or next
action clear. Use the format that the user requests. Keep required data formats valid.

## ASD-STE100 language

Use the `simple-english` skill as the base for all text that you write for the user.
This includes replies, progress reports, documents, table cells, and diagram labels.
Read `skills/simple-english/SKILL.md` before your first reply in a session.
Use its Document rules for written work and its Reply rules for chat.
Use its Strict mode only when the user asks for ASD-STE100 compliance.
The `writing-whip` skill removes AI writing tropes. A later section says when to load it.

For project documentation, also read [docs-writing.md](docs-writing.md).

## Writing precedence

This section is the only owner of the order between the writing rule sources.
When two sources conflict, the higher row wins.

| Order | Source | Scope |
| --- | --- | --- |
| 1 | The user's instructions | All text |
| 2 | Repository instructions and style guides | All text in that repository |
| 3 | The required output of the active workflow or skill | That output |
| 4 | `simple-english` | Grammar, vocabulary, sentence length, and formatting |
| 5 | `writing-whip` | AI writing tropes and response behavior |
| 6 | [docs-writing.md](docs-writing.md) | Structure of project documentation |
| 7 | `vercel-web-interface-guidelines` | UI text only |

Use these resolutions for the known conflicts:

| Conflict | Resolution |
| --- | --- |
| Bold | In a reply, use bold for quick emphasis of a key term or result. Do not start every bullet with bold. In a document, use bold only for UI element names. |
| Prose or a table | Use the format rules in this file for findings, relationships, and plans. Use prose for other replies. |
| Short sentences | Write complete STE sentences. Do not write sentence fragments as separate paragraphs. |
| Contractions | Do not use contractions. |
| Quotes, ellipsis, and arrows | In Markdown, code, and replies, use straight quotes, three periods, and `->`. In UI text, follow the web interface guidelines. |
| Heading case | Use sentence case. UI headings follow the repository design system. |
| "We" | Use "we" only for an action of the project team. Do not use it for the reader, or in a document that you did not write. |
| Counts | Do not count items before a list. A count is allowed when it is data, such as a finding total or a test result. |
| Verification and reasoning | A workflow's required checks, verification, and output fields win over "do not verify" and "give the answer, not your reasoning". |
| Documentation updates | User and repository instructions that require documentation or changelog updates win over the `writing-whip` changelog rule. |

`scripts/check-writing-rules.py` makes sure that the imported skills point to this section.

## Avoid AI-writing patterns

Read `skills/writing-whip/SKILL.md` before you write anything longer than a paragraph.
Check the output against it before you send it.

`writing-whip` does not cover these patterns:

- Say who does what. Do not write like a data sheet, with phrases such as "provides" or "is configurable".
- Connect a paragraph to the previous text. Do not start it with a sentence that reads like a heading.
- Do not give a machine a human action. Write "the browser gets the URL", not "hand the browser a URL".

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
  workflow's vocabulary. Color and icons can supplement those labels.
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

For a small plan, use `1. Action: why. Done when ...`. For a reviewable plan,
use this layout, retaining the owning workflow's required scope and approvals:

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Read the installed package version. | Use the correct API documentation. | The manifest or lockfile gives the version. |
| 2 | Read the official documentation for that version. | Find the parameter's meaning. | A source passage answers the question for that version. |

Give a reason related to the task's result. Reasons such as "improve quality" do not explain the need for a step.
Give an estimate only when evidence supports it and it helps a decision.

## Finish with a reviewable result

Show which work is complete, failed, or not verified. Keep important conditions and required evidence when you shorten the text.
Give a next action only when work remains.
