# Domain language

Read this at the Standard level or higher when terms are unclear, or when the design crosses domain boundaries.
A bounded context is an area of the system in which each term has one meaning.

## Glossary

1. Find the project glossary, or create one in the project's design location when the team agrees.
2. For each important term, record the meaning, the bounded context, and the synonyms to avoid.
3. Check each term against the code. If the code uses another name, record the conflict and ask which name wins.
4. Update the glossary during the design conversation, when a question settles a term.
   Do not wait for the end of the design.
5. When one word has two meanings, such as "account" for a login and for a billing customer, give each meaning its own term.

## Context map

Draw how the bounded contexts relate. For each relationship, record:

- Which context depends on the other.
- Which context owns the shared model or contract.
- Whether the dependent context translates the other model at its boundary, which protects it from changes.

## Boundaries

A good service or module boundary follows a bounded context.
A design that needs a change in several contexts for one business rule has a boundary in the wrong place.
Start with modules inside one deployable unit. Extract a service only when a team, a scaling need, or a release need requires it.
