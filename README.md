# School SaaS

A JavaScript monorepo starter for a school management SaaS: React + Vite + Tailwind CSS, Express 5, and PostgreSQL. All schools share one database; school-owned data must be scoped by a server-verified `school_id`. The API uses `pg` and explicit SQL migrations.

## Requirements

- Node.js 24 LTS (or 22.12+)
- npm 11+
- Docker Compose for the local PostgreSQL service

## Start locally

1. Install dependencies: `npm install`.
2. Start PostgreSQL: `docker compose up -d db`.
3. Copy `apps/api/.env.example` to `apps/api/.env`.
4. Apply the initial migration: `npm run db:migrate`.
5. Start the web app and API: `npm run dev`.

Vite serves the web app at `http://localhost:5173` and proxies `/api` to Express at `http://localhost:3001`. The starter UI calls the API liveness endpoint. The readiness endpoint checks the PostgreSQL connection.

## Workspaces

- `apps/web` — React UI.
- `apps/api` — Express API, SQL migrations, and PostgreSQL connection.
- `packages/contracts` — Zod contracts shared by the browser and API.

Create future migrations with `npm run db:create -- add_your_change`. Review every generated migration before applying it.

The template intentionally has no login, school membership, roles, or business-data routes. Before adding school data endpoints, implement and verify server-side authentication and school context. Never use a client-supplied `school_id` as authorization. Add cross-school denial coverage before exposing business records.

The local Docker credentials are for development only. The local PostgreSQL account is privileged for bootstrap convenience; use separate, least-privileged migration and application roles in shared or production environments. Never commit real secrets. See `HARNESS.md` and `engineering/` for the agent workflow and engineering rules.
