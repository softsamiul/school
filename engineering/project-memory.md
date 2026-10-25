# Project Memory

Use this file for confirmed project-specific decisions and gotchas, not generalized lessons.

## Confirmed starting context

- Frontend: React with Vite and Tailwind CSS v4.
- Backend: Express.js.
- Database: PostgreSQL, one shared database and schema for all schools. School-owned records are scoped with `school_id`.
- Tenant context: derive the active school from authenticated identity and verified membership on the server. The identity provider, membership and role model, and whether to add PostgreSQL row-level security are not yet chosen.
- Repository: one npm-workspace monorepo with `apps/web`, `apps/api`, and `packages/contracts`.
- Initial implementation defaults: Vite, JavaScript ES modules, `pg`, SQL migrations with node-pg-migrate, npm workspaces, and Node.js 24 LTS. These are starter choices, not commitments that prevent a later deliberate change.
- External integrations: none requested for the initial harness.
- Shared or destructive actions require a human decision.

Update these notes only when repository evidence or the team confirms a decision. Do not treat assumptions as settled architecture.
