# Per-language checklists

The facet lenses are deliberately language-agnostic (they apply everywhere). Per-language checklists
add the **language-specific traps** a generic lens won't name — Python mutable default args, TS
`any`-erosion, SQL missing indexes. They're an *addendum* injected into the relevant facet agents
when the diff touches that language, not a replacement for the facets.

These live **in this skill** (`checklists/<lang>.md`), not in the target repo — they're reusable
review knowledge, not project policy. (Project policy is `.pr-review.md`, `repo-config.md`.)

## Discovery (match the diff's languages)

Map changed-file extensions to languages, then load each matching `checklists/<lang>.md` that exists:

| language | extensions | checklist |
|---|---|---|
| typescript / javascript | `.ts .tsx .js .jsx .mjs .cts` | `checklists/typescript.md` |
| python | `.py .pyi` | `checklists/python.md` |
| sql | `.sql` + migration dirs | `checklists/sql.md` |

Only load checklists for languages actually present in the diff. No matching file → nothing injected
(the facets still run). Adding a new language = drop a `checklists/<lang>.md` in and add a row here;
no orchestration change.

## Injection (which facet gets which checklist)

Each checklist is sectioned by facet so only the relevant slice goes to each agent. When spawning a
facet sub-agent (`fan-out.md` §2), append the facet's slice of every in-scope language checklist to
its prompt, after `_shared.md` + the facet file + standards + repo-config. A checklist item is a
**lens, not a finding** — the agent still applies the schema, evidence, and anti-noise rules; it must
not emit a checklist item verbatim as a finding without a concrete `file:line` and consequence.

## Checklist file shape

```markdown
# <language> checklist
## correctness
- <language-specific bug trap, one line>
## security
- ...
## performance
- ...
## maintainability
- ...
```

Keep items **specific to the language** — anything true of all languages belongs in the facet file,
not here. Keep them few and high-signal (the anti-noise discipline applies to checklists too).

## Status

Mechanism + starter checklists (typescript, python, sql) shipped. Add languages as real-world
accuracy demands them.
