# Human-readable output

Give the answer or recommendation first. Make the comparison, decision, or next
action clear. Use the format that the user requests. Keep required data formats valid.

This file is the complete writing rule set for the Toolbelt. It applies ASD-STE100
(a controlled English standard for technical text) and removes AI writing patterns.
It covers replies, progress reports, documents, table cells, and diagram labels.
The rules control the text of the output only. They never limit the tool calls,
tests, verification, or exploration that the task or the workflow needs.

For project documentation, also read [docs-writing.md](docs-writing.md).

## Writing precedence

When two sources conflict, the higher row wins.

| Order | Source | Scope |
| --- | --- | --- |
| 1 | The user's instructions | All text |
| 2 | Repository instructions and style guides | All text in that repository |
| 3 | The required output of the active workflow or skill | That output |
| 4 | `vercel-web-interface-guidelines` | UI text only |
| 5 | This file | All text |
| 6 | [docs-writing.md](docs-writing.md) | Structure of project documentation |
| 7 | The `simple-english` and `writing-whip` skills | Only the tasks in "Full writing skills" |

This file already settles the known conflicts with the two skills. Bold is allowed for
emphasis in replies. Verification is never limited. Documentation and changelog updates
follow user and repository instructions.

## Every text

1. Put the answer, result, or change in the first sentence. Do not restate the question.
2. Stop when the answer is complete. Do not add a recap or tie the answer back to the question.
3. Match the detail to the question. Offer more detail instead of adding it first.
4. Keep your planning and deliberation out of the output. Explain your reasoning only when
   the user asks or a workflow output field requires it.
5. Answer directly and honestly. Do not manage the reader's feelings. Do not write openers
   such as "Certainly" or closers such as "I hope this helps".
6. Write complete sentences in simple tenses and the active voice. Name the actor. Keep
   articles and "that". Do not write sentence fragments as separate paragraphs.
7. Do not use contractions, semicolons, or em dashes. Write two sentences, or name the
   relation with "because", "but", or "for example".
8. Use the modals `can`, `will`, and `must` only. A required "should" becomes "must".
   Delete an optional one.
9. Define a concept term in a few words at its first use: "idempotent (safe to run twice)".
   Do not define product names or standard names such as Postgres or HTTP.
10. Use one word for one meaning in the whole text. Do not cycle synonyms for one thing.
11. State the fact, not its importance. Delete words that carry no fact, such as
    `simply`, `seamlessly`, `crucial`, `in order to`, and `it is worth noting`.
12. Use American spelling, straight quotes, three periods, and `->`. Do not use smart
    quotes, unicode arrows, or emoji.
13. Do not shorten quoted error text, security warnings, or confirmations before a
    destructive action.

## Replies

- Use prose by default. Use a list, a table, or a heading only when the content has that
  shape: separate blocks, three or more parallel items, steps in order, or a comparison
  across attributes. "Choose the format" gives the shape for structured information.
- Use bold for quick emphasis of a key term or result. Do not start every bullet with bold.
- Use a code block only for text that the reader must copy.

## Documents

1. Classify each passage. Procedural text tells the reader what to do: imperative mood,
   at most 20 words for each sentence, one instruction for each sentence. Descriptive text
   explains: at most 25 words for each sentence, one topic and at most six sentences for
   each paragraph.
2. Do not change code, identifiers, commands, flags, file paths, quoted errors, product
   names, or facts.
3. Put a condition before its command, with a comma: "If the build fails, read the log."
4. Give the reader each term and fact before the step that needs it. Name the host, the
   flag, or the prior step that a command depends on.
5. Use `make sure that` for check, verify, confirm, validate, and ensure. Use
   `configuration` for config, settings, and options. Break a noun chain of more than
   three words with a preposition.
6. Put the command or condition of a warning first, then the risk: "Do not run this
   against production. The command deletes rows."
7. Use bold only for UI element names. Use sentence-case headings. Do not put a heading
   over fewer than three sentences.
8. Use "we" only for an action of the project team. Do not use it for the reader, or in
   a document that you did not write.
9. Write a changelog or a diary-style note only when a user or repository instruction
   requires it.

## AI writing patterns

Do not use these patterns. Before you send text that is longer than a paragraph, read it
against this table.

| Pattern | What to remove |
| --- | --- |
| Preamble | An opening that announces the output, names its shape, or restates the prompt: "Two constraints shape the design." |
| Reasoning leak | Narration of what you do, decide, or plan. |
| Premise stacking | Evidence before the point. Make the point first. |
| Counting | A count before a list, such as "for two reasons". A count is allowed when it is data, such as a finding total. |
| Recaps | Section summaries, a closing restatement, or "In conclusion". |
| Belaboring | A defense of a minor point against an objection that nobody raised. |
| Self-answered question | "The result? Devastating." |
| Negative parallelism | "It is not X, it is Y", "not because X but because Y", or "Not X. Not Y. Just Z." |
| Fragments | Short fragments as separate paragraphs for emphasis. |
| Threes | More than one group of three in a piece. |
| Stakes inflation | Large stakes for an ordinary subject. |
| Invented labels | A new compound term used as if it were established: "the supervision paradox". |
| Magic adverbs | `quietly`, `deeply`, `fundamentally`, `remarkably`, `arguably`, `notably`, `importantly`, `interestingly`. |
| Vague attribution | "Experts say" or "industry reports". Name the source or remove the claim. |
| Quotable lines | A standalone line that sounds quotable and carries no information. |
| Figures of speech | A clever simile or metaphor, an analogy that nobody asked for, or "Think of it as". |
| Reveals | "Here is the thing", "Here is the catch", or "Imagine a world where". |
| Teaching voice | "Let us break this down" or "Let us dive in". |
| Inflated words | `delve`, `utilize`, `leverage`, `robust`, `streamline`, `harness`, `powerful`, `comprehensive`, `tapestry`, `landscape`, `paradigm`, `synergy`, `ecosystem`, `load-bearing`. |
| Significance tails | An "-ing" clause that adds importance: ", highlighting its importance". |
| Dodged verbs | "Serves as", "stands as", or "represents" in place of "is". |
| Promotion | Marketing language. Describe the subject. Do not sell it. |
| Familiarity appeals | "A classic", "famously", or "as we all know". |
| Dismissed problems | "Despite these challenges, ..." |
| Repetition | One point in other words, the same sentence opening many times in a row, or an earlier phrase reused as a callback. |
| Question headings | Headings such as "What we do differently" or "Where it actually lives". |
| Data-sheet voice | "Provides" or "is configurable". Say who does what. |
| Heading-like openers | A paragraph that starts with a sentence that reads like a heading. Connect it to the previous text. |
| Human actions for machines | "Hand the browser a URL". Write "the browser gets the URL". |
| False ranges | "From X to Y" when X and Y are not on a real scale. |
| False vulnerability | An admission of bias for effect. |

## Full writing skills

Read the full skills only for these tasks. When they differ from this file, this file wins.
If a skill is not installed, use this file alone.

| Task | Read |
| --- | --- |
| The user asks for STE, ASD-STE100, or compliance | The "Modes" section of `skills/simple-english/SKILL.md` and its `references/strict-vocabulary.md` |
| The user asks you to check text against STE | The "Modes" section of `skills/simple-english/SKILL.md` and its `references/rule-catalog.md` |
| An error message, runbook, incident report, release notes, commit message, or UI copy | `skills/simple-english/references/use-cases.md` |
| You need a plain word for an overused word | `skills/simple-english/references/word-swaps.md` |
| A trope review of long text or client copy, or a pattern that the table above does not cover | `skills/writing-whip/SKILL.md`, then `skills/writing-whip/references/tropes.md` |

## Choose the format

| Information | Default format | Make clear |
| --- | --- | --- |
| Findings, claims, comparisons, status, or other structured data | Table | What each row means, its result, evidence, and important limits. |
| Dependencies, flows, states, architecture, or cause and effect | Diagram | Direction, labels, boundaries, and which relationships are assumptions. |
| A plan or sequence of actions | Numbered steps or a step table | What to do, why it matters, and when it is complete. |
| Measurements over time or across many observations | Chart, with accessible values or a compact data table | Units, period, population, baseline, and uncertainty. |
| A simple fact or short explanation | Direct sentence or short paragraph | The answer and any qualification needed to interpret it. |

Use a table when readers compare entries. Use a diagram when they follow relationships.
Combine them only when each answers a different question.

## Tables people can review

- Give each row one item. Use clear column names. Aim for three to five columns.
  Divide wide tables by topic. Use stable IDs when rows need references.
- Put the decision or status near its item. Use explicit labels such as
  `Supported`, `Contradicted`, `Unknown`, or `Not run`, from the owning
  workflow's vocabulary. Color and icons can add to those labels.
- Put an exact source or evidence link next to the finding it supports.
  Keep the version, date, units, scope, and uncertainty when they affect the meaning.
  A blank cell must not imply a successful check.
- Rank by the user's decision needs. For long results, group related rows and
  put important decisions first. Keep every scoped item in the report or in a
  clearly linked continuation. Presentation limits do not reduce coverage.

## Diagrams people can follow

Use a small labeled diagram for an actual relationship or sequence. For a
compact static engineering diagram, use Mermaid when the destination
supports it. Give a numbered path or edge table when it does not. Show which
parts are observed behavior, proposals, and unknown relationships. Use a chart
when the question is numerical scale, not connectivity.

## Plans people can execute

Give each step one action, its reason, and a completion condition that the reader can verify.
Name the owner or dependency when it is not clear. Identify the first action and any problem that prevents it.

For a small plan, use `1. Action: why. Done when ...`. For a reviewable plan,
use this layout, and keep the owning workflow's required scope and approvals:

| Step | Do | Why | Done when |
| --- | --- | --- | --- |
| 1 | Read the installed package version. | Use the correct API documentation. | The manifest or lockfile gives the version. |
| 2 | Read the official documentation for that version. | Find the parameter's meaning. | A source passage answers the question for that version. |

Give a reason related to the task's result. Reasons such as "improve quality" do not explain the need for a step.
Give an estimate only when evidence supports it and it helps a decision.

## Finish with a reviewable result

Show which work is complete, failed, or not verified. Keep important conditions and required evidence when you shorten the text.
Give a next action only when work remains.
