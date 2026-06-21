---
title: Code review principles, techniques & common quality issues
type: reference / external article
source: Graphite code-review guides (mentions Graphite Agent / Graphite Insights as tooling examples)
use: mine for review principles, a reviewer checklist, coding standards, and a quality-issue taxonomy when designing our own PR-review tool
---

# Code review principles, techniques & common quality issues

Code review best practices emphasize code quality, consistency, and maintainability by following standards like clarity, simplicity, and proper documentation. This guide explores the key principles of the code review process and how to implement them effectively.

## Part 1 — Understanding code review principles

The principles of code review are guidelines that help teams conduct reviews effectively. They aim to create a constructive environment for feedback while ensuring the quality and maintainability of the codebase.

### 1. Focus on the code, not the coder

Separate the code from the individual who wrote it. This promotes a culture where feedback is seen as an opportunity for improvement rather than a personal critique. Instead of saying, "You should know better than this," a better approach is, "This function could be refactored for better readability."

### 2. Keep it constructive

Reviews should always aim to be constructive. Provide actionable feedback that encourages improvement — offer solutions or alternatives, not just problems. For a repeated block of code: "I've noticed this block of code is repeated. It could be simplified into a utility function to enhance maintainability. What do you think about extracting it?"

### 3. Review small changes

Smaller, focused PRs are easier to review than large, complex ones, promoting better understanding and quicker feedback. Aim for PRs that encapsulate a single feature or bug fix. Instead of one PR addressing multiple features, break it down:

- PR 1: `fix(auth): resolve user authentication issue`
- PR 2: `feat(profile): add user profile page`
- PR 3: `fix(api): improve error handling in the API`

### 4. Define clear criteria for approval

Establishing clear approval criteria streamlines the process and sets expectations. Criteria can include:

- **Code functionality:** Does the code meet the intended functionality?
- **Code style:** Does the code adhere to the team's coding standards?
- **Test coverage:** Are there adequate unit tests to verify the new changes?

A reviewer checklist might include:

- Does the code pass all unit tests?
- Is there sufficient documentation for new features?
- Are error cases handled appropriately?

### 5. Encourage discussion

Code reviews should be collaborative. Encouraging discussion allows for diverse perspectives — e.g. when a reviewer suggests an alternative approach, it opens the floor for further dialogue, enhancing the code and strengthening team relationships.

### 6. Limit the number of reviewers

Too many reviewers leads to confusion and conflicting feedback. Limit to ideally two to three, with defined roles:

- **Primary reviewer:** Focuses on functionality and design.
- **Secondary reviewer:** Checks code style and best practices.

### 7. Prioritize code quality

The ultimate goal is to enhance code quality. Reviewers should prioritize readability, maintainability, and performance.

### 8. Foster a learning environment

Code reviews are an opportunity for learning. Encourage questions and insights: "I've noticed you used a specific library here. Can you explain why you chose that over another option? It might help others understand the decision."

## Part 2 — Code review techniques and coding standards

Adhering to coding standards and applying specific techniques ensures consistency, maintainability, and quality across the codebase.

### Coding standards

- **Consistent naming conventions**
  - Follow naming conventions (e.g., camelCase for variables and functions, PascalCase for classes) for readable, predictable code.
  - Avoid abbreviations unless well-known and standard in the domain.
- **Code formatting**
  - Enforce consistent indentation (e.g., 2 or 4 spaces) and line breaks.
  - Use proper spacing around operators and keywords.
  - Keep line lengths manageable (often 80-120 characters).
- **Error handling**
  - Ensure proper error handling through try-catch blocks and meaningful error messages.
  - Avoid silent failures—errors should be logged or handled appropriately.
- **Commenting and documentation**
  - Write meaningful comments where the code logic is not immediately obvious.
  - Use documentation comments for methods, classes, and public APIs.
  - Avoid unnecessary or redundant comments; code should be as self-explanatory as possible.
- **Code structure and modularity**
  - Follow the single-responsibility principle: each function or class should have one clear responsibility.
  - Keep functions and methods small, ideally performing one well-defined task.
  - Organize code logically, grouping related functionality and separating concerns.
- **Code reuse and DRY (Don't Repeat Yourself)**
  - Reuse existing code and libraries rather than duplicating logic.
  - Refactor common logic into reusable functions or classes where appropriate.
- **Security best practices**
  - Sanitize user inputs to prevent injection attacks.
  - Review for hardcoded secrets, tokens, and sensitive data in source.
  - Use libraries/frameworks to handle authentication and encryption.
- **Performance considerations**
  - Review algorithms for efficiency; avoid memory leaks and unnecessary loops.

### Code review techniques

- **Follow a checklist** — cover key areas like readability, security, and performance; maintain consistency so nothing important is overlooked.
- **Use automated tools** — linters, static analyzers, and tools like Graphite Agent automate detection of syntax errors, security vulnerabilities, and style violations, freeing reviewers to focus on complex aspects.
- **Code style guide enforcement** — follow team/org style guides (e.g., Google Style Guide, PEP8) for a uniform structure.
- **Peer reviews** — engage multiple reviewers for diverse perspectives; experienced devs catch nuanced issues, less experienced ones learn and ask valuable questions.
- **Focus on logic and structure** — ensure logic is clear and maintainable; consider edge cases and unexpected inputs.
- **Encourage constructive feedback** — specific, actionable, focused on improving the code; frame suggestions as improvements, not criticisms.
- **Understand the context** — understand the business requirements/user story driving the change before diving in, so feedback aligns with the goals.

## Part 3 — Common code quality issues

(Graphite frames several of these around metrics from Graphite Insights — kept here as the issue taxonomy is the reusable part.)

- **Code complexity problems** — complex code is hard to understand/maintain, lengthening debugging and testing. Watch median review times and number of review cycles as signals.
- **Lack of coding standards** — inconsistent styles and practices make code hard to read and maintain.
- **Poor maintainability and readability** — spotted via frequency of revisions or number of hotfixes applied.
- **Technical debt accumulation** — the implied cost of rework from choosing the easy solution now; flagged by rising median time to merge PRs.
- **Insufficient code testing** — leads to more bugs and security vulnerabilities; ensure enough attention per piece of code before merge.
- **Security vulnerabilities** — can compromise the whole application; track and prioritize time to address security-fix PRs.
- **Performance inefficiencies and spaghetti code** — inefficiencies slow the app; tangled structure raises complexity. Track performance metrics over time to catch regressions.
- **Code duplication and outdated libraries** — duplication increases maintenance burden; outdated libraries introduce security risk. Monitor duplicated code and dependency freshness.
- **Lack of documentation and error-prone sections** — documentation matters for onboarding and long-term maintenance; error-prone sections cause frequent bugs.
- **Software bug frequency** — frequent bugs erode user trust; track median time to fix bugs and frequency of bug-related issues to find root causes.
