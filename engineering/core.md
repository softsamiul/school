# Engineering Operating Manual

Read this file before engineering work. Load the selected mode and relevant rules before acting. The harness is intentionally small and adapts to the application's conventions as they become known.

**Stack:** React + Vite + Tailwind CSS frontend, Express 5 API, JavaScript ES modules, `pg` with reviewed SQL migrations, one shared PostgreSQL database for all schools, managed as an npm-workspace monorepo. Use a supported Node.js LTS release (24 preferred). School-owned records are isolated by a verified `school_id` tenant context. **Goal:** deliver understandable, secure changes that meet the task and can be verified. **Success:** applicable Definition of Done items are satisfied and the human handoff is clear.

## Mode router

| Request | Mode | Read |
|---|---|---|
| Plan a product feature | Planning | `engineering/modes/planning.md`, `docs/prd.md`, and the relevant `docs/specs/<feature>.md` |
| Plan engineering work that is not a product feature | Planning | `engineering/modes/planning.md` |
| Implement a plan or make a code change | Implementation | `engineering/modes/implementation.md` |
| Review a diff or check readiness | Code review | `engineering/modes/code-review.md` |
| Debug, explore, or answer an engineering question | Default | Implementation mode, narrowed to the requested scope |

If the request could mean either planning or implementation and that choice changes the work, ask once. Do not add an autonomous end-to-end workflow in this initial harness.

## Rules router

| Work touches | Read |
|---|---|
| module boundaries or request/data flow | `engineering/rules/architecture.md` |
| React components, browser state, or UI behavior | `engineering/rules/frontend.md` |
| Express routes, middleware, or API behavior | `engineering/rules/backend.md` |
| names, JavaScript/React conventions, validation | `engineering/rules/coding-standards.md` |
| schema, SQL, queries, indexes, migrations | `engineering/rules/data-access.md` |
| login, roles, school boundaries, personal data, secrets | `engineering/rules/security.md` |
| tests or verification | `engineering/rules/testing.md` |
| logs, errors, failure responses | `engineering/rules/logging.md` |
| before handing off | `engineering/rules/definition-of-done.md` |
| a proposed shortcut or recurring failure pattern | `engineering/rules/anti-patterns.md` |

## Invariants

- All schools share one PostgreSQL database. School-user requests are scoped by the server-verified `school_id`. Platform operators have authorized cross-school access through a separate operator path. Never treat a client-supplied school ID alone as authorization.
- The authentication, school membership, and role model are not yet implemented. Do not invent their storage or lifecycle; raise those choices when a task depends on them.
- No authenticated business-data endpoints are enabled in the starter. Do not add one until its server-side school context and authorization are designed.
- Validate untrusted input at the server boundary and enforce authorization on the server for every protected operation.
- Keep database access behind the repository's established data-access boundary. If none exists, plan a small explicit boundary before spreading SQL through request handlers.
- Treat student, guardian, staff, attendance, and financial data as sensitive. Minimize access and output to what the task requires.
- Never take the shared or destructive actions listed in `AGENTS.md` without a human.
