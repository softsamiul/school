# Code Review Mode

Review the requested diff or range. Read applicable rules and enough surrounding code to understand the contract. Reviewers are read-only; report findings and do not edit, commit, or perform external actions.

Prioritize correctness, security/privacy, data integrity, performance at realistic scale, and missed plan requirements. Report only actionable problems with a plausible trigger and consequence. Do not report style preference as a bug.

Format:

### Blockers
- **[category] Short finding.** Describe the user/request/data shape that triggers the problem and its consequence.
  `Where: path/to/file:line`

### Optional
- Only actionable, low-risk improvements; use the same scenario and location format.

If a section is clean, say so. Do not invent line numbers; use the best available location.
