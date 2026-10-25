# Engineering Harness — Team Handoff

This repository contains a Codex and Claude Code engineering harness for a React + Vite frontend, Express 5 API, and one shared PostgreSQL database for all schools. The code is organized as an npm-workspace monorepo, with school-owned rows scoped by `school_id`. The API uses `pg` and SQL migrations. Authentication and product-specific roles remain to be designed.

## Use it

- For a plan, ask Codex to plan the feature using `engineering/modes/planning.md` and `engineering/templates/plan.md`. The plan reviewer can check the result.
- For implementation, provide the accepted plan and ask Codex to follow `engineering/modes/implementation.md`. Ask recon to map existing patterns first when the task spans unfamiliar areas.
- For a diff review, ask Codex to follow `engineering/modes/code-review.md` and run the correctness/safety and craft/standards reviewers in `.codex/agents/`.
- Use `engineering/rules/definition-of-done.md` for the final handoff. Ask a human before push, merge, deployment, destructive migrations, or other shared/destructive actions.

Codex agent model and reasoning settings are omitted so each agent inherits the team's configured Codex defaults. Agent definitions are read-only; implementation remains with the main session. No project-specific test, lint, or build command is assumed until the application repository supplies one.

## First team decisions to confirm

1. Identity, school membership, and role design, including how server-side school context is established.
2. PostgreSQL hosting, backup/restore, and whether PostgreSQL row-level security should reinforce application-level scoping.
3. React framework, styling/component system, state/data fetching, validation, and test tooling.
4. Privacy/retention requirements and the exact deployment/CI handoff.

Update `engineering/project-memory.md` and the focused rules when the team confirms these conventions. Keep general corrections in `engineering/learnings/codex.md`.
