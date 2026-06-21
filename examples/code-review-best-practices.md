---
title: Code review best practices (guide)
type: reference / external article
source: Graphite code-review guide (mentions Graphite as the tooling example throughout)
use: mine for principles & process when designing our own PR-review tool
---

# Code review best practices

Code review is more than just a routine check—it's a collaborative process that ensures code quality, catches potential issues early, and helps developers learn from each other. By having developers other than the author examine code changes, teams can not only improve the quality of their software but also foster a culture of shared responsibility and continuous improvement. In this guide, we'll take a look at the key principles of code reviews and explore how you can make them more efficient and impactful for your team.

## What is a code review?

A code review involves peers reviewing code changes before they are merged into a main branch. It can be done through various methods, such as formal inspections, pair programming, or using tools like GitHub's pull requests (PRs).

## Why conduct code reviews?

- **Improve code quality:** Detect bugs and improve maintainability.
- **Share knowledge:** Help team members learn from each other.
- **Ensure adherence to coding standards:** Confirm that code follows agreed-upon guidelines.
- **Reducing technical debt:** Identifying issues early through code reviews prevents problems from snowballing into larger, harder-to-fix issues down the line.

## The code review process: steps and best practices

### Step 1: Prepare for the review

- **Select the right reviewer:** Choose someone familiar with the codebase or the specific area being modified. This ensures relevant feedback and avoids time-consuming explanations.
- **Limit the size of code changes:** Aim to keep pull requests (PRs) small, ideally under 400 lines of code. This promotes a more focused review and makes it easier for reviewers to provide thorough feedback. A study found that smaller code changes are less prone to errors and require less time to review.

### Step 2: Conduct the review

- **Use code review tools:** Tools like Graphite facilitate streamlined code review processes by allowing developers to comment directly on lines of code and track changes effectively.
- **Focus on the following aspects:**
  - **Code correctness:** Ensure that the code behaves as intended and meets the requirements.
  - **Code efficiency:** Look for performance issues, such as unnecessary loops or memory usage.
  - **Readability:** Code should be easy to read and understand. This includes meaningful variable names and clear logic.

### Step 3: Provide constructive feedback

- **Be specific:** Instead of vague comments like "this code isn't good," specify what is wrong and suggest improvements.
- **Balance positive and negative feedback:** Highlight what works well alongside areas for improvement. This encourages developers and fosters a positive review culture.

## Code review comments best practices

- **Use clear language:** Avoid jargon unless the team is familiar with it. Aim for clarity in your suggestions.
- **Provide examples:** When pointing out issues, include snippets or references to documentation that illustrate best practices.
- **Example of constructive feedback:** "Great job on implementing the feature! However, I noticed that the function calculateSum could be optimized. Instead of using a for loop, you can leverage the reduce method to improve readability"

## Ensuring an efficient code review process

To achieve an efficient code review process, consider the following practices:

- **Establish a review timeline:** Set deadlines for reviews to prevent bottlenecks. Aim for a review turnaround of 24-48 hours to keep development moving.
- **Automate checks:** Integrate tools like linters or automated tests in the CI/CD pipeline to catch common issues before the review process. This allows reviewers to focus on more complex issues.
- **Conduct asynchronous reviews:** Allow developers to submit code for review at any time, enabling reviewers to check code when they are available. This is particularly useful in agile environments where team members may work in different time zones.

## Code review size considerations

Managing code review size is crucial for maintaining efficiency. Here are some practices to consider:

- **Keep PRs small:** As previously mentioned, smaller code changes are easier to review and understand. Aim for PRs to be no larger than a few hundred lines.
- **Break down large changes:** If a feature requires extensive modifications, split the work into smaller, manageable chunks. This will make the review process smoother and more focused.
- **Stack your PRs:** Stacking PRs allows developers to break down large changes into smaller, more manageable chunks, which makes it easier for reviewers to focus on specific sections of code, provide more targeted feedback, and reduce the cognitive load during the review process.

## Agile considerations in code reviews

Agile methodologies emphasize collaboration and flexibility. In the context of code reviews, adopting agile practices can further enhance the review process:

- **Incorporate reviews into sprints:** Schedule regular code reviews during sprint planning to ensure they are part of the workflow rather than an afterthought.
- **Review continuously:** Foster a culture of continuous feedback, where code is reviewed incrementally as it is developed rather than in large batches. This aligns with agile principles of adaptability and responsiveness.

## Common pitfalls in code reviews

Be aware of common pitfalls that can hinder the effectiveness of the code review process:

- **Rushing reviews:** Hasty reviews can lead to missed errors. Allow adequate time for thorough evaluation.
- **Ignoring context:** Reviewers should understand the purpose and scope of changes. Not having this context can lead to inappropriate feedback.
- **Neglecting to follow up:** Ensure that comments are addressed. If a reviewer raises an issue, the author should respond or make the necessary changes.

## Takeaways

Implementing these code review best practices can significantly enhance your team's development process. By focusing on efficient code review practices, establishing a clear process, utilizing code review tools like Graphite and encouraging constructive feedback, teams can improve code quality and foster a more collaborative environment. Whether you're working in agile or other development frameworks, prioritizing good code review practices is essential for success.
