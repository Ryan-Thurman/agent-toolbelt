# checklists/

Per-language review checklists — language-specific traps the language-agnostic facet lenses won't
name. Loaded by the orchestrator when the diff touches a matching language and injected (sliced by
facet) into the facet sub-agents. Mechanism + the extension-→-language map: `../references/lang-checklists.md`.

Each file is `<language>.md`, sectioned by facet (`## correctness`, `## security`, `## performance`,
`## maintainability`). Keep items language-*specific* and high-signal — anything true of all languages
belongs in the facet file, not here.

Current: `typescript.md`, `python.md`, `sql.md`. Add a language by dropping in a file and adding a row
to the map in `lang-checklists.md`.
