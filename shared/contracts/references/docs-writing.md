# Documentation writing

Read this file with `human-readable-output.md` when you write or review project documentation.
Project documentation includes README files, wiki pages, docs pages, changelogs, skill references, and PR descriptions.
This file adds page structure, headings, code, placeholders, units, and links to the
`simple-english` Document rules. The "Writing precedence" section in `human-readable-output.md` decides each conflict.
Read the full trope catalog, `skills/writing-whip/references/tropes.md`, only when the list in
`skills/writing-whip/SKILL.md` does not cover a pattern that you see.

## Plan the page

- Give each page one job: a tutorial, a how-to, a reference, a concept explanation, or troubleshooting.
- Write a title that matches the reader's task or question. Do not use only the feature name.
- Start each page with a short summary of what it covers. Start each major section with a summary sentence.
- For more than one audience, write a short shared opening. Then put technical details in subsections.

## Voice

- Address the reader as "you". Do not use "the user" or "one".
- Use "we" only for an action of the project team, such as "we recommend". Do not use "we" for the reader.
- Do not ask rhetorical questions.

## Specific words

- Do not use "easy", "simple", "quick", "just", "very", or "really".
  Write a specific description, such as "one command" or "the default settings".
- Replace "significantly", "many", "often", "typically", and "generally" with a number or a specific claim.
- Replace "near-zero", "sub-second", and "most requests" with a measured value and its source.
- Use the literal verb for the action. Do not use figurative verbs, such as "lands", "carries", or "moves through".

## Headings

- Use sentence case for headings, unless the repository uses a different rule.
- Make each heading specific, so that the reader can predict the section content.
  Do not use one general word, such as "Overview", "Notes", or "Caveats", alone.

## Structure

- Spell out an acronym at first use, for example "Content Security Policy (CSP)".
- Define each term at first use, or link to the page that defines it.
- Give each paragraph one idea. Use two to four sentences in each paragraph.
- When a paragraph contains three or more parallel items, write a list.
- Use a numbered list for steps in sequence. Use a bulleted list for other items.
- Do not put a period after a list item that is not a full sentence.
- For a list of terms, use this format: `- Term: description`.

## Emphasis and code

- Use bold only for UI element names.
- Use inline code for paths, file extensions, identifiers, commands, and short code.
- Give each code block a language tag.
- Keep each code block to 25 lines or fewer and 80 characters or fewer for each line.
  Divide a longer example, and explain each part.
- Explain what each code block does, in the text before or after the block.
- Do not show default values or repeat variable definitions in examples.
- Write new examples in the main language of the project.

## Placeholders, units, and links

- Write a text placeholder in `snake_case` with a clear name, such as `your_access_token`.
  Do not use `<TOKEN>`, `xxx`, `your-token`, or a general uppercase word.
- Write a number placeholder that is clearly not real, such as `1234567890`.
- Put a space between a number and its unit, and use the standard symbol: `64 KB`, `200 ms`, `30 s`.
- Make link text name the destination. Do not use a bare URL, "here", or "link" as link text.

## Punctuation and layout

- Do not use a hyphen as punctuation. Use a colon, a comma, or a new sentence.
- In Markdown source, use straight quotes and three periods, so that search and copy work.
  UI text follows the typography rules of the web interface guidelines.
- Do not put horizontal rules (`---`) between sections.
- Follow the line-wrap convention of the file that you edit.

## Review documentation

Report each finding on one line, grouped by file: `path:line - problem. Fix.`
Report only the changed text, unless the user names the files.

Adapted from the MIT-licensed [Vercel Labs Writing Guidelines](https://github.com/vercel-labs/writing-guidelines/tree/83e2316b034cf572400513538e4e4da01c4cc742).
Rules specific to the Vercel docs site are removed. The `simple-english` rules replace the rules that conflict with them.
