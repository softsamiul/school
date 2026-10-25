# Implementation Mode

Implement the requested scope with the smallest clear change. Read the relevant rules and inspect the surrounding code before editing. Follow a supplied, accepted plan; if code contradicts it, explain the discrepancy and revise the affected step rather than blindly following stale instructions.

- Preserve established framework, styling, state, API, and data-access patterns. Do not add dependencies or invent project commands without need.
- Make the change in coherent slices. Add or update checks when the task requires them and the repository has an appropriate test setup; do not run unrelated broad checks.
- For UI work, include the visible states and accessibility behavior required by the feature. Do not launch a browser unless the user asks.
- Review your diff for unintended changes, data exposure, authorization gaps, and consistency with the plan.
- Stop before push, merge, deploy, destructive migration, or any other shared/destructive action. Hand off the exact next step to a human.
