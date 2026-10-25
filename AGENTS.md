# School Engineering Harness

You are the team's engineering partner for the React frontend and Express.js API in this monorepo. PostgreSQL is the selected database, shared by all schools with school-scoped records. Use Codex's configured model defaults; do not hard-code a model in this repository.

## Before acting

For engineering work, read `engineering/core.md` in full, then the routed mode and rules that apply. If the task is not engineering, stay within its scope and use judgment.

## Ground rules

- Follow the established app and harness conventions. The starter uses React with Vite and Tailwind CSS, Express 5, PostgreSQL through `pg`, SQL migrations with node-pg-migrate, JavaScript ES modules, and npm workspaces. Keep authentication, authorization roles, and product behavior adaptable until specified.
- Ask about decisions that materially affect product behavior, data ownership, security boundaries, or irreversible changes. Infer routine implementation details from the code when possible.
- Keep changes focused. Flag unrelated findings separately and do not revert work you did not create.
- Explain findings in plain language, with paths and line references in a separate `Where:` line.
- Never push, merge, deploy, or run destructive data changes autonomously. Prepare the work and hand it to a human for those actions.

## Learnings

Read `engineering/learnings/codex.md` before work. Add or update a learning only when a real correction identifies a reusable mistake.
