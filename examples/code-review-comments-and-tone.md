---
title: Code review comment types, examples & tone
type: reference / external article
source: Graphite code-review guide
use: mine for a comment taxonomy (blocking vs nit), good/bad comment patterns, and tone rules for our tool's output
---

# Code review comment types, examples & tone

## Understanding comment types

- **Blocking comments:** critical issues that must be addressed before merge.
  - _"This function is vulnerable to SQL injection. Please use parameterized queries to fix this issue."_
- **Nits** (nitpicks): minor issues that don't significantly affect functionality but could improve quality or style.
  - _"Consider renaming this variable to be more descriptive."_

## Common comment categories

- **Code quality** — readability, maintainability, or performance.
  - _"This loop could be simplified using the map function."_
- **Functionality** — bugs or issues in how the code performs.
  - _"This method does not handle null values correctly."_
- **Documentation** — improving or adding documentation.
  - _"Please add docstrings to this function to clarify its purpose and parameters."_

## Examples of good comments

- **Specific and actionable:** _"The calculateTotal function lacks error handling for invalid input. Please add checks for negative numbers."_
- **Positive reinforcement:** _"Great job on implementing the caching! It significantly improves performance."_
- **Encouraging collaboration:** _"I noticed you used a different approach for sorting. Can we discuss why you chose this method over the built-in sort function?"_

## Examples of poor comments

- **Vague:** _"This code is bad."_ — no actionable insight, demoralizing.
- **Personal attacks:** _"I can't believe you wrote this. You should know better."_ — unprofessional, creates a hostile environment.

## Language and tone

- **Be respectful and professional.** Instead of "You messed this up," say "I noticed an issue with this implementation."
- **Focus on the code, not the person.** "This approach may not be optimal," rather than "You did this wrong."
- **Explain yourself** when helpful. Rather than "Consider renaming this variable," try "Consider renaming this variable to something more descriptive to improve readability and align with our best practices for maintainability."

## How to write good comments

- **Be concise but thorough.** _"This logic can be simplified using a guard clause, which enhances readability."_
- **Use examples / reference specific lines.** _"In line 45, consider using a switch statement instead of multiple if conditions for better readability."_
- **Encourage discussion.** _"What do you think about using a different approach here? Let's brainstorm together."_
- **Suggest improvements.** _"To improve performance, consider using asynchronous calls here."_
- **Highlight best practices.** _"Using constants for magic numbers enhances maintainability. Let's define those at the top."_
- **Request clarification.** _"Could you explain the reasoning behind this approach? It might help us understand better."_
