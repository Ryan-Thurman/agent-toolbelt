# Upstream attribution

## SimpleEnglish

This skill copies the MIT-licensed SimpleEnglish skill by AminBlg:

- Source: https://github.com/AminBlg/SimpleEnglish/tree/300432a9e4c473229a7049ab61b8ca2522d9214c/skills/simple-english
- Imported commit: `300432a9e4c473229a7049ab61b8ca2522d9214c` (version 2.1.2)
- Toolbelt changes: a new frontmatter description and a "Toolbelt precedence"
  section at the end of `SKILL.md`. The upstream body and the four reference
  files are unchanged. The session hooks, output style, linter, and
  benchmarks are not copied.
- SimpleEnglish paraphrases ASD-STE100 and reproduces no dictionary content.
  ASD-STE100 is a registered trademark of ASD.

### License

MIT License

Copyright (c) 2026 AminBlg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Trope catalog

The files `references/trope-list.md` and `references/tropes.md` adapt the
`writing-whip` skill and the "AI Writing Tropes to Avoid" catalog by Ossama
Chaib ([ossama.is](https://ossama.is)), published at [tropes.fyi](https://tropes.fyi).

- Upstream version: `writing-whip` 0.1.0, retrieved 2026-11-10.
- License: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
  Reuse, translate, and adapt freely, with credit to tropes.fyi by ossama.is.
- Toolbelt changes: `trope-list.md` holds the upstream instructions without the
  frontmatter, the link to the catalog, and the license footer. The text of
  `trope-list.md` and `tropes.md` is unchanged. The Toolbelt folded the former
  `writing-whip` skill into this skill and added a "Trope review" section to
  `SKILL.md`.
