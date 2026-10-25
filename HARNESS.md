# Engineering Harness — Team Handoff

This repository contains a Codex and Claude Code engineering harness for a React + Vite + Tailwind CSS frontend, Express 5 API, and one shared PostgreSQL database for all schools. The code is organized as an npm-workspace monorepo, with school-owned rows scoped by `school_id`. The API uses `pg` and SQL migrations. Authentication implementation and detailed permission enforcement remain to be designed.

## Use it

- For a plan, ask Codex to plan the feature using `engineering/modes/planning.md` and `engineering/templates/plan.md`. The plan reviewer can check the result.
- Product feature plans must read `docs/prd.md` and the matching feature spec in `docs/specs/`. If the spec is missing, agree on it before locking the plan. Keep product requirements out of `CLAUDE.md` and `AGENTS.md`.
- For implementation, provide the accepted plan and ask Codex to follow `engineering/modes/implementation.md`. Ask recon to map existing patterns first when the task spans unfamiliar areas.
- For a diff review, ask Codex to follow `engineering/modes/code-review.md` and run the correctness/safety and craft/standards reviewers in `.codex/agents/`.
- Use `engineering/rules/definition-of-done.md` for the final handoff. Ask a human before push, merge, deployment, destructive migrations, or other shared/destructive actions.

Codex agent model and reasoning settings are omitted so each agent inherits the team's configured Codex defaults. Agent definitions are read-only; implementation remains with the main session. No project-specific test, lint, or build command is assumed until the application repository supplies one.

## First team decisions to confirm

1. Authentication provider/session design and detailed permission enforcement for school users and full-access platform operators.
2. PostgreSQL hosting, backup/restore, and whether PostgreSQL row-level security should reinforce application-level scoping.
3. Frontend state/data-fetching/form conventions, validation, and test/lint tooling.
4. Privacy/retention requirements and the exact deployment/CI handoff.

Update `engineering/project-memory.md` and the focused rules when the team confirms these conventions. Keep general corrections in `engineering/learnings/codex.md`.
